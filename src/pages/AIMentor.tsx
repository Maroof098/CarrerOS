import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Brain, 
  Lightbulb, 
  Target,
  Loader2
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

import api from '../lib/api';

export default function AIMentor({ user }: { user: any }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Hello ${user.name}! I'm your CareerOS Mentor. How can I help you engineer your career today?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const { data } = await api.post('/ai/chat', { 
        message: userMessage, 
        history: messages.slice(-10) 
      });
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      // Handled by global interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col gap-6"
    >
      <header className="flex justify-between items-center bg-blue-600/10 p-6 rounded-3xl border border-blue-500/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center glow-blue">
            <Bot className="text-white w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-white">Career Mentor</h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400 font-medium">Powered by Gemini AI</span>
            </div>
          </div>
        </div>
        <div className="hidden md:flex gap-4">
          <SuggestionChip icon={<Lightbulb className="w-4 h-4" />} label="Project Ideas" />
          <SuggestionChip icon={<Target className="w-4 h-4" />} label="Weak Topic Analysis" />
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 glass rounded-3xl overflow-hidden flex flex-col relative">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.role === 'assistant' ? 'bg-blue-600 shadow-lg shadow-blue-600/20' : 'bg-white/10'
                }`}>
                  {msg.role === 'assistant' ? <Bot className="text-white w-6 h-6" /> : <User className="text-gray-300 w-6 h-6" />}
                </div>
                <div className={`max-w-[80%] p-4 rounded-2xl ${
                  msg.role === 'assistant' 
                  ? 'bg-white/5 border border-white/10 text-gray-100' 
                  : 'bg-blue-600 text-white'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <div className="flex gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Loader2 className="animate-spin text-gray-500" />
              </div>
              <div className="h-12 bg-white/5 w-24 rounded-2xl"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-md">
          <div className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your career journey..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button 
              type="submit"
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white hover:bg-blue-500 transition-all disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

const SuggestionChip = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <button className="glass px-4 py-2 rounded-xl flex items-center gap-2 text-sm text-gray-400 hover:text-white hover:border-white/30 transition-all">
    {icon}
    {label}
  </button>
);
