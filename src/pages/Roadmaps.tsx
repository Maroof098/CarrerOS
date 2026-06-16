import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Code, 
  Database, 
  Layout, 
  Terminal, 
  Layers, 
  Cloud, 
  Shield, 
  ChevronRight,
  Circle,
  CheckCircle2,
  Lock
} from 'lucide-react';

import api from '../lib/api';

const paths = [
  { id: 'web', title: 'Web Development', icon: <Layout />, color: 'blue', level: 'Intermediate' },
  { id: 'ai', title: 'AI & Machine Learning', icon: <Code />, color: 'purple', level: 'Beginner' },
  { id: 'ds', title: 'Data Science', icon: <Database />, color: 'green', level: 'Locked' },
  { id: 'app', title: 'App Development', icon: <Terminal />, color: 'orange', level: 'Locked' },
  { id: 'devops', title: 'DevOps & Cloud', icon: <Cloud />, color: 'cyan', level: 'Locked' },
  { id: 'cyber', title: 'Cybersecurity', icon: <Shield />, color: 'red', level: 'Locked' },
];

const roadmapData = [
  { 
    level: 'Beginner',
    modules: [
      { id: 1, title: 'HTML/CSS Fundamentals', status: 'completed' },
      { id: 2, title: 'JavaScript Essentials', status: 'completed' },
      { id: 3, title: 'DOM Manipulation', status: 'active' },
    ]
  },
  {
    level: 'Intermediate',
    modules: [
      { id: 4, title: 'React.js & Hooks', status: 'locked' },
      { id: 5, title: 'Tailwind CSS', status: 'locked' },
      { id: 6, title: 'State Management (Redux/Zustand)', status: 'locked' },
    ]
  },
  {
    level: 'Advanced',
    modules: [
      { id: 7, title: 'Node.js & Express', status: 'locked' },
      { id: 8, title: 'Database Integration (SQL/NoSQL)', status: 'locked' },
      { id: 9, title: 'Web Performance & Security', status: 'locked' },
    ]
  }
];

export default function Roadmaps({ user }: { user: any }) {
  const [selectedPath, setSelectedPath] = useState(user.current_path?.toLowerCase().includes('web') ? 'web' : 'web');
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    setLoading(true);
    const pathTitle = paths.find(p => p.id === selectedPath)?.title;
    try {
      await api.put('/user/profile', { 
        ...user,
        current_path: pathTitle 
      });
      window.location.reload(); // Refresh to update context
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-12"
    >
      <header>
        <h1 className="text-4xl font-display font-bold text-white mb-2">Learning Roadmaps</h1>
        <p className="text-gray-400">Structured paths curated for industry standards.</p>
      </header>

      {/* Path Selector */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {paths.map((path) => (
          <button
            key={path.id}
            onClick={() => setSelectedPath(path.id)}
            className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-4 group relative ${
              selectedPath === path.id 
              ? 'bg-blue-600/20 border-blue-500 text-blue-500 glow-blue' 
              : 'glass border-transparent text-gray-400 hover:text-white hover:border-white/20'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-current opacity-10 group-hover:opacity-20 transition-opacity`}></div>
            <div className="absolute top-10 flex items-center justify-center">
              {path.icon}
            </div>
            <span className="text-sm font-bold text-center">{path.title}</span>
            {path.level === 'Locked' && (
              <div className="absolute top-2 right-2">
                <Lock className="w-3 h-3 opacity-50" />
              </div>
            )}
            {user.current_path === path.title && (
              <div className="absolute top-2 left-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Roadmap visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 glass p-6 rounded-3xl h-fit sticky top-8">
          <h3 className="text-xl font-bold mb-4">Path Stats</h3>
          <div className="space-y-4">
            <StatItem label="Modules" value="12" />
            <StatItem label="Est. Time" value="120 hours" />
            <StatItem label="Completion" value={user.current_path === paths.find(p => p.id === selectedPath)?.title ? "25%" : "0%"} />
            <div className="pt-4 mt-4 border-t border-white/10">
              <button 
                onClick={handleEnroll}
                disabled={loading || user.current_path === paths.find(p => p.id === selectedPath)?.title}
                className={`w-full font-bold py-3 rounded-xl transition-all ${
                  user.current_path === paths.find(p => p.id === selectedPath)?.title
                  ? 'bg-green-600/20 text-green-500 cursor-default'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {loading ? 'Enrolling...' : user.current_path === paths.find(p => p.id === selectedPath)?.title ? 'Enrolled' : 'Enroll in Path'}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-8">
          {roadmapData.map((phase, idx) => (
            <div key={phase.level} className="relative">
              {idx !== roadmapData.length - 1 && (
                <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/50 to-transparent"></div>
              )}
              <h2 className="text-xl font-bold text-gray-400 mb-6 flex items-center gap-4">
                <span className="w-12 h-12 rounded-full glass flex items-center justify-center text-white border-blue-500/50 border">
                  {idx + 1}
                </span>
                {phase.level} Phase
              </h2>
              <div className="space-y-4 pl-12">
                {phase.modules.map((module) => (
                  <ModuleCard 
                    key={module.id} 
                    title={module.title} 
                    status={module.status as any} 
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

const StatItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-400 text-sm">{label}</span>
    <span className="text-white font-bold">{value}</span>
  </div>
);

const ModuleCard = ({ title, status }: { title: string; status: 'completed' | 'active' | 'locked', key?: any }) => (
  <div className={`p-5 rounded-2xl border transition-all flex items-center justify-between group ${
    status === 'completed' ? 'glass border-green-500/30' :
    status === 'active' ? 'bg-blue-600/10 border-blue-500/50' :
    'glass border-transparent opacity-50'
  }`}>
    <div className="flex items-center gap-4">
      {status === 'completed' ? <CheckCircle2 className="text-green-500" /> :
       status === 'active' ? <Circle className="text-blue-500 animate-pulse" /> :
       <Lock className="text-gray-500" />}
      <span className={`font-medium ${status === 'locked' ? 'text-gray-500' : 'text-white'}`}>{title}</span>
    </div>
    {status !== 'locked' && (
      <button className="text-gray-500 hover:text-white transition-colors">
        <ChevronRight />
      </button>
    )}
  </div>
);
