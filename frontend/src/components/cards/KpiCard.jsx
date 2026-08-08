import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import Sparkline from '../charts/Sparkline';

export default function KpiCard({
  title = '',
  value = 0,
  change = '+0.0%',
  changeType = 'positive',
  icon: Icon,
  sparklineColor = '#22c55e',
  sparklineData = [],
  unit = '',
  subtitle = '',
  onClick = null
}) {
  const isPositive = changeType === 'positive' || (typeof change === 'string' && change.startsWith('+'));
  const isNegative = changeType === 'negative' || (typeof change === 'string' && change.startsWith('-'));

  // Format value safely
  const formattedValue = typeof value === 'number' ? value.toLocaleString() : value;

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/80 p-5 shadow-sm dark:shadow-card-dark transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:border-blue-500/40 hover:shadow-md hover:shadow-blue-500/10' : ''
      }`}
    >
      {/* Top Row: Icon + Title + Tooltip */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {Icon && (
            <div className="p-2 rounded-xl bg-blue-500/10 dark:bg-slate-800/80 border border-blue-500/20 text-blue-600 dark:text-blue-400 group-hover:text-blue-500 transition-all">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 truncate tracking-wide">
            {title}
          </span>
        </div>

        {/* Hover Tooltip trigger icon */}
        {subtitle && (
          <div className="relative group/tooltip">
            <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer" />
            <div className="absolute right-0 bottom-full mb-2 hidden group-hover/tooltip:block w-48 p-2 rounded-lg bg-slate-900 text-[10px] text-slate-200 border border-slate-800 shadow-xl z-30 pointer-events-none">
              {subtitle}
            </div>
          </div>
        )}
      </div>

      {/* Middle Row: Formatted Value + Trend Badge */}
      <div className="flex items-baseline justify-between gap-2 mb-3">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight font-sans">
            {formattedValue}
          </span>
          {unit && <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{unit}</span>}
        </div>

        {/* Trend Indicator Badge */}
        <div
          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${
            isPositive
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : isNegative
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : isNegative ? (
            <ArrowDownRight className="w-3 h-3" />
          ) : null}
          <span>{change}</span>
        </div>
      </div>

      {/* Bottom Row: Mini Sparkline Chart */}
      <div className="h-9 w-full mt-2 pt-1 border-t border-slate-800/40">
        <Sparkline data={sparklineData} color={sparklineColor} />
      </div>
    </motion.div>
  );
}
