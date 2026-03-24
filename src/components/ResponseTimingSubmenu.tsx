import React from 'react';
import { ChevronLeft, Check, Plus, Minus, X } from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from "sonner";

export interface ResponseTimingSubmenuProps {
  handleNavigationAttempt: (target: string | null) => void;
  tempResponseTiming: 'instant' | 'natural' | 'delayed' | 'random' | 'custom';
  setTempResponseTiming: React.Dispatch<React.SetStateAction<'instant' | 'natural' | 'delayed' | 'random' | 'custom'>>;
  tempRandomTimingPattern: Array<{ value: number; unit: string }>;
  setTempRandomTimingPattern: React.Dispatch<React.SetStateAction<Array<{ value: number; unit: string }>>>;
  setResponseTiming: React.Dispatch<React.SetStateAction<'instant' | 'natural' | 'delayed' | 'random' | 'custom'>>;
  setActiveSubmenu: (submenu: string | null) => void;
  onSave?: () => void;
}

export function ResponseTimingSubmenu(props: ResponseTimingSubmenuProps) {
  const {
    handleNavigationAttempt,
    tempResponseTiming, setTempResponseTiming,
    tempRandomTimingPattern, setTempRandomTimingPattern,
    setResponseTiming, setActiveSubmenu,
    onSave,
  } = props;

  const timingOptions = [
    { value: 'instant', label: 'Instant', desc: 'Respond immediately without delay' },
    { value: 'natural', label: 'Natural', desc: 'Add slight typing delay for human feel' },
    { value: 'delayed', label: 'Delayed', desc: 'Wait 2-5 seconds before responding' },
    { value: 'random', label: 'Random', desc: 'Vary response times for more human-like behavior' },
  ];

  return (
    <div className="w-full bg-white dark:bg-gray-800">
      {/* Header with Back Button */}
      <div 
        onClick={() => handleNavigationAttempt('edit-template')}
        style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
        className="flex items-center px-6 mx-4 mt-3 mb-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg"
      >
        <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-2" />
        <span className="font-medium text-gray-900 dark:text-gray-100">Adjust Response Timing</span>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="space-y-4">
          <div>
            <Label className="text-gray-900 dark:text-gray-100">Response Speed</Label>
            <div className="space-y-2 mt-4 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
              {timingOptions.map((opt) => (
                <div 
                  key={opt.value}
                  onClick={() => setTempResponseTiming(opt.value as 'instant' | 'natural' | 'delayed' | 'random' | 'custom')}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    tempResponseTiming === opt.value 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{opt.label}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{opt.desc}</p>
                    </div>
                    {tempResponseTiming === opt.value && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 pb-4">
            <div className="flex items-center gap-3 mb-4">
              <Checkbox 
                id="custom-pattern-checkbox"
                checked={tempResponseTiming === 'custom'}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setTempResponseTiming('custom');
                  } else {
                    setTempResponseTiming('instant');
                  }
                }}
                className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 data-[state=checked]:!bg-blue-500 data-[state=checked]:!border-blue-500 data-[state=checked]:!text-white"
              />
              <div className="flex-1">
                <Label htmlFor="custom-pattern-checkbox" className="text-gray-900 dark:text-gray-100 cursor-pointer">Custom Pattern</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Create a repeating delay pattern. The AI will cycle through each step in order before repeating.
                </p>
              </div>
            </div>
            
            {tempResponseTiming === 'custom' && (
            <div className="space-y-3">
              {tempRandomTimingPattern.map((pattern, index) => {
                let intervalRef: NodeJS.Timeout | null = null;
                
                const handleMouseDown = (increment: boolean) => {
                  const updateValue = () => {
                    const newPattern = [...tempRandomTimingPattern];
                    if (increment) {
                      newPattern[index].value = Math.min(999, newPattern[index].value + 1);
                    } else {
                      newPattern[index].value = Math.max(1, newPattern[index].value - 1);
                    }
                    setTempRandomTimingPattern(newPattern);
                  };
                  
                  const timeoutId = setTimeout(() => {
                    intervalRef = setInterval(updateValue, 100);
                  }, 300);
                  
                  return () => {
                    clearTimeout(timeoutId);
                    if (intervalRef) clearInterval(intervalRef);
                  };
                };
                
                return (
                <div key={index} className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTempResponseTiming('custom');
                      const newPattern = [...tempRandomTimingPattern];
                      newPattern[index].value = Math.max(1, pattern.value - 1);
                      setTempRandomTimingPattern(newPattern);
                    }}
                    onMouseDown={(e) => {
                      setTempResponseTiming('custom');
                      const cleanup = handleMouseDown(false);
                      const handleMouseUp = () => {
                        cleanup();
                        document.removeEventListener('mouseup', handleMouseUp);
                      };
                      document.addEventListener('mouseup', handleMouseUp);
                    }}
                    className="h-9 w-9 p-0 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  
                  <Input
                    type="number"
                    min="1"
                    max="999"
                    value={pattern.value}
                    onFocus={() => setTempResponseTiming('custom')}
                    onChange={(e) => {
                      setTempResponseTiming('custom');
                      const newPattern = [...tempRandomTimingPattern];
                      newPattern[index].value = parseInt(e.target.value) || 1;
                      setTempRandomTimingPattern(newPattern);
                    }}
                    className="w-20 h-9 text-center bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTempResponseTiming('custom');
                      const newPattern = [...tempRandomTimingPattern];
                      newPattern[index].value = Math.min(999, pattern.value + 1);
                      setTempRandomTimingPattern(newPattern);
                    }}
                    onMouseDown={(e) => {
                      setTempResponseTiming('custom');
                      const cleanup = handleMouseDown(true);
                      const handleMouseUp = () => {
                        cleanup();
                        document.removeEventListener('mouseup', handleMouseUp);
                      };
                      document.addEventListener('mouseup', handleMouseUp);
                    }}
                    className="h-9 w-9 p-0 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  
                  {/* Pill-like Unit Selector */}
                  <div className="flex bg-gray-100 dark:bg-gray-800 rounded-full p-1 flex-1">
                    {['seconds', 'minutes', 'hours'].map((unit) => (
                      <button
                        key={unit}
                        onClick={() => {
                          setTempResponseTiming('custom');
                          const newPattern = [...tempRandomTimingPattern];
                          newPattern[index].unit = unit;
                          setTempRandomTimingPattern(newPattern);
                        }}
                        className={`px-3 py-1 rounded-full text-sm transition-all ${
                          pattern.unit === unit
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {unit === 'seconds' ? 'Sec' : unit === 'minutes' ? 'Min' : 'Hour'}
                      </button>
                    ))}
                  </div>
                  
                  {/* Remove Button */}
                  {tempRandomTimingPattern.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newPattern = tempRandomTimingPattern.filter((_, i) => i !== index);
                        setTempRandomTimingPattern(newPattern);
                      }}
                      className="h-9 w-9 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              )
            })}
              
              {/* Add Step Button */}
              <button
                onClick={() => {
                  setTempResponseTiming('custom');
                  setTempRandomTimingPattern([...tempRandomTimingPattern, {value: 1, unit: 'seconds'}]);
                }}
                className="w-full h-10 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Add Step</span>
              </button>
            </div>
            )}
            
            {tempResponseTiming === 'custom' && tempRandomTimingPattern.length > 0 && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  <strong>Pattern timing:</strong> {tempRandomTimingPattern.map((p, i) => 
                    `${p.value} ${p.unit}${i < tempRandomTimingPattern.length - 1 ? ' \u2192 ' : ''}`
                  ).join('')} (then repeats)
                </p>
              </div>
            )}
          </div>
        </div>

        <Button
          onClick={() => {
            setResponseTiming(tempResponseTiming);
            // Update completion flags for the filter system
            try {
              const rawFlags = localStorage.getItem('acesai_setup_completion_flags');
              const flags = rawFlags ? JSON.parse(rawFlags) : {};
              flags['Adjust Response Timing'] = true;
              localStorage.setItem('acesai_setup_completion_flags', JSON.stringify(flags));
            } catch (e) {
              console.error('Error updating completion flags:', e);
            }
            onSave?.();
            setActiveSubmenu('edit-template');
            toast.success('Response timing updated successfully');
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
}
