import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronDown, MessageSquareOff, Info, Brain, X, Check } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';
import { toast } from "sonner";
import { motion, AnimatePresence } from 'motion/react';
import { UnsavedChangesDialog } from './UnsavedChangesDialog';
import { MagicalLoadingText } from './MagicalLoadingText';
import { generateWithOpenAI, getBusinessContext } from '../utils/openai';

interface AbandonedChatRemindersProps {
  onBack: () => void;
  onSave?: () => void;
}

export function AbandonedChatReminders({ onBack, onSave }: AbandonedChatRemindersProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [showUnsavedChanges, setShowUnsavedChanges] = useState(false);
  
  // Load initial state from localStorage
  const [initialState] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem('abandonedChatRemindersSettings');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const defaultSettings = {
    isEnabled: false,
    abandonmentTimer: '30',
    customTimer: '30',
    firstNudge: "Still here if you'd like help!",
    enableSecondNudge: false,
    secondNudge: "Want me to check availability for you?",
    onlyIfNoReply: true,
    skipExcluded: true,
    skipCompleted: true,
    timerEnabled: true,
    messagesEnabled: true,
    conditionsEnabled: true,
  };

  const savedSettings = initialState || defaultSettings;

  const [isEnabled, setIsEnabled] = useState(savedSettings.isEnabled);
  const [abandonmentTimer, setAbandonmentTimer] = useState(savedSettings.abandonmentTimer);
  const [customTimer, setCustomTimer] = useState(savedSettings.customTimer);
  const [firstNudge, setFirstNudge] = useState(savedSettings.firstNudge);
  const [enableSecondNudge, setEnableSecondNudge] = useState(savedSettings.enableSecondNudge);
  const [secondNudge, setSecondNudge] = useState(savedSettings.secondNudge);
  const [onlyIfNoReply, setOnlyIfNoReply] = useState(savedSettings.onlyIfNoReply);
  const [skipExcluded, setSkipExcluded] = useState(savedSettings.skipExcluded);
  const [skipCompleted, setSkipCompleted] = useState(savedSettings.skipCompleted);
  const [timerEnabled, setTimerEnabled] = useState(savedSettings.timerEnabled ?? true);
  const [messagesEnabled, setMessagesEnabled] = useState(savedSettings.messagesEnabled ?? true);
  const [conditionsEnabled, setConditionsEnabled] = useState(savedSettings.conditionsEnabled ?? true);

  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);
  const [conditionsDropdownOpen, setConditionsDropdownOpen] = useState(false);
  const [conditionsExpanded, setConditionsExpanded] = useState(savedSettings.conditionsEnabled ?? true);
  const conditionsDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (conditionsDropdownRef.current && !conditionsDropdownRef.current.contains(event.target as Node)) {
        setConditionsDropdownOpen(false);
      }
    };
    if (conditionsDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [conditionsDropdownOpen]);

  // Conditions config
  const conditionItems = [
    { key: 'onlyIfNoReply' as const, label: "Only send if customer hasn't replied", checked: onlyIfNoReply, toggle: setOnlyIfNoReply },
    { key: 'skipExcluded' as const, label: "Don't send if customer is in Exclusion List", checked: skipExcluded, toggle: setSkipExcluded },
    { key: 'skipCompleted' as const, label: "Don't send if booking is already completed", checked: skipCompleted, toggle: setSkipCompleted },
  ];

  const selectedConditions = conditionItems.filter(c => c.checked);

  // AI-generated nudge message variations
  const nudgeVariations = [
    "Hey {name}, still thinking it over? I'm here whenever you're ready!",
    "Hi {name}, looks like we got disconnected — would you like to pick up where we left off?",
    "Just checking in, {name}! Need any help finishing your booking?",
    "Hey {name}, I noticed you haven't completed your booking yet. Can I assist with anything?",
    "Still here if you need me, {name}! Let me know how I can help.",
    "Hi {name}, don't miss out — I can help you wrap up your booking in no time!",
    "Hey {name}, I'm still around if you'd like to continue. No rush!",
    "Hi there {name}, wanted to follow up — is there anything I can clarify for you?",
  ];

  const handleGenerateMessage = async () => {
    if (isGeneratingMessage) return;
    setIsGeneratingMessage(true);
    toast.info('Generating AI nudge message...');

    try {
      const { companyName, lineOfBusiness } = getBusinessContext();
      const systemPrompt = `You are a business messaging assistant. Generate a short, friendly nudge message for customers who have abandoned a chat session. Use {name} as a placeholder. Keep it under 2 sentences. Conversational and helpful tone.`;
      const userPrompt = `Generate a chat nudge/follow-up message${companyName ? ` for ${companyName}` : ''}${lineOfBusiness ? ` (${lineOfBusiness})` : ''}. Use {name} as a placeholder. Encourage the customer to continue.`;

      const generated = await generateWithOpenAI(systemPrompt, userPrompt);
      setFirstNudge(generated);
      toast.success('AI nudge message generated!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate message');
    } finally {
      setIsGeneratingMessage(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (!isMounted) return;
    
    const settings = {
      isEnabled,
      abandonmentTimer,
      customTimer,
      firstNudge,
      enableSecondNudge,
      secondNudge,
      onlyIfNoReply,
      skipExcluded,
      skipCompleted,
      timerEnabled,
      messagesEnabled,
      conditionsEnabled,
    };
    
    localStorage.setItem('abandonedChatRemindersSettings', JSON.stringify(settings));
  }, [isMounted, isEnabled, abandonmentTimer, customTimer, firstNudge, enableSecondNudge, secondNudge, onlyIfNoReply, skipExcluded, skipCompleted, timerEnabled, messagesEnabled, conditionsEnabled]);

  const hasUnsavedChanges = () => {
    const currentSettings = {
      isEnabled,
      abandonmentTimer,
      customTimer,
      firstNudge,
      enableSecondNudge,
      secondNudge,
      onlyIfNoReply,
      skipExcluded,
      skipCompleted,
      timerEnabled,
      messagesEnabled,
      conditionsEnabled,
    };
    
    return JSON.stringify(currentSettings) !== JSON.stringify({
      isEnabled: savedSettings.isEnabled,
      abandonmentTimer: savedSettings.abandonmentTimer,
      customTimer: savedSettings.customTimer,
      firstNudge: savedSettings.firstNudge,
      enableSecondNudge: savedSettings.enableSecondNudge,
      secondNudge: savedSettings.secondNudge,
      onlyIfNoReply: savedSettings.onlyIfNoReply,
      skipExcluded: savedSettings.skipExcluded,
      skipCompleted: savedSettings.skipCompleted,
      timerEnabled: savedSettings.timerEnabled,
      messagesEnabled: savedSettings.messagesEnabled,
      conditionsEnabled: savedSettings.conditionsEnabled,
    });
  };

  const handleBack = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedChanges(true);
    } else {
      onBack();
    }
  };

  const handleDiscard = () => {
    if (initialState) {
      localStorage.setItem('abandonedChatRemindersSettings', JSON.stringify(initialState));
    }
    setShowUnsavedChanges(false);
    onBack();
  };

  const handleSaveAndExit = () => {
    // Update completion flags for the filter system
    try {
      const rawFlags = localStorage.getItem('acesai_setup_completion_flags');
      const flags = rawFlags ? JSON.parse(rawFlags) : {};
      flags['Abandoned Chat Reminders'] = true;
      localStorage.setItem('acesai_setup_completion_flags', JSON.stringify(flags));
    } catch (e) {
      console.error('Error updating completion flags:', e);
    }

    onSave?.();
    toast.success('Abandoned chat reminder settings saved!');
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

      {/* Header */}
      <div 
        onClick={handleBack}
        style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
        className="flex items-center px-6 mx-4 mt-3 mb-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg"
      >
        <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-2" />
        <span className="font-medium text-gray-900 dark:text-gray-100">Abandoned Chat Notification</span>
      </div>

      <div className="p-6 space-y-8">
        
        {/* Main Toggle */}
        <div className="space-y-2">
          <div 
            className={`relative rounded-2xl border p-4 transition-all duration-300 ${
              isEnabled 
                ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 shadow-md shadow-blue-100/50 dark:shadow-blue-900/20' 
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Left: Icon + Text */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                  isEnabled 
                    ? 'bg-blue-100 dark:bg-blue-900/50' 
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <MessageSquareOff className={`w-5 h-5 transition-colors duration-300 ${
                    isEnabled 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-400 dark:text-gray-500'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-sm font-medium transition-colors duration-300 ${
                      isEnabled 
                        ? 'text-gray-900 dark:text-gray-100' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      Activate Abandoned Chat Notification
                    </span>
                    <div 
                      className="relative group"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Info className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-help transition-colors" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                        Re-engage customers who haven't completed their booking.
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
                      </div>
                    </div>
                  </div>
                  <p className={`text-xs mt-0.5 transition-colors duration-300 ${
                    isEnabled 
                      ? 'text-gray-600 dark:text-gray-400' 
                      : 'text-gray-400 dark:text-gray-500'
                  }`}>
                    Send automated nudges to abandoned chats
                  </p>
                </div>
              </div>

              {/* Right: Toggle + Status */}
              <div className="flex items-center gap-2.5 flex-shrink-0">
                <span className={`text-xs font-medium transition-colors duration-300 ${
                  isEnabled 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {isEnabled ? 'Enabled' : 'Disabled'}
                </span>
                <Switch 
                  checked={isEnabled} 
                  onCheckedChange={setIsEnabled}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
            </div>
          </div>

          <div className="relative mt-4">
              <motion.div
                initial={false}
                animate={{ opacity: isEnabled ? 1 : 0.4 }}
                transition={{ duration: 0.3 }}
              >
                <div 
                  className={`space-y-4 transition-colors duration-300`}
                  style={{ pointerEvents: isEnabled ? 'auto' : 'none' }}
                >
                  
                  {/* Abandonment Timer */}
                  <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Abandonment Timer</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Configure when to consider a chat abandoned</p>
                      </div>
                      <Switch 
                        checked={timerEnabled} 
                        onCheckedChange={setTimerEnabled}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>

                    <AnimatePresence>
                      {timerEnabled && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="border-l-2 border-blue-400 dark:border-blue-600 pl-4 space-y-3">
                            <div className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl space-y-3">
                              <Select value={abandonmentTimer} onValueChange={setAbandonmentTimer}>
                                <SelectTrigger className="w-full">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="15">15 minutes</SelectItem>
                                  <SelectItem value="30">30 minutes</SelectItem>
                                  <SelectItem value="60">1 hour</SelectItem>
                                  <SelectItem value="360">6 hours</SelectItem>
                                  <SelectItem value="custom">Custom</SelectItem>
                                </SelectContent>
                              </Select>

                              <AnimatePresence>
                                {abandonmentTimer === 'custom' && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.15 }}
                                  >
                                    <div className="flex items-center gap-3">
                                      <Input
                                        type="number"
                                        min="1"
                                        value={customTimer}
                                        onChange={(e) => setCustomTimer(e.target.value)}
                                        className="w-24"
                                        placeholder="30"
                                      />
                                      <span className="text-sm text-gray-500 dark:text-gray-400">minutes</span>
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

                  {/* Reminder Messages */}
                  <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Reminder Messages</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Configure follow-up messages for abandoned chats</p>
                      </div>
                      <Switch 
                        checked={messagesEnabled} 
                        onCheckedChange={setMessagesEnabled}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>

                    <AnimatePresence>
                      {messagesEnabled && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="border-l-2 border-blue-400 dark:border-blue-600 pl-4 space-y-3">
                            <div className="space-y-2">
                              <Label className="text-sm text-gray-700 dark:text-gray-300">1st Nudge Message</Label>
                              <Textarea
                                value={firstNudge}
                                onChange={(e) => setFirstNudge(e.target.value)}
                                rows={2}
                                placeholder="Still here if you'd like help!"
                                className="text-sm rounded-xl"
                              />
                              <div 
                                onClick={handleGenerateMessage}
                                className={`flex items-center gap-1 mt-1 text-sm ${isGeneratingMessage ? 'text-blue-400 dark:text-blue-500' : 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'} ${isGeneratingMessage ? 'cursor-wait' : 'cursor-pointer'} transition-colors`}
                              >
                                <MagicalLoadingText isLoading={isGeneratingMessage} icon={<Brain className="w-3.5 h-3.5" />}>
                                  <span>Generate using AI</span>
                                </MagicalLoadingText>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Use {'{name}'} as a placeholder for the customer's name
                              </p>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                              <div>
                                <Label className="text-sm text-gray-700 dark:text-gray-300">Enable 2nd Nudge Message</Label>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Send another reminder if no response</p>
                              </div>
                              <Switch checked={enableSecondNudge} onCheckedChange={setEnableSecondNudge} className="data-[state=checked]:bg-blue-600" />
                            </div>

                            <AnimatePresence>
                              {enableSecondNudge && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="space-y-2">
                                    <Label className="text-sm text-gray-700 dark:text-gray-300">2nd Nudge Message</Label>
                                    <Textarea
                                      value={secondNudge}
                                      onChange={(e) => setSecondNudge(e.target.value)}
                                      rows={2}
                                      placeholder="Want me to check availability for you?"
                                      className="text-sm rounded-xl"
                                    />
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Conditions */}
                  <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Conditions</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Set rules for when reminders should be sent</p>
                      </div>
                      <Switch 
                        checked={conditionsEnabled} 
                        onCheckedChange={(val) => {
                          if (!val) {
                            setConditionsExpanded(false);
                            setConditionsDropdownOpen(false);
                          }
                          setConditionsEnabled(val);
                        }}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>

                    <AnimatePresence>
                      {conditionsEnabled && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          onAnimationComplete={(definition: any) => {
                            if (definition?.opacity === 1) {
                              setConditionsExpanded(true);
                            }
                          }}
                          style={{ overflow: conditionsExpanded ? 'visible' : 'hidden' }}
                        >
                          <div className="border-l-2 border-blue-400 dark:border-blue-600 pl-4 space-y-3">
                            {/* Selected conditions as removable tags */}
                            <AnimatePresence>
                              {selectedConditions.length > 0 && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.15 }}
                                  className="flex flex-wrap gap-2"
                                >
                                  {selectedConditions.map((condition) => (
                                    <motion.div
                                      key={condition.key}
                                      initial={{ opacity: 0, scale: 0.9 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.9 }}
                                      transition={{ duration: 0.15 }}
                                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg"
                                    >
                                      <span className="text-xs text-blue-700 dark:text-blue-300">{condition.label}</span>
                                      <button
                                        onClick={() => condition.toggle(false)}
                                        className="flex-shrink-0 p-0.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors"
                                      >
                                        <X className="w-3 h-3 text-blue-500 dark:text-blue-400" />
                                      </button>
                                    </motion.div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Custom dropdown */}
                            <div ref={conditionsDropdownRef} className="relative">
                              <button
                                onClick={() => setConditionsDropdownOpen(!conditionsDropdownOpen)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all text-sm ${
                                  conditionsDropdownOpen
                                    ? 'border-blue-400 dark:border-blue-500 ring-2 ring-blue-100 dark:ring-blue-900/40 bg-white dark:bg-gray-800'
                                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                                }`}
                              >
                                <span className="text-gray-500 dark:text-gray-400">
                                  {selectedConditions.length === 0
                                    ? 'Select conditions...'
                                    : `${selectedConditions.length} condition${selectedConditions.length > 1 ? 's' : ''} selected`}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${conditionsDropdownOpen ? 'rotate-180' : ''}`} />
                              </button>

                              <AnimatePresence>
                                {conditionsDropdownOpen && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute z-20 left-0 right-0 mt-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg overflow-hidden"
                                  >
                                    {conditionItems.map((condition, index) => (
                                      <button
                                        key={condition.key}
                                        onClick={() => condition.toggle(!condition.checked)}
                                        className={`w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors ${
                                          index < conditionItems.length - 1 ? 'border-b border-gray-100 dark:border-gray-700/50' : ''
                                        }`}
                                      >
                                        <div className={`flex-shrink-0 rounded flex items-center justify-center transition-all duration-150 ${
                                          condition.checked
                                            ? 'bg-blue-600 dark:bg-blue-500'
                                            : 'border-2 border-gray-300 dark:border-gray-600'
                                        }`}
                                          style={{ width: '18px', height: '18px' }}
                                        >
                                          {condition.checked && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                        <span className={`text-sm ${
                                          condition.checked 
                                            ? 'text-gray-900 dark:text-gray-100' 
                                            : 'text-gray-600 dark:text-gray-400'
                                        }`}>
                                          {condition.label}
                                        </span>
                                      </button>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              </motion.div>
              {/* Invisible overlay to block all interactions when disabled */}
              {!isEnabled && (
                <div className="absolute inset-0 z-10 cursor-not-allowed" />
              )}
          </div>
        </div>

      </div>
    </div>
  );
}