import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({
  title = '',
  value = '',
  subtitle = '',
  icon: Icon,
  badge = null,
  accentColor = 'emerald'
}) {
  const colorMap = {
    emerald: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    indigo: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
    amber: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    cyan: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    rose: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
  };

  const badgeStyle = colorMap[accentColor] || colorMap.emerald;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-4 shadow-sm flex items-center justify-between gap-3"
    >
      <div className="space-y-1 min-w-0">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
          {title}
        </p>
        <p className="text-lg font-black text-slate-100 tracking-tight">
          {value}
        </p>
        {subtitle && <p className="text-[10px] text-slate-400 truncate">{subtitle}</p>}
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0">
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${badgeStyle}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
        {badge && (
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${badgeStyle}`}>
            {badge}
          </span>
        )}
      </div>
    </motion.div>
  );
}
