import React from 'react';
import { getMasteryLabel } from '../../engine/mastery';

interface MasteryBadgeProps {
  score: number;
  showPercent?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const MasteryBadge: React.FC<MasteryBadgeProps> = ({
  score,
  showPercent = true,
  size = 'md',
  className = ''
}) => {
  const { label } = getMasteryLabel(score);

  // High-contrast, clean semantic palette
  const getStyle = () => {
    if (score >= 85) {
      return 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
    }
    if (score >= 70) {
      return 'bg-teal-50 text-teal-800 border-teal-200/80';
    }
    if (score >= 40) {
      return 'bg-amber-50 text-amber-800 border-amber-200/80';
    }
    return 'bg-rose-50 text-rose-800 border-rose-200/80';
  };

  const getDotColor = () => {
    if (score >= 85) return 'bg-emerald-600';
    if (score >= 70) return 'bg-teal-600';
    if (score >= 40) return 'bg-amber-600';
    return 'bg-rose-600';
  };

  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5 gap-1',
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2'
  }[size];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border shadow-2xs select-none ${getStyle()} ${sizeClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getDotColor()}`} />
      <span className="leading-none">{label}</span>
      {showPercent && (
        <span className="font-semibold tabular-nums opacity-90 leading-none">
          {score}%
        </span>
      )}
    </span>
  );
};
