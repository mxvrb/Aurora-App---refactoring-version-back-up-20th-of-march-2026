import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface CustomDateRangeSelectorProps {
  selectedDateRange: string;
  customStartDate?: Date;
  customEndDate?: Date;
  onDateRangeChange: (value: string) => void;
  onSelectDatesClick: () => void;
  isDarkMode: boolean;
}

const CustomDateRangeSelector: React.FC<CustomDateRangeSelectorProps> = ({
  selectedDateRange,
  customStartDate,
  customEndDate,
  onDateRangeChange,
  onSelectDatesClick,
  isDarkMode
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const options = [
    { value: 'this-week', label: 'This Week' },
    { value: 'last-week', label: 'Last Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'last-month', label: 'Last Month' },
    { value: 'select-dates', label: 'Select Dates' },
  ];

  const getDisplayValue = () => {
    if (selectedDateRange === 'custom-dates' && customStartDate && customEndDate) {
      return 'Custom';
    }
    
    const option = options.find(opt => opt.value === selectedDateRange);
    return option ? option.label : 'This Week';
  };

  const handleOptionClick = (value: string) => {
    if (value === 'select-dates') {
      onSelectDatesClick();
    } else if (value !== 'custom') {
      onDateRangeChange(value);
    }
    setIsOpen(false);
  };

  const getCurrentValue = () => {
    if (selectedDateRange === 'custom-dates') {
      return 'custom';
    }
    return selectedDateRange;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-32 h-10 px-3 flex items-center justify-between text-left rounded-md border transition-colors ${
          isDarkMode
            ? 'bg-gray-800 border-gray-600 text-gray-100 hover:bg-gray-700'
            : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
        } shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
      >
        <span className="text-sm font-medium truncate">
          {getDisplayValue()}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute top-full left-0 mt-1 w-full rounded-md border shadow-lg z-50 py-1 ${
          isDarkMode
            ? 'bg-gray-900 border-gray-700'
            : 'bg-white border-gray-200'
        }`}>
          {options.map((option) => {
            const isSelected = getCurrentValue() === option.value;
            
            return (
              <button
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
                className={`w-full px-3 py-2 text-left text-sm flex items-center justify-between transition-colors ${
                  isDarkMode
                    ? 'text-gray-100 hover:bg-gray-800'
                    : 'text-gray-900 hover:bg-gray-50'
                } ${isSelected ? (isDarkMode ? 'bg-gray-800' : 'bg-gray-50') : ''}`}
              >
                <span>{option.label}</span>
                {isSelected && (
                  <Check className={`w-4 h-4 ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomDateRangeSelector;