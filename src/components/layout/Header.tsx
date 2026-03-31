import React from 'react';
import { Search, Bell, Menu, Sun, Moon } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { Avatar } from '../ui/Common';
import { useLocation } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { data, activeProjectId, preferences, setPreferences } = useTasks();
  const location = useLocation();
  const activeProject = data.projects.find(p => p.id === activeProjectId);

  const getTitle = () => {
    if (location.pathname === '/') return 'Overview';
    if (location.pathname === '/my-tasks') return 'My Tasks';
    if (location.pathname === '/dashboard') return activeProject?.name || 'Board';
    if (location.pathname === '/analytics') return 'Analytics';
    if (location.pathname === '/settings') return 'Settings';
    return 'TaskFlow';
  };

  return (
    <header className={`h-[60px] border-b flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 transition-colors duration-300 ${
      preferences.darkMode 
        ? 'bg-slate-900 border-slate-800' 
        : 'bg-white border-slate-200'
    }`}>
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className={`lg:hidden p-2 rounded-md transition-colors ${
            preferences.darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <Menu size={20} />
        </button>
        <h2 className={`text-lg font-semibold hidden sm:block ${
          preferences.darkMode ? 'text-white' : 'text-slate-900'
        }`}>
          {getTitle()}
        </h2>
      </div>

      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className={`w-full border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all ${
              preferences.darkMode 
                ? 'bg-slate-800 text-white placeholder-slate-500' 
                : 'bg-slate-100 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 lg:gap-6">
        <button 
          onClick={() => {
            console.log('Toggling dark mode from Header. Current:', preferences.darkMode);
            setPreferences({ darkMode: !preferences.darkMode });
          }}
          className={`p-2 rounded-full transition-colors ${
            preferences.darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'
          }`}
          title={preferences.darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {preferences.darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className={`p-2 rounded-full relative transition-colors ${
          preferences.darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'
        }`}>
          <Bell size={20} />
          <span className={`absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 ${
            preferences.darkMode ? 'border-slate-900' : 'border-white'
          }`} />
        </button>
        <div className={`flex items-center gap-3 pl-4 border-l ${
          preferences.darkMode ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div className="text-right hidden sm:block">
            <p className={`text-sm font-medium leading-none ${
              preferences.darkMode ? 'text-white' : 'text-slate-900'
            }`}>{data.currentUser.name}</p>
            <p className={`text-[10px] mt-1 uppercase tracking-wider font-bold ${
              preferences.darkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>Team Member</p>
          </div>
          <Avatar src={data.currentUser.avatar} name={data.currentUser.name} />
        </div>
      </div>
    </header>
  );
};
