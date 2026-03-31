import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Tag, Flag, MessageSquare, Send, Trash2, LayoutDashboard, Plus } from 'lucide-react';
import { Task, Priority } from '../../types';
import { useTasks } from '../../context/TaskContext';
import { Button, Badge, Avatar } from '../ui/Common';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface TaskModalProps {
  task: Task;
  onClose: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ task: initialTask, onClose }) => {
  const { data, updateTask, addComment, deleteTask } = useTasks();
  const task = data.tasks.find(t => t.id === initialTask.id) || initialTask;
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
  }, [task.id]); // Only reset when task ID changes

  const handleSave = () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    updateTask(task.id, { 
      title: title.trim(),
      description: description.trim()
    });
    onClose();
  };

  const handlePostComment = () => {
    if (commentText.trim()) {
      addComment(task.id, commentText.trim());
      setCommentText('');
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div 
        layoutId={task.id}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Task Details</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleDelete} className="text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400">
              <Trash2 size={20} />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-slate-200">
              <X size={24} />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
            {/* Main Content */}
            <div className="space-y-8">
              {/* Title */}
              <div className="space-y-2">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (e.target.value.trim()) setError('');
                  }}
                  className={cn(
                    "w-full text-3xl font-bold text-slate-900 dark:text-white bg-transparent border-none focus:ring-0 p-0 placeholder:text-slate-300 dark:placeholder:text-slate-700",
                    error && "text-red-500"
                  )}
                  placeholder="Task Title"
                />
                {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
              </div>

              {/* Description */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
                  <LayoutDashboard size={18} className="text-slate-400 dark:text-slate-500" />
                  <span>Description</span>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a more detailed description..."
                  className="w-full min-h-[150px] bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl p-4 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
              </div>

              {/* Comments Section */}
              <div className="space-y-6 pt-8 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
                  <MessageSquare size={18} className="text-slate-400 dark:text-slate-500" />
                  <span>Activity</span>
                </div>

                <div className="flex gap-4">
                  <Avatar src={data.currentUser.avatar} name={data.currentUser.name} />
                  <div className="flex-1 space-y-2">
                    <textarea
                      placeholder="Write a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
                      rows={2}
                    />
                    <div className="flex justify-end">
                      <Button 
                        size="sm" 
                        disabled={!commentText.trim()} 
                        onClick={handlePostComment}
                        className="gap-2"
                      >
                        <Send size={14} />
                        Post Comment
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {task.comments.map(comment => {
                    const user = data.users.find(u => u.id === comment.userId);
                    return (
                      <div key={comment.id} className="flex gap-4">
                        <Avatar src={user?.avatar || ''} name={user?.name || ''} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">{user?.name}</span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">{format(new Date(comment.timestamp), 'MMM d, h:mm a')}</span>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl rounded-tl-none p-3 text-sm text-slate-700 dark:text-slate-300">
                            {comment.text}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar Metadata */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Status</label>
                  <select 
                    value={task.statusId}
                    onChange={(e) => updateTask(task.id, { statusId: e.target.value })}
                    className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm font-medium p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    {data.statuses.map(s => (
                      <option key={s.id} value={s.id} className="dark:bg-slate-800">{s.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Assignee</label>
                  <div className="flex items-center gap-3 p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <select 
                      value={task.assigneeId}
                      onChange={(e) => updateTask(task.id, { assigneeId: e.target.value })}
                      className="flex-1 bg-transparent border-none text-sm font-medium p-0 text-slate-900 dark:text-white focus:ring-0"
                    >
                      {data.users.map(u => (
                        <option key={u.id} value={u.id} className="dark:bg-slate-800">{u.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Priority</label>
                  <select 
                    value={task.priority}
                    onChange={(e) => updateTask(task.id, { priority: e.target.value as Priority })}
                    className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm font-medium p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Low" className="dark:bg-slate-800">Low</option>
                    <option value="Medium" className="dark:bg-slate-800">Medium</option>
                    <option value="High" className="dark:bg-slate-800">High</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Due Date</label>
                  <div className="flex items-center gap-3 p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <Calendar size={16} className="text-slate-400 dark:text-slate-500" />
                    <input 
                      type="date" 
                      value={task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val) {
                          updateTask(task.id, { dueDate: new Date(val).toISOString() });
                        }
                      }}
                      className="flex-1 bg-transparent border-none text-sm font-medium p-0 text-slate-900 dark:text-white focus:ring-0 [color-scheme:light] dark:[color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map(tag => (
                      <Badge key={tag} color="blue">{tag}</Badge>
                    ))}
                    <button className="w-6 h-6 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-colors">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} className="dark:text-slate-400 dark:hover:text-white">Cancel</Button>
          <Button 
            onClick={handleSave} 
            disabled={!!error || !title.trim()}
          >
            Save Changes
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
