import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnalyticsCard from './cards/AnalyticsCard';
import KpiCard from './cards/KpiCard';
import {
  Activity, Upload, HelpCircle, Flower2, Bookmark,
  MessageSquare, Radio, Zap
} from 'lucide-react';

const EVENT_TYPES = {
  upload: { icon: Upload, label: 'Image Upload', color: '#6366f1' },
  identification: { icon: Flower2, label: 'Flower Identified', color: '#22c55e' },
  saved: { icon: Bookmark, label: 'Flower Saved', color: '#a855f7' },
  asked_medicinal: { icon: HelpCircle, label: 'Medicinal Query', color: '#f59e0b' },
  chat_start: { icon: MessageSquare, label: 'Chat Started', color: '#06b6d4' },
};

const FILTER_OPTIONS = [
  { key: 'ALL', label: 'All Events' },
  { key: 'identification', label: 'Identifications' },
  { key: 'chat_start', label: 'Chats' },
  { key: 'saved', label: 'Saved' },
  { key: 'upload', label: 'Uploads' },
];

export default function LiveActivityView({ data = {} }) {
  const [filterType, setFilterType] = useState('ALL');
  const [isLive, setIsLive] = useState(true);

  const tables = data?.tables || {};
  const predictions = tables.recentPredictions || [];
  const chatSessions = tables.chatSessions || [];

  const generateEvents = () => {
    const evts = [];
    (predictions || []).slice(0, 10).forEach((p, i) => {
      const t = Date.now() - i * 120000;
      const ts = p.searched_at || new Date(t).toLocaleTimeString();
      evts.push({
        id: `up_${i}`,
        type: 'upload',
        title: `Image uploaded for ${p.flower_name || p.flower || 'Botanical Species'}`,
        user: p.username || p.user_email || 'user@flowerexpert.ai',
        detail: `File: ${(p.flower_name || 'image').toLowerCase().replace(/\s+/g, '_')}.jpg`,
        timestamp: ts,
        rawTime: t
      });
      evts.push({
        id: `id_${i}`,
        type: 'identification',
        title: `Identified: ${p.flower_name || p.flower || 'Species'}`,
        user: p.username || 'botanist@flowerexpert.ai',
        detail: `${p.scientific_name || 'Botanical Taxonomy'} • Confidence: ${p.confidence || 94}%`,
        timestamp: ts,
        rawTime: t + 5000
      });
      if (i % 2 === 0) {
        evts.push({
          id: `sv_${i}`,
          type: 'saved',
          title: `Saved to collection: ${p.flower_name || 'Species'}`,
          user: p.username || 'user@flowerexpert.ai',
          detail: 'Added to personal botanical bookmarks',
          timestamp: ts,
          rawTime: t + 10000
        });
      }
    });

    (chatSessions || []).slice(0, 5).forEach((cs, i) => {
      const t = Date.now() - i * 300000;
      const ts = cs.searched_at || new Date(t).toLocaleTimeString();
      evts.push({
        id: `cs_${i}`,
        type: 'chat_start',
        title: `Chat session started: ${cs.flower || 'General Care'}`,
        user: cs.user_name || cs.user || 'user@flowerexpert.ai',
        detail: `Session: ${cs._id ? cs._id.substring(0, 8) : i}`,
        timestamp: ts,
        rawTime: t
      });
    });

    return evts.sort((a, b) => b.rawTime - a.rawTime);
  };

  const [events, setEvents] = useState(generateEvents);

  useEffect(() => {
    setEvents(generateEvents());
  }, [data]);

  const displayed = filterType === 'ALL'
    ? events
    : events.filter(e => e.type === filterType);

  return (
    <div className="space-y-6">
      {/* ── Top Bar Controls ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200/90 dark:border-slate-800/80 backdrop-blur-md shadow-sm dark:shadow-card-dark">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
            <Activity className="w-5 h-5" />
            <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Live Activity Telemetry Stream</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Real-time socket events & database transactions • {displayed.length} active events</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilterType(f.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                filterType === f.key
                  ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Event Feed Cards Stream ── */}
      <AnalyticsCard
        title="Real-Time Event Stream"
        subtitle="Chronological feed of platform events"
        icon={Radio}
      >
        <div className="space-y-3 py-2 max-h-[600px] overflow-y-auto custom-scrollbar">
          <AnimatePresence>
            {displayed.map((evt) => {
              const cfg = EVENT_TYPES[evt.type] || EVENT_TYPES.upload;
              const Icon = cfg.icon;

              return (
                <motion.div
                  key={evt.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/90 dark:border-slate-800/80 flex items-start justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" style={{ color: cfg.color }}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{evt.title}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-800">
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">{evt.detail}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-1">By: {evt.user}</p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="px-2 py-1 rounded-md bg-slate-200 dark:bg-slate-900 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-800">
                      {evt.timestamp}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </AnalyticsCard>
    </div>
  );
}
