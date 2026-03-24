import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

interface AutoResizeTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  minHeight?: number;
}

export const AutoResizeTextarea = forwardRef<HTMLTextAreaElement, AutoResizeTextareaProps>(
  ({ value, onChange, placeholder, className, id, minHeight = 100 }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

    const adjustHeight = () => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      // Set height to 0 to get accurate scrollHeight
      textarea.style.height = '0px';
      
      // Calculate the required height
      const scrollHeight = textarea.scrollHeight;
      
      // Set the height to either scrollHeight or minHeight, whichever is larger
      const newHeight = Math.max(scrollHeight, minHeight);
      textarea.style.height = `${newHeight}px`;
    };

    // Adjust height when value changes
    useEffect(() => {
      adjustHeight();
    }, [value]);

    // Adjust height on mount and after a delay to ensure DOM is ready
    useEffect(() => {
      // Multiple timings to catch different rendering scenarios
      const timers = [
        setTimeout(adjustHeight, 0),
        setTimeout(adjustHeight, 50),
        setTimeout(adjustHeight, 150),
        setTimeout(adjustHeight, 300)
      ];

      return () => {
        timers.forEach(timer => clearTimeout(timer));
      };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
      // Adjust height immediately on input
      requestAnimationFrame(adjustHeight);
    };

    return (
      <textarea
        ref={textareaRef}
        id={id}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={className}
        style={{
          minHeight: `${minHeight}px`,
          lineHeight: '1.5',
          resize: 'none',
          overflow: 'hidden'
        }}
      />
    );
  }
);

AutoResizeTextarea.displayName = 'AutoResizeTextarea';
