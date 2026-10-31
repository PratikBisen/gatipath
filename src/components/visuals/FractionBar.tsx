import React from 'react';

interface FractionBarProps {
  totalParts: number;
  shadedParts: number[]; // 1-indexed parts that are shaded, e.g. [1, 2]
  labels?: string[];
  subLabel?: string;
  activeColor?: string;
  className?: string;
}

export const FractionBar: React.FC<FractionBarProps> = ({
  totalParts,
  shadedParts,
  labels,
  subLabel,
  activeColor = '#246B50',
  className = ''
}) => {
  const parts = Math.max(1, totalParts);

  return (
    <div className={`flex flex-col items-center my-3 select-none ${className}`}>
      <div className="w-full max-w-md h-12 bg-white rounded-md border-2 border-borderSoft flex overflow-hidden shadow-inner">
        {Array.from({ length: parts }, (_, index) => {
          const partNumber = index + 1;
          const isShaded = shadedParts.includes(partNumber);
          return (
            <div
              key={index}
              style={{
                width: `${100 / parts}%`,
                backgroundColor: isShaded ? activeColor : '#F7F8F5'
              }}
              className={`h-full border-r border-borderSoft last:border-r-0 flex items-center justify-center transition-colors duration-200`}
            >
              <span
                className={`text-xs font-semibold ${
                  isShaded ? 'text-white' : 'text-charcoal-muted'
                }`}
              >
                {labels && labels[index] ? labels[index] : `1/${parts}`}
              </span>
            </div>
          );
        })}
      </div>
      {subLabel && (
        <span className="text-xs font-medium text-charcoal-muted mt-1.5 text-center">
          {subLabel}
        </span>
      )}
    </div>
  );
};
