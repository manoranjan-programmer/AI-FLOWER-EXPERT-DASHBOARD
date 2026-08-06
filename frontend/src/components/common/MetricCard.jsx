import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

/** Animated number counter */
function AnimatedValue({ value }) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    const raw = typeof value === 'number' ? value : parseFloat(value) || 0;
    const from = prevRef.current;
    prevRef.current = raw;

    const duration = 800;
    const steps = 40;
    const step = (raw - from) / steps;
    let current = from;
    let count = 0;

    const timer = setInterval(() => {
      count++;
      current += step;
      setDisplay(Math.round(current));
      if (count >= steps) {
        setDisplay(raw);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  if (typeof value !== 'number') return <>{value}</>;

  return (
    <>{display >= 1_000_000
      ? (display / 1_000_000).toFixed(1) + 'M'
      : display >= 1_000
      ? display.toLocaleString()
      : display}
    </>
  );
}

export default function MetricCard({
  title,
  value,
  change,
  changeType = 'positive',
  icon: Icon,
  trendData = [],
  sparklineColor = '#6366f1',
  unit = '',
  subtitle,
  onClick,
  gradient = 'icon-indigo'
}) {
  const isPositive = changeType === 'positive' || (typeof change === 'number' && change >= 0);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="stat-card cursor-pointer group"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Top glow line on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${sparklineColor}, transparent)` }}
      />

      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] leading-tight" style={{ color: 'var(--text-tertiary)' }}>
          {title}
        </span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 ${gradient}`}>
          {Icon && <Icon className="w-4.5 h-4.5 w-[18px] h-[18px]" />}
        </div>
      </div>

      {/* Value + change badge */}
      <div className="flex items-baseline justify-between gap-2">
        <div className="text-[26px] font-black tracking-tight leading-none" style={{ color: 'var(--text-primary)' }}>
          <AnimatedValue value={value} />
          {unit && <span className="text-sm font-semibold ml-1" style={{ color: 'var(--text-tertiary)' }}>{unit}</span>}
        </div>

        {change !== undefined && (
          <div
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold shrink-0"
            style={isPositive ? {
              background: 'rgba(16,185,129,0.12)',
              color: '#10b981',
              border: '1px solid rgba(16,185,129,0.2)'
            } : {
              background: 'rgba(239,68,68,0.12)',
              color: '#ef4444',
              border: '1px solid rgba(239,68,68,0.2)'
            }}
          >
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {typeof change === 'number' ? `${change > 0 ? '+' : ''}${change}%` : change}
          </div>
        )}
      </div>

      {subtitle && (
        <p className="text-[11px] mt-1.5 truncate" style={{ color: 'var(--text-tertiary)' }}>
          {subtitle}
        </p>
      )}

      {/* Sparkline */}
      <div className="mt-3 h-10 w-full -mx-0">
        {trendData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`sg_${title.replace(/\W/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={sparklineColor} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={sparklineColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={sparklineColor}
                strokeWidth={1.5}
                fillOpacity={1}
                fill={`url(#sg_${title.replace(/\W/g, '')})`}
                isAnimationActive
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-1.5 w-full rounded-full mt-4 overflow-hidden" style={{ background: 'var(--border-subtle)' }}>
            <div className="h-full rounded-full animate-pulse" style={{ width: '70%', background: sparklineColor, opacity: 0.5 }} />
          </div>
        )}
      </div>

      {/* Hover cue */}
      <div className="mt-2 flex items-center justify-between text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-primary)' }}>
        <span>View details</span>
        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </motion.div>
  );
}
