'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Layout, Globe, Shield, AlertCircle, 
  CheckCircle, ArrowLeft, Zap, ExternalLink,
  BarChart3, Clock, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

export default function ReportPage() {
  const { id } = useParams();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/report?id=${id}`)
      .then(res => res.json())
      .then(data => {
        setReport(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="mesh-bg" />
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <div className="text-indigo-400 font-bold tracking-widest text-sm uppercase">Assembling Report...</div>
        </div>
      </div>
    );
  }

  if (!report || report.error) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
        <div className="mesh-bg" />
        <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mb-8">
          <AlertCircle size={40} className="text-red-500" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Report Not Found</h1>
        <p className="text-gray-400 mb-10 max-w-xs">The audit log has expired or the reference is incorrect.</p>
        <Link href="/" className="glow-btn px-10 py-4 rounded-3xl font-bold text-white">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30 font-sans relative">
      <div className="mesh-bg" />
      
      {/* Use the fallback center-container for absolute centering */}
      <div className="center-container py-12 lg:py-24">
        
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-16 transition-colors group no-underline">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm tracking-widest uppercase">Dashboard</span>
        </Link>

        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-24 border-b border-white/5 pb-16">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-400 text-[11px] font-bold uppercase tracking-widest border border-indigo-500/20">
              <BarChart3 size={14} />
              Diagnostic Complete
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] m-0">
              Analysis <br />
              <span className="text-gradient">Log Report.</span>
            </h1>
            <div className="flex items-center gap-3 text-gray-500 font-medium text-sm">
              <Clock size={18} />
              {new Date(report.createdAt).toLocaleString()}
            </div>
          </div>
          <div className="px-8 py-6 bg-white/5 rounded-[32px] border border-white/10 backdrop-blur-3xl shadow-2xl">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">SYSTEM_REFERENCE_ID</div>
            <div className="font-mono text-base text-indigo-400 font-semibold">{id?.toString().toUpperCase()}</div>
          </div>
        </header>

        {/* Grid Layout for Score Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-32">
          {[
            { label: 'Overall', val: report.score, color: 'from-indigo-600 to-indigo-400', icon: Zap },
            { label: 'Frontend', val: report.stats.frontend, color: 'from-purple-600 to-pink-500', icon: Layout },
            { label: 'SEO', val: report.stats.seo, color: 'from-emerald-600 to-teal-400', icon: Globe },
            { label: 'Security', val: report.stats.security, color: 'from-rose-600 to-orange-500', icon: Shield },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="glass-card p-12 relative overflow-hidden group border border-white/5"
            >
              <div className={`absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />
              <div className="flex justify-between items-start mb-16">
                <div className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${stat.color} shadow-2xl flex items-center justify-center group-hover:rotate-12 transition-transform`}>
                  <stat.icon size={32} className="text-white" />
                </div>
                <div className="text-right">
                  <div className="text-6xl font-black tracking-tighter leading-none">{stat.val}%</div>
                  <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-3">Integrity</div>
                </div>
              </div>
              <div className="text-gray-400 font-bold tracking-widest text-xs uppercase mb-6">{stat.label} Assessment</div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.val}%` }}
                  transition={{ duration: 2, delay: 0.6 + i * 0.1 }}
                  className={`h-full bg-gradient-to-r ${stat.color}`} 
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detailed Findings Section */}
        <div className="space-y-16">
          <div className="flex items-center gap-6 mb-20">
            <div className="w-16 h-16 bg-orange-500/10 rounded-3xl flex items-center justify-center shadow-inner">
              <AlertTriangle className="text-orange-500" size={32} />
            </div>
            <div>
              <h2 className="text-4xl font-black tracking-tight uppercase m-0">Detected Anomalies</h2>
              <div className="text-[13px] font-bold text-gray-500 uppercase tracking-widest mt-2">Total Issues Identified: {report.issues.length}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-12">
            {report.issues.map((issue: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-12 lg:p-16 flex flex-col lg:flex-row gap-16 items-start border border-white/5"
              >
                <div className={`p-8 rounded-[40px] shrink-0 shadow-[0_20px_50px_rgba(0,0,0,0.3)] ${
                  issue.severity === 'High' ? 'bg-red-500/10 text-red-500' :
                  issue.severity === 'Medium' ? 'bg-orange-500/10 text-orange-500' :
                  'bg-blue-500/10 text-blue-400'
                }`}>
                  {issue.category === 'Security' ? <Shield size={48} /> : 
                   issue.category === 'SEO' ? <Globe size={48} /> : <Layout size={48} />}
                </div>
                <div className="flex-1 space-y-8">
                  <div className="flex flex-wrap items-center gap-6">
                    <h3 className="text-4xl font-black tracking-tight uppercase m-0">{issue.title}</h3>
                    <span className={`px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest border ${
                      issue.severity === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                      issue.severity === 'Medium' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                      'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {issue.severity} RISK LEVEL
                    </span>
                  </div>
                  {issue.file && (
                     <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/5 rounded-2xl border border-white/10 text-[13px] font-mono text-indigo-400 shadow-sm">
                      <ExternalLink size={16} />
                      SOURCE_REF: {issue.file}
                    </div>
                  )}
                  <p className="text-gray-400 text-xl leading-relaxed max-w-4xl font-medium">
                    {issue.description}
                  </p>
                  <div className="bg-white/5 p-12 rounded-[40px] border border-white/10 relative overflow-hidden group mt-12 shadow-2xl">
                    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-pink-500" />
                    <div className="text-[12px] font-bold text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                      <CheckCircle size={20} />
                      Remediation Protocol
                    </div>
                    <p className="text-gray-200 text-xl leading-relaxed font-bold">
                      {issue.recommendation}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {report.issues.length === 0 && (
               <div className="glass-card p-40 text-center border border-white/5">
                  <div className="w-32 h-32 bg-emerald-500/10 rounded-[40px] flex items-center justify-center mx-auto mb-12 shadow-[0_20px_60px_rgba(16,185,129,0.2)]">
                     <CheckCircle size={64} className="text-emerald-500" />
                  </div>
                  <h3 className="text-5xl font-black uppercase tracking-tighter mb-6">System Sanitized</h3>
                  <p className="text-gray-400 max-w-md mx-auto text-xl leading-relaxed font-medium">No architectural deficiencies or security vulnerabilities were detected in this analysis cycle. The environment remains optimal.</p>
               </div>
          )}
          </div>
          
          <footer className="mt-60 text-center py-24 border-t border-white/5">
            <div className="text-gray-600 text-[12px] font-bold uppercase tracking-[0.8em]">
              © 2026 SB DETECTOR — CLOUD DIAGNOSTIC ENGINE V2.0
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
