import React from 'react';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  TrendingUp,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Activity,
  Settings,
  Layers,
  LucideIcon,
  Menu,
  FileUp,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { NavPillButton } from '../ui/NavPillButton';

export type TabType = 
  | 'predictor' 
  | 'resume'
  | 'cohorts'
  | 'bands'
  | 'appraisals' 
  | 'batch'
  | 'benchmarks' 
  | 'telemetry'
  | 'config'
  | 'docs';

interface NavItem {
  id: TabType;
  label: string;
  badge?: string;
  icon: LucideIcon;
}

const PRIMARY_NAV_ITEMS: NavItem[] = [
  { id: 'predictor', label: 'Appraisal Predictor', icon: LayoutDashboard, badge: 'Live ML' },
  { id: 'resume', label: 'Resume / CV AI Scanner', icon: FileUp, badge: 'Auto-Read' },
  { id: 'cohorts', label: 'Employee Cohorts', icon: Users, badge: '22.7k' },
  { id: 'bands', label: 'Compensation Bands', icon: TrendingUp },
  { id: 'appraisals', label: 'Appraisal Ledger', icon: Layers, badge: 'Active' },
  { id: 'batch', label: 'Batch Evaluation', icon: FileSpreadsheet },
  { id: 'benchmarks', label: 'Model Benchmarks', icon: BarChart3, badge: 'R² 0.949' },
  { id: 'telemetry', label: 'Telemetry & Logs', icon: Activity },
];

const SECONDARY_NAV_ITEMS: NavItem[] = [
  { id: 'config', label: 'Pipeline Config', icon: Settings },
  { id: 'docs', label: 'HR Guidelines & Docs', icon: ShieldCheck },
];

interface SidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  (
    {
      activeTab,
      onSelectTab,
      collapsed,
      onToggleCollapsed,
      onMouseEnter,
      onMouseLeave,
    },
    ref
  ) => {
    return (
      <aside
        ref={ref}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={cn(
          'border-r border-zinc-200/80 dark:border-white/10 bg-white/90 dark:bg-zinc-950/80 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between shrink-0 select-none z-20 h-full max-h-full overflow-hidden',
          collapsed ? 'w-20' : 'w-64'
        )}
      >
        <div className="p-3.5 space-y-4 overflow-y-auto flex-1 h-full">
          {/* Three-line Menu Toggle Button with Rotating Glow Ring */}
          <div
            className={cn(
              'flex items-center transition-all duration-300 pb-2.5 mb-2 border-b border-zinc-200/60 dark:border-white/5',
              collapsed ? 'justify-center w-full px-0' : 'justify-between w-full px-1'
            )}
          >
            {!collapsed && (
              <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 tracking-wider uppercase select-none">
                Appraisal Modules
              </span>
            )}
            <button
              onClick={onToggleCollapsed}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className={cn(
                'nav-pill-btn group p-0 justify-center rounded-full transition-all duration-300 cursor-pointer',
                collapsed ? 'w-10 h-10 mx-auto' : 'w-8 h-8 ml-auto'
              )}
            >
              <div
                className={cn(
                  'relative flex items-center justify-center shrink-0 rounded-full',
                  collapsed ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-6 h-6'
                )}
              >
                <div className="nav-pill-ring" aria-hidden="true" />
                <div className="relative z-10 flex items-center justify-center w-full h-full rounded-full bg-gradient-to-b from-[#181920] to-[#0a0a0d] border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.18)]">
                  <Menu
                    className={cn(
                      'text-zinc-100 group-hover:text-white transition-colors drop-shadow-[0_1px_1px_rgba(255,255,255,0.35)] shrink-0',
                      collapsed ? 'w-4 h-4' : 'w-3.5 h-3.5'
                    )}
                  />
                </div>
              </div>
            </button>
          </div>

        {/* Primary navigation list */}
        <nav className="space-y-2">
          {PRIMARY_NAV_ITEMS.map(item => {
            const isActive = activeTab === item.id;
            return (
              <NavPillButton
                key={item.id}
                icon={item.icon}
                title={item.label}
                isActive={isActive}
                collapsed={collapsed}
                badge={item.badge}
                onClick={() => onSelectTab(item.id)}
              />
            );
          })}
        </nav>

        {/* Governance & Admin list */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
          {!collapsed && (
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 tracking-wider uppercase px-2 block mb-2">
              Governance & Policies
            </span>
          )}
          <nav className="space-y-2">
            {SECONDARY_NAV_ITEMS.map(item => {
              const isActive = activeTab === item.id;
              return (
                <NavPillButton
                  key={item.id}
                  icon={item.icon}
                  title={item.label}
                  isActive={isActive}
                  collapsed={collapsed}
                  badge={item.badge}
                  onClick={() => onSelectTab(item.id)}
                />
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Branding */}
      {!collapsed && (
        <div className="p-3 border-t border-zinc-200/80 dark:border-zinc-800/80 text-[11px] text-zinc-400 flex items-center justify-between">
          <span>Enterprise Compliant</span>
          <span className="font-mono text-emerald-600 font-bold">v2.4.1</span>
        </div>
      )}
    </aside>
  );
});

Sidebar.displayName = 'Sidebar';
