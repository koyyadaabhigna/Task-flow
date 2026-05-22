const statColors = {
  total: {
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    text: 'text-indigo-400',
    glow: 'shadow-glow-indigo',
  },
  pending: {
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/20',
    text: 'text-slate-300',
    glow: '',
  },
  inProgress: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    text: 'text-cyan-400',
    glow: 'shadow-glow-cyan',
  },
  completed: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
    glow: '',
  },
};

const StatsCard = ({ label, value, icon: Icon, type }) => {
  const colors = statColors[type] || statColors.total;

  return (
    <div className={`glass-card p-5 border ${colors.border} transition-all duration-300 hover:${colors.glow}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">{label}</span>
        <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center`}>
          <Icon size={15} className={colors.text} />
        </div>
      </div>
      <p className={`text-3xl font-display font-bold ${colors.text}`}>{value}</p>
    </div>
  );
};

export default StatsCard;
