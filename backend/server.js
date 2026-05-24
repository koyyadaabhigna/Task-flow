const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { initSocket } = require('./config/socket');


dotenv.config();
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(null, true); // Allow all in dev; restrict in prod via env
  },
  credentials: true,
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'TaskFlow API is running' });
});

// Root
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to TaskFlow API', version: '1.0.1' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use(require('./middleware/errorMiddleware'));

const server = http.createServer(app);

// Initialize Socket.IO server with CORS allowed origins
initSocket(server, allowedOrigins);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 TaskFlow server running on port ${PORT}`);
});
