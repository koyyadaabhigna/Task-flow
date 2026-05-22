const TaskSkeleton = () => (
  <div className="glass-card p-5 space-y-4">
    <div className="flex items-start gap-3">
      <div className="skeleton w-5 h-5 rounded-full flex-shrink-0 mt-0.5" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 rounded-lg w-3/4" />
        <div className="skeleton h-3 rounded-lg w-1/2" />
      </div>
    </div>
    <div className="flex gap-2">
      <div className="skeleton h-5 w-16 rounded-full" />
      <div className="skeleton h-5 w-20 rounded-full" />
    </div>
  </div>
);

const TaskSkeletonGrid = ({ count = 6 }) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <TaskSkeleton key={i} />
    ))}
  </div>
);

export default TaskSkeletonGrid;
