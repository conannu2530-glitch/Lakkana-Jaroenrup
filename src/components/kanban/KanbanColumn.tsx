import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Status, Task } from '../../types';
import { TaskCard } from './TaskCard';
import { useTasks } from '../../context/TaskContext';
import { Button } from '../ui/Common';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { cn } from '../../lib/utils';

interface KanbanColumnProps {
  status: Status;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, tasks, onTaskClick }) => {
  const { addTask, activeProjectId, preferences } = useTasks();
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const { setNodeRef, isOver } = useDroppable({
    id: status.id,
  });

  const handleAdd = () => {
    if (newTitle.trim()) {
      addTask(activeProjectId, status.id, newTitle.trim());
      setNewTitle('');
      setIsAdding(false);
    }
  };

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "flex flex-col flex-shrink-0 bg-slate-100/50 dark:bg-slate-800/40 rounded-xl p-3 max-h-full border-2 transition-all duration-300",
        preferences.compactView ? "w-[260px]" : "w-[300px]",
        isOver ? "border-blue-400 bg-blue-50/50 dark:bg-blue-900/20 border-dashed" : "border-transparent"
      )}
    >
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">{status.title}</h3>
          <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="text-slate-400 hover:text-blue-600 transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className={cn(
        "flex flex-col overflow-y-auto pr-1 custom-scrollbar min-h-[100px] transition-all duration-300",
        preferences.compactView ? "gap-2" : "gap-3"
      )}>
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
          ))}
        </SortableContext>

        {isAdding ? (
          <div className="bg-white dark:bg-slate-900 p-3 rounded-lg shadow-sm border-2 border-blue-500">
            <textarea
              autoFocus
              placeholder="What needs to be done?"
              className="w-full text-sm border-none focus:ring-0 p-0 resize-none mb-2 bg-transparent dark:text-white dark:placeholder-slate-500"
              rows={2}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAdd();
                }
                if (e.key === 'Escape') setIsAdding(false);
              }}
            />
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={handleAdd}>Add Task</Button>
              <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>
                <X size={16} />
              </Button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm hover:text-blue-600 dark:hover:text-blue-400 p-2 transition-colors"
          >
            <Plus size={16} />
            <span>Add Task</span>
          </button>
        )}
      </div>
    </div>
  );
};
