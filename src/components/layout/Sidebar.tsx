import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { LayoutGrid, CheckSquare, Settings, LogOut, FolderKanban, Menu, X, Plus, FolderPlus, BarChart3 } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { cn } from '../../lib/utils';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Common';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { data, activeProjectId, setActiveProjectId, addProject, preferences } = useTasks();
  const navigate = useNavigate();
  const [isAddingProject, setIsAddingProject] = React.useState(false);
  const [newProjectName, setNewProjectName] = React.useState('');

  const navItems = [
    { icon: LayoutGrid, label: 'Overview', path: '/' },
    { icon: CheckSquare, label: 'My Tasks', path: '/my-tasks' },
    { icon: FolderKanban, label: 'Board', path: '/dashboard' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed top-0 left-0 h-full w-[250px] border-r z-50 transition-all duration-300 lg:translate-x-0",
        preferences.darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={cn(
            "h-[60px] flex items-center px-6 border-b",
            preferences.darkMode ? "border-slate-800" : "border-slate-100"
          )}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FolderKanban className="text-white w-5 h-5" />
              </div>
              <span className={cn(
                "font-bold text-xl",
                preferences.darkMode ? "text-white" : "text-slate-900"
              )}>TaskFlow</span>
            </div>
            <button onClick={onClose} className="ml-auto lg:hidden p-1 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>

          {/* Main Nav */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? (preferences.darkMode ? "bg-blue-900/20 text-blue-400" : "bg-blue-50 text-blue-600") 
                    : (preferences.darkMode ? "text-slate-400 hover:bg-slate-800 hover:text-white" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900")
                )}
                onClick={() => window.innerWidth < 1024 && onClose()}
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Projects Section */}
          <div className="px-4 py-2">
            <div className="flex items-center justify-between px-3 mb-2">
              <h3 className={cn(
                "text-[10px] font-bold uppercase tracking-wider",
                preferences.darkMode ? "text-slate-500" : "text-slate-400"
              )}>Projects</h3>
              <button 
                onClick={() => setIsAddingProject(true)}
                className={cn(
                  "p-1 transition-colors",
                  preferences.darkMode ? "text-slate-500 hover:text-blue-400" : "text-slate-400 hover:text-blue-500"
                )}
                title="Create Project"
              >
                <Plus size={14} />
              </button>
            </div>
            <div className="space-y-1">
              {data.projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => {
                    setActiveProjectId(project.id);
                    navigate('/dashboard');
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    activeProjectId === project.id
                      ? (preferences.darkMode ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-900")
                      : (preferences.darkMode ? "text-slate-400 hover:bg-slate-800 hover:text-white" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900")
                  )}
                >
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    activeProjectId === project.id ? "bg-blue-500" : (preferences.darkMode ? "bg-slate-600" : "bg-slate-300")
                  )} />
                  {project.name}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Nav */}
          <div className={cn(
            "mt-auto p-4 border-t",
            preferences.darkMode ? "border-slate-800" : "border-slate-100"
          )}>
            <NavLink 
              to="/settings"
              className={({ isActive }) => cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? (preferences.darkMode ? "bg-blue-900/20 text-blue-400" : "bg-blue-50 text-blue-600") 
                  : (preferences.darkMode ? "text-slate-400 hover:bg-slate-800 hover:text-white" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900")
              )}
              onClick={() => window.innerWidth < 1024 && onClose()}
            >
              <Settings size={18} />
              Settings
            </NavLink>
            <button className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              preferences.darkMode ? "text-red-400 hover:bg-red-900/20" : "text-red-600 hover:bg-red-50"
            )}>
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Add Project Modal */}
      <Modal
        isOpen={isAddingProject}
        onClose={() => setIsAddingProject(false)}
        title="Create New Project"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-blue-600 mb-2">
            <FolderPlus size={24} />
            <p className="font-medium">Start a new project</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Project Name
            </label>
            <input
              autoFocus
              type="text"
              placeholder="e.g., Website Redesign, Marketing Campaign"
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-transparent dark:text-white"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (newProjectName.trim()) {
                    addProject(newProjectName.trim());
                    setNewProjectName('');
                    setIsAddingProject(false);
                    navigate('/dashboard');
                  }
                }
              }}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setIsAddingProject(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (newProjectName.trim()) {
                  addProject(newProjectName.trim());
                  setNewProjectName('');
                  setIsAddingProject(false);
                  navigate('/dashboard');
                }
              }}
            >
              Create Project
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
