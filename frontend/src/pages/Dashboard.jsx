import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Search, SlidersHorizontal, LayoutGrid, List,
  CheckCircle2, Clock, Zap, BarChart3, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import StatsCard from '../components/StatsCard';
import TaskSkeletonGrid from '../components/TaskSkeleton';
import EmptyState from '../components/EmptyState';

const STATUS_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const PRIORITY_FILTERS = [
  { value: 'all', label: 'All Priorities' },
  { value: 'urgent', label: '🔴 Urgent' },
  { value: 'high', label: '🟡 High' },
  { value: 'medium', label: '🔵 Medium' },
  { value: 'low', label: '🟢 Low' },
];

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest first' },
  { value: 'createdAt', label: 'Oldest first' },
  { value: '-dueDate', label: 'Due date ↑' },
  { value: 'dueDate', label: 'Due date ↓' },
  { value: 'priority', label: 'Priority' },
  { value: 'title', label: 'Title A-Z' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, stats, loading, actionLoading, fetchTasks, createTask, updateTask, deleteTask, toggleTask } = useTasks();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sort, setSort] = useState('-createdAt');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const loadTasks = useCallback(() => {
    fetchTasks({ status: statusFilter, priority: priorityFilter, search, sort });
  }, [fetchTasks, statusFilter, priorityFilter, search, sort]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleOpenCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleModalSubmit = async (data) => {
    if (editingTask) {
      await updateTask(editingTask._id, data);
    } else {
      await createTask(data);
    }
    setModalOpen(false);
    loadTasks();
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
  };

  const handleToggle = async (id) => {
    await toggleTask(id);
    loadTasks();
  };

  const hasFilters = statusFilter !== 'all' || priorityFilter !== 'all' || search;

  const clearFilters = () => {
    setStatusFilter('all');
    setPriorityFilter('all');
    setSearchInput('');
    setSearch('');
  };

  // Greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl" style={{color: 'var(--text-primary)'}}>
            {greeting}, <span className="text-indigo-400">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-sm mt-1" style={{color: 'var(--text-secondary)'}}>
            You have{' '}
            <span className="text-cyan-400 font-semibold">{stats.pending}</span>{' '}
            pending and{' '}
            <span className="text-indigo-400 font-semibold">{stats.inProgress}</span>{' '}
            in-progress tasks
          </p>
        </div>
        <button onClick={handleOpenCreate} className="btn-primary flex items-center gap-2 flex-shrink-0">
          <Plus size={16} />
          New Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard label="Total" value={stats.total} icon={BarChart3} type="total" />
        <StatsCard label="Pending" value={stats.pending} icon={Clock} type="pending" />
        <StatsCard label="In Progress" value={stats.inProgress} icon={Zap} type="inProgress" />
        <StatsCard label="Completed" value={stats.completed} icon={CheckCircle2} type="completed" />
      </div>

      {/* Filter bar */}
      <div className="glass-card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search tasks..."
              className="input-field pl-9 py-2.5"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status tabs (desktop) */}
          <div className="hidden sm:flex items-center gap-1 bg-void-800 rounded-xl p-1 border border-surface-border">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${statusFilter === f.value
                  ? 'bg-indigo-500 text-white shadow-glow-indigo'
                  : 'text-slate-400 hover:text-white'
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`sm:hidden btn-secondary flex items-center gap-2 py-2.5 ${showFilters ? 'border-indigo-500/40 text-indigo-400' : ''}`}
          >
            <SlidersHorizontal size={14} />
            Filters
            {hasFilters && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
          </button>

          {/* Priority + Sort */}
          <div className="hidden sm:flex items-center gap-2">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="input-field py-2.5 text-xs w-36"
            >
              {PRIORITY_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input-field py-2.5 text-xs w-36"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile filter panel */}
        {showFilters && (
          <div className="sm:hidden mt-3 pt-3 border-t border-surface-border space-y-3 animate-slide-up">
            <div className="flex flex-wrap gap-1">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === f.value
                    ? 'bg-indigo-500 text-white'
                    : 'bg-void-700 text-slate-400 border border-surface-border'
                    }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="input-field py-2 text-xs"
              >
                {PRIORITY_FILTERS.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="input-field py-2 text-xs"
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Active filters row */}
        {hasFilters && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-surface-border">
            <span className="text-xs text-slate-500">Active filters:</span>
            {statusFilter !== 'all' && (
              <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                {statusFilter}
              </span>
            )}
            {priorityFilter !== 'all' && (
              <span className="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                {priorityFilter}
              </span>
            )}
            {search && (
              <span className="text-xs bg-void-700 text-slate-300 border border-surface-border px-2 py-0.5 rounded-full">
                "{search}"
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-xs text-slate-500 hover:text-rose-400 transition-colors ml-auto flex items-center gap-1"
            >
              <X size={11} /> Clear all
            </button>
          </div>
        )}
      </div>

      {/* Tasks count */}
      {!loading && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-500">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''} found
          </p>
        </div>
      )}

      {/* Task grid */}
      {loading ? (
        <TaskSkeletonGrid count={6} />
      ) : tasks.length === 0 ? (
        <EmptyState filtered={hasFilters} onAdd={handleOpenCreate} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        task={editingTask}
        loading={actionLoading}
      />
    </div>
  );
};

export default Dashboard;
