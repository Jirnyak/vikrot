import React from 'react';

interface Props {
  label: string;
  value: number;
  max: number;
  color: string;
  emoji: string;
  warning?: number;
  danger?: number;
}

export const StatBar: React.FC<Props> = ({ label, value, max, color, emoji, warning = 25, danger = 10 }) => {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const isDanger = value <= danger;
  const isWarning = value <= warning;
  const barColor = isDanger ? 'bg-red-600 animate-pulse' : isWarning ? 'bg-yellow-500' : color;

  return (
    <div className="flex items-center gap-1.5 text-xs">
      <span className="w-5 text-center">{emoji}</span>
      <span className="w-20 truncate font-medium text-gray-300">{label}</span>
      <div className="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden relative">
        <div className={`h-full rounded-full transition-all duration-300 ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`w-8 text-right font-mono ${isDanger ? 'text-red-400 font-bold' : 'text-gray-400'}`}>{Math.round(value)}</span>
    </div>
  );
};
