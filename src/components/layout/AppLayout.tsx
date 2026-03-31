import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useTasks } from '../../context/TaskContext';

export const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { preferences } = useTasks();

  return (
    <div className={`flex h-screen transition-colors duration-300 ${preferences.darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0 lg:ml-[250px]">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className={`flex-1 overflow-y-auto custom-scrollbar transition-colors duration-300 ${preferences.darkMode ? 'bg-slate-900/50' : ''}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
