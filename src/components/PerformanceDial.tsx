import React from 'react';
import lightDialImage from 'figma:asset/e7d7c7c2966484419543840c53fb5a4e0fcf13ee.png';
import darkDialImage from 'figma:asset/cf24d4b2e20a15517df0ad783ec7725a2446262f.png';
import Frame3 from '../imports/Frame3-751-142';

interface PerformanceDialProps {
  className?: string;
}

export const PerformanceDial: React.FC<PerformanceDialProps> = ({ className = "w-12 h-12" }) => {
  // Prevent all image interaction events
  const handleImageInteraction = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle selectstart events using useEffect and addEventListener
  const lightImageRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    const preventSelectStart = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const lightImg = lightImageRef.current;

    if (lightImg) {
      lightImg.addEventListener('selectstart', preventSelectStart, { passive: false });
    }

    return () => {
      if (lightImg) {
        lightImg.removeEventListener('selectstart', preventSelectStart);
      }
    };
  }, []);

  return (
    <div className={className}>
      {/* Light mode image */}
      <img 
        ref={lightImageRef}
        src={lightDialImage}
        alt="Performance Dial"
        className="w-full h-full object-contain dark:hidden select-none pointer-events-none"
        draggable={false}
        onContextMenu={handleImageInteraction}
        onDragStart={handleImageInteraction}
        onMouseDown={handleImageInteraction}
        onDrop={handleImageInteraction}
        onDragOver={handleImageInteraction}
        onDragEnter={handleImageInteraction}
        onDragLeave={handleImageInteraction}
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          WebkitTouchCallout: 'none',
          WebkitUserDrag: 'none',
          KhtmlUserSelect: 'none',
          pointerEvents: 'none'
        }}
      />
      {/* Dark mode dial - Frame3 SVG */}
      <div 
        className="w-full h-full hidden dark:block select-none pointer-events-none"
        onContextMenu={handleImageInteraction}
        onDragStart={handleImageInteraction}
        onMouseDown={handleImageInteraction}
        onDrop={handleImageInteraction}
        onDragOver={handleImageInteraction}
        onDragEnter={handleImageInteraction}
        onDragLeave={handleImageInteraction}
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          WebkitTouchCallout: 'none',
          WebkitUserDrag: 'none',
          KhtmlUserSelect: 'none',
          pointerEvents: 'none',
          '--fill-0': '#4b5563',
          '--stroke-0': '#4b5563'
        } as React.CSSProperties}
      >
        <Frame3 />
      </div>
    </div>
  );
};