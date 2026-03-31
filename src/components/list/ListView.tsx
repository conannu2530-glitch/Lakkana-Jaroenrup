import React from 'react';
import { Calendar, User, Tag } from 'lucide-react';
import { Task, Priority } from '../../types';
import { useTasks } from '../../context/TaskContext';
import { Badge, Avatar } from '../ui/Common';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';

interface ListViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export const ListView: React.FC<ListViewProps> = ({ tasks, onTaskClick }) => {
  const { data, preferences } = useTasks();

  const priorityColors: Record<Priority, 'red' | 'yellow' | 'green'> = {
    High: 'red',
    Medium: 'yellow',
    Low: 'green',
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden mx-4 lg:mx-8 transition-all duration-300">
      <div className="grid grid-cols-[1fr_150px_150px_120px_100px] gap-4 px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
        <div>Task Name</div>
        <div>Status</div>
        <div>Assignee</div>
        <div>Due Date</div>
        <div className="text-right">Priority</div>
      </div>
      
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {tasks.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
            No tasks found in this view.
          </div>
        ) : (
          tasks.map(task => {
            const status = data.statuses.find(s => s.id === task.statusId);
            const assignee = data.users.find(u => u.id === task.assigneeId);
            
            return (
              <div 
                key={task.id}
                onClick={() => onTaskClick(task)}
                className={cn(
                  "grid grid-cols-[1fr_150px_150px_120px_100px] gap-4 px-6 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group",
                  preferences.compactView ? "py-2" : "py-4"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{task.title}</span>
                </div>
                
                <div>
                  <Badge color="blue" className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
                    {status?.title}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  {assignee && (
                    <>
                      <Avatar src={assignee.avatar} name={assignee.name} size="sm" />
                      <span className="text-xs text-slate-600 dark:text-slate-400 truncate">{assignee.name}</span>
                    </>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Calendar size={14} />
                  {format(new Date(task.dueDate), 'MMM d, yyyy')}
                </div>
                
                <div className="text-right">
                  <Badge color={priorityColors[task.priority]}>{task.priority}</Badge>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
