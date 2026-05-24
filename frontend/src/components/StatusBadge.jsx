const statusConfig = {
  pending: {
    label: 'Pending',
    bg: 'rgba(148,163,184,0.08)',
    color: 'var(--text-secondary)',
    border: 'rgba(148,163,184,0.12)',
    dot: 'var(--text-secondary)',
  },
  'in-progress': {
    label: 'In Progress',
    bg: 'rgba(99,102,241,0.08)',
    color: 'var(--accent-primary)',
    border: 'rgba(99,102,241,0.12)',
    dot: 'var(--accent-primary)',
    pulse: true,
  },
  completed: {
    label: 'Completed',
    bg: 'rgba(52,211,153,0.08)',
    color: 'var(--emerald-400)',
    border: 'rgba(52,211,153,0.12)',
    dot: 'var(--emerald-400)',
  },
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border`}
      style={{backgroundColor: config.bg, color: config.color, borderColor: config.border}}
    >
      <span className={`w-1.5 h-1.5 rounded-full`} style={{backgroundColor: config.dot, animation: config.pulse ? 'pulse 1.8s infinite' : 'none'}} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
