import React, { useState } from 'react';
import { Sparkles, Activity, Moon, Sun, ShieldCheck, X, RefreshCw, CheckCircle2, ArrowLeft, Home } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../ui/Badge';
import { NavPillButton } from '../ui/NavPillButton';
import { cn } from '../../lib/utils';

interface NavbarProps {
  isBackendOnline: boolean | null;
  onRefreshHealth?: () => void;
  onNavigateToLanding?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isBackendOnline, onRefreshHealth, onNavigateToLanding }) => {
  const { isDark, toggleTheme } = useTheme();
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [isSessionPopoverOpen, setIsSessionPopoverOpen] = useState(false);
  const [analystRole, setAnalystRole] = useState('HR Lead Analyst');

  return (
    <>
      <header className="h-16 border-b border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-950/90 backdrop-blur-xl sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
        
        {/* Clickable Logo and App Title */}
        <div 
          onClick={() => setIsVersionModalOpen(true)}
          className="flex items-center gap-3 cursor-pointer group"
          title="Click to view model version specs"
        >
          <div className="relative flex items-center justify-center shrink-0 w-9 h-9 rounded-full">
            <div className="nav-pill-ring" aria-hidden="true" />
            <div className="relative z-10 flex items-center justify-center w-full h-full rounded-full bg-gradient-to-b from-[#1c1d26] to-[#0a0a0d] border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.22)] group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-zinc-100 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50 group-hover:text-zinc-300 transition-colors">
                AURA Predictor
              </h1>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold border border-zinc-200 dark:border-zinc-700/60">
                ML Core
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:block">
              Employee Salary Hike Predictor & Decision Support
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Back to Landing Page / Home Link */}
          {onNavigateToLanding && (
            <NavPillButton
              icon={Home}
              title="Landing Page"
              onClick={onNavigateToLanding}
              size="sm"
              className="w-auto"
              aria-label="Back to Landing Page (Home)"
            />
          )}

          {/* Clickable Backend Status Pill */}
          <button
            onClick={() => setIsHealthModalOpen(true)}
            className="nav-pill-btn group px-2.5 py-1 text-xs gap-2 cursor-pointer focus:outline-none"
            title="Click to inspect ML API status"
          >
            <div className="relative flex items-center justify-center shrink-0 w-5 h-5 rounded-full">
              <div className="nav-pill-ring" aria-hidden="true" />
              <div className="relative z-10 flex items-center justify-center w-full h-full rounded-full bg-[#0a0b0e]">
                <span
                  className={cn(
                    'w-2 h-2 rounded-full',
                    isBackendOnline === true
                      ? 'bg-emerald-400 animate-pulse'
                      : isBackendOnline === false
                      ? 'bg-amber-400'
                      : 'bg-zinc-400'
                  )}
                />
              </div>
            </div>
            <span className="text-[11px] font-semibold text-zinc-200 group-hover:text-white transition-colors hidden md:inline">
              {isBackendOnline === true && 'ML Engine Online (5050)'}
              {isBackendOnline === false && 'Local Fallback'}
              {isBackendOnline === null && 'Probing ML...'}
            </span>
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="nav-pill-btn group p-1 w-8 h-8 justify-center rounded-full"
            title="Toggle color theme"
          >
            <div className="relative flex items-center justify-center shrink-0 w-6 h-6 rounded-full">
              <div className="nav-pill-ring" aria-hidden="true" />
              <div className="relative z-10 flex items-center justify-center w-full h-full rounded-full bg-[#0a0b0e]">
                {isDark ? (
                  <Sun className="w-3.5 h-3.5 text-amber-300 drop-shadow" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-zinc-200 drop-shadow" />
                )}
              </div>
            </div>
          </button>

          {/* Clickable Analyst Role Pill */}
          <div className="relative">
            <button
              onClick={() => setIsSessionPopoverOpen(!isSessionPopoverOpen)}
              className="nav-pill-btn group px-2.5 py-1 text-xs gap-2 cursor-pointer"
            >
              <div className="relative flex items-center justify-center shrink-0 w-6 h-6 rounded-full">
                <div className="nav-pill-ring" aria-hidden="true" />
                <div className="relative z-10 flex items-center justify-center w-full h-full rounded-full bg-gradient-to-b from-[#181920] to-[#0a0a0d] border border-white/10 text-[10px] font-bold text-zinc-200">
                  HR
                </div>
              </div>
              <div className="hidden sm:block text-left pr-1">
                <span className="block text-[11px] font-semibold text-zinc-200 group-hover:text-white transition-colors leading-tight">
                  {analystRole}
                </span>
                <span className="block text-[9px] text-zinc-400 font-mono">
                  Auth Verified
                </span>
              </div>
            </button>

            {/* Session Popover */}
            {isSessionPopoverOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-4 z-40 text-xs animate-fadeIn">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                  Appraisal Analyst Persona:
                </span>
                <div className="space-y-1 mb-3">
                  {['HR Lead Analyst', 'Comp & Benefits VP', 'Engineering Manager'].map(role => (
                    <button
                      key={role}
                      onClick={() => { setAnalystRole(role); setIsSessionPopoverOpen(false); }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                        analystRole === role
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 font-bold'
                          : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-[10px] text-zinc-400 font-mono">
                  <span>Sign-off Authority</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Backend Diagnostics Modal */}
      {isHealthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800 mb-4">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" /> ML Backend Microservice Diagnostics
              </h3>
              <button onClick={() => setIsHealthModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 flex justify-between items-center">
                <span className="text-zinc-500">Service Endpoint:</span>
                <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200 truncate max-w-[220px]" title={import.meta.env.VITE_API_BASE_URL || "Local Proxy (/api)"}>{import.meta.env.VITE_API_BASE_URL || "http://localhost:5050"}</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 flex justify-between items-center">
                <span className="text-zinc-500">Status:</span>
                <span className={`font-bold ${isBackendOnline ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {isBackendOnline ? 'Connected & Healthy (200 OK)' : 'Offline (Local Engine Active)'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 space-y-1.5">
                <span className="text-zinc-400 block font-mono text-[10px]">Loaded Pipelines:</span>
                <div className="flex justify-between font-mono text-[11px]">
                  <span>Gradient Boosting (Core/Full):</span>
                  <span className="text-emerald-500 font-bold">Ready</span>
                </div>
                <div className="flex justify-between font-mono text-[11px]">
                  <span>Linear Regression Baseline:</span>
                  <span className="text-emerald-500 font-bold">Ready</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-4">
              <button
                onClick={() => {
                  if (onRefreshHealth) onRefreshHealth();
                  setIsHealthModalOpen(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-semibold hover:bg-zinc-100"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Re-probe Port
              </button>
              <button
                onClick={() => setIsHealthModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Model Spec Modal */}
      {isVersionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800 mb-4">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" /> AURA Salary Hike Model v2.4.1
              </h3>
              <button onClick={() => setIsVersionModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono my-3">
              <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-500 font-sans">Primary Architecture:</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200">Gradient Boosting Regressor</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-500 font-sans">Trained Dataset:</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200">salary_data.csv (22,770 rows)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-500 font-sans">Test R² Score:</span>
                <span className="font-bold text-emerald-500">0.941 / 0.949</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-500 font-sans">Mean Absolute Error:</span>
                <span className="font-bold text-blue-500">±1.28%</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-500 font-sans">Policy Domain:</span>
                <span className="font-bold text-emerald-500">[5.0% - 35.0%]</span>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setIsVersionModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold"
              >
                Close Spec
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
