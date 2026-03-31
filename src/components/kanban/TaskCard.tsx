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
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Common';
import { AlertTriangle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  isOverlay?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, isOverlay }) => {
  const { data, preferences, deleteTask } = useTasks();
  const [isDeleting, setIsDeleting] = React.useState(false);
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

  const isOverdue = task.statusId !== 's4' && new Date(task.dueDate).getTime() < new Date().getTime();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-lg shadow-sm border transition-all group relative touch-none",
        preferences.darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200",
        preferences.compactView ? "p-2.5" : "p-4",
        isOverlay && "shadow-xl border-blue-400 dark:border-blue-500 rotate-2 scale-105",
        isDragging && !isOverlay && "opacity-0",
        isOverdue && "border-red-200 dark:border-red-900/50"
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
          {isOverdue && <Badge color="red" className="text-[8px] px-1 py-0 uppercase">Overdue</Badge>}
        </div>
        <button 
          className="text-slate-400 dark:text-slate-600 opacity-0 group-hover:opacity-100 hover:text-red-500 dark:hover:text-red-400 transition-opacity p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={(e) => {
            e.stopPropagation();
            setIsDeleting(true);
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
          <div className={cn(
            "flex items-center gap-1 text-[10px]",
            isOverdue ? "text-red-500 font-bold" : ""
          )}>
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        title="Delete Task"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-red-600">
            <AlertTriangle size={24} />
            <p className="font-medium">Are you sure you want to delete this task?</p>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            This action cannot be undone. All data associated with this task will be permanently removed.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setIsDeleting(false)}>
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={() => {
                deleteTask(task.id);
                setIsDeleting(false);
              }}
            >
              Delete Task
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
