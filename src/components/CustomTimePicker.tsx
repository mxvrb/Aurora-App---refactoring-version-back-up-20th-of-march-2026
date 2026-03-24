import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CustomTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

// Generate all 30-minute increment times
const generateTimeOptions = (): string[] => {
  const times: string[] = [];
  for (let i = 0; i < 48; i++) {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    times.push(`${hour.toString().padStart(2, '0')}:${minute}`);
  }
  return times;
};

const timeOptions = generateTimeOptions();

export const CustomTimePicker: React.FC<CustomTimePickerProps> = ({ 
  value, 
  onChange, 
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customTime, setCustomTime] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);

  // Check if current value is a custom time (not in standard options)
  useEffect(() => {
    if (value && !timeOptions.includes(value)) {
      setIsCustomMode(true);
      setCustomTime(value);
    } else {
      setIsCustomMode(false);
      setCustomTime('');
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus custom input when custom mode is activated
  useEffect(() => {
    if (isCustomMode && customInputRef.current) {
      customInputRef.current.focus();
    }
  }, [isCustomMode]);

  const handleTimeSelect = (time: string) => {
    onChange(time);
    setIsCustomMode(false);
    setCustomTime('');
    setIsOpen(false);
  };

  const handleCustomClick = () => {
    setIsCustomMode(true);
    setCustomTime('');
    setIsOpen(false);
  };

  const handleExitCustomMode = () => {
    setIsCustomMode(false);
    setCustomTime('');
    setIsOpen(true);
  };

  const formatTimePreview = (input: string): string => {
    // Extract digits
    const digits = input.replace(/[^0-9]/g, '');
    
    if (digits.length === 0) return '00:00';
    if (digits.length === 1) return `0${digits}:00`;
    if (digits.length === 2) return `${digits}:00`;
    if (digits.length === 3) return `${digits.slice(0, 2)}:${digits[2]}0`;
    if (digits.length >= 4) {
      const hours = digits.slice(0, 2);
      const mins = digits.slice(2, 4);
      return `${hours}:${mins}`;
    }
    return '00:00';
  };

  const handleCustomTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Extract digits only
    const digits = input.replace(/[^0-9]/g, '');
    
    // Limit to 4 digits (HHMM)
    const limitedDigits = digits.slice(0, 4);
    
    // Validate each digit position
    let validDigits = '';
    for (let i = 0; i < limitedDigits.length; i++) {
      const digit = limitedDigits[i];
      
      if (i === 0) {
        // First digit: 0-2 only
        if (digit >= '0' && digit <= '2') validDigits += digit;
      } else if (i === 1) {
        // Second digit: depends on first digit
        if (validDigits[0] === '2') {
          // 20-23
          if (digit >= '0' && digit <= '3') validDigits += digit;
        } else {
          // 00-19
          if (digit >= '0' && digit <= '9') validDigits += digit;
        }
      } else if (i === 2) {
        // Third digit: 0-5 only (minutes tens)
        if (digit >= '0' && digit <= '5') validDigits += digit;
      } else if (i === 3) {
        // Fourth digit: 0-9 (minutes ones)
        if (digit >= '0' && digit <= '9') validDigits += digit;
      }
    }
    
    // Format with colon
    let formatted = validDigits;
    if (validDigits.length >= 3) {
      formatted = validDigits.slice(0, 2) + ':' + validDigits.slice(2);
    }
    
    setCustomTime(formatted);
    
    // If we have complete time, update the value
    if (validDigits.length === 4) {
      const hoursNum = parseInt(validDigits.slice(0, 2));
      const mins = validDigits.slice(2, 4);
      
      // Validate hours is 00-23
      if (hoursNum >= 0 && hoursNum <= 23) {
        const formattedTime = `${hoursNum.toString().padStart(2, '0')}:${mins}`;
        onChange(formattedTime);
      }
    }
  };

  const handleCustomTimeBlur = () => {
    if (customTime) {
      const digits = customTime.replace(/[^0-9]/g, '');
      
      if (digits.length === 4) {
        const hoursNum = parseInt(digits.slice(0, 2));
        const mins = digits.slice(2, 4);
        
        if (hoursNum >= 0 && hoursNum <= 23) {
          const formattedTime = `${hoursNum.toString().padStart(2, '0')}:${mins}`;
          onChange(formattedTime);
          return;
        }
      }
    }
    
    // If invalid or empty, revert to non-custom mode
    setIsCustomMode(false);
    setCustomTime('');
  };

  const validateTimeFormat = (time: string): boolean => {
    // Basic validation for military time format like "11:15" or "09:40" or "23:59"
    const timeRegex = /^([01][0-9]|2[0-3]):([0-5][0-9])$/;
    return timeRegex.test(time);
  };

  const displayValue = isCustomMode ? customTime : value;
  const previewTime = isCustomMode ? formatTimePreview(customTime) : '';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      {!isCustomMode ? (
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-28 h-8 px-3 flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm transition-colors ${
            disabled 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer'
          } ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}
        >
          <span className="text-gray-900 dark:text-gray-100 truncate">
            {value || 'Select'}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      ) : (
        <div className="relative">
          <input
            ref={customInputRef}
            type="text"
            value={customTime}
            onChange={handleCustomTimeChange}
            onBlur={handleCustomTimeBlur}
            placeholder={previewTime}
            disabled={disabled}
            className={`w-28 h-8 px-3 pr-8 bg-white dark:bg-gray-800 border border-blue-500 dark:border-blue-500 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
          {/* Exit Custom Mode Button */}
          <button
            type="button"
            onClick={handleExitCustomMode}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            title="Back to dropdown"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-[200000] mt-1 w-28 max-h-64 overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg flex flex-col"
          >
            {/* Custom Option - Sticky at Top */}
            <button
              type="button"
              onClick={handleCustomClick}
              className={`sticky top-0 z-10 w-full px-3 py-2 text-left text-sm flex items-center justify-between border-b border-gray-200 dark:border-gray-700 transition-colors bg-white dark:bg-gray-800 ${
                isCustomMode
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Custom
              </span>
              {isCustomMode && (
                <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              )}
            </button>

            {/* Standard Time Options - Scrollable */}
            <div className="overflow-y-auto max-h-56">
              {timeOptions.map((time, index) => {
                const isSelected = value === time && !isCustomMode;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleTimeSelect(time)}
                    className={`w-full px-3 py-2 text-left text-sm flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span>{time}</span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
