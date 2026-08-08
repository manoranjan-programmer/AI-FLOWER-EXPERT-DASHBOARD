import React from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] w-full flex flex-col items-center justify-center p-8 text-center bg-slate-900/80 backdrop-blur-md rounded-2xl border border-rose-500/30 shadow-2xl space-y-4">
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <AlertOctagon className="w-10 h-10 animate-bounce" />
          </div>

          <div className="space-y-1.5 max-w-md">
            <h3 className="text-lg font-bold text-slate-100 tracking-tight">
              Executive Component Exception Caught
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              An unhandled rendering exception occurred. Your backend connections and data remain safe.
            </p>
          </div>

          {this.state.error && (
            <div className="w-full max-w-lg p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-left font-mono text-[11px] text-rose-300 overflow-x-auto custom-scrollbar">
              {this.state.error.toString()}
            </div>
          )}

          <button
            onClick={this.handleReload}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-glow-emerald transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Executive Interface</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
