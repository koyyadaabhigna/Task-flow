const priorityConfig = {
  low: {
    label: 'Low',
    classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    dot: 'bg-emerald-400',
  },
  medium: {
    label: 'Medium',
    classes: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    dot: 'bg-cyan-400',
  },
  high: {
    label: 'High',
    classes: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    dot: 'bg-amber-400',
  },
  urgent: {
    label: 'Urgent',
    classes: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    dot: 'bg-rose-400',
  },
};

const PriorityBadge = ({ priority, size = 'sm' }) => {
  const config = priorityConfig[priority] || priorityConfig.medium;
  const textSize = size === 'xs' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.classes} ${textSize}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

export default PriorityBadge;
