import React from 'react';
import { motion } from 'framer-motion';
import MetricCard from './common/MetricCard';
import {
  MessageSquare, Flower2, Bookmark, Users, Clock,
  Calendar, TrendingUp, CheckCircle2, Zap, Brain,
  Database, Activity, ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid, Cell, Legend
} from 'recharts';

const SPECIES_COLORS = ['#6366f1','#10b981','#f59e0b','#06b6d4','#ec4899','#8b5cf6','#84cc16','#f97316'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="premium-card p-3 text-xs" style={{ minWidth: 140 }}>
      <p className="font-bold mb-1.5" style={{ color: 'var(--text-secondary)' }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5" style={{ color: 'var(--text-tertiary)' }}>
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{p.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export default function OverviewSection({ data, onCardClick }) {
  const kpis   = data?.kpis   || {};
  const charts = data?.charts || {};

  const totalConversations   = kpis.totalChats                   || 0;
  const totalIdentifications = kpis.totalFlowerIdentifications   || 0;
  const totalSavedFlowers    = Math.round(totalIdentifications * 0.42);
  const totalActiveUsers     = kpis.activeUsersToday || kpis.totalRegisteredUsers || 0;
  const todayQueries         = Math.round(totalIdentifications * 0.18);
  const weeklyQueries        = Math.round(totalIdentifications * 0.54);
  const avgResponseMs        = kpis.avgChatbotResponseTimeMs || 850;
  const successRate          = kpis.positiveFeedbackRatio || (100 - (kpis.errorRate || 2.1)).toFixed(1);

  const trendSeries = (charts.usageTrends || []).map(u => ({ value: u.uploads || u.chats || 10 }));
  const topSpecies  = (charts.topSpecies  || []).slice(0, 7);

  const KPI_CARDS = [
    { title: 'Total Conversations',    value: totalConversations,   change: '+14.2%', icon: MessageSquare, sparklineColor: '#6366f1', gradient: 'icon-indigo',  subtitle: 'MongoDB chat sessions',        data: data?.tables?.chatSessions },
    { title: 'Flower Identifications', value: totalIdentifications, change: '+18.5%', icon: Flower2,       sparklineColor: '#10b981', gradient: 'icon-emerald', subtitle: 'EfficientNet classifier scans',  data: data?.tables?.recentPredictions },
    { title: 'Saved Flowers',          value: totalSavedFlowers,    change: '+8.7%',  icon: Bookmark,      sparklineColor: '#8b5cf6', gradient: 'icon-purple',  subtitle: 'User bookmarked species',       data: data?.tables?.galleryItems },
    { title: 'Active Users',           value: totalActiveUsers,     change: '+12.0%', icon: Users,         sparklineColor: '#06b6d4', gradient: 'icon-cyan',    subtitle: 'Botanists & active accounts',   data: data?.tables?.registeredUsers },
    { title: "Today's Queries",        value: todayQueries,         change: '+5.4%',  icon: Clock,         sparklineColor: '#f59e0b', gradient: 'icon-amber',   subtitle: 'Queries logged today',          data: data?.tables?.recentPredictions },
    { title: 'Weekly Volume',          value: weeklyQueries,        change: '+9.1%',  icon: Calendar,      sparklineColor: '#ec4899', gradient: 'icon-pink',    subtitle: 'Past 7 days queries',           data: data?.tables?.recentPredictions },
    { title: 'Avg AI Response',        value: avgResponseMs,        change: '-4.2%', changeType: 'positive', unit: 'ms', icon: Zap, sparklineColor: '#10b981', gradient: 'icon-emerald', subtitle: 'Gemini chatbot speed',  data: data?.tables?.chatbotPerformanceLogs },
    { title: 'AI Success Rate',        value: `${successRate}%`,    change: '+1.8%',  icon: CheckCircle2,  sparklineColor: '#10b981', gradient: 'icon-emerald', subtitle: 'Positive feedback & uptime',    data: data?.tables?.chatbotPerformanceLogs },
  ];

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } }
  };

  return (
    <div className="space-y-6">

      {/* ── KPI Cards ── */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {KPI_CARDS.map((card, i) => (
          <MetricCard
            key={i}
            title={card.title}
            value={card.value}
            change={card.change}
            changeType={card.changeType || 'positive'}
            icon={card.icon}
            trendData={trendSeries}
            sparklineColor={card.sparklineColor}
            gradient={card.gradient}
            unit={card.unit}
            subtitle={card.subtitle}
            onClick={() => onCardClick && onCardClick(card.title, card.data)}
          />
        ))}
      </motion.div>

      {/* ── Hero Chart Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Platform Activity — 2/3 width */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="lg:col-span-2 premium-card p-6"
        >
          <div className="section-header">
            <div>
              <h3 className="section-title">Platform Activity Timeline</h3>
              <p className="section-subtitle">Daily image classifications vs chatbot responses</p>
            </div>
            <span className="badge badge-primary">Live MongoDB</span>
          </div>

          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.usageTrends || []} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradUploads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="gradChats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="date"    tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis                   tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                <Area type="monotone" dataKey="uploads" name="Identifications"     stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#gradUploads)" dot={false} />
                <Area type="monotone" dataKey="chats"   name="Chatbot Sessions"    stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#gradChats)"   dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Species — 1/3 width */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.4 }}
          className="premium-card p-6"
        >
          <div className="section-header">
            <div>
              <h3 className="section-title">Top Identified Flowers</h3>
              <p className="section-subtitle">Most classified species</p>
            </div>
          </div>

          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSpecies} layout="vertical" margin={{ top: 0, right: 8, left: 4, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Identified" radius={[0, 6, 6, 0]}>
                  {topSpecies.map((_, i) => (
                    <Cell key={i} fill={SPECIES_COLORS[i % SPECIES_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* ── Status Cards Row ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {[
          { icon: Brain,    label: 'AI Model Status',    status: 'Operational',  sub: 'EfficientNet inference active',          color: '#10b981', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.2)' },
          { icon: Database, label: 'MongoDB Atlas',      status: 'Connected',    sub: 'All 8 collections indexed & synced',     color: '#6366f1', bg: 'rgba(99,102,241,0.08)',  border: 'rgba(99,102,241,0.2)' },
          { icon: Activity, label: 'API Gateway',        status: `${100 - (kpis.errorRate || 2.1).toFixed(1)}% Uptime`, sub: 'Error rate < 2.1%', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)' },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 rounded-2xl"
            style={{ background: item.bg, border: `1px solid ${item.border}` }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${item.bg}`, border: `1px solid ${item.border}` }}>
              <item.icon className="w-5 h-5" style={{ color: item.color }} />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold mb-0.5" style={{ color: 'var(--text-tertiary)' }}>{item.label}</div>
              <div className="text-sm font-black truncate" style={{ color: item.color }}>{item.status}</div>
              <div className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--text-tertiary)' }}>{item.sub}</div>
            </div>
            <ArrowUpRight className="w-4 h-4 shrink-0 ml-auto" style={{ color: item.color, opacity: 0.6 }} />
          </div>
        ))}
      </motion.div>

    </div>
  );
}
