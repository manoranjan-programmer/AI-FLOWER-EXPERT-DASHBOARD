import React, { useState } from 'react';
import { Settings, Database, Server, Bell, Shield, Key, Save, Check } from 'lucide-react';

export default function SettingsPanel() {
  const [saved, setSaved] = useState(false);
  const [apiPort, setApiPort] = useState('5001');
  const [mongoDb, setMongoDb] = useState('test');
  const [historyColl, setHistoryColl] = useState('Flower_Search_History');
  const [knowledgeColl, setKnowledgeColl] = useState('Flower_Knowledge_Base');
  const [autoRefreshInterval, setAutoRefreshInterval] = useState('5');
  const [emailAlerts, setEmailAlerts] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            System & Dashboard Settings
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure backend API endpoints, MongoDB collection aliases, telemetry auto-sync intervals, and security keys.
          </p>
        </div>

        {saved && (
          <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1.5 animate-fade-in">
            <Check className="w-4 h-4 text-emerald-600" /> Settings Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* MongoDB Connection Config */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-600" /> MongoDB Atlas Collection Settings
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Target Database</label>
              <input
                type="text"
                value={mongoDb}
                onChange={(e) => setMongoDb(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">API Express Port</label>
              <input
                type="text"
                value={apiPort}
                onChange={(e) => setApiPort(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Search History Collection</label>
              <input
                type="text"
                value={historyColl}
                onChange={(e) => setHistoryColl(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Knowledge Base Collection</label>
              <input
                type="text"
                value={knowledgeColl}
                onChange={(e) => setKnowledgeColl(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Telemetry & Refresh Settings */}
        <div className="space-y-3 pt-3 border-t border-gray-100">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-600" /> Auto-Sync & Telemetry Preferences
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Live Polling Interval (Seconds)</label>
              <select
                value={autoRefreshInterval}
                onChange={(e) => setAutoRefreshInterval(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
              >
                <option value="5">5 Seconds (Real-time)</option>
                <option value="10">10 Seconds</option>
                <option value="30">30 Seconds</option>
                <option value="60">1 Minute</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200 mt-5">
              <div>
                <span className="text-xs font-bold text-gray-900">System Alert Email Notifications</span>
                <p className="text-[11px] text-gray-500">Receive alerts when toxicity ratio exceeds threshold</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-3 border-t border-gray-100">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all btn-ripple"
          >
            <Save className="w-4 h-4" /> Save Dashboard Configuration
          </button>
        </div>

      </form>
    </div>
  );
}
