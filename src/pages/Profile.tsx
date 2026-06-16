import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  GraduationCap, 
  Code, 
  MapPin, 
  Save, 
  Cpu,
  Star
} from 'lucide-react';

import api from '../lib/api';
import { toast } from 'sonner';

export default function Profile({ user, setUser }: { user: any; setUser: (user: any) => void }) {
  const [formData, setFormData] = useState({
    name: user.name || '',
    branch: user.branch || '',
    year: user.year || '',
    cgpa: user.cgpa || '',
    interests: user.interests || '',
    skills: user.skills || '',
    career_goals: user.career_goals || '',
    current_path: user.current_path || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.put('/user/profile', formData);
      if (data.success) {
        setUser({ ...user, ...formData });
        toast.success('Career Profile updated!');
      }
    } catch (err) {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <header className="flex items-center gap-6 pb-8 border-b border-white/10">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center glow-blue text-4xl font-bold text-white shadow-2xl">
          {user.name?.[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-white">{user.name}</h1>
          <div className="flex items-center gap-2 text-gray-400">
            <Mail className="w-4 h-4" />
            <span>{user.email}</span>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <SectionTitle icon={<User className="text-blue-500" />} title="Personal Information" />
          <Input 
            label="Full Name" 
            value={formData.name} 
            onChange={(v) => setFormData({...formData, name: v})} 
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Branch" 
              value={formData.branch} 
              placeholder="e.g. Computer Science"
              onChange={(v) => setFormData({...formData, branch: v})} 
            />
            <Input 
              label="Year" 
              value={formData.year} 
              placeholder="e.g. 3rd Year"
              onChange={(v) => setFormData({...formData, year: v})} 
            />
          </div>
          <Input 
            label="CGPA" 
            value={formData.cgpa} 
            placeholder="e.g. 8.5"
            onChange={(v) => setFormData({...formData, cgpa: v})} 
          />
        </div>

        <div className="space-y-6">
          <SectionTitle icon={<Star className="text-purple-500" />} title="Career Preferences" />
          <Input 
            label="Current Path" 
            value={formData.current_path} 
            placeholder="e.g. Full-Stack Dev"
            onChange={(v) => setFormData({...formData, current_path: v})} 
          />
          <TextArea 
            label="Skills (comma separated)" 
            value={formData.skills} 
            placeholder="React, TypeScript, Node.js..."
            onChange={(v) => setFormData({...formData, skills: v})} 
          />
          <TextArea 
            label="Career Goals" 
            value={formData.career_goals} 
            placeholder="Aiming for SDE-1 at a product-based company..."
            onChange={(v) => setFormData({...formData, career_goals: v})} 
          />
        </div>

        <div className="md:col-span-2 pt-8 flex justify-end gap-4">
          <button 
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

const SectionTitle = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <h3 className="text-xl font-display font-bold text-white flex items-center gap-3">
    {icon}
    {title}
  </h3>
);

const Input = ({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) => (
  <div>
    <label className="block text-sm font-medium text-gray-500 mb-2">{label}</label>
    <input 
      type="text" 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
    />
  </div>
);

const TextArea = ({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) => (
  <div>
    <label className="block text-sm font-medium text-gray-500 mb-2">{label}</label>
    <textarea 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={4}
      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
    />
  </div>
);
