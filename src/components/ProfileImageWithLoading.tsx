import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ProfileImageWithLoadingProps {
  src: string;
  alt: string;
  className?: string;
  isEditMode?: boolean;
  onRemove?: () => void;
}

export const ProfileImageWithLoading: React.FC<ProfileImageWithLoadingProps> = ({ 
  src, 
  alt, 
  className = "w-full h-full object-cover",
  isEditMode = false,
  onRemove
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="w-full h-full relative">
      {/* Loading indicator - shown while image is loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full">
          <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Actual image - starts hidden and fades in when loaded */}
      <img 
        src={src}
        alt={alt}
        className={`${className} transition-all duration-500 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(false);
        }}
        style={{ display: hasError ? 'none' : 'block' }}
        loading="eager"
      />

      {/* Remove button - only shown in edit mode */}
      {isEditMode && onRemove && (
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 border border-gray-200 dark:border-gray-500 rounded-full flex items-center justify-center shadow-lg transition-colors duration-200 z-[99999]"
          title="Remove profile picture"
        >
          <X className="w-3 h-3 text-red-700 dark:text-red-500" />
        </button>
      )}
    </div>
  );
};