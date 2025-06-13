import React from 'react';

interface PlayerAvatarProps {
  name: string;
  color: string;
  emoji: string;
  initials: string;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  isActive?: boolean;
  score?: number;
}

const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  name,
  color,
  emoji,
  initials,
  size = 'md',
  showName = false,
  isActive = false,
  score
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg'
  };

  return (
    <div className={`flex items-center ${showName ? 'gap-3' : ''}`}>
      <div className="relative">
        {/* Avatar Circle */}
        <div
          className={`relative rounded-full flex items-center justify-center font-bold transition-transform ${
            sizeClasses[size]
          } ${isActive ? 'ring-2 ring-yellow-400 ring-offset-2' : ''}`}
          style={{ backgroundColor: color }}
        >
          <span className="text-white drop-shadow-md">
            {emoji || initials}
          </span>
        </div>

        {/* Active Indicator */}
        {isActive && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center">
            <span className="text-[8px]">✏️</span>
          </div>
        )}

        {/* Score Badge */}
        {typeof score !== 'undefined' && score > 0 && (
          <div className="absolute -top-1 -right-1">
            <div className="bg-indigo-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
              {score}
            </div>
          </div>
        )}
      </div>

      {/* Name */}
      {showName && (
        <div className="flex flex-col">
          <span className="font-medium text-gray-800">{name}</span>
          {typeof score !== 'undefined' && (
            <span className="text-xs text-gray-500">
              {score} {score === 1 ? 'point' : 'points'}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerAvatar; 
