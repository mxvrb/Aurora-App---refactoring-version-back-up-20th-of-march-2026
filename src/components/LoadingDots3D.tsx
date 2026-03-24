import React, { useState, useEffect } from 'react';

interface LoadingDots3DProps {
  className?: string;
}

export const LoadingDots3D: React.FC<LoadingDots3DProps> = ({ className = '' }) => {
  const [activeDot, setActiveDot] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDot(prev => prev === 3 ? 1 : prev + 1);
    }, 200); // Fast but smooth - like iPhone messaging indicator

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      {[1, 2, 3].map((dotIndex) => (
        <div
          key={dotIndex}
          className={`
            w-2 h-2 rounded-full transition-all duration-150 ease-out
            ${dotIndex === activeDot 
              ? 'opacity-100 scale-110 transform translate-y-0' 
              : 'opacity-40 scale-80 transform translate-y-0'
            }
            shadow-sm
            relative
          `}
          style={{
            background: dotIndex === activeDot 
              ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 50%, #4b5563 100%)' 
              : 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 50%, #6b7280 100%)',
            boxShadow: dotIndex === activeDot 
              ? '0 2px 4px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)' 
              : '0 1px 2px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        >
          {/* 3D highlight effect */}
          <div 
            className="absolute top-0.5 left-0.5 w-1 h-1 rounded-full bg-white opacity-40"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6) 0%, transparent 60%)'
            }}
          />
        </div>
      ))}
    </div>
  );
};