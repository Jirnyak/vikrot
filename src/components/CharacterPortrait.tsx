import React from 'react';

interface Props {
  emoji: string;
  color: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  isViktor?: boolean;
}

export const CharacterPortrait: React.FC<Props> = ({ emoji, color, name, size = 'md', className = '', isViktor }) => {
  const sizes = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl',
    xl: 'w-24 h-24 text-5xl',
  };

  return (
    <div
      className={`rounded-full flex items-center justify-center relative ${sizes[size]} ${className}`}
      style={{
        background: `radial-gradient(circle at 30% 30%, ${color}44, ${color}22)`,
        border: `2px solid ${color}88`,
        boxShadow: `0 0 12px ${color}33`,
      }}
      title={name}
    >
      <span className="select-none">{isViktor ? '🎹' : emoji}</span>
      {isViktor && (
        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-cyan-500 border border-gray-900 flex items-center justify-center text-[8px]">
          В
        </div>
      )}
    </div>
  );
};
