import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-surface rounded-xl border border-border shadow-card ${
        hoverable || onClick ? 'hover:shadow-card-hover hover:border-primary/40 cursor-pointer' : ''
      } transition-all duration-200 ${className}`}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
  badge,
  className = '',
}) => {
  return (
    <div className={`p-5 pb-4 border-b border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${className}`}>
      <div>
        <div className="flex items-center gap-2">
          {typeof title === 'string' ? (
            <h3 className="text-base font-heading font-bold text-charcoal">
              {title}
            </h3>
          ) : (
            title
          )}
          {badge}
        </div>
        {subtitle && (
          <p className="text-xs text-charcoal-muted mt-0.5 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <div className={`p-5 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`p-4 px-5 border-t border-border/80 bg-canvas-subtle/50 rounded-b-xl flex items-center justify-between text-xs text-charcoal-muted ${className}`}>
      {children}
    </div>
  );
};
