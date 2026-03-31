import React, { useState } from 'react';
import { Search, Save, Bell, User, Settings as SettingsIcon, Moon, Layout } from 'lucide-react';
import { Button } from '../components/ui/Common';
import { useTasks } from '../context/TaskContext';

export const Settings: React.FC = () => {
  const { data, preferences, setPreferences } = useTasks();
  const [fullName, setFullName] = useState(data.currentUser.name);
  const [email, setEmail] = useState(data.currentUser.email);
  
  const [notifications, setNotifications] = useState({
    email: true,
    taskAssigned: true,
    taskUpdated: true,
    newComments: true,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePreference = (key: keyof import('../context/TaskContext').UserPreferences) => {
    setPreferences({ [key]: !preferences[key] });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-1">
              <User size={20} className="text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-900">Profile Settings</h2>
            </div>
            <p className="text-sm text-slate-500 mb-6">Manage your profile information</p>
            
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <Button className="mt-2">Save Changes</Button>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-1">
              <Bell size={20} className="text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
            </div>
            <p className="text-sm text-slate-500 mb-6">Manage your notification preferences</p>
            
            <div className="space-y-4">
              <ToggleItem 
                label="Email Notifications" 
                enabled={notifications.email} 
                onToggle={() => toggleNotification('email')} 
              />
              <ToggleItem 
                label="Task Assigned" 
                enabled={notifications.taskAssigned} 
                onToggle={() => toggleNotification('taskAssigned')} 
              />
              <ToggleItem 
                label="Task Updated" 
                enabled={notifications.taskUpdated} 
                onToggle={() => toggleNotification('taskUpdated')} 
              />
              <ToggleItem 
                label="New Comments" 
                enabled={notifications.newComments} 
                onToggle={() => toggleNotification('newComments')} 
              />
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-1">
              <Layout size={20} className="text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-900">Preferences</h2>
            </div>
            <p className="text-sm text-slate-500 mb-6">Customize your experience</p>
            
            <div className="space-y-4">
              <ToggleItem 
                label="Dark Mode" 
                enabled={preferences.darkMode} 
                onToggle={() => togglePreference('darkMode')} 
              />
              <ToggleItem 
                label="Compact View" 
                enabled={preferences.compactView} 
                onToggle={() => togglePreference('compactView')} 
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

interface ToggleItemProps {
  label: string;
  enabled: boolean;
  onToggle: () => void;
}

const ToggleItem: React.FC<ToggleItemProps> = ({ label, enabled, onToggle }) => {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <button 
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          enabled ? 'bg-blue-600' : 'bg-slate-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};
