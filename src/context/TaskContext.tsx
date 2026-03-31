import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppData, Task, Project, User, Status, Priority } from '../types';
import { mockData } from '../data/mockData';

export interface UserPreferences {
  darkMode: boolean;
  compactView: boolean;
}

interface TaskContextType {
  data: AppData;
  activeProjectId: string;
  setActiveProjectId: (id: string) => void;
  addTask: (projectId: string, statusId: string, title: string, dueDate?: string) => string;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  reorderTasks: (newTasks: Task[]) => void;
  deleteTask: (taskId: string) => void;
  addComment: (taskId: string, text: string) => void;
  addStatus: (title: string) => void;
  updateStatus: (statusId: string, updates: Partial<Status>) => void;
  deleteStatus: (statusId: string) => void;
  addProject: (name: string) => void;
  updateCurrentUser: (updates: Partial<User>) => void;
  preferences: UserPreferences;
  setPreferences: (prefs: Partial<UserPreferences>) => void;
  isLoading: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setDataState] = useState<AppData>(() => {
    const saved = localStorage.getItem('taskflow_data');
    return saved ? JSON.parse(saved) : mockData;
  });
  const [activeProjectId, setActiveProjectId] = useState<string>(data.projects[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferencesState] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('taskflow_preferences');
    return saved ? JSON.parse(saved) : {
      darkMode: false,
      compactView: false,
    };
  });

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('taskflow_preferences', JSON.stringify(preferences));
  }, [preferences]);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('taskflow_data', JSON.stringify(data));
  }, [data]);

  // Apply dark mode
  useEffect(() => {
    console.log('Dark mode preference changed:', preferences.darkMode);
    const root = document.documentElement;
    if (preferences.darkMode) {
      root.classList.add('dark');
      console.log('Added .dark class to html element');
      console.log('Current html classes:', root.className);
    } else {
      root.classList.remove('dark');
      console.log('Removed .dark class from html element');
      console.log('Current html classes:', root.className);
    }
  }, [preferences.darkMode]);

  const setPreferences = (prefs: Partial<UserPreferences>) => {
    setPreferencesState(prev => ({ ...prev, ...prefs }));
  };

  const setData = (updateFn: (prev: AppData) => AppData) => {
    setDataState(prev => {
      const next = updateFn(prev);
      return next;
    });
  };

  // Simulate loading when project changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [activeProjectId]);

  const addTask = (projectId: string, statusId: string, title: string, dueDate?: string) => {
    const newTask: Task = {
      id: `t${Date.now()}`,
      projectId,
      statusId,
      title,
      description: '',
      assigneeId: data.currentUser.id,
      priority: 'Medium',
      dueDate: dueDate || new Date().toISOString(),
      tags: [],
      comments: []
    };
    setData(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask]
    }));
    return newTask.id;
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t)
    }));
  };
  
  const reorderTasks = (newTasks: Task[]) => {
    setData(prev => ({
      ...prev,
      tasks: newTasks
    }));
  };

  const deleteTask = (taskId: string) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== taskId)
    }));
  };

  const addComment = (taskId: string, text: string) => {
    const newComment = {
      id: `c${Date.now()}`,
      userId: data.currentUser.id,
      text,
      timestamp: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => 
        t.id === taskId ? { ...t, comments: [...t.comments, newComment] } : t
      )
    }));
  };

  const addStatus = (title: string) => {
    const newStatus: Status = {
      id: `s${Date.now()}`,
      title,
      order: data.statuses.length
    };
    setData(prev => ({
      ...prev,
      statuses: [...prev.statuses, newStatus]
    }));
  };

  const updateStatus = (statusId: string, updates: Partial<Status>) => {
    setData(prev => ({
      ...prev,
      statuses: prev.statuses.map(s => s.id === statusId ? { ...s, ...updates } : s)
    }));
  };

  const deleteStatus = (statusId: string) => {
    setData(prev => {
      const remainingStatuses = prev.statuses
        .filter(s => s.id !== statusId)
        .sort((a, b) => a.order - b.order)
        .map((s, index) => ({ ...s, order: index }));

      return {
        ...prev,
        statuses: remainingStatuses,
        tasks: prev.tasks.filter(t => t.statusId !== statusId)
      };
    });
  };

  const addProject = (name: string) => {
    const newProject: Project = {
      id: `p${Date.now()}`,
      name
    };
    setData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
    setActiveProjectId(newProject.id);
  };

  const updateCurrentUser = (updates: Partial<User>) => {
    setData(prev => ({
      ...prev,
      currentUser: { ...prev.currentUser, ...updates },
      users: prev.users.map(u => u.id === prev.currentUser.id ? { ...u, ...updates } : u)
    }));
  };

  return (
    <TaskContext.Provider value={{ 
      data, 
      activeProjectId, 
      setActiveProjectId, 
      addTask, 
      updateTask, 
      reorderTasks,
      deleteTask,
      addComment,
      addStatus,
      updateStatus,
      deleteStatus,
      addProject,
      updateCurrentUser,
      preferences,
      setPreferences,
      isLoading 
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within a TaskProvider');
  return context;
};
