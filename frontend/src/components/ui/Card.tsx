import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

export type LandingGlowAccent = 'amber' | 'blue' | 'emerald';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'subtle' | 'landing-glow' | 'dashboard-glass';
  accent?: LandingGlowAccent;
  interactive?: boolean;
  selected?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      accent = 'emerald',
      interactive = false,
      selected = false,
      children,
      ...props
    },
    ref
  ) => {
    if (variant === 'landing-glow') {
      const accentClass =
        accent === 'amber'
          ? 'landing-card-amber'
          : accent === 'blue'
          ? 'landing-card-blue'
          : 'landing-card-emerald';

      return (
        <div
          ref={ref}
          tabIndex={interactive ? (props.tabIndex ?? 0) : undefined}
          className={cn(
            'landing-glow-card',
            accentClass,
            selected && 'landing-card-selected',
            interactive && 'cursor-pointer',
            className
          )}
          {...props}
        >
          {/* Internal Decorative Clipped Gradient Layers */}
          <div className="landing-card-glow-bg" aria-hidden="true">
            <div className="landing-card-glow-rest" />
            <div className="landing-card-glow-hover" />
            <div className="landing-card-bottom-rim" />
          </div>

          {/* Content Layer */}
          <div className="landing-card-content h-full">
            {children}
          </div>
        </div>
      );
    }

    if (variant === 'dashboard-glass') {
      return (
        <div
          ref={ref}
          className={cn(
            'dashboard-glass-panel rounded-2xl',
            interactive && 'cursor-pointer interactive',
            className
          )}
          {...props}
        >
          {children}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'glass-card-ios rounded-2xl transition-all duration-300',
          variant === 'subtle' &&
            'bg-white/45 dark:bg-zinc-950/35 border-white/30 dark:border-white/8',
          variant === 'glass' &&
            'bg-white/80 dark:bg-[#12131c]/65 backdrop-blur-3xl border-white/60 dark:border-white/20',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export interface LandingGlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: LandingGlowAccent;
  interactive?: boolean;
  selected?: boolean;
}

export const LandingGlowCard = React.forwardRef<HTMLDivElement, LandingGlowCardProps>(
  ({ className, accent = 'emerald', interactive = false, selected = false, children, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        variant="landing-glow"
        accent={accent}
        interactive={interactive}
        selected={selected}
        className={className}
        {...props}
      >
        {children}
      </Card>
    );
  }
);
LandingGlowCard.displayName = 'LandingGlowCard';

export interface LandingIconTileProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: LandingGlowAccent;
}

export const LandingIconTile: React.FC<LandingIconTileProps> = ({
  accent = 'emerald',
  className,
  children,
  ...props
}) => {
  const accentClass =
    accent === 'amber'
      ? 'landing-card-amber'
      : accent === 'blue'
      ? 'landing-card-blue'
      : 'landing-card-emerald';

  return (
    <div
      className={cn('landing-icon-tile', accentClass, className)}
      {...props}
    >
      {children}
    </div>
  );
};

export interface CardHeaderTitleProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const CardHeaderTitle: React.FC<CardHeaderTitleProps> = ({
  icon: Icon,
  title,
  subtitle,
  badge,
  action,
  className,
}) => {
  return (
    <div className={cn('flex items-center justify-between border-b border-zinc-100 dark:border-white/10 pb-4', className)}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="relative flex items-center justify-center shrink-0 w-8 h-8 rounded-full">
            {/* Rotating Multicolour Ring */}
            <div className="nav-pill-ring" aria-hidden="true" />
            
            {/* Inner Opaque Layer shielding icon */}
            <div className="relative z-10 flex items-center justify-center w-full h-full rounded-full bg-gradient-to-b from-[#181920] to-[#0a0a0d] border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.18)]">
              <Icon className="w-4 h-4 text-zinc-100 drop-shadow-[0_1px_1px_rgba(255,255,255,0.35)] shrink-0" />
            </div>
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              {title}
            </h3>
            {badge}
          </div>
          {subtitle && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {action && (
        <div className="flex items-center gap-2">
          {action}
        </div>
      )}
    </div>
  );
};
