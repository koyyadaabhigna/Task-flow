import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { setApiSocketId } from '../utils/api';
import toast from 'react-hot-toast';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineCount, setOnlineCount] = useState(1);
  const [activeTyping, setActiveTyping] = useState({}); // taskId -> Array of user names

  useEffect(() => {
    // If not authenticated, do not connect or clean up existing connection
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      setIsConnected(false);
      setApiSocketId(null);
      return;
    }

    const token = localStorage.getItem('taskflow_token');
    
    // Resolve Socket URL from VITE_API_URL or fallback
    // e.g. 'http://localhost:5000/api' becomes 'http://localhost:5000'
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const socketUrl = backendUrl.replace('/api', '');

    console.log(`🔌 Initializing WebSocket connection to: ${socketUrl}`);

    const socketInstance = io(socketUrl, {
      auth: {
        token,
      },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    socketInstance.on('connect', () => {
      console.log(`⚡ Connected to WebSocket. Socket ID: ${socketInstance.id}`);
      setIsConnected(true);
      
      // Register socket ID globally with our Axios instance
      setApiSocketId(socketInstance.id);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log(`⚡ WebSocket disconnected: ${reason}`);
      setIsConnected(false);
      
      // Clear socket ID from our Axios instance
      setApiSocketId(null);

      if (reason === 'io server disconnect') {
        // The server disconnected us, attempt manual reconnect
        socketInstance.connect();
      }
    });

    socketInstance.on('connect_error', (err) => {
      console.error('⚡ WebSocket connection error:', err.message);
      setIsConnected(false);
      setApiSocketId(null);
      
      // Show descriptive toast for auth errors
      if (err.message.includes('Authentication error')) {
        toast.error('Real-time sync authentication failed');
      }
    });

    // Listen to online users count broadcast
    socketInstance.on('onlineUsersCount', (count) => {
      setOnlineCount(count);
    });

    // Listen to user typing states
    socketInstance.on('userTyping', ({ userId, name, isTyping, taskId }) => {
      setActiveTyping((prev) => {
        const currentTypers = prev[taskId] || [];
        if (isTyping) {
          if (!currentTypers.includes(name)) {
            return {
              ...prev,
              [taskId]: [...currentTypers, name],
            };
          }
        } else {
          return {
            ...prev,
            [taskId]: currentTypers.filter((n) => n !== name),
          };
        }
        return prev;
      });
    });

    setSocket(socketInstance);

    // Cleanup on unmount or user change
    return () => {
      console.log('🔌 Cleaning up WebSocket connection...');
      socketInstance.disconnect();
      setApiSocketId(null);
    };
  }, [user]);

  /**
   * Send active typing status for a task
   * @param {string} taskId - The ID of the task being edited
   * @param {boolean} isTyping - Whether the user is actively typing
   */
  const sendTypingStatus = (taskId, isTyping) => {
    if (socket && isConnected && taskId) {
      socket.emit('typing', { taskId, isTyping });
    }
  };

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineCount, activeTyping, sendTypingStatus }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (ctx === null) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return ctx;
};
