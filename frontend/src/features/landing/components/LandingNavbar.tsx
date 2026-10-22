import React, { useState, useEffect } from 'react';
import { Sparkles, Activity, Sun, Moon, ArrowRight, ShieldCheck, Cpu, Menu, X, ChevronRight, LayoutDashboard } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { TabType } from '../../../components/layout/Sidebar';
import { NavPillButton } from '../../../components/ui/NavPillButton';
import { cn } from '../../../lib/utils';

interface LandingNavbarProps {
  isBackendOnline: boolean | null;
  onOpenApp: (tab?: TabType) => void;
  onRefreshHealth?: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  isBackendOnline,
  onOpenApp,
  onRefreshHealth,
}) => {
  const { isDark, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setMobileMenuOpen(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Simulator', href: '#simulator' },
    { label: 'The Dilemma', href: '#dilemma' },
    { label: 'Platform Pillars', href: '#features' },
    { label: 'ML Engine & SHAP', href: '#ml-engine' },
    { label: 'Workflow', href: '#workflow' },
    { label: 'Security & HRIS', href: '#security' },
    { label: 'ROI Impact', href: '#roi' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200/80 dark:border-zinc-800/80 shadow-sm'
          : 'bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md border-b border-zinc-200/40 dark:border-zinc-800/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative flex items-center justify-center shrink-0 w-10 h-10 rounded-full">
              <div className="nav-pill-ring" aria-hidden="true" />
              <div className="relative z-10 flex items-center justify-center w-full h-full rounded-full bg-gradient-to-b from-[#1c1d26] to-[#0a0a0d] border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.22)] group-hover:scale-105 transition-transform duration-300">
                <Sparkles className="w-5 h-5 text-zinc-100 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 group-hover:text-zinc-300 transition-colors">
                  AURA
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-200 border border-white/20">
                  ML Core
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium hidden sm:block">
                Precision Compensation Engineering
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3 py-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-zinc-100/70 dark:hover:bg-zinc-800/60 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Status Pill & Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Live Model Status Pill */}
            <div 
              onClick={onRefreshHealth}
              className="nav-pill-btn group cursor-pointer flex items-center gap-2 px-2.5 py-1 text-[11px] font-mono font-medium"
              title="Click to ping ML engine endpoint"
            >
              <div className="relative flex items-center justify-center shrink-0 w-4 h-4 rounded-full">
                <div className="nav-pill-ring" aria-hidden="true" />
                <div className="relative z-10 flex items-center justify-center w-full h-full rounded-full bg-[#0a0b0e]">
                  <span className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    isBackendOnline === true ? 'bg-emerald-400 animate-pulse' :
                    isBackendOnline === false ? 'bg-amber-400' : 'bg-zinc-400'
                  )} />
                </div>
              </div>
              <span className="text-zinc-200 font-semibold hidden md:inline">
                {isBackendOnline === true ? 'Live Engine' : isBackendOnline === false ? 'Fallback' : 'Probing...'}
              </span>
              {isBackendOnline === true && (
                <span className="text-emerald-400 font-bold">&lt;15ms</span>
              )}
            </div>

            {/* Dark/Light Mode Toggle */}
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

            {/* Launch Platform App CTA */}
            <NavPillButton
              icon={LayoutDashboard}
              title="Launch Platform"
              onClick={() => onOpenApp('predictor')}
              size="sm"
              className="w-auto px-3.5 py-1.5"
              aria-label="Launch Platform Appraisal Predictor"
            />

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-6 bg-white/95 dark:bg-zinc-950/95 border-b border-zinc-200 dark:border-zinc-800 backdrop-blur-2xl animate-fadeIn">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </a>
            ))}
            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-2">
              <NavPillButton
                icon={LayoutDashboard}
                title="Open Full ML Suite"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenApp('predictor');
                }}
                className="w-full justify-center"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};