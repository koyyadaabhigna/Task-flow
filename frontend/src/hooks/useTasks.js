import { useState, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const useTasks = () => {
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
