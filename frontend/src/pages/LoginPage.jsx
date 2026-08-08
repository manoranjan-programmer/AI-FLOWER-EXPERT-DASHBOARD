import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles, BarChart3, Flower2, Brain, Shield, Zap, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginAdmin } from '../services/api';

const FEATURES = [
  { icon: BarChart3, label: 'Real-time MongoDB Analytics', desc: 'Live telemetry from 8+ collections', iconBg: 'bg-blue-50 text-blue-600' },
  { icon: Flower2, label: 'AI Classification Insights', desc: 'EfficientNet neural performance', iconBg: 'bg-emerald-50 text-emerald-600' },
  { icon: Brain, label: 'Chatbot Intelligence Metrics', desc: 'Gemini AI response analytics', iconBg: 'bg-violet-50 text-violet-600' },
  { icon: TrendingUp, label: 'Multi-dimensional Filters', desc: 'Custom date ranges & categories', iconBg: 'bg-amber-50 text-amber-600' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin.ai@flowerexpert.com');
  const [password, setPassword] = useState('Admin-ai@123');
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
      setError(err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    setEmail('admin.ai@flowerexpert.com');
    setPassword('Admin-ai@123');
  };

  return (
    <div className="min-h-screen w-full flex bg-[#f8fafc] text-slate-900 overflow-hidden relative selection:bg-blue-600 selection:text-white">

      {/* ── Light Mode Dynamic Ambient Mesh & Glows ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[650px] h-[650px] rounded-full bg-blue-400/10 blur-[130px]" />
        <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] rounded-full bg-indigo-400/10 blur-[130px]" />
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] rounded-full bg-emerald-400/10 blur-[120px]" />
        {/* Subtle dot overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} 
        />
      </div>

      <div className="w-full max-w-7xl mx-auto min-h-screen flex flex-col lg:flex-row items-center justify-between p-6 lg:p-12 relative z-10 gap-12">

        {/* ── Left Branding & Showcase Panel ── */}
        <div className="w-full lg:w-[55%] flex flex-col justify-between space-y-10">

          {/* Logo Badge */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-800 p-[2px] shadow-lg shadow-blue-500/20 overflow-hidden">
              <img src="/logo.png" alt="Flower AI Logo" className="w-full h-full object-cover rounded-[14px]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900">Flower AI</span>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-blue-100 text-blue-700 border border-blue-200">
                  Enterprise
                </span>
              </div>
              <p className="text-slate-500 text-xs font-semibold">Botanical Intelligence & Analytics Console</p>
            </div>
          </div>

          {/* Main Hero Header */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-xs">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>MongoDB Atlas Powered SaaS Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-slate-900 leading-[1.08] tracking-tight">
              AI-Powered <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600">
                Botanical Analytics
              </span>
            </h1>

            <p className="text-slate-600 text-base leading-relaxed max-w-xl font-medium">
              Monitor your AI flower identification ecosystem in real-time. Deep insights from MongoDB Atlas — conversations, classifications, user management, and AI query performance.
            </p>
          </div>

          {/* Feature Showcase Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                className="group p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-200 backdrop-blur-sm"
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-xl ${f.iconBg} flex items-center justify-center shrink-0 border border-slate-200/50`}>
                    <f.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-slate-900 text-sm font-bold group-hover:text-blue-600 transition-colors">{f.label}</h4>
                    <p className="text-slate-500 text-xs mt-0.5">{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Real-time Telemetry Metrics Pill */}
          <div className="flex items-center gap-8 pt-4 border-t border-slate-200">
            <div>
              <div className="text-2xl font-black text-slate-900">8+</div>
              <div className="text-slate-500 text-xs font-semibold mt-0.5">Active Collections</div>
            </div>
            <div className="h-8 w-[1px] bg-slate-200" />
            <div>
              <div className="text-2xl font-black text-emerald-600">&lt;850ms</div>
              <div className="text-slate-500 text-xs font-semibold mt-0.5">Avg Response Time</div>
            </div>
            <div className="h-8 w-[1px] bg-slate-200" />
            <div>
              <div className="flex items-center gap-1.5 text-2xl font-black text-blue-600">
                <span>99.9%</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-slate-500 text-xs font-semibold mt-0.5">System Uptime</div>
            </div>
          </div>
        </div>

        {/* ── Right Login Light Glass Card ── */}
        <div className="w-full lg:w-[420px] shrink-0">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full relative"
          >
            {/* White Glass Card with Soft Shadow */}
            <div className="relative rounded-3xl bg-white/95 border border-slate-200/90 p-8 shadow-2xl shadow-slate-300/50 backdrop-blur-xl overflow-hidden">
              
              {/* Top Accent Gradient Line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500" />

              {/* Card Header */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src="/logo.png" alt="Logo" className="w-7 h-7 object-cover rounded-lg shadow-sm" />
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Admin Sign In</h2>
                  </div>
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600" />
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">Secure access to your analytics platform console</p>
              </div>

              {/* Error Alert */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2.5"
                >
                  <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                    <span>Admin Email</span>
                    <span className="text-[10px] text-blue-600 font-semibold lowercase">Required</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="admin-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@aflowerexpert.com"
                      className="w-full bg-slate-50/80 border border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/10 text-slate-900 placeholder-slate-400 text-sm font-medium rounded-xl pl-10 pr-4 py-3 outline-none transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={handleQuickFill}
                      className="text-[11px] text-blue-600 hover:text-blue-700 font-bold underline underline-offset-2 transition-colors"
                    >
                      Fill Demo Credentials
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50/80 border border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/10 text-slate-900 placeholder-slate-400 text-sm font-medium rounded-xl pl-10 pr-10 py-3 outline-none transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.01 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Authenticating System…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In to Dashboard
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </motion.button>
              </form>

              {/* Security Footer Badges */}
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100 text-[11px] text-slate-500 font-semibold">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  <span>MongoDB Atlas Protected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-blue-600" />
                  <span>JWT Auth Secured</span>
                </div>
              </div>

            </div>
          </motion.div>
        </div>

      </div>

    </div>
  );
}
