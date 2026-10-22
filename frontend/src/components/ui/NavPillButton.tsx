import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface NavPillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  title: string;
  isActive?: boolean;
  collapsed?: boolean;
  badge?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const NavPillButton = React.forwardRef<HTMLButtonElement, NavPillButtonProps>(
  (
    {
      icon: Icon,
      title,
      isActive = false,
      collapsed = false,
      badge,
      size = 'md',
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        title={collapsed ? title : undefined}
        aria-label={props['aria-label'] || title}
        className={cn(
          'nav-pill-btn group w-full',
          isActive && 'nav-pill-active',
          collapsed
            ? 'w-10 h-10 p-0 justify-center mx-auto'
            : cn(
                'flex items-center text-left',
                size === 'sm' && 'px-2 py-1 gap-2',
                size === 'md' && 'px-2.5 py-1.5 sm:px-3 sm:py-2 gap-2.5 sm:gap-3',
                size === 'lg' && 'px-3.5 py-2.5 gap-3'
              ),
          className
        )}
        {...props}
      >
        {/* Circular Icon Container with Rotating Glow Ring */}
        <div
          className={cn(
            'relative flex items-center justify-center shrink-0 rounded-full',
            size === 'sm' && 'w-6 h-6',
            size === 'md' && 'w-7 h-7 sm:w-8 sm:h-8',
            size === 'lg' && 'w-8 h-8 sm:w-9 sm:h-9'
          )}
        >
          {/* Isolated Continuous Rotating Multicolour Ring */}
          <div className="nav-pill-ring" aria-hidden="true" />

          {/* Opaque Inner Circular Layer: prevents glow from covering icon or text */}
          <div
            className={cn(
              'relative z-10 flex items-center justify-center w-full h-full rounded-full',
              'bg-gradient-to-b from-[#181920] to-[#0a0a0d]',
              'border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.18)]'
            )}
          >
            {/* Stationary Metallic Icon */}
            <Icon
              className={cn(
                'shrink-0 text-zinc-200 group-hover:text-white transition-colors',
                'drop-shadow-[0_1px_1px_rgba(255,255,255,0.35)]',
                size === 'sm' && 'w-3.5 h-3.5',
                size === 'md' && 'w-3.5 h-3.5 sm:w-4 sm:h-4',
                size === 'lg' && 'w-4 h-4 sm:w-4.5 sm:h-4.5'
              )}
            />
          </div>
        </div>

        {/* Existing Title & Badge (Stationary) */}
        {!collapsed && (
          <div className="flex-1 flex items-center justify-between min-w-0 pr-1">
            <span
              className={cn(
                'truncate font-semibold tracking-normal transition-colors',
                size === 'sm' && 'text-[11px]',
                size === 'md' && 'text-xs',
                size === 'lg' && 'text-xs sm:text-sm',
                isActive ? 'text-white' : 'text-zinc-200 group-hover:text-white'
              )}
            >
              {title}
            </span>

            {badge && (
              <span
                className={cn(
                  'text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1.5 shrink-0 transition-colors',
                  isActive
                    ? 'bg-zinc-100 text-zinc-950 shadow-sm border border-white/50'
                    : 'bg-zinc-800/90 text-zinc-400 border border-zinc-700/60'
                )}
              >
                {badge}
              </span>
            )}
          </div>
        )}
      </button>
    );
  }
);

NavPillButton.displayName = 'NavPillButton';
