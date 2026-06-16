import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Flame, 
  Star, 
  ChevronRight, 
  Target, 
  TrendingUp,
  Cpu,
  Brain,
  Code,
  Loader2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const data = [
  { name: 'Week 1', score: 20 },
  { name: 'Week 2', score: 35 },
  { name: 'Week 3', score: 55 },
  { name: 'Week 4', score: 75 },
  { name: 'Week 5', score: 82 },
];

import api from '../lib/api';

export default function Dashboard({ user: initialUser }: { user: any }) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [aiRec, setAiRec] = useState<any>(null);
  const [loadingRec, setLoadingRec] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/user/stats');
      setStats(data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const fetchAIRecommendation = async () => {
    setLoadingRec(true);
    try {
      const { data } = await api.post('/ai/recommend');
      setAiRec(data);
    } catch (err) {
    } finally {
      setLoadingRec(false);
    }
  };

  if (loading) return (
    <div className="space-y-8 animate-pulse p-4">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-white/5 rounded-lg"></div>
          <div className="h-4 w-96 bg-white/5 rounded-lg"></div>
        </div>
        <div className="flex gap-4">
          <div className="h-12 w-32 bg-white/5 rounded-xl"></div>
          <div className="h-12 w-32 bg-white/5 rounded-xl"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 h-64 bg-white/5 rounded-3xl"></div>
        <div className="h-64 bg-white/5 rounded-3xl"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-96 bg-white/5 rounded-3xl"></div>
        <div className="h-96 bg-white/5 rounded-3xl"></div>
      </div>
    </div>
  );

  const user = stats?.user || initialUser;
  const taskStats = stats?.taskStats || { progress: 0, total: 0, completed: 0 };
  const historyData = stats?.history || [
    { name: 'Week 1', score: 40 },
    { name: 'Week 2', score: 45 },
    { name: 'Week 3', score: 50 },
    { name: 'Week 4', score: 55 },
    { name: 'Week 5', score: 60 },
  ];

  const skillsData = [
    { name: 'Frontend', level: user.skills?.toLowerCase().includes('react') ? 85 : 40 },
    { name: 'Backend', level: user.skills?.toLowerCase().includes('node') ? 75 : 30 },
    { name: 'DSA', level: user.skills?.toLowerCase().includes('dsa') ? 80 : 45 },
    { name: 'Systems', level: 25 },
    { name: 'Soft Skills', level: 70 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Welcome back, {user.name}!</h1>
          <p className="text-gray-400">You're making great progress in your {user.current_path || 'Career'} journey.</p>
        </div>
        <div className="flex items-center gap-4">
          <StatBadge icon={<Flame className="text-orange-500" />} value={user.streaks || 0} label="Streak" />
          <StatBadge icon={<Trophy className="text-yellow-500" />} value={user.xp || 0} label="XP" />
        </div>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CareerGPS progress={taskStats.progress} path={user.current_path} />
        <AIRecommendationCard user={user} recommendation={aiRec} onGetRec={fetchAIRecommendation} loading={loadingRec} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Progress Chart */}
        <div className="glass p-6 rounded-3xl">
          <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="text-blue-500" />
            Learning Velocity
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historyData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="score" stroke="#3b82f6" fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Matrix */}
        <div className="glass p-6 rounded-3xl">
          <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
            <Cpu className="text-purple-500" />
            Skill Matrix
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillsData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#9ca3af" width={100} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                   itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="level" radius={[0, 10, 10, 0]}>
                  {skillsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#8b5cf6' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Suggested Tasks */}
      <div className="space-y-4">
        <h3 className="text-2xl font-display font-bold text-white">Daily Quests</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TaskCard title="Complete Path Module" category={user.current_path || 'Learning'} xp={50} />
          <TaskCard title="Daily Coding Problem" category="Problem Solving" xp={30} />
          <TaskCard title="Update Portfolio" category="Project" xp={100} />
        </div>
      </div>
    </motion.div>
  );
}

const StatBadge = ({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) => (
  <div className="glass px-4 py-2 rounded-2xl flex items-center gap-3">
    {icon}
    <div>
      <div className="text-lg font-bold text-white">{value}</div>
      <div className="text-[10px] text-gray-500 uppercase tracking-widest">{label}</div>
    </div>
  </div>
);

const CareerGPS = ({ progress, path }: { progress: number; path: string }) => {
  const dashOffset = 364.4 * (1 - progress / 100);
  
  return (
    <div className="md:col-span-2 glass p-8 rounded-3xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-blue-500/20 transition-colors"></div>
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle cx="64" cy="64" r="58" className="stroke-white/5 fill-none" strokeWidth="12" />
            <circle 
              cx="64" cy="64" r="58" 
              className="stroke-blue-500 fill-none transition-all duration-1000 ease-out" 
              strokeWidth="12" 
              strokeDasharray={364.4}
              strokeDashoffset={dashOffset} 
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{progress}%</span>
          </div>
        </div>
        <div>
          <h4 className="text-2xl font-display font-bold text-white mb-2 underline decoration-blue-500 underline-offset-8">Career GPS</h4>
          <p className="text-gray-400 mb-4 max-w-md">You are <span className="text-blue-400 font-bold">{100 - progress}% away</span> from completing your current objectives for {path || 'your career'}.</p>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl transition-all flex items-center gap-2 group">
            View Analysis
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

const AIRecommendationCard = ({ user, recommendation, onGetRec, loading }: { user: any, recommendation: any, onGetRec: () => void, loading: boolean }) => (
  <div className="glass p-8 rounded-3xl bg-gradient-to-br from-purple-500/20 to-blue-500/10 border-white/20">
    <div className="flex items-center gap-2 text-purple-400 mb-4">
      <Brain className="w-6 h-6" />
      <span className="text-sm font-bold uppercase tracking-widest">AI Mentor Suggests</span>
    </div>
    
    {recommendation ? (
      <div className="space-y-4">
        <h4 className="text-xl font-bold text-white">{recommendation.path || recommendation.careerPath}</h4>
        <p className="text-sm text-gray-400">
          {recommendation.justification || recommendation.summary}
        </p>
        <div className="flex flex-wrap gap-2">
          {recommendation.roadmap?.map((step: any, i: number) => (
            <span key={i} className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded text-gray-300">
              {step.level || step}
            </span>
          ))}
        </div>
      </div>
    ) : (
      <>
        <h4 className="text-xl font-bold text-white mb-2">{user.current_path || 'Define Path'}</h4>
        <p className="text-sm text-gray-400 mb-6">
          {user.interests 
            ? `Given your interest in ${user.interests}, we can generate a custom roadmap for you.`
            : 'Update your profile interests to get personalized AI career recommendations.'}
        </p>
        <button 
          onClick={onGetRec}
          disabled={loading || !user.interests}
          className="w-full py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Get Personalized Advice'}
        </button>
      </>
    )}
  </div>
);

const TaskCard = ({ title, category, xp }: { title: string; category: string; xp: number }) => (
  <button className="glass p-5 rounded-2xl hover:bg-white/10 transition-all text-left group">
    <div className="flex justify-between items-start mb-4">
      <span className="text-[10px] uppercase font-bold tracking-widest text-blue-500 border border-blue-500/30 px-2 py-0.5 rounded-full">
        {category}
      </span>
      <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold">
        <Star className="w-3 h-3 fill-yellow-500" />
        +{xp}
      </div>
    </div>
    <h5 className="text-white font-medium group-hover:text-blue-400 transition-colors">{title}</h5>
  </button>
);
