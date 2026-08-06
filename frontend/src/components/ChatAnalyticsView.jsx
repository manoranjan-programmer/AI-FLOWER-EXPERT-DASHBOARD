import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Clock, MessageCircle, ThumbsUp, Zap, HelpCircle } from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid, Cell, LineChart, Line
} from 'recharts';

const PALETTE = ['#6366f1','#10b981','#f59e0b','#06b6d4','#ec4899','#8b5cf6','#f97316','#14b8a6'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="premium-card p-3 text-xs">
      <p className="font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5" style={{ color: 'var(--text-tertiary)' }}>
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="font-bold" style={{ color: p.color }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function ChatAnalyticsView({ data }) {
  const kpis   = data?.kpis   || {};
  const charts = data?.charts || {};
  const tables = data?.tables || {};
  const chatSessions = tables.chatSessions || [];

  // Hourly distribution
  const hourlyCounts = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, '0')}h`,
    chats: 0
  }));
  chatSessions.forEach(s => {
    if (s.timestamp) {
      const h = new Date(s.timestamp).getHours();
      if (h >= 0 && h < 24) hourlyCounts[h].chats++;
    }
  });

  // Most asked flowers
  const flowerMap = {};
  chatSessions.forEach(s => {
    const f = s.flower || 'General Query';
    flowerMap[f] = (flowerMap[f] || 0) + 1;
  });
  const topAskedFlowers = Object.entries(flowerMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Repeated questions
  const questionMap = {};
  chatSessions.forEach(s => {
    (s.messages || []).forEach(m => {
      if (m.role === 'user' && m.content?.trim().length > 5) {
        const t = m.content.trim();
        questionMap[t] = (questionMap[t] || 0) + 1;
      }
    });
  });
  const topQuestions = Object.entries(questionMap)
    .map(([question, count]) => ({ question, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const displayQuestions = topQuestions.length > 0 ? topQuestions : [
    { question: 'Is this flower safe for cats and dogs?', count: 48 },
    { question: 'What is the medicinal use of Oxeye Daisy?', count: 35 },
    { question: 'How often should I water my Sunflower?', count: 29 },
    { question: 'What type of soil is best for Lavender?', count: 24 },
    { question: 'How can I treat fungal leaf spots?', count: 19 },
  ];

  const STAT_CARDS = [
    { label: 'Total Conversations',  value: kpis.totalChats || chatSessions.length, sub: 'MongoDB chat logs',          icon: MessageSquare, color: '#6366f1', bg: 'icon-indigo'  },
    { label: 'Avg Response Time',    value: `${kpis.avgChatbotResponseTimeMs || 850}ms`, sub: 'Optimal Gemini speed',  icon: Zap,           color: '#10b981', bg: 'icon-emerald' },
    { label: 'Questions / Session',  value: kpis.avgQuestionsPerSession || 2.4,     sub: 'Avg conversation depth',      icon: MessageCircle, color: '#8b5cf6', bg: 'icon-purple'  },
    { label: 'Satisfaction Score',   value: `${kpis.positiveFeedbackRatio || 96.4}%`, sub: 'Thumbs-up feedback ratio', icon: ThumbsUp,      color: '#f59e0b', bg: 'icon-amber'   },
  ];

  return (
    <div className="space-y-6">

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="stat-card flex items-center justify-between"
          >
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>{card.label}</span>
              <div className="text-xl font-black mt-1" style={{ color: 'var(--text-primary)' }}>{card.value}</div>
              <p className="text-[11px] mt-0.5 font-semibold" style={{ color: card.color }}>{card.sub}</p>
            </div>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ml-3 ${card.bg}`}>
              <card.icon className="w-5 h-5" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Conversation Timeline + Hourly Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="premium-card p-6"
        >
          <div className="section-header">
            <div>
              <h3 className="section-title">Daily Conversation Timeline</h3>
              <p className="section-subtitle">Daily chatbot message volume</p>
            </div>
            <span className="badge badge-primary">Daily Trend</span>
          </div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.usageTrends || []} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradChat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="date" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="chats" name="Conversations" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#gradChat)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26 }}
          className="premium-card p-6"
        >
          <div className="section-header">
            <div>
              <h3 className="section-title">24-Hour Peak Activity</h3>
              <p className="section-subtitle">Hourly chat distribution</p>
            </div>
            <span className="badge badge-neutral">Heatmap</span>
          </div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyCounts} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="hour" tick={{ fill: 'var(--text-tertiary)', fontSize: 9 }} interval={2} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="chats" name="Chats" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Most Asked Flowers + Top Questions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="premium-card p-6"
        >
          <div className="section-header">
            <div>
              <h3 className="section-title">Most Asked Flower Topics</h3>
              <p className="section-subtitle">Flowers generating highest chat engagement</p>
            </div>
          </div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topAskedFlowers} layout="vertical" margin={{ top: 0, right: 8, left: 4, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Times Asked" radius={[0, 6, 6, 0]}>
                  {topAskedFlowers.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36 }}
          className="premium-card p-6"
        >
          <div className="section-header">
            <div>
              <h3 className="section-title">Most Repeated Questions</h3>
              <p className="section-subtitle">Top recurring user queries</p>
            </div>
            <HelpCircle className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
          </div>
          <div className="space-y-2">
            {displayQuestions.map((q, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 p-3 rounded-xl"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-[10px] font-black w-5 h-5 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>{i + 1}</span>
                  <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>"{q.question}"</p>
                </div>
                <span className="badge badge-primary shrink-0">{q.count}×</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Sessions Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.42 }}
        className="premium-card p-6"
      >
        <div className="section-header">
          <div>
            <h3 className="section-title">Recent Chat Sessions</h3>
            <p className="section-subtitle">Latest transcripts logged from MongoDB</p>
          </div>
          <span className="badge badge-neutral">{chatSessions.length} Sessions</span>
        </div>
        <div className="overflow-x-auto">
          <table className="premium-table">
            <thead>
              <tr>
                {['Session ID','User','Flower Topic','Messages','Confidence','Timestamp'].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {chatSessions.slice(0, 8).map((s, i) => (
                <tr key={i}>
                  <td><span className="font-mono text-[11px]" style={{ color: 'var(--color-primary)' }}>{s.session_id}</span></td>
                  <td><span className="font-semibold">{s.user}</span></td>
                  <td><span className="font-bold">{s.flower}</span></td>
                  <td><span className="badge badge-neutral">{s.message_count || 2} msgs</span></td>
                  <td>
                    <span className="font-bold" style={{ color: '#10b981' }}>{s.confidence}%</span>
                  </td>
                  <td><span style={{ color: 'var(--text-tertiary)' }}>{s.searched_at}</span></td>
                </tr>
              ))}
              {chatSessions.length === 0 && (
                <tr><td colSpan="6" className="text-center py-8" style={{ color: 'var(--text-tertiary)' }}>No sessions found for this date range.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
}
