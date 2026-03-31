import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { KanbanColumn } from './KanbanColumn';
import { Task } from '../../types';
import { cn } from '../../lib/utils';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Common';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  TouchSensor,
  useSensor, 
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { TaskCard } from './TaskCard';

interface KanbanBoardProps {
  onTaskClick: (task: Task) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ onTaskClick }) => {
  const { data, activeProjectId, updateTask, reorderTasks, preferences, addStatus } = useTasks();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isAddingStatus, setIsAddingStatus] = useState(false);
  const [newStatusTitle, setNewStatusTitle] = useState('');
  
  const sortedStatuses = [...data.statuses].sort((a, b) => a.order - b.order);
  const projectTasks = data.tasks.filter(t => t.projectId === activeProjectId);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = projectTasks.find(t => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTask = projectTasks.find(t => t.id === activeId);
    const overTask = projectTasks.find(t => t.id === overId);
    const overStatus = data.statuses.find(s => s.id === overId);

    if (!activeTask) return;

    // If dragging over a task in a different column
    if (overTask && activeTask.statusId !== overTask.statusId) {
      updateTask(activeTask.id, { statusId: overTask.statusId });
    } 
    // If dragging over a column directly
    else if (overStatus && activeTask.statusId !== overStatus.id) {
      updateTask(activeTask.id, { statusId: overStatus.id });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const activeTask = projectTasks.find(t => t.id === active.id);
      const overTask = projectTasks.find(t => t.id === over.id);

      if (activeTask && overTask && activeTask.statusId === overTask.statusId) {
        const oldIndex = data.tasks.findIndex(t => t.id === active.id);
        const newIndex = data.tasks.findIndex(t => t.id === over.id);
        
        if (oldIndex !== newIndex) {
          reorderTasks(arrayMove(data.tasks, oldIndex, newIndex));
        }
      }
    }
    
    setActiveTask(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className={cn(
        "flex overflow-x-auto pb-6 h-full items-start px-4 lg:px-8 custom-scrollbar transition-all duration-300",
        preferences.compactView ? "gap-3" : "gap-6"
      )}>
        {sortedStatuses.map(status => (
          <KanbanColumn 
            key={status.id} 
            status={status} 
            tasks={projectTasks.filter(t => t.statusId === status.id)}
            onTaskClick={onTaskClick}
          />
        ))}
        
        {/* Add Column Button */}
        <button 
          onClick={() => setIsAddingStatus(true)}
          className={cn(
            "flex-shrink-0 flex items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200",
            "border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-400",
            "bg-slate-50/50 dark:bg-slate-900/30 hover:bg-white dark:hover:bg-slate-900",
            preferences.compactView ? "w-[260px] h-[100px]" : "w-[300px] h-[120px]"
          )}
        >
          <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400">
            <Plus size={24} />
            <span className="text-sm font-medium">Add Column</span>
          </div>
        </button>

        {/* Add Status Modal */}
        <Modal
          isOpen={isAddingStatus}
          onClose={() => setIsAddingStatus(false)}
          title="Add New Column"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Column Name
              </label>
              <input
                autoFocus
                type="text"
                placeholder="e.g., In Review, Delivered"
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 bg-transparent dark:text-white"
                value={newStatusTitle}
                onChange={(e) => setNewStatusTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (newStatusTitle.trim()) {
                      addStatus(newStatusTitle.trim());
                      setNewStatusTitle('');
                      setIsAddingStatus(false);
                    }
                  }
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsAddingStatus(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  if (newStatusTitle.trim()) {
                    addStatus(newStatusTitle.trim());
                    setNewStatusTitle('');
                    setIsAddingStatus(false);
                  }
                }}
              >
                Add Column
              </Button>
            </div>
          </div>
        </Modal>
      </div>
      <DragOverlay dropAnimation={{
        sideEffects: defaultDropAnimationSideEffects({
          styles: {
            active: {
              opacity: '0.5',
            },
          },
        }),
      }}>
        {activeTask ? (
          <div className="w-[300px] rotate-3 scale-105 pointer-events-none">
            <TaskCard task={activeTask} onClick={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
