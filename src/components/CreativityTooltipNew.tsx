import React, { useState, useRef } from 'react';
import { Info } from 'lucide-react';
import { createPortal } from 'react-dom';

export function CreativityTooltipNew() {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Calculate position for portal
    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top + window.scrollY,
        left: rect.left + rect.width / 2 + window.scrollX
      });
    }
    
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      timeoutRef.current = null;
    }, 200);
  };

  return (
    <>
      <div 
        ref={iconRef}
        className="relative inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Info 
          className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help transition-colors"
        />
      </div>
      
      {isVisible && createPortal(
        <div 
          className="fixed transition-all duration-200 opacity-100 pointer-events-none"
          style={{ 
            top: `${position.top}px`,
            left: `${position.left}px`,
            transform: 'translate(-50%, calc(-100% - 12px))',
            zIndex: 999999,
            filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))'
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Tooltip content */}
          <div 
            className="bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 relative"
            style={{ 
              width: '300px',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="space-y-2 text-xs">
              <p className="text-gray-900 dark:text-gray-100 font-semibold mb-2">
                Creativity Level Guide
              </p>
              <div className="space-y-1.5">
                <p className="leading-snug">
                  <span className="font-semibold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                    Conservative:{' '}
                  </span>
                  <span className="text-gray-700 dark:text-gray-200">
                    AI gives consistent, predictable responses. Best for professional, fact-based interactions.
                  </span>
                </p>
                <p className="leading-snug">
                  <span className="font-semibold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">
                    Balanced:{' '}
                  </span>
                  <span className="text-gray-700 dark:text-gray-200">
                    AI mixes accuracy with natural variety. Ideal for most customer conversations.
                  </span>
                </p>
                <p className="leading-snug">
                  <span className="font-semibold bg-gradient-to-r from-pink-600 to-pink-500 bg-clip-text text-transparent">
                    Creative:{' '}
                  </span>
                  <span className="text-gray-700 dark:text-gray-200">
                    AI explores diverse responses and creative solutions. More dynamic and engaging.
                  </span>
                </p>
              </div>
            </div>

            {/* Custom Arrow Pointer */}
            <div 
              className="absolute left-1/2 -bottom-2 w-4 h-4 bg-white dark:bg-gray-900 border-r-2 border-b-2 border-gray-300 dark:border-gray-600"
              style={{
                transform: 'translateX(-50%) rotate(45deg)',
              }}
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}