import React, { useState } from 'react';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { ListView } from '../components/list/ListView';
import { TaskModal } from '../components/tasks/TaskModal';
import { KanbanSkeleton } from '../components/ui/Skeleton';
import { useTasks } from '../context/TaskContext';
import { Task } from '../types';
import { LayoutGrid, List, Plus, Filter } from 'lucide-react';
import { Button } from '../components/ui/Common';
import { AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const Dashboard: React.FC = () => {
  const { data, activeProjectId, isLoading, addTask, preferences } = useTasks();
  const [view, setView] = useState<'board' | 'list'>('board');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const projectTasks = data.tasks.filter(t => t.projectId === activeProjectId);

  return (
    <div className="flex flex-col h-full">
      {/* Dashboard Header */}
      <div className={cn(
        "px-4 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300",
        preferences.compactView ? "py-3" : "py-6"
      )}>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Project Overview</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage your team's workflow and track progress.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex items-center">
            <button 
              onClick={() => setView('board')}
              className={`p-1.5 rounded-md transition-all ${view === 'board' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setView('list')}
              className={`p-1.5 rounded-md transition-all ${view === 'list' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
              <List size={18} />
            </button>
          </div>

          <Button variant="outline" size="sm" className="gap-2 hidden md:flex dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
            <Filter size={16} />
            Filter
          </Button>
          
          <Button 
            size="sm" 
            className="gap-2"
            onClick={() => addTask(activeProjectId, data.statuses[0].id, 'New Task')}
          >
            <Plus size={16} />
            Add Task
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0">
        {isLoading ? (
          <KanbanSkeleton />
        ) : (
          view === 'board' ? (
            <KanbanBoard onTaskClick={setSelectedTask} />
          ) : (
            <ListView tasks={projectTasks} onTaskClick={setSelectedTask} />
          )
        )}
      </div>

      {/* Task Detail Modal */}
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

export default Dashboard;
