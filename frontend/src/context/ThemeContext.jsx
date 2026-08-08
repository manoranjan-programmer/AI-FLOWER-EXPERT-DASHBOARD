import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const CHART_PALETTES = {
  emerald: {
    name: 'Emerald Botanic',
    primary: '#10b981',
    secondary: '#3b82f6',
    accent: '#8b5cf6',
    warn: '#f59e0b',
    gradient: ['#10b981', '#059669']
  },
  cyan: {
    name: 'Electric Cyan',
    primary: '#06b6d4',
    secondary: '#6366f1',
    accent: '#ec4899',
    warn: '#f59e0b',
    gradient: ['#06b6d4', '#0891b2']
  },
  indigo: {
    name: 'Royal Indigo',
    primary: '#6366f1',
    secondary: '#10b981',
    accent: '#f43f5e',
    warn: '#f59e0b',
    gradient: ['#6366f1', '#4f46e5']
  },
  amber: {
    name: 'Sunset Flame',
    primary: '#f59e0b',
    secondary: '#ef4444',
    accent: '#10b981',
    warn: '#8b5cf6',
    gradient: ['#f59e0b', '#d97706']
  }
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('admin_dashboard_theme') || 'light';
  });

  const [chartPalette, setChartPalette] = useState(() => {
    return localStorage.getItem('admin_dashboard_palette') || 'emerald';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('admin_dashboard_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const changePalette = (newPalette) => {
    if (CHART_PALETTES[newPalette]) {
      setChartPalette(newPalette);
      localStorage.setItem('admin_dashboard_palette', newPalette);
    }
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme,
      toggleTheme,
      chartPalette,
      changePalette,
      paletteColors: CHART_PALETTES[chartPalette] || CHART_PALETTES.emerald
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
