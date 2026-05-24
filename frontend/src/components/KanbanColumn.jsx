import React from 'react';
import { useDroppable } from '@dnd-kit/core';

const KanbanColumn = ({ id, title, accent = 'slate', count = 0, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  const accentColor = {
    slate: 'border-slate-300/10',
    indigo: 'border-indigo-400',
    emerald: 'border-emerald-400',
  }[accent] || 'border-slate-300/10';

  return (
    <div ref={setNodeRef} id={id} className={`kanban-column glass-card p-4 flex flex-col`} style={{borderTopWidth: '4px', borderTopColor: 'transparent'}}>
      <div className={`kanban-column-header flex items-center justify-between mb-3 pb-2`}>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm" style={{color: 'var(--text-primary)'}}>{title}</h3>
          <span className="inline-flex items-center justify-center text-xs px-2 py-0.5 rounded-full" style={{backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-color)', color: 'var(--text-muted)'}}>{count}</span>
        </div>
      </div>

      <div className={`kanban-column-body flex-1 overflow-y-auto pr-2 ${isOver ? 'ring-2 ring-indigo-400/30' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default KanbanColumn;
