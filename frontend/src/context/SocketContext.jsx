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
  const [activeTyping, setActiveTyping] = useState({});

  useEffect(() => {
    // Only connect if user is logged in
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
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const socketUrl = backendUrl.replace('/api', '');

    console.log(`🔌 Connecting WebSocket to: ${socketUrl}`);

    const socketInstance = io(socketUrl, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
      timeout: 20000,
      // Don't connect automatically on auth pages
      autoConnect: true,
    });

    socketInstance.on('connect', () => {
      console.log(`⚡ WebSocket connected: ${socketInstance.id}`);
      setIsConnected(true);
      setApiSocketId(socketInstance.id);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log(`⚡ WebSocket disconnected: ${reason}`);
      setIsConnected(false);
      setApiSocketId(null);
      if (reason === 'io server disconnect') {
        socketInstance.connect();
      }
    });

    socketInstance.on('connect_error', (err) => {
      // Only log — no toast for connection errors
      // This prevents "Route not found" toast on auth pages
      console.warn('⚡ WebSocket connection error:', err.message);
      setIsConnected(false);
      setApiSocketId(null);
    });

    socketInstance.on('onlineUsersCount', (count) => {
      setOnlineCount(count);
    });

    socketInstance.on('userTyping', ({ userId, name, isTyping, taskId }) => {
      setActiveTyping((prev) => {
        const currentTypers = prev[taskId] || [];
        if (isTyping) {
          if (!currentTypers.includes(name)) {
            return { ...prev, [taskId]: [...currentTypers, name] };
          }
        } else {
          return { ...prev, [taskId]: currentTypers.filter((n) => n !== name) };
        }
        return prev;
      });
    });

    setSocket(socketInstance);

    return () => {
      console.log('🔌 Cleaning up WebSocket...');
      socketInstance.disconnect();
      setApiSocketId(null);
    };
  }, [user]);

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