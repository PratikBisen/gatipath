import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  badge?: {
    text: string;
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  };
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'accent';
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  badge,
  icon: Icon,
  variant = 'default',
  onClick,
  className = ''
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          card: 'border-rose-200/90 hover:border-rose-300',
          iconBg: 'bg-rose-50 text-rose-700 border border-rose-200/60',
          value: 'text-charcoal',
        };
      case 'success':
        return {
          card: 'border-emerald-200/90 hover:border-emerald-300',
          iconBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
          value: 'text-charcoal',
        };
      case 'warning':
        return {
          card: 'border-amber-200/90 hover:border-amber-300',
          iconBg: 'bg-amber-50 text-amber-700 border border-amber-200/60',
          value: 'text-charcoal',
        };
      case 'accent':
        return {
          card: 'border-accent/30 hover:border-accent/50',
          iconBg: 'bg-accent-light text-accent border border-accent/20',
          value: 'text-charcoal',
        };
      default:
        return {
          card: 'border-border hover:border-border/80',
          iconBg: 'bg-canvas-subtle text-charcoal-muted border border-border/60',
          value: 'text-charcoal',
        };
    }
  };

  const getBadgeStyles = (bVariant: string = 'default') => {
    switch (bVariant) {
      case 'danger':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'success':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'warning':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'info':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-canvas text-charcoal-muted border-border';
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      onClick={onClick}
      className={`bg-surface rounded-xl p-5 border shadow-card transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-card-hover' : ''
      } ${styles.card} ${className}`}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
          {label}
        </span>
        <div className={`p-2 rounded-lg shrink-0 ${styles.iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className={`text-2xl sm:text-3xl font-heading font-extrabold tracking-tight ${styles.value}`}>
          {value}
        </span>
        {badge && (
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getBadgeStyles(
              badge.variant
            )}`}
          >
            {badge.text}
          </span>
        )}
      </div>

      {subtext && (
        <p className="text-xs text-charcoal-muted mt-1.5 line-clamp-1 leading-normal font-normal">
          {subtext}
        </p>
      )}
    </div>
  );
};
