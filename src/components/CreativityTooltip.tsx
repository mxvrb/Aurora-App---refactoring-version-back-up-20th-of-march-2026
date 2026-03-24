import React, { useState, useRef } from 'react';
import svgPaths from '../imports/svg-sh7h78oygf';
import { Info } from 'lucide-react';

export function CreativityTooltip() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsClosing(false);
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsClosing(true);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      timeoutRef.current = null;
    }, 750);
  };

  return (
    <div 
      ref={containerRef}
      className="relative inline-block z-[100000]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Info 
        className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help transition-colors"
      />
      
      {isVisible && (
        <div 
          className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 transition-all duration-300 pointer-events-auto ${
            isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
          style={{ 
            width: '320px', 
            zIndex: 100000
          }}
        >
          <div className="relative w-full">
            {/* SVG Background */}
            <div className="absolute inset-0" style={{ 
              top: '-18.52%', 
              right: '-3.65%', 
              bottom: '-37.04%', 
              left: '-3.65%',
              zIndex: 1
            }}>
              <svg className="block size-full drop-shadow-xl" fill="none" preserveAspectRatio="none" viewBox="0 0 294 84">
                <g id="Tooltip_Original">
                  <g filter="url(#filter0_d_601_105)" id="Union">
                    <mask fill="white" id="path-1-inside-1_601_105">
                      <path d={svgPaths.p1e6ecf00} />
                    </mask>
                    <path 
                      d={svgPaths.p1e6ecf00} 
                      fill="white" 
                      className="dark:fill-gray-900"
                      fillOpacity="0.98"
                    />
                    <path 
                      d={svgPaths.p348c1080} 
                      fill="#d1d5db" 
                      className="dark:fill-gray-600"
                      mask="url(#path-1-inside-1_601_105)" 
                      strokeWidth="1.5"
                    />
                  </g>
                </g>
                <defs>
                  <filter 
                    colorInterpolationFilters="sRGB" 
                    filterUnits="userSpaceOnUse" 
                    height="84" 
                    id="filter0_d_601_105" 
                    width="294" 
                    x="0" 
                    y="0"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                    <feOffset dy="2" />
                    <feGaussianBlur stdDeviation="8" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
                    <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_601_105" />
                    <feBlend in="SourceGraphic" in2="effect1_dropShadow_601_105" mode="normal" result="shape" />
                  </filter>
                </defs>
              </svg>
            </div>

            {/* Content */}
            <div className="relative px-5 py-3" style={{ zIndex: 2 }}>
              <div className="space-y-2 text-xs">
                <p className="text-gray-900 dark:text-gray-100 font-medium mb-2">Creativity Level Guide</p>
                <div className="space-y-1.5">
                  <p className="leading-snug">
                    <span className="font-semibold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                      Conservative (0-33%):{' '}
                    </span>
                    <span className="text-gray-700 dark:text-gray-200">
                      Precise and factual responses
                    </span>
                  </p>
                  <p className="leading-snug">
                    <span className="font-semibold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">
                      Balanced (34-66%):{' '}
                    </span>
                    <span className="text-gray-700 dark:text-gray-200">
                      Mix of accuracy and variety
                    </span>
                  </p>
                  <p className="leading-snug">
                    <span className="font-semibold bg-gradient-to-r from-pink-600 to-pink-500 bg-clip-text text-transparent">
                      Creative (67-100%):{' '}
                    </span>
                    <span className="text-gray-700 dark:text-gray-200">
                      Varied, imaginative responses
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
