import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Calendar, 
  Trash2,
  Clock,
  Layout
} from 'lucide-react';

import api from '../lib/api';
import { toast } from 'sonner';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  date: string;
}

export default function Tasks({ user }: { user: any }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data.map((t: any) => ({ ...t, completed: !!t.completed })));
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const { data } = await api.post('/tasks', { title: newTask, date: new Date().toISOString() });
      setTasks([{ ...data, completed: false }, ...tasks]);
      setNewTask('');
      toast.success('Task added to your Daily Quests!');
    } catch (err) {}
  };

  const toggleTask = async (id: number, completed: boolean) => {
    try {
      await api.put(`/tasks/${id}`, { completed: !completed });
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: !completed } : t));
      if (!completed) toast.success('+50 XP Earned!');
    } catch (err) {}
  };

  const deleteTask = async (id: number) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
      toast.info('Task removed');
    } catch (err) {}
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display font-bold text-white mb-2">Daily Quests</h1>
          <p className="text-gray-400">Complete tasks to earn XP and build streaks.</p>
        </div>
        <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3">
          <Calendar className="text-blue-500" />
          <span className="text-white font-bold">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
        </div>
      </header>

      {/* Task Input */}
      <form onSubmit={addTask} className="relative group">
        <input 
          type="text" 
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new goal for today..."
          className="w-full glass p-6 rounded-3xl text-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all pr-16"
        />
        <button 
          type="submit"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/30"
        >
          <Plus />
        </button>
      </form>

      {/* Task List */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <div className="glass p-12 rounded-3xl text-center">
            <Layout className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No tasks for today. Start by adding one above!</p>
          </div>
        ) : (
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`glass p-5 rounded-2xl flex items-center gap-4 group transition-all ${task.completed ? 'opacity-60 bg-white/0 border-transparent' : 'bg-white/5 border-white/10 hover:border-blue-500/30'}`}
              >
                <button 
                  onClick={() => toggleTask(task.id, task.completed)}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${task.completed ? 'bg-green-500/20 text-green-500' : 'bg-white/5 text-gray-500 hover:text-blue-500'}`}
                >
                  {task.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                </button>
                <span className={`flex-1 text-lg font-medium transition-all ${task.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
                  {task.title}
                </span>
                <div className="flex items-center gap-3">
                  <div className="hidden group-hover:flex items-center gap-1 text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded-lg uppercase tracking-widest font-bold">
                    <Clock className="w-3 h-3" />
                    +{Math.floor(Math.random() * 50) + 20} XP
                  </div>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )
        }
      </div>

      {/* Recommended Section */}
      <div className="pt-8">
        <h3 className="text-xl font-bold text-white mb-4">Recommended for your path</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RecommendedTask title="Clean up Landing Page CSS" type="Web Dev" />
          <RecommendedTask title="Review Linked List problems" type="DSA" />
        </div>
      </div>
    </motion.div>
  );
}

const RecommendedTask = ({ title, type }: { title: string; type: string }) => (
  <div className="glass p-5 rounded-2xl border-dashed border-white/20 flex justify-between items-center group cursor-pointer hover:bg-white/5 transition-all">
    <div>
      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{type}</span>
      <p className="text-white font-medium">{title}</p>
    </div>
    <Plus className="text-gray-600 group-hover:text-blue-500 transition-colors" />
  </div>
);
