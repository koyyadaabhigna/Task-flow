const priorityConfig = {
  low: {
    label: 'Low',
    bg: 'rgba(52,211,153,0.08)',
    color: 'var(--emerald-400)',
    border: 'rgba(52,211,153,0.12)',
    dot: 'var(--emerald-400)',
  },
  medium: {
    label: 'Medium',
    bg: 'rgba(6,182,212,0.08)',
    color: 'var(--accent-cyan)',
    border: 'rgba(6,182,212,0.12)',
    dot: 'var(--accent-cyan)',
  },
  high: {
    label: 'High',
    bg: 'rgba(245,158,11,0.08)',
    color: 'var(--amber-400)',
    border: 'rgba(245,158,11,0.12)',
    dot: 'var(--amber-400)',
  },
  urgent: {
    label: 'Urgent',
    bg: 'rgba(244,63,94,0.08)',
    color: 'var(--accent-rose)',
    border: 'rgba(244,63,94,0.12)',
    dot: 'var(--accent-rose)',
  },
};

const PriorityBadge = ({ priority, size = 'sm' }) => {
  const config = priorityConfig[priority] || priorityConfig.medium;
  const textSize = size === 'xs' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${textSize}`}
      style={{backgroundColor: config.bg, color: config.color, borderColor: config.border}}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: config.dot}} />
      {config.label}
    </span>
  );
};

export default PriorityBadge;
