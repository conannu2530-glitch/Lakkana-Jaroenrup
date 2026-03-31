import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, Github, Chrome } from 'lucide-react';
import { Button } from '../components/ui/Common';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login delay
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
            <FolderKanban className="text-white w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome to TaskFlow</h1>
          <p className="text-slate-500 mt-1">Sign in to manage your team's workflow</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <input 
                type="email" 
                required
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <button type="button" className="text-xs font-medium text-blue-600 hover:underline">Forgot password?</button>
              </div>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full py-3" 
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-slate-400 font-bold tracking-wider">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="gap-2">
              <Chrome size={18} />
              Google
            </Button>
            <Button variant="outline" className="gap-2">
              <Github size={18} />
              GitHub
            </Button>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-8">
          Don't have an account? <button className="font-semibold text-blue-600 hover:underline">Create one for free</button>
        </p>
      </div>
    </div>
  );
};

export default Login;
