import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import { AppLayout } from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import MyTasks from './pages/MyTasks';
import Overview from './pages/Overview';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import { Settings } from './pages/Settings';

export default function App() {
  return (
    <TaskProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Overview />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="my-tasks" element={<MyTasks />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </TaskProvider>
  );
}
