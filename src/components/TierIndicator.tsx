import React from 'react';

interface TierIndicatorProps {
  tier: 'basic' | 'pro' | 'premium' | 'enterprise' | 'free';
  className?: string;
}

export const TierIndicator: React.FC<TierIndicatorProps> = ({ tier, className = '' }) => {
  const getTierColor = (tierType: string) => {
    switch (tierType) {
      case 'free':
        return 'text-white bg-blue-600';
      case 'basic':
        return 'text-white';
      case 'pro':
        return 'text-white bg-purple-500';
      case 'premium':
        return 'text-white';
      case 'enterprise':
        return 'text-blue-600 bg-white border border-blue-600';
      default:
        return 'text-white bg-gray-500';
    }
  };

  // Protection event handlers
  const preventSelection = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  return (
    <div 
      className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full font-medium capitalize select-none ${getTierColor(tier)} ${className}`}
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitUserDrag: 'none',
        KhtmlUserSelect: 'none',
        MozUserDrag: 'none',
        touchAction: 'none',
        minWidth: 'fit-content',
        fontSize: '8px',
        lineHeight: '10px',
        ...(tier === 'premium' && { backgroundColor: '#C68C33' }),
        ...(tier === 'basic' && { backgroundColor: '#AF0C0C' })
      }}
      onContextMenu={preventSelection}
      onDragStart={preventSelection}
      onMouseDown={preventSelection}
      onDrag={preventSelection}
      onDragEnd={preventSelection}
      onDrop={preventSelection}
      onDragOver={preventSelection}
      onDragEnter={preventSelection}
      onDragLeave={preventSelection}
    >
      <span 
        className="select-none"
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          WebkitTouchCallout: 'none',
          touchAction: 'none'
        }}
      >
        {tier}
      </span>
    </div>
  );
};