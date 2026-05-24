const StatsCard = ({ label, value, icon: Icon, type }) => {
  const iconBg = type === 'inProgress' ? 'rgba(6,182,212,0.08)' : type === 'completed' ? 'rgba(52,211,153,0.08)' : 'rgba(99,102,241,0.08)';
  const iconColor = type === 'inProgress' ? 'var(--accent-cyan)' : type === 'completed' ? 'var(--emerald-400)' : 'var(--accent-primary)';

  return (
    <div className={`glass-card p-5 border transition-all duration-300`} style={{borderColor: 'var(--border-color)'}}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium uppercase tracking-widest" style={{color: 'var(--text-secondary)'}}>{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center`} style={{background: iconBg}}>
          <Icon size={15} style={{color: iconColor}} />
        </div>
      </div>
      <p className="text-3xl font-display font-bold" style={{color: 'var(--text-primary)'}}>{value}</p>
    </div>
  );
};

export default StatsCard;
