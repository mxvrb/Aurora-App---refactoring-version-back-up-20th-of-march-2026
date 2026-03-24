import React, { useState, useEffect } from 'react';
import { Monitor } from 'lucide-react';

interface ScreenTooSmallProps {
  isDarkMode: boolean;
}

export function ScreenTooSmall({ isDarkMode }: ScreenTooSmallProps) {
  const [currentWidth, setCurrentWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setCurrentWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`fixed inset-0 z-[99999] flex items-center justify-center ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800' 
        : 'bg-gray-50'
    }`}>
      <div className="flex flex-col items-center justify-center px-8 max-w-md text-center">
        {/* Monitor Icon */}
        <div className={`w-24 h-24 rounded-full mb-6 flex items-center justify-center ${
          isDarkMode
            ? 'bg-gray-800/50 border border-gray-700'
            : 'bg-white border border-gray-200'
        } shadow-lg`}>
          <Monitor className={`w-12 h-12 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`} />
        </div>

        {/* Heading */}
        <h1 className={`text-2xl font-semibold mb-3 ${
          isDarkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>
          Screen Too Small
        </h1>

        {/* Description */}
        <p className={`text-base mb-6 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          This application requires a larger screen. Please use a desktop or laptop for the best experience.
        </p>

        {/* Width Requirements */}
        <div className={`w-full rounded-xl p-4 ${
          isDarkMode
            ? 'bg-gray-800/50 border border-gray-700'
            : 'bg-white border border-gray-200'
        }`}>
          <div className={`flex justify-between items-center mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <span className="text-sm">Minimum width:</span>
            <span className="font-medium">1024px</span>
          </div>
          <div className={`flex justify-between items-center ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <span className="text-sm">Current width:</span>
            <span className="font-medium">{currentWidth}px</span>
          </div>
        </div>
      </div>
    </div>
  );
}