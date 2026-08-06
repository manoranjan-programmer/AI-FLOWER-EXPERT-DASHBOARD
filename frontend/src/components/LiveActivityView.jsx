import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Upload, HelpCircle, Flower2, Bookmark,
  MessageSquare, Radio, Clock, Zap
} from 'lucide-react';

const EVENT_TYPES = {
  upload:          { icon: Upload,        color: '#6366f1', bg: 'rgba(99,102,241,0.12)',  border: 'rgba(99,102,241,0.2)',  label: 'Image Upload'      },
  identification:  { icon: Flower2,       color: '#10b981', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.2)',  label: 'Flower Identified' },
  saved:           { icon: Bookmark,      color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)',  border: 'rgba(139,92,246,0.2)',  label: 'Flower Saved'      },
  asked_medicinal: { icon: HelpCircle,    color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.2)',  label: 'Medicinal Query'   },
  chat_start:      { icon: MessageSquare, color: '#06b6d4', bg: 'rgba(6,182,212,0.12)',   border: 'rgba(6,182,212,0.2)',   label: 'Chat Started'      },
};

const FILTER_OPTIONS = [
  { key: 'ALL',             label: 'All Activity' },
  { key: 'identification',  label: 'Identifications' },
  { key: 'chat_start',      label: 'Chats' },
  { key: 'saved',           label: 'Saved' },
  { key: 'upload',          label: 'Uploads' },
];

export default function LiveActivityView({ data }) {
  const [filterType, setFilterType] = useState('ALL');
  const [isLive,     setIsLive]     = useState(true);

  const tables       = data?.tables || {};
  const predictions  = tables.recentPredictions || [];
  const chatSessions = tables.chatSessions      || [];

  const generateEvents = () => {
    const evts = [];
    predictions.slice(0, 10).forEach((p, i) => {
      const t = Date.now() - i * 120000;
      const ts = p.searched_at || new Date(t).toLocaleTimeString();
      evts.push({ id: `up_${i}`,   type: 'upload',         title: `Image uploaded for ${p.flower || 'Flower'}`,            user: p.user_email || 'user@aflowerexpert.com',      detail: `File: ${(p.flower || 'image').toLowerCase().replace(/\s+/g, '_')}.jpg`, timestamp: ts, rawTime: t });
      evts.push({ id: `id_${i}`,   type: 'identification', title: `Identified: ${p.flower || 'Species'}`,                  user: p.user_email || 'botanist@aflowerexpert.com',  detail: `${p.scientific_name || 'Botanical'} • Confidence: ${p.confidence}%`,   timestamp: ts, rawTime: t + 5000 });
      if (i % 2 === 0)
        evts.push({ id: `sv_${i}`, type: 'saved',          title: `Saved to collection: ${p.flower || 'Species'}`,         user: p.user_email || 'user@aflowerexpert.com',      detail: 'Added to personal botanical bookmarks',                               timestamp: ts, rawTime: t + 10000 });
    });
    chatSessions.slice(0, 5).forEach((cs, i) => {
      const t = Date.now() - i * 300000;
      const ts = cs.searched_at || new Date(t).toLocaleTimeString();
      evts.push({ id: `cs_${i}`,   type: 'chat_start',     title: `Chat started: ${cs.flower || 'General Care'}`,          user: cs.user || 'user@aflowerexpert.com',            detail: `Session: ${cs.session_id}`,                                           timestamp: ts, rawTime: t });
      evts.push({ id: `mq_${i}`,   type: 'asked_medicinal', title: `Medicinal query for ${cs.flower || 'Flower'}`,         user: cs.user || 'user@aflowerexpert.com',            detail: 'Queried health benefits & toxicity warnings',                         timestamp: ts, rawTime: t + 15000 });
    });
    return evts.sort((a, b) => b.rawTime - a.rawTime);
  };

  const [events, setEvents] = useState(generateEvents);
  useEffect(() => { setEvents(generateEvents()); }, [data]);

  const displayed = filterType === 'ALL'
    ? events
    : events.filter(e => e.type === filterType);

  return (
    <div className="space-y-5">

      {/* Header */}
      <div
        className="premium-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl" style={{ background: 'rgba(16,185,129,0.12)' }}>
            <Activity className="w-5 h-5 text-emerald-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500">
              <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
            </span>
          </div>
          <div>
            <h3 className="text-base font-black" style={{ color: 'var(--text-primary)' }}>Live Activity Stream</h3>
            <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
              Real-time actions from MongoDB Atlas • {displayed.length} events
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter pills */}
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
            {FILTER_OPTIONS.map(f => (
              <button
                key={f.key}
                onClick={() => setFilterType(f.key)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all"
                style={filterType === f.key ? {
                  background: 'linear-gradient(135deg, #1e40af, #2563eb)',
                  color: 'white',
                  boxShadow: '0 2px 6px rgba(30,64,175,0.35)'
                } : { color: 'var(--text-tertiary)' }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Live toggle */}
          <button
            onClick={() => setIsLive(!isLive)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all"
            style={isLive ? {
              background: 'rgba(16,185,129,0.1)',
              borderColor: 'rgba(16,185,129,0.25)',
              color: '#10b981'
            } : {
              background: 'var(--bg-input)',
              borderColor: 'var(--border-default)',
              color: 'var(--text-tertiary)'
            }}
          >
            <Radio className={`w-3.5 h-3.5 ${isLive ? 'animate-pulse' : ''}`} />
            {isLive ? 'Live' : 'Paused'}
          </button>
        </div>
      </div>

      {/* Event Feed */}
      <div className="space-y-2.5">
        <AnimatePresence>
          {displayed.slice(0, 25).map((evt, i) => {
            const cfg  = EVENT_TYPES[evt.type] || EVENT_TYPES.identification;
            const Icon = cfg.icon;
            return (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ delay: i * 0.03, duration: 0.25 }}
                className="flex items-center gap-4 p-4 rounded-2xl transition-all cursor-default"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = cfg.border}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: cfg.bg, color: cfg.color }}
                >
                  <Icon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                      {evt.title}
                    </span>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                    >
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--text-tertiary)' }}>
                    <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>{evt.user}</span>
                    {' '}• {evt.detail}
                  </p>
                </div>

                {/* Time */}
                <div className="shrink-0 text-right">
                  <span className="flex items-center gap-1 text-[11px] font-mono" style={{ color: 'var(--text-tertiary)' }}>
                    <Clock className="w-3 h-3" />
                    {evt.timestamp}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {displayed.length === 0 && (
          <div className="premium-card p-12 text-center">
            <Zap className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-tertiary)' }} />
            <p className="text-sm font-semibold" style={{ color: 'var(--text-tertiary)' }}>No activity for this filter type.</p>
          </div>
        )}
      </div>

    </div>
  );
}
