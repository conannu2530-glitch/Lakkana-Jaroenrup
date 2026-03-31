import React from 'react';
import { useTasks } from '../context/TaskContext';
import { 
  CheckCircle2, 
  MessageSquare, 
  ArrowRight, 
  Filter, 
  Plus, 
  TrendingUp,
  Clock,
  UserPlus
} from 'lucide-react';
import { Button, Badge, Avatar } from '../components/ui/Common';
import { Link, useNavigate } from 'react-router-dom';
import { Modal } from '../components/ui/Modal';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

const Overview: React.FC = () => {
  const { data, preferences, addProject } = useTasks();
  const navigate = useNavigate();
  const [isAddingProject, setIsAddingProject] = React.useState(false);
  const [newProjectName, setNewProjectName] = React.useState('');
  
  // Mock recent activities since we don't have a real activity log
  const recentActivities = [
    {
      id: 'a1',
      user: data.users[1],
      action: 'assigned you to',
      target: 'Define v2.0 feature scope',
      time: 'Feb 2, 3:05 PM',
      icon: UserPlus,
      iconColor: 'text-purple-500',
      iconBg: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      id: 'a2',
      user: data.users[2],
      action: 'commented on',
      target: 'Design new homepage hero section',
      time: 'Mar 28, 6:45 PM',
      icon: MessageSquare,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      id: 'a3',
      user: data.users[0],
      action: 'moved',
      target: 'Audit current site performance',
      to: 'Done',
      time: 'Feb 15, 11:20 AM',
      icon: CheckCircle2,
      iconColor: 'text-green-500',
      iconBg: 'bg-green-50 dark:bg-green-900/20'
    }
  ];

  const myTasks = data.tasks.filter(t => t.assigneeId === data.currentUser.id).slice(0, 3);

  return (
    <div className="flex flex-col h-full transition-colors duration-300">
      {/* Welcome Header */}
      <div className="px-4 lg:px-8 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Welcome back, {data.currentUser.name.split(' ')[0]}!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Here's what's happening in your workspace today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2 dark:border-slate-700 dark:text-slate-300">
            <Filter size={16} />
            Filters
          </Button>
          <Button 
            size="sm" 
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white border-none"
            onClick={() => setIsAddingProject(true)}
          >
            <Plus size={16} />
            New Project
          </Button>
        </div>
      </div>

      {/* Add Project Modal */}
      <Modal
        isOpen={isAddingProject}
        onClose={() => setIsAddingProject(false)}
        title="Create New Project"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Project Name
            </label>
            <input
              autoFocus
              type="text"
              placeholder="e.g., Website Redesign"
              className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-transparent dark:text-white"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newProjectName.trim()) {
                  addProject(newProjectName.trim());
                  setNewProjectName('');
                  setIsAddingProject(false);
                  navigate('/dashboard');
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

      {/* Overview Grid */}
      <div className="px-4 lg:px-8 pb-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* My Tasks Card */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
          <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white">My Tasks</h3>
            <Link to="/my-tasks" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              View All
            </Link>
          </div>
          <div className="flex-1 p-2">
            {myTasks.length > 0 ? (
              <div className="space-y-1">
                {myTasks.map(task => (
                  <div key={task.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer">
                    <div className="mt-1 w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 group-hover:border-indigo-500 transition-colors flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{task.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
                          <Clock size={10} />
                          Today
                        </span>
                        <Badge color={task.priority === 'High' ? 'red' : task.priority === 'Medium' ? 'yellow' : 'green'} className="text-[9px] px-1.5 py-0">
                          {task.priority.toLowerCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-40 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
                <CheckCircle2 size={32} className="mb-2 opacity-20" />
                <p className="text-sm">No tasks for today</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white">Recent Activity</h3>
          </div>
          <div className="flex-1 p-4 space-y-6">
            {recentActivities.map(activity => (
              <div key={activity.id} className="flex gap-4">
                <div className="relative flex-shrink-0">
                  <Avatar src={activity.user.avatar} name={activity.user.name} size="md" />
                  <div className={cn("absolute -right-1 -bottom-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900", activity.iconBg)}>
                    <activity.icon size={10} className={activity.iconColor} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-snug">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{activity.user.name}</span>
                    {' '}{activity.action}{' '}
                    <span className="font-semibold text-slate-900 dark:text-slate-100">'{activity.target}'</span>
                    {activity.to && <span> to <Badge color="green" className="ml-1">{activity.to}</Badge></span>}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Progress Card */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-indigo-600 dark:bg-indigo-700 rounded-2xl p-8 text-white shadow-lg shadow-indigo-200 dark:shadow-none relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            
            <h3 className="text-xl font-bold relative z-10">Project Progress</h3>
            <p className="text-indigo-100 text-sm mt-2 relative z-10">You have completed 12 tasks this week. Keep it up!</p>
            
            <div className="mt-8 space-y-6 relative z-10">
              {data.projects.slice(0, 3).map(project => {
                const projectTasks = data.tasks.filter(t => t.projectId === project.id);
                const completedTasks = projectTasks.filter(t => t.statusId === 's4');
                const progress = projectTasks.length > 0 
                  ? Math.round((completedTasks.length / projectTasks.length) * 100) 
                  : 0;
                
                return (
                  <div key={project.id} className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span>{project.name}</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white rounded-full transition-all duration-500" 
                        style={{ width: `${progress}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={() => navigate('/analytics')}
              className="w-full mt-10 bg-white/10 hover:bg-white/20 border border-white/20 py-3 rounded-xl text-sm font-bold transition-all backdrop-blur-sm relative z-10"
            >
              View Analytics
            </button>
          </div>

          {/* Quick Stats or something else */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center text-green-600">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Productivity</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">+12% <span className="text-xs font-normal text-slate-500">vs last week</span></p>
              </div>
            </div>
            <ArrowRight size={20} className="text-slate-300" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Overview;
