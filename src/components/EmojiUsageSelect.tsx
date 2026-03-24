import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import Check1 from '../imports/Check';

interface EmojiUsageSelectProps {
  value: 'none' | 'light' | 'medium' | 'heavy';
  onChange: (value: 'none' | 'light' | 'medium' | 'heavy') => void;
}

const options = [
  { value: 'none' as const, label: 'None', description: 'No emojis' },
  { value: 'light' as const, label: 'Light', description: 'Occasional emojis' },
  { value: 'medium' as const, label: 'Medium', description: 'Regular usage' },
  { value: 'heavy' as const, label: 'Heavy', description: 'Frequent emojis' },
];

export function EmojiUsageSelect({ value, onChange }: EmojiUsageSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-full justify-between bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 h-9"
        >
          <span className="text-sm truncate">
            {selectedOption?.label}
          </span>
          <ChevronDown
            className={`ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="p-0" 
        align="start" 
        side="bottom"
        sideOffset={4}
        avoidCollisions={false}
        style={{ width: 'var(--radix-popover-trigger-width)' }}
      >
        <div className="bg-white dark:bg-gray-800">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-900 dark:text-gray-100">
                  {option.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {option.description}
                </div>
              </div>
              {value === option.value && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-3 h-3 [&_svg_path]:fill-white">
                    <Check1 />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}