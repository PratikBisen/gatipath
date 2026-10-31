import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  target?: number; // Optional target marker e.g. 85 for mastery
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  className?: string;
  semantic?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  target,
  size = 'md',
  showLabel = false,
  label,
  className = '',
  semantic = true,
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  const getHeightClass = () => {
    switch (size) {
      case 'sm':
        return 'h-1.5';
      case 'lg':
        return 'h-3';
      case 'md':
      default:
        return 'h-2';
    }
  };

  const getBarColor = () => {
    if (!semantic) return 'bg-primary';
    if (clampedValue >= 75) return 'bg-emerald-600';
    if (clampedValue >= 50) return 'bg-amber-600';
    return 'bg-rose-600';
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-charcoal-muted mb-1 font-medium">
          <span>{label || 'Mastery'}</span>
          <span className="font-semibold text-charcoal tabular-nums">{clampedValue}%</span>
        </div>
      )}

      <div className={`relative w-full bg-canvas-subtle rounded-full overflow-hidden border border-border/80 ${getHeightClass()}`}>
        <div
          className={`${getHeightClass()} ${getBarColor()} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${Math.max(2, clampedValue)}%` }}
        />

        {/* Optional target threshold marker */}
        {target !== undefined && target > 0 && target < 100 && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-charcoal/40 z-10"
            style={{ left: `${target}%` }}
            title={`Target: ${target}%`}
          />
        )}
      </div>
    </div>
  );
};
