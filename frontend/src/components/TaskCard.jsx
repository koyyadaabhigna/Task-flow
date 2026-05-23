import { useState } from 'react';
import { Calendar, Trash2, Edit3, CheckCircle2, Circle } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';
import { useSocket } from '../context/SocketContext';

const TaskCard = ({ task, onEdit, onDelete, onToggle }) => {
  const { activeTyping } = useSocket();
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  const typers = activeTyping[task._id] || [];

  const isCompleted = task.status === 'completed';
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !isCompleted;
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate));

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    setDeleting(true);
    try {
      await onDelete(task._id);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggle = async () => {
    setToggling(true);
    try {
      await onToggle(task._id);
    } finally {
      setToggling(false);
    }
  };

  return (
    <div
      className={`group glass-card p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
        isCompleted ? 'opacity-60' : ''
      }`}
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
        borderImage: isCompleted
          ? undefined
          : 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(34,211,238,0.1)) 1',
      }}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        {/* Toggle button */}
        <button
          onClick={handleToggle}
          disabled={toggling}
          className="mt-0.5 flex-shrink-0 transition-colors disabled:opacity-50"
          style={{color: 'var(--text-muted)'}}
          title={isCompleted ? 'Mark as pending' : 'Mark as complete'}
        >
          {toggling ? (
            <div className="w-5 h-5 rounded-full border-2 border-indigo-500/40 border-t-indigo-500 animate-spin" />
          ) : isCompleted ? (
            <CheckCircle2 size={20} className="text-emerald-400" />
          ) : (
            <Circle size={20} />
          )}
        </button>

        {/* Title & description */}
        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold text-sm leading-snug mb-1 ${
              isCompleted ? 'line-through' : ''
            }`}
            style={{color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)'}}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="text-xs leading-relaxed line-clamp-2" style={{color: 'var(--text-secondary)'}}>
              {task.description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg hover:bg-indigo-500/10 transition-all"
            style={{color: 'var(--text-muted)'}}
            title="Edit task"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-1.5 rounded-lg hover:bg-rose-500/10 transition-all disabled:opacity-50"
            style={{color: 'var(--text-muted)'}}
            title="Delete task"
          >
            {deleting ? (
              <div className="w-3.5 h-3.5 rounded-full border border-rose-400/40 border-t-rose-400 animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 mt-4 flex-wrap">
        <PriorityBadge priority={task.priority} size="xs" />
        <StatusBadge status={task.status} />

        {task.dueDate && (
          <span
            className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${
              isOverdue
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                : isDueToday
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                : 'border-opacity-50'
            }`}
            style={!isOverdue && !isDueToday ? {backgroundColor: 'var(--bg-elevated)', color: 'var(--text-muted)', borderColor: 'var(--border-color)'} : {}}
          >
            <Calendar size={10} />
            {isOverdue ? 'Overdue · ' : isDueToday ? 'Today · ' : ''}
            {format(new Date(task.dueDate), 'MMM d')}
          </span>
        )}
      </div>

      {/* Typing Indicator */}
      {typers.length > 0 && (
        <div className="flex items-center gap-1.5 mt-3 pt-3 text-xs font-medium animate-pulse" style={{borderColor: 'var(--border-color)', color: '#6366f1'}}>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
          <span>
            {typers.join(', ')} {typers.length === 1 ? 'is' : 'are'} editing...
          </span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
