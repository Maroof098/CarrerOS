import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  CheckSquare, 
  MessageSquare, 
  User, 
  Briefcase, 
  LogOut, 
  TrendingUp,
  Cpu,
  Trophy,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from './lib/api';
import Dashboard from './pages/Dashboard';
import Roadmaps from './pages/Roadmaps';
import Tasks from './pages/Tasks';
import AIMentor from './pages/AIMentor';
import Profile from './pages/Profile';
import InternshipPrep from './pages/InternshipPrep';
import Auth from './pages/Auth';

const Navbar = ({ user, handleLogout }: { user: any; handleLogout: () => void }) => {
  return (
    <nav className="fixed left-0 top-0 h-full w-20 md:w-64 glass border-r border-white/10 flex flex-col items-center py-8 z-50">
      <div className="mb-12">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center glow-blue">
          <Cpu className="text-white w-8 h-8" />
        </div>
        <span className="hidden md:block mt-2 font-display font-bold text-xl tracking-tight text-white">CareerOS</span>
      </div>

      <div className="flex-1 flex flex-col gap-4 w-full px-4">
        <NavLink to="/" icon={<LayoutDashboard />} label="Dashboard" />
        <NavLink to="/roadmaps" icon={<Map />} label="Roadmaps" />
        <NavLink to="/tasks" icon={<CheckSquare />} label="Task Manager" />
        <NavLink to="/mentor" icon={<MessageSquare />} label="AI Mentor" />
        <NavLink to="/prep" icon={<Briefcase />} label="Career Prep" />
      </div>

      <div className="mt-auto flex flex-col gap-4 w-full px-4">
        <NavLink to="/profile" icon={<User />} label="Profile" />
        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all cursor-pointer group"
        >
          <LogOut className="group-hover:scale-110 transition-transform" />
          <span className="hidden md:block font-medium">Logout</span>
        </button>
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
  <Link 
    to={to} 
    className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all group"
  >
    <div className="group-hover:scale-110 transition-transform">{icon}</div>
    <span className="hidden md:block font-medium">{label}</span>
  </Link>
);

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/user/profile')
      .then(({ data }) => {
        if (data.id) setUser(data);
        else localStorage.removeItem('token');
      })
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData: any, token: string) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-blue-500">Loading CareerOS...</div>;

  return (
    <BrowserRouter>
      {!user ? (
        <Auth setUser={(u: any) => setUser(u)} onLogin={login} />
      ) : (
        <div className="flex min-h-screen">
          <Navbar user={user} handleLogout={handleLogout} />
          <main className="flex-1 ml-20 md:ml-64 p-4 md:p-8 overflow-x-hidden">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Dashboard user={user} />} />
                <Route path="/roadmaps" element={<Roadmaps user={user} />} />
                <Route path="/tasks" element={<Tasks user={user} />} />
                <Route path="/mentor" element={<AIMentor user={user} />} />
                <Route path="/prep" element={<InternshipPrep user={user} />} />
                <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      )}
    </BrowserRouter>
  );
}

