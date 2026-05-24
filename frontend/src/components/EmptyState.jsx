import { ClipboardList, Plus } from 'lucide-react';

const EmptyState = ({ filtered, onAdd }) => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
    {/* Decorative glow orb */}
    <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full" style={{background: 'rgba(99,102,241,0.12)', filter: 'blur(24px)', transform: 'scale(1.5)'}} />
        <div className="relative w-20 h-20 rounded-2xl" style={{backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <ClipboardList size={32} style={{color: 'var(--accent-primary)'}} />
        </div>
      </div>

      <h3 className="font-display font-semibold text-xl mb-2" style={{color: 'var(--text-primary)'}}>
        {filtered ? 'No tasks found' : 'No tasks yet'}
      </h3>
      <p className="text-sm max-w-xs leading-relaxed mb-6" style={{color: 'var(--text-secondary)'}}>
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
