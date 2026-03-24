import React, { useState, useEffect } from 'react';

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  shouldAnimate: boolean;
  suffix?: string;
  decimals?: number;
  onComplete?: () => void;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  target,
  duration = 2000,
  shouldAnimate,
  suffix = '',
  decimals = 0,
  onComplete
}) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!shouldAnimate) {
      setCurrent(target);
      return;
    }

    setCurrent(0);
    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateCounter = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Use easeOut animation curve for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const value = target * easeOut;
      
      setCurrent(value);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setCurrent(target);
        onComplete?.();
      }
    };

    requestAnimationFrame(updateCounter);
  }, [target, duration, shouldAnimate, onComplete]);

  const formatValue = (value: number) => {
    if (decimals > 0) {
      return value.toFixed(decimals);
    }
    return Math.floor(value).toString();
  };

  return (
    <span>
      {formatValue(current)}{suffix}
    </span>
  );
};