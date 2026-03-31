import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { ListView } from '../components/list/ListView';
import { TaskModal } from '../components/tasks/TaskModal';
import { Task } from '../types';
import { AnimatePresence } from 'motion/react';

const MyTasks: React.FC = () => {
  const { data } = useTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Filter tasks assigned to current user and sort by due date
  const myTasks = data.tasks
    .filter(t => t.assigneeId === data.currentUser.id)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 lg:px-8 py-6">
        <h1 className="text-2xl font-bold text-slate-900">My Tasks</h1>
        <p className="text-sm text-slate-500">All tasks assigned to you across all projects.</p>
      </div>

      <div className="flex-1 min-h-0">
        <ListView tasks={myTasks} onTaskClick={setSelectedTask} />
      </div>

      <AnimatePresence>
        {selectedTask && (
          <TaskModal 
            task={selectedTask} 
            onClose={() => setSelectedTask(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyTasks;
