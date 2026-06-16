import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Users, 
  Terminal, 
  Lightbulb, 
  ChevronRight,
  ExternalLink,
  Code,
  X,
  MessageSquare,
  Loader2
} from 'lucide-react';

import api from '../lib/api';
import { toast } from 'sonner';

export default function InternshipPrep({ user }: { user: any }) {
  const [showInterview, setShowInterview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [domain, setDomain] = useState('frontend');
  const [interviewText, setInterviewText] = useState("Hello! I'm your AI Interviewer today. We'll start with some technical questions based on your selected domain. Ready to begin?");

  const startInterview = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/ai/chat', { 
        message: `I want to start a mock interview for the ${domain} domain. Please ask me the first challenging technical question.` 
      });
      setInterviewText(data.reply);
      toast.success('Interview Session Started!');
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12"
    >
      <header>
        <h1 className="text-4xl font-display font-bold text-white mb-2">Internship Hub</h1>
        <p className="text-gray-400">Everything you need to secure your first professional role.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Resume Builder */}
        <div className="glass p-8 rounded-3xl group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-blue-500 opacity-50"></div>
          <FileText className="w-12 h-12 text-blue-500 mb-6" />
          <h3 className="text-2xl font-bold mb-4">Smart Resume Builder</h3>
          <p className="text-gray-400 mb-6">AI-powered resume optimization based on your target SDE-1 role.</p>
          <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all flex items-center justify-center gap-2 group">
            Open Builder
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Mock Interviews */}
        <div className="glass p-8 rounded-3xl group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-purple-500 opacity-50"></div>
          <Users className="w-12 h-12 text-purple-500 mb-6" />
          <h3 className="text-2xl font-bold mb-4">AI Mock Interviews</h3>
          <p className="text-gray-400 mb-6">Practice technical and behavioral rounds with real-time feedback.</p>
          <button 
            onClick={() => setShowInterview(true)}
            className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all flex items-center justify-center gap-2 group"
          >
            Start Session
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Aptitude */}
        <div className="glass p-8 rounded-3xl group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-orange-500 opacity-50"></div>
          <Lightbulb className="w-12 h-12 text-orange-500 mb-6" />
          <h3 className="text-2xl font-bold mb-4">Aptitude & DSA</h3>
          <p className="text-gray-400 mb-6">Master the coding rounds with our curated question sets.</p>
          <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all flex items-center justify-center gap-2 group">
            Begin Practice
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Project Suggestions */}
      <div className="space-y-6">
        <h2 className="text-3xl font-display font-bold text-white">Curated Project Ideas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProjectCard 
            title="Real-time Collaborative Ideaboard" 
            difficulty="Intermediate" 
            tech={["Socket.io", "React", "Node.js"]}
          />
          <ProjectCard 
            title="AI Content Summarizer Chrome Extension" 
            difficulty="Advanced" 
            tech={["Gemini API", "JavaScript", "Python"]}
          />
          <ProjectCard 
            title="Decentralized Vote Manager" 
            difficulty="Hard" 
            tech={["Solidity", "Ethers.js", "Hardhat"]}
          />
          <ProjectCard 
            title="Inventory Management Dashboard" 
            difficulty="Beginner" 
            tech={["React", "Firebase", "Tailwind"]}
          />
        </div>
      </div>

      {showInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020617]/80 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#0f172a] border border-white/10 max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-purple-600/10">
              <div className="flex items-center gap-3">
                <Users className="text-purple-500" />
                <h3 className="text-xl font-bold">AI Mock Interview Session</h3>
              </div>
              <button 
                onClick={() => setShowInterview(false)}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors"
              >
                <X />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-400 font-bold uppercase tracking-wider">Select Domain</label>
                <select 
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="frontend">Frontend Engineering</option>
                  <option value="backend">Backend Architecture</option>
                  <option value="dsa">DSA & Problem Solving</option>
                </select>
              </div>
              
              <div className="p-6 bg-white/5 rounded-2xl border border-white/5 italic text-gray-300 max-h-48 overflow-y-auto">
                "{interviewText}"
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={startInterview}
                  disabled={loading}
                  className="flex-1 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" /> : (
                    <>
                      <MessageSquare className="w-5 h-5" />
                      {interviewText.includes('Ready to begin?') ? 'Start Interaction' : 'Get Next Question'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

const ProjectCard = ({ title, difficulty, tech }: { title: string; difficulty: string; tech: string[] }) => (
  <div className="glass p-6 rounded-3xl hover:border-blue-500/30 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
        <Code className="text-blue-500" />
      </div>
      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-widest ${
        difficulty === 'Beginner' ? 'text-green-400 bg-green-400/10' :
        difficulty === 'Intermediate' ? 'text-blue-400 bg-blue-400/10' :
        'text-red-400 bg-red-400/10'
      }`}>
        {difficulty}
      </span>
    </div>
    <h4 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{title}</h4>
    <div className="flex flex-wrap gap-2 mt-4">
      {tech.map(t => (
        <span key={t} className="text-[10px] bg-white/5 text-gray-500 px-2 py-1 rounded-md border border-white/5">{t}</span>
      ))}
    </div>
  </div>
);
