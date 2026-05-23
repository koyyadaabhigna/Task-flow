import { useState, useCallback, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useSocket } from '../context/SocketContext';

export const useTasks = () => {
  const { socket } = useSocket();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTasks = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status && filters.status !== 'all') params.set('status', filters.status);
      if (filters.priority && filters.priority !== 'all') params.set('priority', filters.priority);
      if (filters.search) params.set('search', filters.search);
      if (filters.sort) params.set('sort', filters.sort);

      const { data } = await api.get(`/tasks?${params.toString()}`);
      setTasks(data.tasks);
      setStats(data.stats);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (taskData) => {
    setActionLoading(true);
    try {
      const { data } = await api.post('/tasks', taskData);
      setTasks((prev) => [data.task, ...prev]);
      setStats((prev) => ({
        ...prev,
        total: prev.total + 1,
        pending: data.task.status === 'pending' ? prev.pending + 1 : prev.pending,
      }));
      toast.success('Task created!');
      return data.task;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (id, taskData) => {
    setActionLoading(true);
    try {
      const { data } = await api.put(`/tasks/${id}`, taskData);
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? data.task : t))
      );
      toast.success('Task updated!');
      return data.task;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    setActionLoading(true);
    try {
      await api.delete(`/tasks/${id}`);
      const deleted = tasks.find((t) => t._id === id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      if (deleted) {
        setStats((prev) => ({
          ...prev,
          total: prev.total - 1,
          pending: deleted.status === 'pending' ? prev.pending - 1 : prev.pending,
          completed: deleted.status === 'completed' ? prev.completed - 1 : prev.completed,
          inProgress: deleted.status === 'in-progress' ? prev.inProgress - 1 : prev.inProgress,
        }));
      }
      toast.success('Task deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete task');
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [tasks]);

  const toggleTask = useCallback(async (id) => {
    try {
      const { data } = await api.patch(`/tasks/${id}/toggle`);
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? data.task : t))
      );
      // Refresh stats
      const { data: fresh } = await api.get('/tasks');
      setStats(fresh.stats);
      return data.task;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
    }
  }, []);

  // Listen for real-time task events via WebSocket
  useEffect(() => {
    if (!socket) return;

    const handleCreated = (task) => {
      setTasks((prev) => {
        // Prevent duplicate tasks in local state
        if (prev.some((t) => t._id === task._id)) return prev;
        return [task, ...prev];
      });
      setStats((prev) => ({
        ...prev,
        total: prev.total + 1,
        pending: task.status === 'pending' ? prev.pending + 1 : prev.pending,
        inProgress: task.status === 'in-progress' ? prev.inProgress + 1 : prev.inProgress,
        completed: task.status === 'completed' ? prev.completed + 1 : prev.completed,
      }));
      toast.success(`Task "${task.title}" was created!`);
    };

    const handleUpdated = (task) => {
      setTasks((prev) => {
        const existing = prev.find((t) => t._id === task._id);
        if (existing) {
          // Dynamically adjust stats if task status was changed by another client
          if (existing.status !== task.status) {
            setStats((prevStats) => {
              const next = { ...prevStats };
              // Decrement old status count
              if (existing.status === 'pending') next.pending = Math.max(0, next.pending - 1);
              if (existing.status === 'in-progress') next.inProgress = Math.max(0, next.inProgress - 1);
              if (existing.status === 'completed') next.completed = Math.max(0, next.completed - 1);
              // Increment new status count
              if (task.status === 'pending') next.pending++;
              if (task.status === 'in-progress') next.inProgress++;
              if (task.status === 'completed') next.completed++;
              return next;
            });
          }
          return prev.map((t) => (t._id === task._id ? task : t));
        }
        return prev;
      });
      toast.success(`Task "${task.title}" was updated!`);
    };

    const handleDeleted = ({ taskId, title, status }) => {
      setTasks((prev) => {
        const existing = prev.find((t) => t._id === taskId);
        if (existing) {
          setStats((prevStats) => {
            const next = { ...prevStats };
            next.total = Math.max(0, next.total - 1);
            if (existing.status === 'pending') next.pending = Math.max(0, next.pending - 1);
            if (existing.status === 'in-progress') next.inProgress = Math.max(0, next.inProgress - 1);
            if (existing.status === 'completed') next.completed = Math.max(0, next.completed - 1);
            return next;
          });
          return prev.filter((t) => t._id !== taskId);
        }
        return prev;
      });
      toast.success(`Task "${title || 'Untitled'}" was deleted!`);
    };

    const handleToggled = (task) => {
      setTasks((prev) => {
        const existing = prev.find((t) => t._id === task._id);
        if (existing) {
          if (existing.status !== task.status) {
            setStats((prevStats) => {
              const next = { ...prevStats };
              if (existing.status === 'pending') next.pending = Math.max(0, next.pending - 1);
              if (existing.status === 'in-progress') next.inProgress = Math.max(0, next.inProgress - 1);
              if (existing.status === 'completed') next.completed = Math.max(0, next.completed - 1);
              if (task.status === 'pending') next.pending++;
              if (task.status === 'in-progress') next.inProgress++;
              if (task.status === 'completed') next.completed++;
              return next;
            });
          }
          return prev.map((t) => (t._id === task._id ? task : t));
        }
        return prev;
      });
      toast.success(`Task "${task.title}" marked as ${task.status}!`);
    };

    socket.on('taskCreated', handleCreated);
    socket.on('taskUpdated', handleUpdated);
    socket.on('taskDeleted', handleDeleted);
    socket.on('taskToggled', handleToggled);

    return () => {
      socket.off('taskCreated', handleCreated);
      socket.off('taskUpdated', handleUpdated);
      socket.off('taskDeleted', handleDeleted);
      socket.off('taskToggled', handleToggled);
    };
  }, [socket]);

  return {
    tasks,
    stats,
    loading,
    actionLoading,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
  };
};
