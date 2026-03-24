import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Plus, Trash2, Bell, Info, Brain, ChevronDown, X, Check } from 'lucide-react';
import { Button } from './ui/button';
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

interface AppointmentRemindersProps {
  onBack: () => void;
  onSave?: () => void;
}

interface Reminder {
  id: string;
  value: number;
  unit: 'minutes' | 'hours';
}

export function AppointmentReminders({ onBack, onSave }: AppointmentRemindersProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [showUnsavedChanges, setShowUnsavedChanges] = useState(false);
  
  // Load initial state from localStorage
  const [initialState] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem('appointmentRemindersSettings');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const defaultSettings = {
    isEnabled: false,
    reminders: [
      { id: '1', value: 24, unit: 'hours' as const },
      { id: '2', value: 12, unit: 'hours' as const },
    ],
    regularMessage: "Hi {name}, your appointment is tomorrow at {time}. See you soon!",
    lateNightRestriction: true,
    onlyConfirmed: true,
    skipCancelled: true,
    skipExcluded: true,
    includeLocation: false,
    includeNotes: false,
    offerConfirmCancel: false,
    timingEnabled: true,
    messageEnabled: true,
    conditionsEnabled: true,
    extrasEnabled: false,
  };

  const savedSettings = initialState || defaultSettings;

  const [isEnabled, setIsEnabled] = useState(savedSettings.isEnabled);
  const [reminders, setReminders] = useState<Reminder[]>(savedSettings.reminders);
  const [regularMessage, setRegularMessage] = useState(savedSettings.regularMessage);
  const [lateNightRestriction, setLateNightRestriction] = useState(savedSettings.lateNightRestriction);
  const [onlyConfirmed, setOnlyConfirmed] = useState(savedSettings.onlyConfirmed);
  const [skipCancelled, setSkipCancelled] = useState(savedSettings.skipCancelled);
  const [skipExcluded, setSkipExcluded] = useState(savedSettings.skipExcluded);
  const [includeLocation, setIncludeLocation] = useState(savedSettings.includeLocation);
  const [includeNotes, setIncludeNotes] = useState(savedSettings.includeNotes);
  const [offerConfirmCancel, setOfferConfirmCancel] = useState(savedSettings.offerConfirmCancel);
  const [timingEnabled, setTimingEnabled] = useState(savedSettings.timingEnabled ?? true);
  const [messageEnabled, setMessageEnabled] = useState(savedSettings.messageEnabled ?? true);
  const [conditionsEnabled, setConditionsEnabled] = useState(savedSettings.conditionsEnabled ?? true);
  const [extrasEnabled, setExtrasEnabled] = useState(savedSettings.extrasEnabled ?? false);

  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);
  const [conditionsDropdownOpen, setConditionsDropdownOpen] = useState(false);
  const [conditionsExpanded, setConditionsExpanded] = useState(savedSettings.conditionsEnabled ?? true);
  const conditionsDropdownRef = useRef<HTMLDivElement>(null);
  const [extrasDropdownOpen, setExtrasDropdownOpen] = useState(false);
  const [extrasExpanded, setExtrasExpanded] = useState(savedSettings.extrasEnabled ?? false);
  const extrasDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (conditionsDropdownRef.current && !conditionsDropdownRef.current.contains(event.target as Node)) {
        setConditionsDropdownOpen(false);
      }
      if (extrasDropdownRef.current && !extrasDropdownRef.current.contains(event.target as Node)) {
        setExtrasDropdownOpen(false);
      }
    };
    if (conditionsDropdownOpen || extrasDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [conditionsDropdownOpen, extrasDropdownOpen]);

  // Conditions config
  const conditionItems = [
    { key: 'onlyConfirmed' as const, label: 'Only send if booking is confirmed', checked: onlyConfirmed, toggle: setOnlyConfirmed },
    { key: 'skipCancelled' as const, label: "Don't send if booking was cancelled", checked: skipCancelled, toggle: setSkipCancelled },
    { key: 'skipExcluded' as const, label: "Don't send if customer is in Exclusion List", checked: skipExcluded, toggle: setSkipExcluded },
  ];

  const selectedConditions = conditionItems.filter(c => c.checked);

  // Extras config
  const extrasItems = [
    { key: 'includeLocation' as const, label: 'Include location in reminder', checked: includeLocation, toggle: setIncludeLocation },
    { key: 'includeNotes' as const, label: 'Include booking notes', checked: includeNotes, toggle: setIncludeNotes },
    { key: 'offerConfirmCancel' as const, label: 'Offer "Confirm/Cancel" buttons', checked: offerConfirmCancel, toggle: setOfferConfirmCancel },
  ];

  const selectedExtras = extrasItems.filter(c => c.checked);

  // AI-generated reminder message variations
  const messageVariations = [
    "Hi {name}, just a friendly reminder that your appointment is on {date} at {time}. We look forward to seeing you!",
    "Hey {name}! Your appointment is coming up on {date} at {time}. Please let us know if you need to reschedule.",
    "Reminder: {name}, you have an appointment scheduled for {date} at {time}. See you soon!",
    "Hello {name}, this is a gentle reminder about your upcoming appointment on {date} at {time}. Don't forget!",
    "Hi {name}, we're looking forward to your visit on {date} at {time}. If anything changes, please reach out to us.",
    "Dear {name}, your appointment is confirmed for {date} at {time}. We can't wait to see you — arrive a few minutes early if possible!",
    "Hey {name}! Quick heads-up: your booking on {date} at {time} is just around the corner. Let us know if you have any questions!",
    "Hi {name}, just checking in to remind you about your appointment on {date} at {time}. Feel free to contact us if you need to make changes.",
  ];

  const handleGenerateMessage = async () => {
    if (isGeneratingMessage) return;
    setIsGeneratingMessage(true);
    toast.info('Generating AI reminder message...');

    try {
      const { companyName, lineOfBusiness } = getBusinessContext();
      const systemPrompt = `You are a professional business messaging assistant. Generate concise, friendly appointment reminder messages for businesses. Use {name}, {date}, and {time} as placeholders. Keep messages under 2 sentences. Do not include links or signatures.`;
      const userPrompt = `Generate an appointment reminder message${companyName ? ` for ${companyName}` : ''}${lineOfBusiness ? ` (${lineOfBusiness} business)` : ''}. Make it warm and professional. Use {name}, {date}, and {time} placeholders.`;

      const generated = await generateWithOpenAI(systemPrompt, userPrompt);
      setRegularMessage(generated);
      toast.success('AI reminder message generated!');
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
      reminders,
      regularMessage,
      lateNightRestriction,
      onlyConfirmed,
      skipCancelled,
      skipExcluded,
      includeLocation,
      includeNotes,
      offerConfirmCancel,
      timingEnabled,
      messageEnabled,
      conditionsEnabled,
      extrasEnabled,
    };
    
    localStorage.setItem('appointmentRemindersSettings', JSON.stringify(settings));
  }, [isMounted, isEnabled, reminders, regularMessage, lateNightRestriction, onlyConfirmed, skipCancelled, skipExcluded, includeLocation, includeNotes, offerConfirmCancel, timingEnabled, messageEnabled, conditionsEnabled, extrasEnabled]);

  const hasUnsavedChanges = () => {
    const currentSettings = {
      isEnabled,
      reminders,
      regularMessage,
      lateNightRestriction,
      onlyConfirmed,
      skipCancelled,
      skipExcluded,
      includeLocation,
      includeNotes,
      offerConfirmCancel,
      timingEnabled,
      messageEnabled,
      conditionsEnabled,
      extrasEnabled,
    };
    
    return JSON.stringify(currentSettings) !== JSON.stringify({
      isEnabled: savedSettings.isEnabled,
      reminders: savedSettings.reminders,
      regularMessage: savedSettings.regularMessage,
      lateNightRestriction: savedSettings.lateNightRestriction,
      onlyConfirmed: savedSettings.onlyConfirmed,
      skipCancelled: savedSettings.skipCancelled,
      skipExcluded: savedSettings.skipExcluded,
      includeLocation: savedSettings.includeLocation,
      includeNotes: savedSettings.includeNotes,
      offerConfirmCancel: savedSettings.offerConfirmCancel,
      timingEnabled: savedSettings.timingEnabled,
      messageEnabled: savedSettings.messageEnabled,
      conditionsEnabled: savedSettings.conditionsEnabled,
      extrasEnabled: savedSettings.extrasEnabled,
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
      localStorage.setItem('appointmentRemindersSettings', JSON.stringify(initialState));
    }
    setShowUnsavedChanges(false);
    onBack();
  };

  const handleSaveAndExit = () => {
    // Update completion flags for the filter system
    try {
      const rawFlags = localStorage.getItem('acesai_setup_completion_flags');
      const flags = rawFlags ? JSON.parse(rawFlags) : {};
      flags['Appointment Reminders'] = true;
      localStorage.setItem('acesai_setup_completion_flags', JSON.stringify(flags));
    } catch (e) {
      console.error('Error updating completion flags:', e);
    }

    onSave?.();
    toast.success('Appointment reminder settings saved!');
    onBack();
  };

  const handleAddReminder = () => {
    const newReminder: Reminder = {
      id: Date.now().toString(),
      value: 1,
      unit: 'hours',
    };
    setReminders([...reminders, newReminder]);
  };

  const handleRemoveReminder = (id: string) => {
    if (reminders.length === 1) {
      toast.error('At least one reminder must be configured');
      return;
    }
    setReminders(reminders.filter(r => r.id !== id));
  };

  const handleUpdateReminder = (id: string, field: 'value' | 'unit', value: number | 'minutes' | 'hours') => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, [field]: value } : r
    ));
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
        <span className="font-medium text-gray-900 dark:text-gray-100">Appointment Reminders</span>
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
                  <Bell className={`w-5 h-5 transition-colors duration-300 ${
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
                      Activate Appointment Reminders
                    </span>
                    <div 
                      className="relative group"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Info className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-help transition-colors" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                        Send automated reminders before scheduled appointments.
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
                      </div>
                    </div>
                  </div>
                  <p className={`text-xs mt-0.5 transition-colors duration-300 ${
                    isEnabled 
                      ? 'text-gray-600 dark:text-gray-400' 
                      : 'text-gray-400 dark:text-gray-500'
                  }`}>
                    Send automated reminders before appointments
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
            <AnimatePresence>
              {isEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 pt-2 pb-2">
                  
                  {/* Reminder Timing Options */}
                  <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Reminder Timing Options</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Configure when reminders should be sent</p>
                      </div>
                      <Switch 
                        checked={timingEnabled} 
                        onCheckedChange={setTimingEnabled}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>

                    <AnimatePresence>
                      {timingEnabled && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="border-l-2 border-blue-400 dark:border-blue-600 pl-4 space-y-3">
                            <div className={`grid gap-3 ${
                              reminders.length === 1 ? 'grid-cols-1' 
                              : reminders.length === 2 ? 'grid-cols-2' 
                              : 'grid-cols-3'
                            }`}>
                            {reminders.map((reminder) => (
                              <div key={reminder.id} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                                <Input
                                  type="number"
                                  min="1"
                                  value={reminder.value}
                                  onChange={(e) => handleUpdateReminder(reminder.id, 'value', parseInt(e.target.value) || 1)}
                                  className="w-16 min-w-0 flex-shrink-0"
                                />
                                <Select
                                  value={reminder.unit}
                                  onValueChange={(value: 'minutes' | 'hours') => handleUpdateReminder(reminder.id, 'unit', value)}
                                >
                                  <SelectTrigger className="w-24 min-w-0 flex-shrink-0">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="minutes">minutes</SelectItem>
                                    <SelectItem value="hours">hours</SelectItem>
                                  </SelectContent>
                                </Select>
                                <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">before</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveReminder(reminder.id)}
                                  className="ml-auto hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0 p-1"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            ))}
                            </div>

                            <Button onClick={handleAddReminder} variant="outline" size="sm" className="w-full rounded-xl">
                              <Plus className="w-4 h-4 mr-2" />
                              Add Reminder
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Message Customization */}
                  <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Message Customization</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Customize the reminder message sent to customers</p>
                      </div>
                      <Switch 
                        checked={messageEnabled} 
                        onCheckedChange={setMessageEnabled}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>

                    <AnimatePresence>
                      {messageEnabled && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="border-l-2 border-blue-400 dark:border-blue-600 pl-4 space-y-3">
                            <div className="space-y-2">
                              <Label className="text-sm text-gray-700 dark:text-gray-300">Regular Message</Label>
                              <Textarea
                                value={regularMessage}
                                onChange={(e) => setRegularMessage(e.target.value)}
                                rows={3}
                                placeholder="Hi {name}, your appointment is tomorrow at {time}. See you soon!"
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
                                Use {'{name}'}, {'{time}'}, {'{date}'} as placeholders
                              </p>
                            </div>
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
                                        <div className={`flex-shrink-0 w-4.5 h-4.5 rounded flex items-center justify-center transition-all duration-150 ${
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

                  {/* Optional Extras */}
                  <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Optional Extras</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Additional information to include in reminders</p>
                      </div>
                      <Switch 
                        checked={extrasEnabled} 
                        onCheckedChange={(val) => {
                          if (!val) {
                            setExtrasExpanded(false);
                            setExtrasDropdownOpen(false);
                          }
                          setExtrasEnabled(val);
                        }}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>

                    <AnimatePresence>
                      {extrasEnabled && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          onAnimationComplete={(definition: any) => {
                            if (definition?.opacity === 1) {
                              setExtrasExpanded(true);
                            }
                          }}
                          style={{ overflow: extrasExpanded ? 'visible' : 'hidden' }}
                        >
                          <div className="border-l-2 border-blue-400 dark:border-blue-600 pl-4 space-y-3">
                            {/* Selected extras as removable tags */}
                            <AnimatePresence>
                              {selectedExtras.length > 0 && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.15 }}
                                  className="flex flex-wrap gap-2"
                                >
                                  {selectedExtras.map((extra) => (
                                    <motion.div
                                      key={extra.key}
                                      initial={{ opacity: 0, scale: 0.9 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.9 }}
                                      transition={{ duration: 0.15 }}
                                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg"
                                    >
                                      <span className="text-xs text-blue-700 dark:text-blue-300">{extra.label}</span>
                                      <button
                                        onClick={() => extra.toggle(false)}
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
                            <div ref={extrasDropdownRef} className="relative">
                              <button
                                onClick={() => setExtrasDropdownOpen(!extrasDropdownOpen)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all text-sm ${
                                  extrasDropdownOpen
                                    ? 'border-blue-400 dark:border-blue-500 ring-2 ring-blue-100 dark:ring-blue-900/40 bg-white dark:bg-gray-800'
                                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                                }`}
                              >
                                <span className="text-gray-500 dark:text-gray-400">
                                  {selectedExtras.length === 0
                                    ? 'Select extras...'
                                    : `${selectedExtras.length} extra${selectedExtras.length > 1 ? 's' : ''} selected`}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${extrasDropdownOpen ? 'rotate-180' : ''}`} />
                              </button>

                              <AnimatePresence>
                                {extrasDropdownOpen && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute z-20 left-0 right-0 mt-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg overflow-hidden"
                                  >
                                    {extrasItems.map((extra, index) => (
                                      <button
                                        key={extra.key}
                                        onClick={() => extra.toggle(!extra.checked)}
                                        className={`w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors ${
                                          index < extrasItems.length - 1 ? 'border-b border-gray-100 dark:border-gray-700/50' : ''
                                        }`}
                                      >
                                        <div className={`flex-shrink-0 rounded flex items-center justify-center transition-all duration-150 ${
                                          extra.checked
                                            ? 'bg-blue-600 dark:bg-blue-500'
                                            : 'border-2 border-gray-300 dark:border-gray-600'
                                        }`}
                                          style={{ width: '18px', height: '18px' }}
                                        >
                                          {extra.checked && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                        <span className={`text-sm ${
                                          extra.checked 
                                            ? 'text-gray-900 dark:text-gray-100' 
                                            : 'text-gray-600 dark:text-gray-400'
                                        }`}>
                                          {extra.label}
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
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}