import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  BarChart3,
  Clock3,
  Sparkles,
  CalendarDays,
  Flag,
  PieChart,
  AlertTriangle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import useAnalytics from '../hooks/useAnalytics';

const chartTooltipStyles = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: '16px',
  color: 'var(--text-primary)',
  boxShadow: 'var(--shadow-card)',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div style={chartTooltipStyles} className="p-3 text-sm">
      <p className="font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-3">
          <span className="capitalize" style={{ color: 'var(--text-secondary)' }}>
            {entry.name}
          </span>
          <span style={{ color: 'var(--text-primary)' }}>{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const Analytics = () => {
  const {
    summary,
    weekly,
    priority,
    monthly,
    loadingSummary,
    loadingWeekly,
    loadingPriority,
    loadingMonthly,
    loading,
    error,
    refetch,
  } = useAnalytics();

  const totalTasks = summary?.totalTasks ?? 0;
  const activeCreation = useMemo(
    () => weekly.reduce((sum, item) => sum + item.created, 0),
    [weekly]
  );
  const busiestDay = useMemo(() => {
    if (!weekly || weekly.length === 0) return 'None yet';
    const winner = weekly.reduce((best, item) => {
      const total = item.created + item.completed;
      const bestTotal = best.created + best.completed;
      return total > bestTotal ? item : best;
    }, weekly[0]);
    return winner ? winner.day : 'None yet';
  }, [weekly]);

  const averageTasksPerWeek = useMemo(() => {
    if (!weekly || weekly.length === 0) return 0;
    return Number((activeCreation / 7).toFixed(1));
  }, [activeCreation, weekly]);

  const topPriority = useMemo(() => {
    if (!priority || priority.length === 0) return 'None';
    const top = priority.reduce((best, entry) => (entry.value > best.value ? entry : best), priority[0]);
    return top?.name || 'None';
  }, [priority]);

  const onTimeRate = summary?.onTimeCompletionRate ?? summary?.completionRate ?? 0;

  const statusRows = [
    {
      label: 'Pending',
      value: summary?.pendingTasks ?? 0,
      color: '#64748b',
      accent: 'Pending',
    },
    {
      label: 'In Progress',
      value: summary?.inProgressTasks ?? 0,
      color: '#6366f1',
      accent: 'In Progress',
    },
    {
      label: 'Completed',
      value: summary?.completedTasks ?? 0,
      color: '#34d399',
      accent: 'Completed',
    },
  ];

  if (!loading && totalTasks === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="glass-card p-10 text-center">
          <PieChart size={48} className="mx-auto mb-4 text-indigo-400" />
          <h1 className="text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            No data yet
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Start creating tasks to see your analytics, productivity trends, and priority breakdown.
          </p>
          <Link
            to="/dashboard"
            className="btn-primary mt-6 inline-flex items-center gap-2"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-2 rounded-2xl bg-[rgba(99,102,241,0.08)]" style={{ border: '1px solid var(--border-color)' }}>
            <BarChart3 size={18} className="text-indigo-400" />
            <span className="text-xs uppercase tracking-[0.24em] font-semibold text-slate-400">Analytics</span>
          </div>
          <h1 className="font-display font-bold text-3xl" style={{ color: 'var(--text-primary)' }}>
            Analytics
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-2xl">
            Track your productivity and task insights.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          <button
            type="button"
            onClick={refetch}
            className="btn-secondary inline-flex items-center gap-2"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="glass-card p-4 mb-6 border border-rose-500/20 text-rose-100" style={{ backgroundColor: 'rgba(244, 63, 94, 0.08)', borderColor: 'rgba(244, 63, 94, 0.2)' }}>
          {error}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-4 mb-6">
        {[
          {
            label: 'Completion Rate',
            value: `${summary?.completionRate ?? 0}%`,
            caption: 'of all tasks',
            icon: BarChart3,
            accent: 'from-indigo-500 to-cyan-500',
          },
          {
            label: 'Total Tasks',
            value: summary?.totalTasks ?? 0,
            caption: 'tasks tracked',
            icon: CalendarDays,
            accent: 'from-cyan-500 to-emerald-400',
          },
          {
            label: 'Avg Completion',
            value: `${summary?.avgCompletionDays ?? 0} days`,
            caption: 'per completed task',
            icon: Clock3,
            accent: 'from-amber-400 to-rose-400',
          },
          {
            label: 'Overdue Tasks',
            value: summary?.overdueCount ?? 0,
            caption: 'need attention',
            icon: AlertTriangle,
            accent: 'from-rose-500 to-fuchsia-500',
          },
        ].map((card) => (
          <div key={card.label} className="glass-card p-5 border transition-all duration-300" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: 'var(--text-secondary)' }}>
                  {card.label}
                </p>
                <p className="mt-3 text-3xl font-display font-bold" style={{ color: 'var(--text-primary)' }}>
                  {card.value}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-3xl bg-gradient-to-br ${card.accent} shadow-glow-indigo flex items-center justify-center`}>
                <card.icon size={18} className="text-white" />
              </div>
            </div>
            <p className="text-xs text-slate-500">{card.caption}</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-6 mb-6 border" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Weekly Activity
            </h2>
            <p className="text-sm text-slate-400">Created vs completed tasks in the last 7 days.</p>
          </div>
        </div>

        {loadingWeekly ? (
          <div className="skeleton h-[300px] rounded-3xl" />
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="var(--border-color)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }} />
                <Legend wrapperStyle={{ color: 'var(--text-secondary)' }} />
                <Bar dataKey="created" name="Created" fill="#6366f1" radius={[8, 8, 0, 0]} />
                <Bar dataKey="completed" name="Completed" fill="#34d399" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2 mb-6">
        <div className="glass-card p-6 border" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Priority Breakdown
              </h2>
              <p className="text-sm text-slate-400">See which priorities dominate your workflow.</p>
            </div>
            <PieChart size={18} className="text-indigo-400" />
          </div>

          {loadingPriority ? (
            <div className="skeleton h-[280px] rounded-3xl" />
          ) : (
            <div className="relative h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={priority}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={72}
                    outerRadius={104}
                    paddingAngle={2}
                    stroke="transparent"
                  >
                    {priority.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </RePieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-sm text-slate-500">Total</p>
                <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{totalTasks}</p>
              </div>
            </div>
          )}

          {!loadingPriority && (
            <div className="mt-6 grid gap-2">
              {priority.map((item) => (
                <div key={item.name} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card p-6 border" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Status Overview
              </h2>
              <p className="text-sm text-slate-400">Current breakdown of task progress.</p>
            </div>
            <BarChart3 size={18} className="text-indigo-400" />
          </div>

          {loadingSummary ? (
            <div className="skeleton h-[280px] rounded-3xl" />
          ) : (
            <div className="space-y-5">
              {statusRows.map((row) => {
                const percent = summary?.totalTasks ? Math.round((row.value / summary.totalTasks) * 100) : 0;
                return (
                  <div key={row.label}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{row.label}</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{row.value} tasks</p>
                      </div>
                      <span className="text-sm font-semibold" style={{ color: row.color }}>{percent}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${percent}%`, backgroundColor: row.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="glass-card p-6 mb-6 border" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              30-Day Completion Trend
            </h2>
            <p className="text-sm text-slate-400">Recent completed task momentum over the last month.</p>
          </div>
        </div>

        {loadingMonthly ? (
          <div className="skeleton h-[250px] rounded-3xl" />
        ) : (
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="monthlyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border-color)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} interval={4} />
                <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(99, 102, 241, 0.2)', strokeWidth: 2 }} />
                <Area type="monotone" dataKey="completed" stroke="#6366f1" fill="url(#monthlyGradient)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Insights
          </h2>
          <p className="text-sm text-slate-400">Key productivity summaries from your recent tasks.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: `Your busiest day is ${busiestDay}`,
            description: 'Most combined created + completed tasks in the last 7 days.',
            icon: Sparkles,
            accent: 'bg-indigo-500/10 text-indigo-300',
          },
          {
            title: `You complete ${onTimeRate}% of tasks on time`,
            description: 'Tasks finished before or on their due date.',
            icon: Clock3,
            accent: 'bg-emerald-500/10 text-emerald-300',
          },
          {
            title: `Average ${averageTasksPerWeek} tasks created per week`,
            description: 'Weekly creation pace based on the last 7 days.',
            icon: CalendarDays,
            accent: 'bg-cyan-500/10 text-cyan-300',
          },
          {
            title: `Most tasks are ${topPriority}`,
            description: 'Your task backlog is weighted toward this priority.',
            icon: Flag,
            accent: 'bg-amber-500/10 text-amber-300',
          },
        ].map((insight) => (
          <div key={insight.title} className="glass-card p-5 border" style={{ borderColor: 'var(--border-color)' }}>
            <div className={`inline-flex items-center justify-center w-11 h-11 rounded-2xl mb-4 ${insight.accent}`}>
              <insight.icon size={20} />
            </div>
            <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{insight.title}</h3>
            <p className="text-sm text-slate-400">{insight.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;
