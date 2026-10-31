import React from 'react';

interface FractionPieProps {
  totalParts: number;
  shadedParts: number[]; // 1-indexed parts that are shaded
  size?: number;
  activeColor?: string;
  className?: string;
}

export const FractionPie: React.FC<FractionPieProps> = ({
  totalParts,
  shadedParts,
  size = 120,
  activeColor = '#246B50',
  className = ''
}) => {
  const radius = size / 2 - 4;
  const center = size / 2;
  const parts = Math.max(1, totalParts);

  const getCoordinatesForPercent = (percent: number) => {
    const x = center + radius * Math.cos(2 * Math.PI * percent);
    const y = center + radius * Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-sm">
        <circle cx={center} cy={center} r={radius} fill="#FFFFFF" stroke="#E4E8E2" strokeWidth="2" />
        {Array.from({ length: parts }, (_, index) => {
          const startPercent = index / parts - 0.25; // start at top (12 o'clock)
          const endPercent = (index + 1) / parts - 0.25;

          const [startX, startY] = getCoordinatesForPercent(startPercent);
          const [endX, endY] = getCoordinatesForPercent(endPercent);

          const largeArcFlag = 1 / parts > 0.5 ? 1 : 0;
          const pathData = [
            `M ${center} ${center}`,
            `L ${startX} ${startY}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
            'Z'
          ].join(' ');

          const isShaded = shadedParts.includes(index + 1);

          return (
            <path
              key={index}
              d={pathData}
              fill={isShaded ? activeColor : '#F7F8F5'}
              stroke="#E4E8E2"
              strokeWidth="1.5"
              className="transition-colors duration-200"
            />
          );
        })}
      </svg>
      <span className="text-xs text-charcoal-muted mt-1 font-medium">
        {shadedParts.length}/{parts} of the whole
      </span>
    </div>
  );
};
