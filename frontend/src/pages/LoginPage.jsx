import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles, BarChart3, Flower2, Brain, Shield, Zap, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginAdmin } from '../services/api';
import logo from '../assets/logo.png';

const FEATURES = [
  { icon: BarChart3, label: 'Real-time MongoDB Analytics', desc: 'Live data from all collections' },
  { icon: Flower2, label: 'AI Classification Insights', desc: 'EfficientNet model performance' },
  { icon: Brain, label: 'Chatbot Intelligence Metrics', desc: 'Gemini AI response analytics' },
  { icon: TrendingUp, label: 'Multi-dimensional Filters', desc: 'Date ranges, categories & more' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@aflowerexpert.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginAdmin(email, password);
      login(data.token, data.user);
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex aurora-bg">

      {/* ── Left Branding Panel ── */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] flex-col justify-between p-10 relative overflow-hidden">

        {/* Background gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-blue-700/10 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-emerald-500/8 blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-blue-900/10 blur-[80px]" />
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '48px 48px'
          }} />
        </div>

        {/* Logo / Brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-2xl object-cover shadow-lg shadow-blue-500/30" />
            <div>
              <div className="text-white font-black text-lg leading-none tracking-tight">Flower AI</div>
              <div className="text-blue-400 text-[11px] font-bold uppercase tracking-[0.12em] mt-0.5">Analytics Platform</div>
            </div>
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">Enterprise SaaS Dashboard</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-black text-white leading-[1.1] tracking-tight mb-4">
              AI-Powered<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-400 to-emerald-400">
                Botanical Analytics
              </span>
            </h1>
            <p className="text-slate-400 text-base leading-relaxed max-w-md">
              Monitor your AI flower identification system in real-time. Deep insights from MongoDB Atlas — conversations, classifications, users, and performance.
            </p>
          </div>

          {/* Feature list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-500/15 flex items-center justify-center shrink-0">
                  <f.icon className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <div className="text-white text-xs font-bold">{f.label}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">{f.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-6 pt-2">
            {[
              { label: 'Active Collections', value: '8+' },
              { label: 'Avg Response', value: '<850ms' },
              { label: 'Uptime', value: '99.9%' }
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-slate-500 text-[11px] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-slate-600 text-[11px]">© 2026 AI Flower Expert — All rights reserved</p>
        </div>
      </div>

      {/* ── Right Login Panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        {/* Mobile background */}
        <div className="absolute inset-0 lg:hidden">
          <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-indigo-600/10 blur-[80px]" />
          <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full bg-emerald-500/8 blur-[60px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[400px] relative z-10"
        >
          {/* Card */}
          <div className="premium-card p-8 space-y-6">

            {/* Logo — mobile only shows here */}
            <div className="lg:hidden flex items-center gap-3 pb-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Flower2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-black text-base" style={{ color: 'var(--text-primary)' }}>Flower AI</div>
                <div className="text-[11px] font-bold" style={{ color: 'var(--color-primary)' }}>Analytics Platform</div>
              </div>
            </div>

            {/* Header */}
            <div>
              <h2 className="text-xl font-black tracking-tight mb-1" style={{ color: 'var(--text-primary)' }}>
                Admin Sign In
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                Secure access to your analytics platform
              </p>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 rounded-xl border text-xs font-semibold"
                style={{ background: 'var(--color-danger-light)', borderColor: 'rgba(239,68,68,0.25)', color: '#ef4444' }}
              >
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                  <input
                    id="admin-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@aflowerexpert.com"
                    className="premium-input pl-10"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="premium-input pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full btn-primary justify-center py-3 text-sm mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Authenticating…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In to Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </motion.button>
            </form>

            {/* Footer */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>MongoDB Atlas Protected</span>
              </div>
              <span style={{ color: 'var(--border-strong)' }}>•</span>
              <div className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                <span>JWT Secured</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
