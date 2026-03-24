import React from 'react';

// Animated Loading Dots Component
export const LoadingDots = ({ text = "Logging in" }: { text?: string }) => {
  const [dotCount, setDotCount] = React.useState(1);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDotCount(prev => prev === 3 ? 1 : prev + 1);
    }, 500); // Change dots every 500ms

    return () => clearInterval(interval);
  }, []);

  const dots = '.'.repeat(dotCount);
  
  return (
    <span className="inline-block min-w-[60px] text-left">
      {text}{dots}
    </span>
  );
};

// Image protection utility function
export const getImageProtectionProps = () => ({
  draggable: false,
  onContextMenu: (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  },
  onDragStart: (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  },
  onMouseDown: (e: React.MouseEvent) => {
    if (e.button === 0) { // Only prevent left click drag
      e.preventDefault();
      e.stopPropagation();
    }
    return false;
  },
  onDrag: (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  },
  onDragEnd: (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  },
  onDrop: (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  },
  onDragOver: (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  },
  onDragEnter: (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  },
  onDragLeave: (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  },
  style: {
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    WebkitTouchCallout: 'none',
    WebkitUserDrag: 'none',
    KhtmlUserSelect: 'none',
    MozUserDrag: 'none',
    touchAction: 'none'
  } as React.CSSProperties
});

// Protected Image Component - A wrapper that applies protection to all images
export const ProtectedImg: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({ style, className, ...props }) => {
  const protectionProps = getImageProtectionProps();
  
  // Use useEffect to ensure protection is applied after every render/re-mount
  const imgRef = React.useRef<HTMLImageElement>(null);
  
  React.useEffect(() => {
    const imgElement = imgRef.current;
    if (imgElement) {
      // Force apply all protection properties directly to DOM element
      imgElement.draggable = false;
      imgElement.style.cssText += 'user-select: none !important; -webkit-user-drag: none !important; -webkit-user-select: none !important; -moz-user-select: none !important; -ms-user-select: none !important; touch-action: none !important;';
      
      // Add selectstart event listener directly to DOM (not as React prop)
      const preventSelectStart = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      };
      
      imgElement.addEventListener('selectstart', preventSelectStart);
      
      return () => {
        imgElement.removeEventListener('selectstart', preventSelectStart);
      };
    }
  });
  
  return (
    <img
      {...props}
      ref={imgRef}
      {...protectionProps}
      className={`${className || ''} select-none`}
      style={{
        ...protectionProps.style,
        ...style
      }}
    />
  );
};
