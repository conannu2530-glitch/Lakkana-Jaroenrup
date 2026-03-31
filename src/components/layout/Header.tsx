import React from 'react';
import { Search, Bell, Menu, Sun, Moon } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { Avatar } from '../ui/Common';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { data, activeProjectId, preferences, setPreferences } = useTasks();
  const activeProject = data.projects.find(p => p.id === activeProjectId);

  return (
    <header className="h-[60px] bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
        >
          <Menu size={20} />
        </button>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white hidden sm:block">
          {activeProject?.name || 'Dashboard'}
        </h2>
      </div>

      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all dark:text-white dark:placeholder-slate-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 lg:gap-6">
        <button 
          onClick={() => setPreferences({ darkMode: !preferences.darkMode })}
          className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          title={preferences.darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {preferences.darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-900 dark:text-white leading-none">{data.currentUser.name}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider font-bold">Team Member</p>
          </div>
          <Avatar src={data.currentUser.avatar} name={data.currentUser.name} />
        </div>
      </div>
    </header>
  );
};
