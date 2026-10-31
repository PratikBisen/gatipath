import React from 'react';

interface AvatarProps {
  name: string;
  seed?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'active' | 'attention' | 'offline' | 'none';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  seed,
  size = 'md',
  status = 'none',
  className = '',
}) => {
  const getInitials = (n: string) => {
    if (seed) return seed;
    const parts = n.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base font-bold',
    xl: 'w-14 h-14 text-lg font-bold',
  }[size];

  const dotSizeClasses = {
    xs: 'w-1.5 h-1.5 ring-1',
    sm: 'w-2 h-2 ring-1.5',
    md: 'w-2.5 h-2.5 ring-2',
    lg: 'w-3 h-3 ring-2',
    xl: 'w-3.5 h-3.5 ring-2',
  }[size];

  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'bg-emerald-600 ring-white';
      case 'attention':
        return 'bg-rose-600 ring-white';
      case 'offline':
        return 'bg-charcoal-light ring-white';
      default:
        return '';
    }
  };

  return (
    <div className={`relative inline-flex shrink-0 select-none ${className}`}>
      <div
        className={`${sizeClasses} rounded-xl bg-canvas-subtle border border-border text-charcoal font-heading font-bold flex items-center justify-center tracking-tight shadow-2xs`}
      >
        {getInitials(name)}
      </div>

      {status !== 'none' && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 rounded-full ${dotSizeClasses} ${getStatusColor()}`}
        />
      )}
    </div>
  );
};
