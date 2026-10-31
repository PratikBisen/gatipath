import React from 'react';

export type StatusVariant =
  | 'needs_support'
  | 'developing'
  | 'almost_mastered'
  | 'mastered'
  | 'pending'
  | 'in_progress'
  | 'completed';

interface StatusPillProps {
  status: StatusVariant | string;
  label?: string;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export const StatusPill: React.FC<StatusPillProps> = ({
  status,
  label,
  size = 'sm',
  className = '',
}) => {
  const normalized = status.toLowerCase().replace(/[\s-]/g, '_');

  const getDetails = (): { text: string; style: string; dot: string } => {
    switch (normalized) {
      case 'mastered':
        return {
          text: label || 'Mastered',
          style: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
          dot: 'bg-emerald-600',
        };
      case 'almost_mastered':
      case 'on_track':
      case 'ready_for_test':
        return {
          text: label || (normalized === 'ready_for_test' ? 'Ready for Test' : 'On Track'),
          style: 'bg-teal-50 text-teal-800 border-teal-200/80',
          dot: 'bg-teal-600',
        };
      case 'developing':
      case 'in_progress':
        return {
          text: label || 'Developing',
          style: 'bg-amber-50 text-amber-800 border-amber-200/80',
          dot: 'bg-amber-600',
        };
      case 'needs_support':
      case 'struggling':
      case 'flagged':
        return {
          text: label || 'Needs Support',
          style: 'bg-rose-50 text-rose-800 border-rose-200/80',
          dot: 'bg-rose-600',
        };
      case 'pending':
        return {
          text: label || 'Pending Action',
          style: 'bg-amber-50 text-amber-800 border-amber-200/80',
          dot: 'bg-amber-600',
        };
      case 'completed':
        return {
          text: label || 'Completed',
          style: 'bg-canvas-subtle text-charcoal-muted border-border',
          dot: 'bg-charcoal-light',
        };
      default:
        return {
          text: label || status,
          style: 'bg-canvas-subtle text-charcoal-muted border-border',
          dot: 'bg-charcoal-light',
        };
    }
  };

  const { text, style, dot } = getDetails();

  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5 gap-1',
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border shadow-2xs select-none ${style} ${sizeClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
      <span className="leading-none">{text}</span>
    </span>
  );
};
