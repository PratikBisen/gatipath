import React from 'react';
import { getMasteryLabel } from '../../engine/mastery';

interface MasteryBadgeProps {
  score: number;
  showPercent?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const MasteryBadge: React.FC<MasteryBadgeProps> = ({
  score,
  showPercent = true,
  size = 'md'
}) => {
  const { label, badgeColor } = getMasteryLabel(score);

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${badgeColor} ${sizeClasses} select-none`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{label}</span>
      {showPercent && (
        <span className="font-semibold opacity-90">({score}%)</span>
      )}
    </span>
  );
};
