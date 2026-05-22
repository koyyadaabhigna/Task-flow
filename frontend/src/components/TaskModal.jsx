import { useState, useEffect, useRef } from 'react';
import { X, Loader2 } from 'lucide-react';

const initialForm = {
  title: '',
  description: '',
  priority: 'medium',
  status: 'pending',
  dueDate: '',
};

const TaskModal = ({ isOpen, onClose, onSubmit, task, loading }) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const titleRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (task) {
        setForm({
          title: task.title || '',
          description: task.description || '',
          priority: task.priority || 'medium',
          status: task.status || 'pending',
          dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        });
      } else {
        setForm(initialForm);
      }
      setErrors({});
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [isOpen, task]);

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (form.title.trim().length > 200) newErrors.title = 'Title too long (max 200 chars)';
    if (form.description.length > 1000) newErrors.description = 'Description too long (max 1000 chars)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = { ...form };
    if (!payload.dueDate) delete payload.dueDate;
    await onSubmit(payload);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdrop}
    >
      <div className="glass-modal w-full max-w-lg animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-surface-border">
          <div>
            <h2 className="font-display font-semibold text-lg text-white">
              {task ? 'Edit Task' : 'New Task'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {task ? 'Update task details below' : 'Fill in the details for your new task'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-void-700 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Title */}
          <div>
            <label className="label">
              Title <span className="text-rose-400">*</span>
            </label>
            <input
              ref={titleRef}
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              className={`input-field ${errors.title ? 'border-rose-500 focus:border-rose-500' : ''}`}
              maxLength={200}
            />
            {errors.title && <p className="text-rose-400 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="label">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add more details (optional)"
              rows={3}
              className={`input-field resize-none ${errors.description ? 'border-rose-500' : ''}`}
              maxLength={1000}
            />
            {errors.description && (
              <p className="text-rose-400 text-xs mt-1">{errors.description}</p>
            )}
            <p className="text-slate-600 text-xs mt-1 text-right">
              {form.description.length}/1000
            </p>
          </div>

          {/* Priority + Status row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="input-field"
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🔵 Medium</option>
                <option value="high">🟡 High</option>
                <option value="urgent">🔴 Urgent</option>
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="input-field"
              >
                <option value="pending">⚪ Pending</option>
                <option value="in-progress">🔵 In Progress</option>
                <option value="completed">✅ Completed</option>
              </select>
            </div>
          </div>

          {/* Due date */}
          <div>
            <label className="label">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="input-field"
              style={{ colorScheme: 'dark' }}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  {task ? 'Saving...' : 'Creating...'}
                </>
              ) : task ? (
                'Save Changes'
              ) : (
                'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
