const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

let io;
// Keep track of online users: userId (string) -> Set of socket.ids
const onlineUsers = new Map();

/**
 * Initialize Socket.IO Server
 * @param {object} server - HTTP Server instance
 * @param {string[]} allowedOrigins - CORS allowed origins
 */
const initSocket = (server, allowedOrigins) => {
  io = socketIO(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // JWT Authentication Middleware for Socket.IO connections
  io.use(async (socket, next) => {
    try {
      // Retrieve token from connection handshake auth or headers
      const token = 
        socket.handshake.auth?.token || 
        socket.handshake.headers['authorization']?.split(' ')[1];

      if (!token) {
        console.warn(`⚠️ Socket auth failed: No token provided (Socket ID: ${socket.id})`);
        return next(new Error('Authentication error: Token missing'));
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Fetch user from DB
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        console.warn(`⚠️ Socket auth failed: User not found (ID: ${decoded.id})`);
        return next(new Error('Authentication error: User not found'));
      }

      // Attach user object to socket instance for downstream handlers
      socket.user = user;
      next();
    } catch (err) {
      console.error(`❌ Socket auth failed: ${err.message}`);
      return next(new Error('Authentication error: Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user._id.toString();
    const projectName = socket.user.projectName;
    console.log(`🔌 Socket connected: ${socket.id} | User: ${socket.user.name} (${socket.user.email}) | Project: ${projectName}`);

    // Track online user connections
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);

    // Join rooms
    // 1. Project room (all users in the same project get task updates here)
    socket.join(`project_${projectName}`);
    console.log(`📍 User ${socket.user.name} joined project room: project_${projectName}`);
    
    // 2. User-specific room (for cross-tab/cross-device sync for the same user)
    socket.join(`user_${userId}`);
    
    // 3. Global room (e.g. for global updates/stats if ever needed)
    socket.join('global');

    // Emit updated online count to all connected users
    io.emit('onlineUsersCount', onlineUsers.size);

    // Typing indicators: when a user is actively editing a task in the task modal
    socket.on('typing', (data) => {
      const { taskId, isTyping } = data;
      if (!taskId) return;

      // Broadcast the typing event to all sockets in the project room *except* the sender socket
      socket.to(`project_${projectName}`).emit('userTyping', {
        userId,
        name: socket.user.name,
        isTyping,
        taskId,
      });
    });

    // Room-based Task Collaboration: join/leave task specific room
    socket.on('joinTaskRoom', (taskId) => {
      if (taskId) {
        socket.join(`task_${taskId}`);
        console.log(`👤 User ${socket.user.name} joined task room: ${taskId}`);
      }
    });

    socket.on('leaveTaskRoom', (taskId) => {
      if (taskId) {
        socket.leave(`task_${taskId}`);
        console.log(`👤 User ${socket.user.name} left task room: ${taskId}`);
      }
    });

    // Handle connection termination
    socket.on('disconnect', (reason) => {
      console.log(`🔌 Socket disconnected: ${socket.id} | Reason: ${reason}`);

      const userSockets = onlineUsers.get(userId);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          onlineUsers.delete(userId);
        }
      }

      // Broadcast updated online count
      io.emit('onlineUsersCount', onlineUsers.size);
    });
  });

  return io;
};

/**
 * Get active Socket.IO instance
 * @returns {object} io instance
 */
const getIO = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized yet!');
  }
  return io;
};

module.exports = {
  initSocket,
  getIO,
  onlineUsers,
};
