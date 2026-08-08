import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, Check } from 'lucide-react';

const DATE_OPTIONS = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: '7d', label: 'Last 7 Days' },
  { id: '30d', label: 'Last 30 Days' },
  { id: 'this_month', label: 'This Month' },
  { id: 'last_month', label: 'Last Month' },
  { id: 'custom', label: 'Custom Range' },
];

export default function DateRangePicker({ value = '30d', onChange = () => {} }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = DATE_OPTIONS.find((opt) => opt.id === value) || { label: 'Last 30 Days' };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800/80 text-slate-800 dark:text-slate-300 text-xs font-semibold shadow-sm transition-all"
      >
        <Calendar className="w-3.5 h-3.5 text-emerald-500" />
        <span>{selectedOption.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5 z-50 space-y-1">
          {DATE_OPTIONS.map((opt) => {
            const isSelected = value === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  onChange(opt.id);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
