import React, { useState } from 'react';
import { Settings, Database, Server, Sun, Moon, Palette, Globe, Save, Check, Shield } from 'lucide-react';
import { useTheme, CHART_PALETTES } from '../context/ThemeContext';
import AnalyticsCard from './cards/AnalyticsCard';

export default function SettingsPanel() {
  const { theme, setTheme, chartPalette, changePalette } = useTheme();
  const [saved, setSaved] = useState(false);
  const [language, setLanguage] = useState('en');
  const [refreshInterval, setRefreshInterval] = useState('5');
  const [mongoDb, setMongoDb] = useState('test');

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <AnalyticsCard
        title="Dashboard & Platform Settings"
        subtitle="Configure visual theme, chart color palettes, live refresh rates, language, and database connections."
        icon={Settings}
        actionSlot={
          saved && (
            <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 flex items-center gap-1.5 animate-fade-in">
              <Check className="w-4 h-4" /> Preferences Saved
            </span>
          )
        }
      >
        <form onSubmit={handleSave} className="space-y-6 py-2">
          {/* Theme & Palette Customization */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4 text-emerald-400" /> Visual Theme & Accent Palette
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Interface Theme */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Interface Theme Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                      theme === 'light'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/40 shadow-sm'
                        : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <Sun className="w-4 h-4 text-amber-400" /> Light Mode
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                      theme === 'dark'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-sm'
                        : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <Moon className="w-4 h-4 text-emerald-400" /> Dark Mode
                  </button>
                </div>
              </div>

              {/* Palette Switcher */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Chart Palette Accent</label>
                <div className="grid grid-cols-2 gap-2">
                  {CHART_PALETTES && Object.entries(CHART_PALETTES).map(([key, pal]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => changePalette(key)}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                        chartPalette === key
                          ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                          : 'border-slate-800 text-slate-400 bg-slate-950/80 hover:text-slate-200'
                      }`}
                    >
                      <span>{pal.name}</span>
                      <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: pal.primary }} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-800/80" />

          {/* Database & System Configurations */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> MongoDB Atlas & Polling Configuration
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Target Database</label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-slate-200">
                  <Server className="w-4 h-4 text-emerald-500 shrink-0" />
                  <input
                    type="text"
                    value={mongoDb}
                    onChange={(e) => setMongoDb(e.target.value)}
                    className="bg-transparent focus:outline-none w-full"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Auto-Refresh Interval</label>
                <select
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-slate-200 focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="3">3 seconds</option>
                  <option value="5">5 seconds (Recommended)</option>
                  <option value="10">10 seconds</option>
                  <option value="30">30 seconds</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Language Locale</label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-200">
                  <Globe className="w-4 h-4 text-cyan-500 shrink-0" />
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-transparent focus:outline-none w-full font-semibold text-slate-900 dark:text-slate-200"
                  >
                    <option value="en">English (US)</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Save Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-glow-emerald transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save System Settings</span>
            </button>
          </div>
        </form>
      </AnalyticsCard>
    </div>
  );
}
