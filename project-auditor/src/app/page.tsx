'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, Activity, Globe, Shield, Zap, ArrowRight, Loader2, BarChart3 } from 'lucide-react';

export default function Home() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'url' | 'local'>('url');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAudit = async () => {
    if (!input) return;
    setLoading(true);
    try {
      const endpoint = mode === 'url' ? '/api/audit' : '/api/audit/local';
      const body = mode === 'url' 
        ? { url: input.startsWith('http') ? input : `https://${input}` }
        : { path: input };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      
      const result = await response.json();
      
      const saveResponse = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      });
      const { reportId } = await saveResponse.json();
      
      router.push(`/report/${reportId}`);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center p-6 lg:p-24 overflow-hidden">
      <div className="mesh-bg" />

      {/* Floating Elements */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-20 left-20 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute bottom-20 right-20 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"
      />

      {/* Nav */}
      <nav className="absolute top-0 left-0 w-full p-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
            <Zap size={20} className="text-white fill-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">AuditMaster</span>
        </div>
        <div className="flex bg-white/5 p-1 rounded-2xl backdrop-blur-md border border-white/10">
          <button 
            onClick={() => setMode('url')}
            className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${mode === 'url' ? 'bg-white text-black shadow-xl' : 'text-gray-400 hover:text-white'}`}
          >
            URL SCAN
          </button>
          <button 
            onClick={() => setMode('local')}
            className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${mode === 'local' ? 'bg-white text-black shadow-xl' : 'text-gray-400 hover:text-white'}`}
          >
            LOCAL SCAN
          </button>
        </div>
      </nav>

      <div className="max-w-5xl w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-pink-400 text-sm font-medium mb-10 shadow-2xl"
        >
          <Sparkles size={16} />
          Elevate Your Code Quality
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-extrabold mb-10 leading-[0.9] tracking-tighter"
        >
          Professional <br />
          <span className="text-gradient">Audit Diagnostics.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-16 leading-relaxed"
        >
          An intelligent diagnostic platform designed for elite engineering teams. Uncover hidden architectural flaws in seconds.
        </motion.p>

        {/* Dynamic Input Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass p-3 flex flex-col md:flex-row items-center gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-white/10"
        >
          <div className="flex-1 flex items-center gap-4 px-6 w-full">
            <Search className="text-gray-500" />
            <input 
              type="text"
              placeholder={mode === 'url' ? "Enter your project URL..." : "Enter local directory path..."}
              className="bg-transparent border-none outline-none flex-1 py-4 text-xl text-white placeholder:text-gray-600 font-medium"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAudit()}
            />
          </div>
          <button 
            onClick={handleAudit}
            disabled={loading}
            className="glow-btn w-full md:w-auto px-10 py-5 rounded-3xl font-bold text-white flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Start Diagnostic <ArrowRight size={20} /></>}
          </button>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
          {[
            { icon: Globe, label: 'SEO STRATEGY', desc: 'Metadata & indexing health', color: 'text-indigo-400' },
            { icon: Shield, label: 'SECURITY PRO', desc: 'Secrets & vulnerability scan', color: 'text-emerald-400' },
            { icon: Activity, label: 'UI/UX AUDIT', desc: 'DOM & accessibility scan', color: 'text-pink-400' }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="glass-card p-8 text-left group"
            >
              <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${item.color}`}>
                <item.icon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">{item.label}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-32 text-gray-600 text-sm flex flex-col items-center gap-4 relative z-10">
        <div className="flex gap-10 font-bold tracking-widest text-[10px] uppercase">
          <span>Enterprise Ready</span>
          <span>Zero Configuration</span>
          <span>Cloud Diagnostic</span>
        </div>
        <div>© 2026 AUDITMASTER — REIMAGINED BY ANTIGRAVITY</div>
      </footer>
    </main>
  );
}
