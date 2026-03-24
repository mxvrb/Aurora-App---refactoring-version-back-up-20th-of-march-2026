import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  Check, 
  Sparkles,
  WandSparkles,
  CheckCircle,
  Minus,
  AlertCircle,
  XCircle,
  ChevronDown,
  Eraser,
  ArrowRightLeft,
  Copy,
  BookX,
  ScissorsLineDashed,
  Shuffle,
  Zap,
  TrendingUp,
  Clock,
  Timer,
  Repeat,
  Dot,
  TrendingUpDown
} from 'lucide-react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from "sonner";
import { motion, AnimatePresence } from 'motion/react';
import LucideBrain from '../imports/LucideBrain';
import CommaIcon from '../imports/CommaIcon';
import { UnsavedChangesDialog } from './UnsavedChangesDialog';
import { MagicalLoadingText } from './MagicalLoadingText';

interface HumanizeAISettingsProps {
  onBack: () => void;
  onSave: () => void;
  initialEnabled: boolean;
}

export function HumanizeAISettings({ onBack, onSave, initialEnabled }: HumanizeAISettingsProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showUnsavedChanges, setShowUnsavedChanges] = useState(false);

  // Load settings from localStorage once during initialization
  const [savedSettings] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem('humanizeAISettings');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Failed to parse settings', e);
      return null;
    }
  });

  // Store initial state for unsaved changes detection
  // We need to capture the state exactly as it is initialized
  const [initialState] = useState(() => {
    const defaultSettings = {
      spellingEnabled: false,
      imperfectionRate: [1],
      enabledImperfections: ['common-misspellings'],
      consistency: 'random',
      selfCorrection: false,
      punctuationEnabled: true,
      punctuationStyle: 'always',
      capitalizationEnabled: true,
      genderRecognitionEnabled: false,
      masculineResponse: '',
      feminineResponse: '',
      sensitivitiesEnabled: false,
      sensitivityInstructions: ''
    };

    if (!savedSettings) return defaultSettings;

    return {
      spellingEnabled: savedSettings.spellingEnabled ?? defaultSettings.spellingEnabled,
      imperfectionRate: savedSettings.imperfectionRate ?? defaultSettings.imperfectionRate,
      enabledImperfections: savedSettings.enabledImperfections ?? defaultSettings.enabledImperfections,
      consistency: savedSettings.consistency ?? defaultSettings.consistency,
      selfCorrection: savedSettings.selfCorrection ?? defaultSettings.selfCorrection,
      punctuationEnabled: savedSettings.punctuationEnabled ?? defaultSettings.punctuationEnabled,
      punctuationStyle: savedSettings.punctuationStyle ?? defaultSettings.punctuationStyle,
      capitalizationEnabled: savedSettings.capitalizationEnabled ?? defaultSettings.capitalizationEnabled,
      genderRecognitionEnabled: savedSettings.genderRecognitionEnabled ?? defaultSettings.genderRecognitionEnabled,
      masculineResponse: savedSettings.masculineResponse ?? defaultSettings.masculineResponse,
      feminineResponse: savedSettings.feminineResponse ?? defaultSettings.feminineResponse,
      sensitivitiesEnabled: savedSettings.sensitivitiesEnabled ?? defaultSettings.sensitivitiesEnabled,
      sensitivityInstructions: savedSettings.sensitivityInstructions ?? defaultSettings.sensitivityInstructions,
    };
  });
  
  // 1. Spelling Imperfections
  const [spellingEnabled, setSpellingEnabled] = useState(savedSettings?.spellingEnabled || false);
  const [imperfectionRate, setImperfectionRate] = useState(savedSettings?.imperfectionRate || [1]); // 0-100
  const [enabledImperfections, setEnabledImperfections] = useState<string[]>(
    savedSettings?.enabledImperfections && savedSettings.enabledImperfections.length > 0 
      ? savedSettings.enabledImperfections 
      : ['common-misspellings']
  );
  type FrequencyPattern = 'every-message' | 'most-messages' | 'half-messages' | 'occasionally' | 'rarely' | 'random' | 'habitual';
  const [consistency, setConsistency] = useState<FrequencyPattern>(savedSettings?.consistency || 'random');
  const [selfCorrection, setSelfCorrection] = useState(savedSettings?.selfCorrection || false);
  const [imperfectionTypesExpanded, setImperfectionTypesExpanded] = useState(savedSettings?.imperfectionTypesExpanded || false);

  // 2. Punctuation
  const [punctuationEnabled, setPunctuationEnabled] = useState(
    savedSettings?.punctuationEnabled !== undefined ? savedSettings.punctuationEnabled : true
  );
  const [punctuationStyle, setPunctuationStyle] = useState<'always' | 'occasionally' | 'necessary' | 'never' | 'only-periods' | 'only-commas'>(
    savedSettings?.punctuationStyle || 'always'
  );
  const [capitalizationEnabled, setCapitalizationEnabled] = useState(
    savedSettings?.capitalizationEnabled !== undefined ? savedSettings.capitalizationEnabled : true
  );
  const [punctuationDropdownOpen, setPunctuationDropdownOpen] = useState(false);
  const punctuationButtonRef = useRef<HTMLDivElement>(null);
  const [punctuationDropdownPosition, setPunctuationDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [frequencyDropdownOpen, setFrequencyDropdownOpen] = useState(false);
  const frequencyButtonRef = useRef<HTMLDivElement>(null);
  const [frequencyDropdownPosition, setFrequencyDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [frequencyPatternExpanded, setFrequencyPatternExpanded] = useState(savedSettings?.frequencyPatternExpanded || false);

  // 3. Gender Recognition
  const [genderRecognitionEnabled, setGenderRecognitionEnabled] = useState(savedSettings?.genderRecognitionEnabled || false);
  const [masculineResponse, setMasculineResponse] = useState(savedSettings?.masculineResponse || '');
  const [feminineResponse, setFeminineResponse] = useState(savedSettings?.feminineResponse || '');

  // 4. Sensitivities
  const [sensitivitiesEnabled, setSensitivitiesEnabled] = useState(savedSettings?.sensitivitiesEnabled || false);
  const [sensitivityInstructions, setSensitivityInstructions] = useState(savedSettings?.sensitivityInstructions || '');

  const getImperfectionLabel = (value: number) => {
    if (value === 0) return { label: 'Perfect Spelling', color: 'text-green-600 dark:text-green-400' };
    if (value <= 5) return { label: 'Light, Subtle Realism', color: 'text-blue-600 dark:text-blue-400' };
    if (value <= 20) return { label: 'Noticeable Human Typing', color: 'text-yellow-600 dark:text-yellow-400' };
    return { label: 'Heavy, Sloppy, Rushed', color: 'text-red-600 dark:text-red-400' };
  };

  const imperfectionTypes = [
    { id: 'common-misspellings', label: 'Common Misspellings', examples: 'definately, recieve, seperate', icon: BookX },
    { id: 'casual-shortened', label: 'Casual Shortened Words', examples: 'tho, u, idk', icon: ScissorsLineDashed },
    { id: 'letter-drops', label: 'Letter Drops', examples: 'becuse, interesing, almos', icon: Eraser },
    { id: 'letter-swaps', label: 'Letter Swaps', examples: 'hte, wrogn, adn', icon: ArrowRightLeft },
    { id: 'double-letters', label: 'Double Letters', examples: 'soo, goood, helloo', icon: Copy },
    { id: 'random-typos', label: 'Random Typos', examples: 'exqmple, nixt, thosr', icon: Shuffle },
  ];

  const handleImperfectionToggle = (id: string) => {
    setEnabledImperfections(prev => {
      // Prevent unchecking if it's the last selected option
      if (prev.includes(id) && prev.length === 1) {
        toast.error('At least one imperfection type must be selected');
        return prev;
      }
      return prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
    });
  };

  const frequencyOptions = [
    { id: 'random' as const, label: 'Vary Each Message', description: 'Different random mistakes every time', icon: Shuffle },
    { id: 'habitual' as const, label: 'Repeat Same Mistakes', description: 'Always make the same specific errors', icon: Repeat },
    { id: 'rarely' as const, label: 'Rarely', description: 'Mistakes only in 1 out of 10 messages (~10%)', icon: Timer },
    { id: 'occasionally' as const, label: 'Occasionally', description: 'Mistakes appear every 4th message (~25%)', icon: Clock },
    { id: 'half-messages' as const, label: 'Half the Time', description: 'Mistakes in about half of your messages (~50%)', icon: Minus },
    { id: 'most-messages' as const, label: 'Most Messages', description: 'Mistakes appear in 3 out of 4 messages (~75%)', icon: TrendingUp },
    { id: 'every-message' as const, label: 'Every Message', description: 'Include mistakes in all messages (~100%)', icon: TrendingUpDown },
  ];

  const getFrequencyDisplay = (freq: FrequencyPattern) => {
    const option = frequencyOptions.find(opt => opt.id === freq);
    return option || frequencyOptions[1]; // Default to 'random'
  };

  // Add loading states for AI generation
  const [isGeneratingMasculine, setIsGeneratingMasculine] = useState(false);
  const [isGeneratingFeminine, setIsGeneratingFeminine] = useState(false);
  const [isGeneratingSensitivity, setIsGeneratingSensitivity] = useState(false);

  // Update dropdown position on scroll
  useEffect(() => {
    const updateDropdownPosition = () => {
      if (frequencyDropdownOpen && frequencyButtonRef.current) {
        const rect = frequencyButtonRef.current.getBoundingClientRect();
        setFrequencyDropdownPosition({
          top: rect.bottom + 4,
          left: rect.left,
          width: rect.width,
        });
      }
      if (punctuationDropdownOpen && punctuationButtonRef.current) {
        const rect = punctuationButtonRef.current.getBoundingClientRect();
        setPunctuationDropdownPosition({
          top: rect.bottom + 4,
          left: rect.left,
          width: rect.width,
        });
      }
    };

    if (frequencyDropdownOpen || punctuationDropdownOpen) {
      window.addEventListener('scroll', updateDropdownPosition, true);
      window.addEventListener('resize', updateDropdownPosition);
      
      return () => {
        window.removeEventListener('scroll', updateDropdownPosition, true);
        window.removeEventListener('resize', updateDropdownPosition);
      };
    }
  }, [frequencyDropdownOpen, punctuationDropdownOpen]);

  // Mark initial load complete and enable animations after a tick
  useEffect(() => {
    requestAnimationFrame(() => {
      setIsInitialLoad(false);
      setIsMounted(true);
    });
  }, []);

  // Save settings to localStorage whenever they change (but only after mount)
  useEffect(() => {
    if (!isMounted) return;
    
    const settings = {
      spellingEnabled,
      imperfectionRate,
      enabledImperfections,
      consistency,
      selfCorrection,
      imperfectionTypesExpanded,
      punctuationEnabled,
      punctuationStyle,
      capitalizationEnabled,
      frequencyPatternExpanded,
      genderRecognitionEnabled,
      masculineResponse,
      feminineResponse,
      sensitivitiesEnabled,
      sensitivityInstructions,
    };
    
    localStorage.setItem('humanizeAISettings', JSON.stringify(settings));
  }, [
    isMounted,
    spellingEnabled,
    imperfectionRate,
    enabledImperfections,
    consistency,
    selfCorrection,
    imperfectionTypesExpanded,
    punctuationEnabled,
    punctuationStyle,
    capitalizationEnabled,
    frequencyPatternExpanded,
    genderRecognitionEnabled,
    masculineResponse,
    feminineResponse,
    sensitivitiesEnabled,
    sensitivityInstructions,
  ]);

  const hasUnsavedChanges = () => {
    const currentSettings = {
      spellingEnabled,
      imperfectionRate,
      enabledImperfections,
      consistency,
      selfCorrection,
      punctuationEnabled,
      punctuationStyle,
      capitalizationEnabled,
      genderRecognitionEnabled,
      masculineResponse,
      feminineResponse,
      sensitivitiesEnabled,
      sensitivityInstructions,
    };
    
    return JSON.stringify(currentSettings) !== JSON.stringify(initialState);
  };

  const handleBack = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedChanges(true);
    } else {
      onBack();
    }
  };

  const handleDiscard = () => {
    // Revert localStorage to initial state
    if (initialState) {
       const restoredSettings = {
          ...savedSettings, 
          ...initialState,
       };
       localStorage.setItem('humanizeAISettings', JSON.stringify(restoredSettings));
    }
    setShowUnsavedChanges(false);
    onBack();
  };

  const handleSaveAndExit = () => {
    onSave();
    onBack();
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800">
      <UnsavedChangesDialog 
        open={showUnsavedChanges} 
        onOpenChange={setShowUnsavedChanges}
        onDiscard={handleDiscard}
        onSave={handleSaveAndExit}
      />

      {/* Header - Matching exact style from Response Timing */}
      <div 
        onClick={handleBack}
        style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
        className="flex items-center px-6 mx-4 mt-3 mb-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg"
      >
        <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-2" />
        <span className="font-medium text-gray-900 dark:text-gray-100">Humanize AI</span>
      </div>

      <div className="p-6 space-y-8">
        
        {/* 1. Simulate Spelling Imperfections */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-900 dark:text-gray-100">Simulate Spelling Imperfections & Typos</Label>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Make the AI mimic human typing patterns and errors.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {spellingEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <Switch 
                checked={spellingEnabled} 
                onCheckedChange={setSpellingEnabled}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
          </div>

          <AnimatePresence>
            {spellingEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: isMounted ? 0.2 : 0 }}
              >
                <div className="pl-4 space-y-4 border-l-2 border-blue-200 dark:border-blue-800">
                  {/* Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-gray-700 dark:text-gray-300">Imperfection Level: {imperfectionRate[0]}%</Label>
                      <span className={`text-xs font-medium ${getImperfectionLabel(imperfectionRate[0]).color}`}>
                        {getImperfectionLabel(imperfectionRate[0]).label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {imperfectionRate[0] === 0 ? 'Perfect Spelling - No errors or typos' : 
                       imperfectionRate[0] <= 5 ? 'Light, Subtle Realism - Barely noticeable mistakes' : 
                       imperfectionRate[0] <= 20 ? 'Noticeable Human Typing - Natural everyday errors' : 
                       'Heavy, Sloppy, Rushed - Frequent mistakes and typos'}
                    </p>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      step="0.1"
                      value={imperfectionRate[0]}
                      onChange={(e) => setImperfectionRate([Number(e.target.value)])}
                      className="w-full apple-slider cursor-pointer"
                      style={{
                        background: imperfectionRate[0] === 0 
                          ? `linear-gradient(to right, #10b981 0%, #e5e7eb 0%, #e5e7eb 100%)`
                          : imperfectionRate[0] <= 5 
                          ? `linear-gradient(to right, #10b981 0%, #3b82f6 ${(imperfectionRate[0] / 40) * 100}%, #e5e7eb ${(imperfectionRate[0] / 40) * 100}%, #e5e7eb 100%)`
                          : imperfectionRate[0] <= 20
                          ? `linear-gradient(to right, #10b981 0%, #3b82f6 ${(5 / 40) * 100}%, #eab308 ${(imperfectionRate[0] / 40) * 100}%, #e5e7eb ${(imperfectionRate[0] / 40) * 100}%, #e5e7eb 100%)`
                          : `linear-gradient(to right, #10b981 0%, #3b82f6 ${(5 / 40) * 100}%, #eab308 ${(20 / 40) * 100}%, #ef4444 ${(imperfectionRate[0] / 40) * 100}%, #e5e7eb ${(imperfectionRate[0] / 40) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Perfect</span>
                      <span>Subtle</span>
                      <span>Human</span>
                      <span>Sloppy</span>
                    </div>
                  </div>

                  {/* Imperfection Types */}
                  <div className="space-y-3">
                    {/* Expandable Header */}
                    <div 
                      onClick={() => setImperfectionTypesExpanded(!imperfectionTypesExpanded)}
                      className="flex items-center gap-1.5 cursor-pointer group w-fit"
                    >
                      <Label className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        Imperfection Types
                      </Label>
                      <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all ${imperfectionTypesExpanded ? 'rotate-180' : ''}`} />
                    </div>

                    {/* Expandable Grid */}
                    <AnimatePresence>
                      {imperfectionTypesExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="grid grid-cols-3 gap-3">
                            {imperfectionTypes.map((type) => {
                              const isSelected = enabledImperfections.includes(type.id);
                              return (
                                <div 
                                  key={type.id}
                                  onClick={() => handleImperfectionToggle(type.id)}
                                  className={`
                                    relative group flex flex-col justify-between p-3 rounded-xl border text-left cursor-pointer transition-all duration-200
                                    ${isSelected 
                                      ? 'border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20 shadow-sm ring-1 ring-blue-600/20 dark:ring-blue-500/20' 
                                      : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm'
                                    }
                                  `}
                                >
                                  <div className="flex items-start justify-between w-full mb-1.5">
                                    <div className="flex items-center gap-2">
                                      <type.icon className={`w-4 h-4 ${
                                        isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-blue-500 dark:text-blue-400'
                                      }`} />
                                      <span className={`text-xs font-semibold tracking-tight ${
                                        isSelected ? 'text-blue-700 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'
                                      }`}>
                                        {type.label}
                                      </span>
                                    </div>
                                    {isSelected ? (
                                      <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                    ) : (
                                      <div className="w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-gray-600 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-colors" />
                                    )}
                                  </div>
                                  <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                                    {type.examples}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                          
                          {/* Self-Correction Checkbox */}
                          <div 
                            onClick={() => setSelfCorrection(!selfCorrection)}
                            className="flex items-center gap-2 cursor-pointer group mt-3"
                          >
                            <Checkbox 
                              checked={selfCorrection} 
                              onCheckedChange={setSelfCorrection}
                              className="border-2 border-gray-300 dark:border-gray-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:dark:bg-blue-600 data-[state=checked]:dark:border-blue-600"
                            />
                            <Label className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              Include Self-Correction
                            </Label>
                            <span className="text-xs text-gray-500 dark:text-gray-400">(Send follow-up fixing mistakes)</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Consistency Pattern Dropdown */}
                  <div className="space-y-3">
                    {/* Expandable Header */}
                    <div 
                      onClick={() => setFrequencyPatternExpanded(!frequencyPatternExpanded)}
                      className="flex items-center gap-1.5 cursor-pointer group w-fit"
                    >
                      <Label className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        Mistake Frequency Pattern
                      </Label>
                      <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all ${frequencyPatternExpanded ? 'rotate-180' : ''}`} />
                    </div>

                    {/* Expandable Content */}
                    <AnimatePresence>
                      {frequencyPatternExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="space-y-2">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Control how often and when typos appear in your messages</p>
                            
                            {/* Dropdown Button */}
                            <div 
                              ref={frequencyButtonRef}
                              onClick={() => {
                                if (!frequencyDropdownOpen && frequencyButtonRef.current) {
                                  const rect = frequencyButtonRef.current.getBoundingClientRect();
                                  setFrequencyDropdownPosition({
                                    top: rect.bottom + 4,
                                    left: rect.left,
                                    width: rect.width,
                                  });
                                }
                                setFrequencyDropdownOpen(!frequencyDropdownOpen);
                              }}
                              className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 border-2 border-blue-500 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                {(() => {
                                  const FrequencyIcon = getFrequencyDisplay(consistency).icon;
                                  return <FrequencyIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
                                })()}
                                <div>
                                  <p className="text-xs font-medium text-gray-900 dark:text-gray-100">
                                    {getFrequencyDisplay(consistency).label}
                                  </p>
                                  <p className="text-[11px] text-gray-600 dark:text-gray-400">
                                    {getFrequencyDisplay(consistency).description}
                                  </p>
                                </div>
                              </div>
                              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${frequencyDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>

                            {/* Floating Dropdown Options */}
                            {frequencyDropdownOpen && (
                              <div 
                                className="fixed space-y-1 border-2 border-gray-300 dark:border-gray-700 rounded-lg p-1.5 bg-white dark:bg-gray-800 shadow-xl z-[9999] max-h-[156px] overflow-y-auto"
                                style={{
                                  top: `${frequencyDropdownPosition.top}px`,
                                  left: `${frequencyDropdownPosition.left}px`,
                                  width: `${frequencyDropdownPosition.width}px`,
                                }}
                              >
                                {frequencyOptions.map((option) => {
                                  const Icon = option.icon;
                                  const isSelected = consistency === option.id;
                                  return (
                                    <div 
                                      key={option.id}
                                      onClick={() => {
                                        setConsistency(option.id);
                                        setFrequencyDropdownOpen(false);
                                      }}
                                      className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-all ${
                                        isSelected
                                          ? 'bg-blue-50 dark:bg-blue-900/20'
                                          : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <Icon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                        <div>
                                          <p className="text-xs font-medium text-gray-900 dark:text-gray-100">{option.label}</p>
                                          <p className="text-[11px] text-gray-600 dark:text-gray-400">{option.description}</p>
                                        </div>
                                      </div>
                                      {isSelected && (
                                        <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2. Capitalization & Punctuation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-900 dark:text-gray-100">Capitalization, Commas & Full Stops</Label>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Control how strictly the AI follows grammatical rules.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {punctuationEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <Switch 
                checked={punctuationEnabled} 
                onCheckedChange={setPunctuationEnabled}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
          </div>

          <AnimatePresence>
            {punctuationEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: isMounted ? 0.2 : 0 }}
              >
                <div className="pl-4 border-l-2 border-blue-200 dark:border-blue-800 space-y-3">
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-900 dark:text-gray-100">Punctuation Style</Label>
                    
                    {/* Custom Dropdown Button */}
                    <div 
                      ref={punctuationButtonRef}
                      onClick={() => {
                        if (!punctuationDropdownOpen && punctuationButtonRef.current) {
                          const rect = punctuationButtonRef.current.getBoundingClientRect();
                          setPunctuationDropdownPosition({
                            top: rect.bottom + 4,
                            left: rect.left,
                            width: rect.width,
                          });
                        }
                        setPunctuationDropdownOpen(!punctuationDropdownOpen);
                      }}
                      className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border-2 border-blue-500 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {punctuationStyle === 'always' && <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                        {punctuationStyle === 'occasionally' && <Minus className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                        {punctuationStyle === 'necessary' && <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                        {punctuationStyle === 'never' && <XCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                        {punctuationStyle === 'only-periods' && <div className="w-4 h-4 flex items-center justify-center"><Dot className="w-4 h-4 text-blue-600 dark:text-blue-400" /></div>}
                        {punctuationStyle === 'only-commas' && <div className="w-4 h-4 flex items-center justify-center"><CommaIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" /></div>}
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {punctuationStyle === 'always' && 'Always Include'}
                            {punctuationStyle === 'occasionally' && 'Occasionally Skip'}
                            {punctuationStyle === 'necessary' && 'Only if Necessary'}
                            {punctuationStyle === 'never' && 'Never Include'}
                            {punctuationStyle === 'only-periods' && 'Only Full Stops'}
                            {punctuationStyle === 'only-commas' && 'Only Commas'}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {punctuationStyle === 'always' && 'Use proper punctuation in all messages'}
                            {punctuationStyle === 'occasionally' && 'Sometimes skip commas and periods'}
                            {punctuationStyle === 'necessary' && 'Use only when needed for clarity'}
                            {punctuationStyle === 'never' && 'Skip all commas and periods'}
                            {punctuationStyle === 'only-periods' && 'Use only full stops in messages'}
                            {punctuationStyle === 'only-commas' && 'Use only commas in messages'}
                          </p>
                        </div>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${punctuationDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {/* Floating Dropdown Options */}
                    {punctuationDropdownOpen && (
                      <div 
                        className="fixed space-y-2 border-2 border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-800 shadow-xl z-[9999] max-h-[240px] overflow-y-auto"
                        style={{
                          top: `${punctuationDropdownPosition.top}px`,
                          left: `${punctuationDropdownPosition.left}px`,
                          width: `${punctuationDropdownPosition.width}px`,
                        }}
                      >
                        {/* Always Include */}
                        <div 
                          onClick={() => {
                            setPunctuationStyle('always');
                            setPunctuationDropdownOpen(false);
                          }}
                          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                            punctuationStyle === 'always'
                              ? 'bg-blue-50 dark:bg-blue-900/20'
                              : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Always Include</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Use proper punctuation in all messages</p>
                            </div>
                          </div>
                          {punctuationStyle === 'always' && (
                            <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>

                        {/* Occasionally Skip */}
                        <div 
                          onClick={() => {
                            setPunctuationStyle('occasionally');
                            setPunctuationDropdownOpen(false);
                          }}
                          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                            punctuationStyle === 'occasionally'
                              ? 'bg-blue-50 dark:bg-blue-900/20'
                              : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Minus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Occasionally Skip</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Sometimes skip commas and periods</p>
                            </div>
                          </div>
                          {punctuationStyle === 'occasionally' && (
                            <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>

                        {/* Only if Necessary */}
                        <div 
                          onClick={() => {
                            setPunctuationStyle('necessary');
                            setPunctuationDropdownOpen(false);
                          }}
                          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                            punctuationStyle === 'necessary'
                              ? 'bg-blue-50 dark:bg-blue-900/20'
                              : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Only if Necessary</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Use only when needed for clarity</p>
                            </div>
                          </div>
                          {punctuationStyle === 'necessary' && (
                            <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>

                        {/* Never Include */}
                        <div 
                          onClick={() => {
                            setPunctuationStyle('never');
                            setPunctuationDropdownOpen(false);
                          }}
                          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                            punctuationStyle === 'never'
                              ? 'bg-blue-50 dark:bg-blue-900/20'
                              : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <XCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Never Include</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Skip all commas and periods</p>
                            </div>
                          </div>
                          {punctuationStyle === 'never' && (
                            <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>

                        {/* Only Periods */}
                        <div 
                          onClick={() => {
                            setPunctuationStyle('only-periods');
                            setPunctuationDropdownOpen(false);
                          }}
                          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                            punctuationStyle === 'only-periods'
                              ? 'bg-blue-50 dark:bg-blue-900/20'
                              : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 flex items-center justify-center"><Dot className="w-4 h-4 text-blue-600 dark:text-blue-400" /></div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Only Full Stops</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Use only full stops in messages</p>
                            </div>
                          </div>
                          {punctuationStyle === 'only-periods' && (
                            <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>

                        {/* Only Commas */}
                        <div 
                          onClick={() => {
                            setPunctuationStyle('only-commas');
                            setPunctuationDropdownOpen(false);
                          }}
                          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                            punctuationStyle === 'only-commas'
                              ? 'bg-blue-50 dark:bg-blue-900/20'
                              : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 flex items-center justify-center"><CommaIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" /></div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Only Commas</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Use only commas in messages</p>
                            </div>
                          </div>
                          {punctuationStyle === 'only-commas' && (
                            <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Proper Capitalization Toggle */}
                  <div className="flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                    <div>
                      <Label className="text-sm text-gray-900 dark:text-gray-100">Proper Capitalization</Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Start sentences with capitals</p>
                    </div>
                    <Switch checked={capitalizationEnabled} onCheckedChange={setCapitalizationEnabled} className="data-[state=checked]:bg-blue-600" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. Gender Recognition */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-900 dark:text-gray-100">Gender Recognition</Label>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Adjust tone based on the user's name.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {genderRecognitionEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <Switch 
                checked={genderRecognitionEnabled} 
                onCheckedChange={setGenderRecognitionEnabled}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
          </div>

          <AnimatePresence>
            {genderRecognitionEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: isMounted ? 0.2 : 0 }}
              >
                <div className="pl-4 space-y-4 border-l-2 border-blue-200 dark:border-blue-800">
                  {/* Masculine */}
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-700 dark:text-gray-300">Masculine Name Recognized</Label>
                    <textarea
                      rows={2}
                      placeholder="Type how you would like the AI to respond to Masculine named customers..."
                      value={masculineResponse}
                      onChange={(e) => setMasculineResponse(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div 
                      onClick={async () => {
                        if (isGeneratingMasculine) return;
                        setIsGeneratingMasculine(true);
                        
                        try {
                          const { projectId, publicAnonKey } = await import('../utils/supabase/info.tsx');
                          
                          const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3f7de5a4/humanize/generate`, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${publicAnonKey}`
                            },
                            body: JSON.stringify({ type: 'masculine' })
                          });

                          if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.error || 'Failed to generate response');
                          }

                          const data = await response.json();
                          setMasculineResponse(data.text);
                          toast.success('Response generated!');
                        } catch (error) {
                          console.error('Error generating masculine response:', error);
                          toast.error('Failed to generate response. Please try again.');
                        } finally {
                          setIsGeneratingMasculine(false);
                        }
                      }}
                      className={`flex items-center gap-1 text-sm ${isGeneratingMasculine ? 'text-blue-400 dark:text-blue-500' : 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'} ${isGeneratingMasculine ? 'cursor-wait' : 'cursor-pointer'} transition-colors`}
                    >
                      <MagicalLoadingText isLoading={isGeneratingMasculine} icon={<LucideBrain className="w-3.5 h-3.5" />}>
                        <span>Generate using AI</span>
                      </MagicalLoadingText>
                    </div>
                  </div>

                  {/* Feminine */}
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-700 dark:text-gray-300">Feminine Name Recognized</Label>
                    <textarea
                      rows={2}
                      placeholder="Type how you would like the AI to respond to Feminine named customers..."
                      value={feminineResponse}
                      onChange={(e) => setFeminineResponse(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div 
                      onClick={async () => {
                        if (isGeneratingFeminine) return;
                        setIsGeneratingFeminine(true);
                        
                        try {
                          const { projectId, publicAnonKey } = await import('../utils/supabase/info.tsx');
                          
                          const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3f7de5a4/humanize/generate`, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${publicAnonKey}`
                            },
                            body: JSON.stringify({ type: 'feminine' })
                          });

                          if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.error || 'Failed to generate response');
                          }

                          const data = await response.json();
                          setFeminineResponse(data.text);
                          toast.success('Response generated!');
                        } catch (error) {
                          console.error('Error generating feminine response:', error);
                          toast.error('Failed to generate response. Please try again.');
                        } finally {
                          setIsGeneratingFeminine(false);
                        }
                      }}
                      className={`flex items-center gap-1 text-sm ${isGeneratingFeminine ? 'text-blue-400 dark:text-blue-500' : 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'} ${isGeneratingFeminine ? 'cursor-wait' : 'cursor-pointer'} transition-colors`}
                    >
                      <MagicalLoadingText isLoading={isGeneratingFeminine} icon={<LucideBrain className="w-3.5 h-3.5" />}>
                        <span>Generate using AI</span>
                      </MagicalLoadingText>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Save Button */}
        <Button 
          onClick={onSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Save Settings
        </Button>

      </div>
    </div>
  );
}