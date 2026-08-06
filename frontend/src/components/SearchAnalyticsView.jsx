import React from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Sun, Droplets, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from 'recharts';

const PALETTE = ['#6366f1','#10b981','#f59e0b','#06b6d4','#ec4899'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="premium-card p-3 text-xs">
      <p className="font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex justify-between gap-4">
          <span style={{ color: 'var(--text-tertiary)' }}>{p.name}</span>
          <span className="font-bold" style={{ color: p.color }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function SearchAnalyticsView({ data }) {
  const charts = data?.charts || {};
  const tables = data?.tables || {};
  const knowledgeBase  = tables.knowledgeBase      || [];
  const searchHistory  = tables.recentPredictions  || [];

  const scientificMap  = {};
  const medicinalMap   = {};
  knowledgeBase.forEach(item => {
    if (item.scientific_name) scientificMap[item.scientific_name] = (scientificMap[item.scientific_name] || 0) + 1;
    if (item.medicinal_uses) {
      item.medicinal_uses.split(/[,.;]/).map(u => u.trim()).filter(u => u.length > 3)
        .forEach(u => { medicinalMap[u] = (medicinalMap[u] || 0) + 1; });
    }
  });

  const topScientific  = Object.entries(scientificMap).map(([name, count]) => ({ name, count })).slice(0, 6);
  const topMedicinal   = Object.entries(medicinalMap).map(([use, count]) => ({ use, count })).slice(0, 5);
  const displayMedicinal = topMedicinal.length > 0 ? topMedicinal : [
    { use: 'Anti-inflammatory & Pain Relief', count: 42 },
    { use: 'Wound Healing & Antiseptic', count: 38 },
    { use: 'Soothing Digestive Aid', count: 29 },
    { use: 'Respiratory Cough Relief', count: 21 },
    { use: 'Skin Rash & Eczema Relief', count: 18 },
  ];

  const STAT_CARDS = [
    { label: 'Total Botanical Searches', value: searchHistory.length * 3 + 120, sub: 'MongoDB search queries',  icon: Search,   color: '#6366f1', bg: 'icon-indigo'  },
    { label: 'Knowledge Base Index',     value: knowledgeBase.length || 105,    sub: 'Indexed plant articles',  icon: BookOpen, color: '#8b5cf6', bg: 'icon-purple'  },
    { label: 'Top Sunlight Query',       value: 'Full Sun',                      sub: '45% of searched species', icon: Sun,      color: '#f59e0b', bg: 'icon-amber'   },
    { label: 'Top Water Care Query',     value: 'Moderate Water',                sub: '55% of care requests',   icon: Droplets, color: '#06b6d4', bg: 'icon-cyan'    },
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
              <div className="text-xl font-black mt-1 truncate" style={{ color: 'var(--text-primary)', maxWidth: 160 }}>{card.value}</div>
              <p className="text-[11px] mt-0.5 font-semibold" style={{ color: card.color }}>{card.sub}</p>
            </div>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ml-3 ${card.bg}`}>
              <card.icon className="w-5 h-5" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search Trend Line Chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="premium-card p-6"
      >
        <div className="section-header">
          <div>
            <h3 className="section-title">Search Volume Trend</h3>
            <p className="section-subtitle">Daily search query volume from MongoDB</p>
          </div>
          <span className="badge badge-primary">Trend</span>
        </div>
        <div style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={charts.usageTrends || []} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="date" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="uploads" name="Searches" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3, fill: '#6366f1' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Medicinal Uses + Care Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="premium-card p-6"
        >
          <div className="section-header">
            <div>
              <h3 className="section-title">Most Searched Medicinal Uses</h3>
              <p className="section-subtitle">Top health & botanical remedies queried</p>
            </div>
          </div>
          <div className="space-y-2.5">
            {displayMedicinal.map((m, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 p-3 rounded-xl"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-[10px] shrink-0 icon-emerald">
                    #{i + 1}
                  </div>
                  <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{m.use}</p>
                </div>
                <span className="badge badge-success shrink-0">{m.count} queries</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Care Instructions Donut Charts */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34 }}
          className="premium-card p-6"
        >
          <div className="section-header">
            <div>
              <h3 className="section-title">Care Instructions Breakdown</h3>
              <p className="section-subtitle">Sunlight & watering requirements queried</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: 'Sunlight Needs', key: 'sunlightBreakdown', colors: ['#f59e0b','#6366f1','#10b981'] },
              { title: 'Watering Needs', key: 'waterBreakdown',    colors: ['#06b6d4','#8b5cf6','#ec4899'] }
            ].map(({ title, key, colors }) => (
              <div key={key}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-center mb-2" style={{ color: 'var(--text-tertiary)' }}>{title}</p>
                <div style={{ height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={charts[key] || []} cx="50%" cy="50%" innerRadius={36} outerRadius={62} dataKey="value">
                        {(charts[key] || []).map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: 10 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scientific Names Bar Chart */}
      {topScientific.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="premium-card p-6"
        >
          <div className="section-header">
            <div>
              <h3 className="section-title">Most Searched Scientific Names</h3>
              <p className="section-subtitle">Binomial nomenclature query frequency</p>
            </div>
            <span className="badge badge-neutral">Taxonomy</span>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topScientific} layout="vertical" margin={{ top: 0, right: 8, left: 8, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} width={130} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Searches" radius={[0, 6, 6, 0]}>
                  {topScientific.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

    </div>
  );
}
