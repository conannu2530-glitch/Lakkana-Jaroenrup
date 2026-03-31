import React, { useState } from 'react';
import { Plus, X, MoreVertical, Edit2, Trash2, AlertTriangle, Calendar } from 'lucide-react';
import { Status, Task } from '../../types';
import { TaskCard } from './TaskCard';
import { useTasks } from '../../context/TaskContext';
import { Button } from '../ui/Common';
import { Modal } from '../ui/Modal';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';

interface KanbanColumnProps {
  status: Status;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, tasks, onTaskClick }) => {
  const { addTask, activeProjectId, preferences, updateStatus, deleteStatus } = useTasks();
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(status.title);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: status.id,
  });

  const handleAdd = () => {
    if (newTitle.trim()) {
      addTask(activeProjectId, status.id, newTitle.trim(), new Date(newDueDate).toISOString());
      setNewTitle('');
      setNewDueDate(format(new Date(), 'yyyy-MM-dd'));
      setIsAdding(false);
    }
  };

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "flex flex-col flex-shrink-0 rounded-xl p-3 max-h-full border-2 transition-all duration-300",
        preferences.darkMode ? "bg-slate-800/40" : "bg-slate-100/50",
        preferences.compactView ? "w-[260px]" : "w-[300px]",
        isOver ? "border-blue-400 bg-blue-50/50 dark:bg-blue-900/20 border-dashed" : "border-transparent"
      )}
    >
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2 group/title">
          <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">{status.title}</h3>
          <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsAdding(true)}
            className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-md hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
            title="Add Task"
          >
            <Plus size={16} />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className={cn(
                "p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-md hover:bg-slate-200/50 dark:hover:bg-slate-700/50",
                showMenu && "text-slate-600 dark:text-slate-200 bg-slate-200/50 dark:bg-slate-700/50"
              )}
            >
              <MoreVertical size={16} />
            </button>
            
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 py-1 z-20">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <Edit2 size={14} />
                    Edit Column
                  </button>
                  <button
                    onClick={() => {
                      setIsDeleting(true);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 size={14} />
                    Delete Column
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
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
          <div className="bg-white dark:bg-slate-900 p-3 rounded-lg shadow-sm border-2 border-blue-500 space-y-3">
            <textarea
              autoFocus
              placeholder="What needs to be done?"
              className="w-full text-sm border-none focus:ring-0 p-0 resize-none bg-transparent dark:text-white dark:placeholder-slate-500"
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
            <div className="flex items-center gap-2 p-1.5 bg-slate-50 dark:bg-slate-800 rounded-md">
              <Calendar size={14} className="text-slate-400" />
              <input 
                type="date" 
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="flex-1 bg-transparent border-none text-[10px] font-medium p-0 text-slate-700 dark:text-slate-300 focus:ring-0 [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>
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

      {/* Edit Status Modal */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Column"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Column Name
            </label>
            <input
              autoFocus
              type="text"
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-transparent dark:text-white"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && editTitle.trim()) {
                  updateStatus(status.id, { title: editTitle.trim() });
                  setIsEditing(false);
                }
              }}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (editTitle.trim()) {
                  updateStatus(status.id, { title: editTitle.trim() });
                  setIsEditing(false);
                }
              }}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Status Modal */}
      <Modal
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        title="Delete Column"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-red-600">
            <AlertTriangle size={24} />
            <p className="font-medium">Are you sure you want to delete this column?</p>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Deleting the <span className="font-bold text-slate-700 dark:text-slate-200">"{status.title}"</span> column will also permanently remove all <span className="font-bold">{tasks.length}</span> tasks within it.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setIsDeleting(false)}>
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={() => {
                deleteStatus(status.id);
                setIsDeleting(false);
              }}
            >
              Delete Column
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
