import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';

export default function KpiCard({ title, value, change, isPositive = true, icon: Icon, unit = '', tooltip = '' }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-emerald-500/10 hover:border-emerald-500/40 group transition-all"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          {title}
          {tooltip && (
            <span className="group/tooltip relative cursor-help">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400 hover:text-slate-200 transition-colors" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block w-48 p-2 rounded-lg bg-slate-900 text-white text-[11px] font-normal shadow-xl border border-slate-700 z-50 pointer-events-none">
                {tooltip}
              </span>
            </span>
          )}
        </span>
        <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {typeof value === 'number' ? value.toLocaleString() : value}
          {unit && <span className="text-sm font-semibold text-slate-400 ml-1">{unit}</span>}
        </div>

        {change && (
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${isPositive
              ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20'
            }`}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>{change}</span>
          </div>
        )}
      </div>

      {/* Subtle indicator bar */}
      <div className="mt-3 w-full h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-3/4 group-hover:w-full transition-all duration-500"></div>
      </div>
    </motion.div>
  );
}
