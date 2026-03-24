import React, { useState, useEffect } from 'react';
import { ChevronLeft, Star, Info, Brain } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { toast } from "sonner";
import { motion, AnimatePresence } from 'motion/react';
import { UnsavedChangesDialog } from './UnsavedChangesDialog';
import { MagicalLoadingText } from './MagicalLoadingText';
import { generateWithOpenAI, getBusinessContext } from '../utils/openai';

interface CustomReviewsProps {
  platformId: string;
  onBack: () => void;
  onSave?: () => void;
}

export function CustomReviews({ platformId, onBack, onSave }: CustomReviewsProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [showUnsavedChanges, setShowUnsavedChanges] = useState(false);
  const [platformName, setPlatformName] = useState('Custom');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('customReviewPlatforms');
      if (saved) {
        const platforms = JSON.parse(saved);
        const p = platforms.find((pl: any) => pl.id === platformId);
        if (p) setPlatformName(p.name);
      }
    } catch (e) {}
  }, [platformId]);
  
  const settingsKey = `customReviewsSettings_${platformId}`;

  const [initialState] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem(settingsKey);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const defaultSettings = {
    isEnabled: false,
    reviewLink: '',
    startTiming: 'immediate',
    customStartValue: '14',
    customStartUnit: 'days',
    stopAfterEnabled: false,
    stopAfterValue: '30',
    stopAfterUnit: 'days',
    oneReviewPerCustomer: false,
    messageTemplate: `Hi {name}, thanks for visiting {business}. Would you mind leaving a review? Here's the link: {link}`,
    enableReminder: false,
    reminderDays: '7',
    onePerPlatform: false,
    linkEnabled: false,
    timeframeEnabled: false,
    distributionEnabled: false,
    messageEnabled: false,
    reminderEnabled: false,
  };

  const savedSettings = initialState || defaultSettings;

  const [isEnabled, setIsEnabled] = useState(savedSettings.isEnabled);
  const [reviewLink, setReviewLink] = useState(savedSettings.reviewLink);
  const [startTiming, setStartTiming] = useState(savedSettings.startTiming);
  const [customStartValue, setCustomStartValue] = useState(savedSettings.customStartValue ?? '14');
  const [customStartUnit, setCustomStartUnit] = useState(savedSettings.customStartUnit ?? 'days');
  const [stopAfterEnabled, setStopAfterEnabled] = useState(savedSettings.stopAfterEnabled);
  const [stopAfterValue, setStopAfterValue] = useState(savedSettings.stopAfterValue);
  const [stopAfterUnit, setStopAfterUnit] = useState(savedSettings.stopAfterUnit);
  const [oneReviewPerCustomer, setOneReviewPerCustomer] = useState(savedSettings.oneReviewPerCustomer);
  const [messageTemplate, setMessageTemplate] = useState(savedSettings.messageTemplate);
  const [enableReminder, setEnableReminder] = useState(savedSettings.enableReminder);
  const [reminderDays, setReminderDays] = useState(savedSettings.reminderDays);
  const [onePerPlatform, setOnePerPlatform] = useState(savedSettings.onePerPlatform);
  const [linkEnabled, setLinkEnabled] = useState(savedSettings.linkEnabled ?? false);
  const [timeframeEnabled, setTimeframeEnabled] = useState(savedSettings.timeframeEnabled ?? false);
  const [distributionEnabled, setDistributionEnabled] = useState(savedSettings.distributionEnabled ?? false);
  const [messageEnabled, setMessageEnabled] = useState(savedSettings.messageEnabled ?? false);
  const [reminderEnabled, setReminderEnabled] = useState(savedSettings.reminderEnabled ?? false);

  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);

  const handleGenerateMessage = async () => {
    if (isGeneratingMessage) return;
    setIsGeneratingMessage(true);
    toast.info(`Generating AI ${platformName} review message...`);
    try {
      const { companyName, lineOfBusiness } = getBusinessContext();
      const systemPrompt = `You are a business messaging assistant. Generate a short, friendly ${platformName} review request message. Use {name}, {business}, and {link} as placeholders. Keep it under 2 sentences.`;
      const userPrompt = `Generate a ${platformName} review request message${companyName ? ` for ${companyName}` : ''}${lineOfBusiness ? ` (${lineOfBusiness})` : ''}. Use {name}, {business}, and {link} as placeholders.`;
      const generated = await generateWithOpenAI(systemPrompt, userPrompt);
      setMessageTemplate(generated);
      toast.success('AI review message generated!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate message');
    } finally {
      setIsGeneratingMessage(false);
    }
  };

  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    if (!isMounted) return;
    const settings = {
      isEnabled, reviewLink, startTiming, customStartValue, customStartUnit, stopAfterEnabled, stopAfterValue, stopAfterUnit,
      oneReviewPerCustomer, messageTemplate, enableReminder, reminderDays, onePerPlatform,
      linkEnabled, timeframeEnabled, distributionEnabled, messageEnabled, reminderEnabled,
    };
    localStorage.setItem(settingsKey, JSON.stringify(settings));
    
    // Dispatch event to refresh App.tsx and reflect changes in filter sidebar immediately
    window.dispatchEvent(new CustomEvent('acesai-local-storage-changed'));
  }, [isMounted, isEnabled, reviewLink, startTiming, customStartValue, customStartUnit, stopAfterEnabled, stopAfterValue, stopAfterUnit, oneReviewPerCustomer, messageTemplate, enableReminder, reminderDays, onePerPlatform, linkEnabled, timeframeEnabled, distributionEnabled, messageEnabled, reminderEnabled, settingsKey]);

  const hasUnsavedChanges = () => {
    const cur = { isEnabled, reviewLink, startTiming, customStartValue, customStartUnit, stopAfterEnabled, stopAfterValue, stopAfterUnit, oneReviewPerCustomer, messageTemplate, enableReminder, reminderDays, onePerPlatform, linkEnabled, timeframeEnabled, distributionEnabled, messageEnabled, reminderEnabled };
    const sav = { isEnabled: savedSettings.isEnabled, reviewLink: savedSettings.reviewLink, startTiming: savedSettings.startTiming, customStartValue: savedSettings.customStartValue ?? '14', customStartUnit: savedSettings.customStartUnit ?? 'days', stopAfterEnabled: savedSettings.stopAfterEnabled, stopAfterValue: savedSettings.stopAfterValue, stopAfterUnit: savedSettings.stopAfterUnit, oneReviewPerCustomer: savedSettings.oneReviewPerCustomer, messageTemplate: savedSettings.messageTemplate, enableReminder: savedSettings.enableReminder, reminderDays: savedSettings.reminderDays, onePerPlatform: savedSettings.onePerPlatform, linkEnabled: savedSettings.linkEnabled, timeframeEnabled: savedSettings.timeframeEnabled, distributionEnabled: savedSettings.distributionEnabled, messageEnabled: savedSettings.messageEnabled, reminderEnabled: savedSettings.reminderEnabled };
    return JSON.stringify(cur) !== JSON.stringify(sav);
  };

  const handleBack = () => { if (hasUnsavedChanges()) { setShowUnsavedChanges(true); } else { onBack(); } };
  const handleDiscard = () => { if (initialState) { localStorage.setItem(settingsKey, JSON.stringify(initialState)); } setShowUnsavedChanges(false); onBack(); };
  const handleSaveAndExit = () => {
    // Trigger any parent save logic if provided
    onSave?.();
    onBack();
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800">
      <UnsavedChangesDialog open={showUnsavedChanges} onOpenChange={setShowUnsavedChanges} onDiscard={handleDiscard} onSave={handleSaveAndExit} />

      {/* Header */}
      <div onClick={handleBack} style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }} className="flex items-center px-6 mx-4 mt-3 mb-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg">
        <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-2" />
        <span className="font-medium text-gray-900 dark:text-gray-100">{platformName} Reviews</span>
      </div>

      <div className="p-6 space-y-8">
        {/* Main Toggle Card */}
        <div className="space-y-2">
          <div className={`relative rounded-2xl border p-4 transition-all duration-300 ${isEnabled ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 shadow-md shadow-blue-100/50 dark:shadow-blue-900/20' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm'}`}>
            <div className="flex items-center gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${isEnabled ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-gray-100 dark:bg-gray-700'}`}>
                  <Star className={`w-5 h-5 transition-colors duration-300 ${isEnabled ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-sm font-medium transition-colors duration-300 ${isEnabled ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>Activate {platformName} Reviews</span>
                    <div className="relative group" onClick={(e) => e.stopPropagation()}>
                      <Info className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-help transition-colors" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                        Send automated {platformName} review requests after appointments.
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
                      </div>
                    </div>
                  </div>
                  <p className={`text-xs mt-0.5 transition-colors duration-300 ${isEnabled ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500'}`}>Send automated review requests after appointments</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 flex-shrink-0">
                <span className={`text-xs font-medium transition-colors duration-300 ${isEnabled ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>{isEnabled ? 'Enabled' : 'Disabled'}</span>
                <Switch checked={isEnabled} onCheckedChange={setIsEnabled} className="data-[state=checked]:bg-blue-600" />
              </div>
            </div>
          </div>

          <div className="relative mt-4">
            <motion.div initial={false} animate={{ opacity: isEnabled ? 1 : 0.4 }} transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}>
              <div className="space-y-8 transition-colors duration-300 pt-2" style={{ pointerEvents: isEnabled ? 'auto' : 'none' }}>

                {/* Review Link */}
                <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 space-y-3 bg-white dark:bg-gray-800/50 relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Review Link</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Paste your {platformName} review link</p>
                    </div>
                    <Switch checked={linkEnabled} onCheckedChange={setLinkEnabled} className="data-[state=checked]:bg-blue-600" />
                  </div>
                  <div className="border-l-2 border-blue-400 dark:border-blue-600 pl-4 mt-3 py-1">
                    <Input type="url" value={reviewLink} onChange={(e) => setReviewLink(e.target.value)} placeholder={`https://www.${platformName.toLowerCase().replace(/\s/g, '')}.com/...`} className="text-sm" />
                  </div>
                </div>

                <AnimatePresence>
                  {(linkEnabled || reviewLink.length > 0) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-8 pt-4 pb-2">
                        {/* Timeframe Settings */}
                        <div className="space-y-2 relative">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-gray-900 dark:text-gray-100">Select Timeframe</Label>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Control exactly when the customer receives a text</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {timeframeEnabled ? 'Timeframe On' : 'Timeframe Off'}
                              </span>
                              <Switch checked={timeframeEnabled} onCheckedChange={setTimeframeEnabled} className="data-[state=checked]:bg-blue-600" />
                            </div>
                          </div>
                          <AnimatePresence>
                            {timeframeEnabled && (
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }} className="overflow-hidden">
                                <div className="space-y-4 pt-2 ml-2 mt-2">
                                  <div className="border-l-2 border-blue-400 dark:border-blue-600 pl-4 space-y-4">
                                    <div className="space-y-2">
                                      <Label className="text-sm text-gray-700 dark:text-gray-300">Start sending reviews</Label>
                                      <Select value={startTiming} onValueChange={setStartTiming}>
                                        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="immediate">Immediately after first appointment</SelectItem>
                                          <SelectItem value="1-day">1 day after first appointment</SelectItem>
                                          <SelectItem value="3-days">3 days after first appointment</SelectItem>
                                          <SelectItem value="1-week">1 week after first appointment</SelectItem>
                                          <SelectItem value="custom">Select custom timeframe...</SelectItem>
                                        </SelectContent>
                                      </Select>

                                      <AnimatePresence>
                                        {startTiming === 'custom' && (
                                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }} className="overflow-hidden">
                                            <div className="border-l-2 border-blue-400 dark:border-blue-600 pl-4 ml-[7px] mt-2 py-1">
                                              <div className="flex items-center gap-3">
                                                <Input type="number" min="1" value={customStartValue} onChange={(e) => setCustomStartValue(e.target.value)} className="w-24" />
                                                <Select value={customStartUnit} onValueChange={setCustomStartUnit}>
                                                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="days">days</SelectItem>
                                                    <SelectItem value="weeks">weeks</SelectItem>
                                                    <SelectItem value="months">months</SelectItem>
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl relative">
                                      <div>
                                        <Label className="text-sm text-gray-700 dark:text-gray-300">Stop sending after a period</Label>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Limit review requests to a specific timeframe</p>
                                      </div>
                                      <Switch checked={stopAfterEnabled} onCheckedChange={setStopAfterEnabled} className="data-[state=checked]:bg-blue-600" />
                                    </div>
                                  </div>

                                  <AnimatePresence>
                                    {stopAfterEnabled && (
                                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }} className="overflow-hidden">
                                        <div className="border-l-2 border-blue-400 dark:border-blue-600 pl-4 ml-[31px] mt-2 py-1">
                                          <div className="flex items-center gap-3">
                                            <Input type="number" min="1" value={stopAfterValue} onChange={(e) => setStopAfterValue(e.target.value)} className="w-24" />
                                            <Select value={stopAfterUnit} onValueChange={setStopAfterUnit}>
                                              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="days">days</SelectItem>
                                                <SelectItem value="weeks">weeks</SelectItem>
                                                <SelectItem value="months">months</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Customer Distribution Logic */}
                        <div className="space-y-2 relative">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-gray-900 dark:text-gray-100">Spam Protection</Label>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Prevent spamming customers and distribute requests smartly</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {distributionEnabled ? 'Protection On' : 'Protection Off'}
                              </span>
                              <Switch checked={distributionEnabled} onCheckedChange={setDistributionEnabled} className="data-[state=checked]:bg-blue-600" />
                            </div>
                          </div>
                          <AnimatePresence>
                            {distributionEnabled && (
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }} className="overflow-hidden">
                                <div className="space-y-4 pt-2 ml-2 mt-2">
                                  <div className="border-l-2 border-blue-400 dark:border-blue-600 pl-4 space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl relative">
                                      <div className="pr-4">
                                        <Label className="text-sm text-gray-700 dark:text-gray-300">Prevent Duplicate Requests</Label>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">Don't ask repeat customers for another review if they've already been asked previously.</p>
                                      </div>
                                      <Switch checked={oneReviewPerCustomer} onCheckedChange={setOneReviewPerCustomer} className="data-[state=checked]:bg-blue-600 flex-shrink-0" />
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl relative">
                                      <div className="pr-4">
                                        <Label className="text-sm text-gray-700 dark:text-gray-300">Evenly Distribute Platforms</Label>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">If you have multiple review links, send a different link to each customer so your reviews spread evenly.</p>
                                      </div>
                                      <Switch checked={onePerPlatform} onCheckedChange={setOnePerPlatform} className="data-[state=checked]:bg-blue-600 flex-shrink-0" />
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Message Customization */}
                        <div className="space-y-2 relative">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-gray-900 dark:text-gray-100">Customize Message</Label>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Write the exact text message your customers will receive</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {messageEnabled ? 'Custom' : 'Let AI Choose'}
                              </span>
                              <Switch checked={messageEnabled} onCheckedChange={setMessageEnabled} className="data-[state=checked]:bg-blue-600" />
                            </div>
                          </div>
                          <AnimatePresence>
                            {messageEnabled && (
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }} className="overflow-hidden">
                                <div className="border-l-2 border-blue-400 dark:border-blue-600 pl-4 space-y-2 pt-2 ml-2 mt-2 py-1">
                                  <Label className="text-sm text-gray-700 dark:text-gray-300">Message Template</Label>
                                  <Textarea value={messageTemplate} onChange={(e) => setMessageTemplate(e.target.value)} rows={3} placeholder="Hi {name}, thanks for visiting {business}. Would you mind leaving a review?" className="text-sm rounded-xl" />
                                  <div onClick={handleGenerateMessage} className={`flex items-center gap-1 mt-1 text-sm ${isGeneratingMessage ? 'text-blue-400 dark:text-blue-500 cursor-wait' : 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer'} transition-colors`}>
                                    <MagicalLoadingText isLoading={isGeneratingMessage} icon={<Brain className="w-3.5 h-3.5" />}><span>Generate using AI</span></MagicalLoadingText>
                                  </div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Use {'{name}'}, {'{business}'}, {'{link}'} as placeholders</p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Reminder Logic */}
                        <div className="space-y-2 relative">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-gray-900 dark:text-gray-100">Automatic Follow-ups</Label>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Send a gentle nudge if they forget to reply</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {reminderEnabled ? 'On' : 'Off'}
                              </span>
                              <Switch checked={reminderEnabled} onCheckedChange={setReminderEnabled} className="data-[state=checked]:bg-blue-600" />
                            </div>
                          </div>
                          <AnimatePresence>
                            {reminderEnabled && (
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }} className="overflow-hidden">
                                <div className="space-y-3 pt-2 ml-2 mt-2">
                                  <div className="border-l-2 border-blue-400 dark:border-blue-600 pl-4">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl relative">
                                      <div>
                                        <Label className="text-sm text-gray-700 dark:text-gray-300">Enable follow-up reminder</Label>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Check in if they had a chance, or ask why they haven't replied</p>
                                      </div>
                                      <Switch checked={enableReminder} onCheckedChange={setEnableReminder} className="data-[state=checked]:bg-blue-600" />
                                    </div>
                                  </div>
                                  <AnimatePresence>
                                    {enableReminder && (
                                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }} className="overflow-hidden">
                                        <div className="border-l-2 border-blue-400 dark:border-blue-600 pl-4 ml-[31px] mt-2 py-1">
                                          <div className="flex items-center gap-3">
                                            <Label className="text-sm text-gray-700 dark:text-gray-300">Follow up after</Label>
                                            <Input type="number" min="1" value={reminderDays} onChange={(e) => setReminderDays(e.target.value)} className="w-20" />
                                            <span className="text-sm text-gray-500 dark:text-gray-400">days</span>
                                          </div>
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
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
            </motion.div>
            {!isEnabled && <div className="absolute inset-0 z-10 cursor-not-allowed" />}
          </div>

        </div>
      </div>
    </div>
  );
}
