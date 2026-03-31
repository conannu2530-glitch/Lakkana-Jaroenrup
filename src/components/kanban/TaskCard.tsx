import React from 'react';
import { Calendar, MessageSquare, Trash2, GripVertical } from 'lucide-react';
import { Task, Priority } from '../../types';
import { useTasks } from '../../context/TaskContext';
import { Badge, Avatar } from '../ui/Common';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '../../lib/utils';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  isOverlay?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, isOverlay }) => {
  const { data, preferences, deleteTask } = useTasks();
  const assignee = data.users.find(u => u.id === task.assigneeId);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const priorityColors: Record<Priority, 'red' | 'yellow' | 'green'> = {
    High: 'red',
    Medium: 'yellow',
    Low: 'green',
  };

  if (isDragging && !isOverlay) {
    return (
      <div 
        ref={setNodeRef}
        style={style}
        className={cn(
          "bg-slate-50 dark:bg-slate-800/50 border-2 border-blue-200 dark:border-blue-900/50 border-dashed rounded-lg transition-all duration-300",
          preferences.compactView ? "h-[80px]" : "h-[120px]"
        )}
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 cursor-pointer hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all group relative touch-none",
        preferences.compactView ? "p-2.5" : "p-4",
        isOverlay && "shadow-xl border-blue-400 dark:border-blue-500 rotate-2 scale-105",
        isDragging && !isOverlay && "opacity-0"
      )}
      onClick={onClick}
      {...attributes}
      {...listeners}
    >
      <div className={cn("flex items-start justify-between", preferences.compactView ? "mb-1" : "mb-2")}>
        <div className="flex items-center gap-2">
          <div className="p-1 -ml-2 text-slate-300 dark:text-slate-600 group-hover:text-slate-400 dark:group-hover:text-slate-500">
            <GripVertical size={14} />
          </div>
          <Badge color={priorityColors[task.priority]}>{task.priority}</Badge>
        </div>
        <button 
          className="text-slate-400 dark:text-slate-600 opacity-0 group-hover:opacity-100 hover:text-red-500 dark:hover:text-red-400 transition-opacity p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm('Are you sure you want to delete this task?')) {
              deleteTask(task.id);
            }
          }}
        >
          <Trash2 size={16} />
        </button>
      </div>

      <h4 className={cn(
        "font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 leading-tight",
        preferences.compactView ? "text-xs mb-1" : "text-sm mb-3"
      )}>
        {task.title}
      </h4>

      <div className={cn("flex items-center justify-between", preferences.compactView ? "mt-2" : "mt-4")}>
        <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-1 text-[10px]">
            <Calendar size={12} />
            <span>{format(new Date(task.dueDate), 'MMM d')}</span>
          </div>
          {task.comments.length > 0 && (
            <div className="flex items-center gap-1 text-[10px]">
              <MessageSquare size={12} />
              <span>{task.comments.length}</span>
            </div>
          )}
        </div>
        {assignee && (
          <Avatar src={assignee.avatar} name={assignee.name} size={preferences.compactView ? "xs" : "sm"} />
        )}
      </div>
    </div>
  );
};
