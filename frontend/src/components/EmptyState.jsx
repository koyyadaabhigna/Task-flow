import { ClipboardList, Plus } from 'lucide-react';

const EmptyState = ({ filtered, onAdd }) => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
    {/* Decorative glow orb */}
    <div className="relative mb-6">
      <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-2xl scale-150" />
      <div className="relative w-20 h-20 rounded-2xl bg-void-700 border border-surface-border flex items-center justify-center">
        <ClipboardList size={32} className="text-indigo-400" />
      </div>
    </div>

    <h3 className="font-display font-semibold text-xl text-white mb-2">
      {filtered ? 'No tasks found' : 'No tasks yet'}
    </h3>
    <p className="text-slate-400 text-sm max-w-xs leading-relaxed mb-6">
      {filtered
        ? 'Try adjusting your filters or search query to find what you\'re looking for.'
        : 'Create your first task to start organizing your work and staying on top of things.'}
    </p>

    {!filtered && (
      <button onClick={onAdd} className="btn-primary flex items-center gap-2">
        <Plus size={16} />
        Create your first task
      </button>
    )}
  </div>
);

export default EmptyState;
