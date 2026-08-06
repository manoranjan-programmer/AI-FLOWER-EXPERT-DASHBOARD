import React, { useState } from 'react';
import { Settings, Database, Server, Sun, Moon, Palette, Globe, Save, Check, Shield } from 'lucide-react';
import { useTheme, CHART_PALETTES } from '../context/ThemeContext';

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
    <div className="saas-card p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-500" />
            Dashboard & Platform Settings
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure visual theme, chart color palettes, live refresh rates, language, and database connections.
          </p>
        </div>

        {saved && (
          <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20 flex items-center gap-1.5 animate-fade-in">
            <Check className="w-4 h-4" /> Preferences Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* Theme & Palette Customization */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-500" /> Visual Theme & Chart Color Palette
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Dark / Light Theme Toggle */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Interface Theme</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                    theme === 'light'
                      ? 'bg-blue-500/10 text-blue-600 border-blue-500/40 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-500" /> Light Mode
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                    theme === 'dark'
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/40 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Moon className="w-4 h-4 text-blue-400" /> Dark Mode
                </button>
              </div>
            </div>

            {/* Chart Accent Palette Switcher */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Chart Color Theme</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(CHART_PALETTES).map(([key, pal]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => changePalette(key)}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                      chartPalette === key
                        ? 'border-blue-500 text-slate-900 dark:text-white bg-blue-500/10'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800'
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

        {/* Sync & Refresh Settings */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-500" /> Auto Refresh & Localization
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Auto Refresh Frequency</label>
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-medium"
              >
                <option value="5">5 Seconds (Real-time)</option>
                <option value="10">10 Seconds</option>
                <option value="30">30 Seconds</option>
                <option value="60">60 Seconds</option>
                <option value="off">Off (Manual Refresh)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Platform Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-medium"
              >
                <option value="en">English (US)</option>
                <option value="es">Spanish (Español)</option>
                <option value="fr">French (Français)</option>
                <option value="de">German (Deutsch)</option>
                <option value="ja">Japanese (日本語)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" /> Save Dashboard Preferences
          </button>
        </div>

      </form>
    </div>
  );
}
