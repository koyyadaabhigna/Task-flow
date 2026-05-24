import React, { useState, useEffect } from 'react';
import { DndContext, useDraggable } from '@dnd-kit/core';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';
import toast from 'react-hot-toast';

const COLUMN_ORDER = [
  { id: 'pending', title: 'To Do', accent: 'slate' },
  { id: 'in-progress', title: 'In Progress', accent: 'indigo' },
  { id: 'completed', title: 'Done', accent: 'emerald' },
];

const DraggableTask = ({ task, children }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task._id });
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.6 : 1,
    transition: isDragging ? 'none' : 'transform 200ms ease',
  };
  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
      {children}
    </div>
  );
};

const KanbanBoard = ({ tasks = [], loading, onEdit, onDelete, onCreate, updateTask, fetchTasks }) => {
  const [localTasks, setLocalTasks] = useState(tasks);

  useEffect(() => setLocalTasks(tasks), [tasks]);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;
    const taskId = active.id;
    const dest = over.id; // column id
    const task = localTasks.find((t) => t._id === taskId);
    if (!task) return;
    if (task.status === dest) return;

    // optimistic update
    setLocalTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status: dest } : t)));
    try {
      await updateTask(taskId, { status: dest });
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
      setLocalTasks(tasks);
    }
  };

  const handleNext = async (id) => {
    const t = localTasks.find((q) => q._id === id);
    if (!t) return;
    const order = ['pending', 'in-progress', 'completed'];
    const idx = order.indexOf(t.status);
    const next = order[Math.min(idx + 1, order.length - 1)];
    if (t.status === next) return;
    setLocalTasks((prev) => prev.map((x) => (x._id === id ? { ...x, status: next } : x)));
    try {
      await updateTask(id, { status: next });
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
      setLocalTasks(tasks);
    }
  };

  return (
    <div className="kanban-board">
      <DndContext onDragEnd={handleDragEnd}>
        <div className="kanban-columns">
          {COLUMN_ORDER.map((col) => (
            <KanbanColumn key={col.id} id={col.id} title={col.title} accent={col.accent} count={localTasks.filter((t) => t.status === col.id).length}>
              <div className="space-y-3">
                {localTasks.filter((t) => t.status === col.id).map((task) => (
                  <DraggableTask key={task._id} task={task}>
                    <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} onToggle={() => handleNext(task._id)} />
                  </DraggableTask>
                ))}
                {localTasks.filter((t) => t.status === col.id).length === 0 && (
                  <div className="p-4 text-sm text-slate-400">No tasks</div>
                )}
              </div>
              {col.id === 'pending' && (
                <div className="mt-3">
                  <button onClick={onCreate} className="btn-secondary w-full">Add task</button>
                </div>
              )}
            </KanbanColumn>
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
