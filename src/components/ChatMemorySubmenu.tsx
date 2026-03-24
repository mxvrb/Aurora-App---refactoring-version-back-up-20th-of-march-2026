import React, { useState } from 'react';
import { ChevronLeft, ChevronDown, Check, Clock, Calendar, Ban, MessageSquareText, ShieldCheck } from 'lucide-react';
import { CalendarFold, CalendarRange, CalendarDays, Database, MessageCircleReply } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { toast } from "sonner";
import { MagicalLoadingText } from './MagicalLoadingText';
import { MemoryUnitDropdown } from './MemoryUnitDropdown';
import LucideBrain from '../imports/LucideBrain';
import { supabase } from '../utils/supabase/client';
import { projectId } from '../utils/supabase/info';

export interface ChatMemorySubmenuProps {
  handleNavigationAttempt: (target: string | null) => void;
  tempChatMemory: boolean;
  setTempChatMemory: React.Dispatch<React.SetStateAction<boolean>>;
  tempChatMemoryScope: string;
  setTempChatMemoryScope: React.Dispatch<React.SetStateAction<string>>;
  memoryRetentionDropdownOpen: boolean;
  setMemoryRetentionDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  tempCustomRetentionValue: number;
  setTempCustomRetentionValue: React.Dispatch<React.SetStateAction<number>>;
  tempCustomRetentionUnit: string;
  setTempCustomRetentionUnit: React.Dispatch<React.SetStateAction<string>>;
  tempAutoTranslationDetection: boolean;
  setTempAutoTranslationDetection: React.Dispatch<React.SetStateAction<boolean>>;
  tempTranslationMessage: string;
  setTempTranslationMessage: React.Dispatch<React.SetStateAction<string>>;
  isGeneratingTranslationMessage: boolean;
  setIsGeneratingTranslationMessage: React.Dispatch<React.SetStateAction<boolean>>;
  tempSpamBehavior: 'let-ai-choose' | 'ignore-user' | 'custom-behavior';
  setTempSpamBehavior: React.Dispatch<React.SetStateAction<'let-ai-choose' | 'ignore-user' | 'custom-behavior'>>;
  spamBehaviorDropdownOpen: boolean;
  setSpamBehaviorDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  tempCustomSpamBehavior: string;
  setTempCustomSpamBehavior: React.Dispatch<React.SetStateAction<string>>;
  isGeneratingSpamBehavior: boolean;
  setIsGeneratingSpamBehavior: React.Dispatch<React.SetStateAction<boolean>>;
  setChatMemory: React.Dispatch<React.SetStateAction<boolean>>;
  setChatMemoryScope: React.Dispatch<React.SetStateAction<string>>;
  setAutoTranslationDetection: React.Dispatch<React.SetStateAction<boolean>>;
  setTranslationMessage: React.Dispatch<React.SetStateAction<string>>;
  setActiveSubmenu: (submenu: string | null) => void;
  companyName: string;
  businessName: string;
  lineOfBusiness: string;
  accessToken: string | null;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
  onSave?: () => void;
}

export function ChatMemorySubmenu(props: ChatMemorySubmenuProps) {
  const {
    handleNavigationAttempt,
    tempChatMemory, setTempChatMemory,
    tempChatMemoryScope, setTempChatMemoryScope,
    memoryRetentionDropdownOpen, setMemoryRetentionDropdownOpen,
    tempCustomRetentionValue, setTempCustomRetentionValue,
    tempCustomRetentionUnit, setTempCustomRetentionUnit,
    tempAutoTranslationDetection, setTempAutoTranslationDetection,
    tempTranslationMessage, setTempTranslationMessage,
    isGeneratingTranslationMessage, setIsGeneratingTranslationMessage,
    tempSpamBehavior, setTempSpamBehavior,
    spamBehaviorDropdownOpen, setSpamBehaviorDropdownOpen,
    tempCustomSpamBehavior, setTempCustomSpamBehavior,
    isGeneratingSpamBehavior, setIsGeneratingSpamBehavior,
    setChatMemory, setChatMemoryScope,
    setAutoTranslationDetection, setTranslationMessage,
    setActiveSubmenu,
    companyName, businessName, lineOfBusiness,
    accessToken, setAccessToken,
    onSave,
  } = props;

  return (
    <div className="w-full bg-white dark:bg-gray-800">
      {/* Floating glassmorphism back button */}
      <div 
        onClick={() => handleNavigationAttempt('edit-template')}
        style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
        className="flex items-center px-6 mx-4 mt-3 mb-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg"
      >
        <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-2" />
        <span className="font-medium text-gray-900 dark:text-gray-100">Manage AI Behavior</span>
      </div>
      
      <div className="p-6 space-y-8">
        {/* Enable Chat Memory Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-900 dark:text-gray-100">Enable Chat Memory</Label>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">AI will remember previous messages in the conversation</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {tempChatMemory ? 'Memory On' : 'Memory Off'}
              </span>
              <Switch
                checked={tempChatMemory}
                onCheckedChange={setTempChatMemory}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
          </div>
          
          {/* Memory Scope Options */}
          {tempChatMemory && (
            <div className="space-y-3 pt-2 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
                  <div className="space-y-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Memory Retention Period</p>
                    <div className="relative">
                      {/* Custom Dropdown Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const newState = !memoryRetentionDropdownOpen;
                          setMemoryRetentionDropdownOpen(newState);
                        }}
                        className="w-full h-9 px-2.5 text-sm flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
                      >
                        <span className="flex items-center gap-1.5">
                          {tempChatMemoryScope === 'last-message' && <MessageCircleReply className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />}
                          {tempChatMemoryScope === 'current-day' && <Calendar className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />}
                          {tempChatMemoryScope === 'current-week' && <CalendarFold className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />}
                          {tempChatMemoryScope === 'current-month' && <CalendarRange className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />}
                          {tempChatMemoryScope === 'current-year' && <CalendarDays className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />}
                          {tempChatMemoryScope === 'full-conversation' && <Database className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />}
                          {tempChatMemoryScope === 'custom' && <Clock className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />}
                          <span className="text-gray-900 dark:text-gray-100">
                            {tempChatMemoryScope === 'last-message' && 'Last Message Only'}
                            {tempChatMemoryScope === 'current-day' && 'Current Day'}
                            {tempChatMemoryScope === 'current-week' && 'Current Week'}
                            {tempChatMemoryScope === 'current-month' && 'Current Month'}
                            {tempChatMemoryScope === 'current-year' && 'Current Year'}
                            {tempChatMemoryScope === 'full-conversation' && 'Full Conversation'}
                            {tempChatMemoryScope === 'custom' && 'Custom'}
                            {!tempChatMemoryScope && 'Select retention period'}
                          </span>
                        </span>
                        <ChevronDown className={`w-3.5 h-3.5 text-gray-600 dark:text-gray-400 transition-transform duration-200 ${memoryRetentionDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Custom Dropdown Menu */}
                      {memoryRetentionDropdownOpen && (
                        <>
                          {/* Backdrop */}
                          <div 
                            className="fixed inset-0 z-40"
                            onClick={() => setMemoryRetentionDropdownOpen(false)}
                          />
                          
                          {/* Dropdown Menu */}
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg overflow-hidden"
                          >
                            {/* Sticky Custom Option */}
                            <div className="border-b border-gray-100 dark:border-gray-700">
                              <button
                                type="button"
                                onClick={() => {
                                  setTempChatMemoryScope('custom');
                                  setMemoryRetentionDropdownOpen(false);
                                }}
                                className={`w-full px-2.5 py-2 text-sm flex items-center gap-1.5 transition-colors duration-150 ${
                                  tempChatMemoryScope === 'custom' 
                                    ? 'bg-blue-50 dark:bg-blue-900/30' 
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                              >
                                <Clock className={`w-3.5 h-3.5 ${tempChatMemoryScope === 'custom' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`} />
                                <span className={`flex-1 text-left ${tempChatMemoryScope === 'custom' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'}`}>
                                  Custom
                                </span>
                                {tempChatMemoryScope === 'custom' && (
                                  <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                )}
                              </button>
                            </div>

                            <div className="py-0.5 max-h-[6.5rem] overflow-y-auto">
                              {[
                                { value: 'last-message', icon: MessageCircleReply, label: 'Last Message Only' },
                                { value: 'current-day', icon: Calendar, label: 'Current Day' },
                                { value: 'current-week', icon: CalendarFold, label: 'Current Week' },
                                { value: 'current-month', icon: CalendarRange, label: 'Current Month' },
                                { value: 'current-year', icon: CalendarDays, label: 'Current Year' },
                                { value: 'full-conversation', icon: Database, label: 'Full Conversation' },
                              ].map((option) => {
                                const Icon = option.icon;
                                const isSelected = tempChatMemoryScope === option.value;
                                return (
                                  <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                      setTempChatMemoryScope(option.value);
                                      setMemoryRetentionDropdownOpen(false);
                                    }}
                                    className={`w-full px-2.5 py-1.5 text-sm flex items-center gap-1.5 transition-colors duration-150 ${
                                      isSelected 
                                        ? 'bg-blue-50 dark:bg-blue-900/30' 
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                  >
                                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`} />
                                    <span className={`flex-1 text-left ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'}`}>
                                      {option.label}
                                    </span>
                                    {isSelected && (
                                      <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        </>
                      )}
                    </div>

                    {tempChatMemoryScope === 'custom' && (
                      <div className="mt-1.5 px-2 py-1.5 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                           <span className="text-sm text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">Memory Period:</span>
                           <div className="flex items-center gap-1.5">
                             <input 
                               type="number" 
                               min="1"
                               value={tempCustomRetentionValue}
                               onChange={(e) => setTempCustomRetentionValue(Math.max(1, parseInt(e.target.value) || 1))}
                               className="w-14 px-2 py-1 h-8 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-1 focus:ring-blue-500 outline-none text-gray-900 dark:text-gray-100"
                             />
                             <MemoryUnitDropdown 
                               value={tempCustomRetentionUnit}
                               onChange={setTempCustomRetentionUnit}
                             />
                           </div>
                        </div>
                        
                        {/* Dynamic Equivalent Display */}
                        {(() => {
                          const value = tempCustomRetentionValue;
                          const unit = tempCustomRetentionUnit;
                          
                          let showDisplay = false;
                          let displayContent = '';
                          
                          if (unit === 'hours' && value >= 24) {
                            showDisplay = true;
                            const days = Math.floor(value / 24);
                            const remainingHours = value % 24;
                            
                            if (days < 7) {
                              const parts = [`${days} day${days !== 1 ? 's' : ''}`];
                              if (remainingHours > 0) parts.push(`${remainingHours} hr${remainingHours !== 1 ? 's' : ''}`);
                              displayContent = parts.join(', ');
                            } else {
                              const weeks = Math.floor(days / 7);
                              const remainingDays = days % 7;
                              const parts = [`${weeks} week${weeks !== 1 ? 's' : ''}`];
                              if (remainingDays > 0) parts.push(`${remainingDays} day${remainingDays !== 1 ? 's' : ''}`);
                              if (remainingHours > 0) parts.push(`${remainingHours} hr${remainingHours !== 1 ? 's' : ''}`);
                              displayContent = parts.join(', ');
                            }
                          } else if (unit === 'days' && value >= 7) {
                            showDisplay = true;
                            const weeks = Math.floor(value / 7);
                            const remainingDays = value % 7;
                            const parts = [`${weeks} week${weeks !== 1 ? 's' : ''}`];
                            if (remainingDays > 0) parts.push(`${remainingDays} day${remainingDays !== 1 ? 's' : ''}`);
                            displayContent = parts.join(', ');
                          }
                          
                          if (showDisplay) {
                            return (
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 pl-0.5">
                                = <span className="font-medium text-gray-700 dark:text-gray-300">{displayContent}</span>
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    )}
                  </div>
                </div>
            )}
        </div>
        
        {/* Auto Translation Detection Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-900 dark:text-gray-100">Auto Translation Detection</Label>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Automatically detect and handle messages in other languages</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {tempAutoTranslationDetection ? 'Detection On' : 'Detection Off'}
              </span>
              <Switch
                checked={tempAutoTranslationDetection}
                onCheckedChange={(checked) => {
                  setTempAutoTranslationDetection(checked);
                  if (!checked) {
                    setTempTranslationMessage('');
                  }
                }}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
          </div>
          
          {/* Custom Message for When Auto Translation is Off */}
          {!tempAutoTranslationDetection && (
            <div className="pl-4 border-l-2 border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Message sent when non-English language is detected</p>
                  <textarea
                    rows={2}
                    placeholder="Enter custom message..."
                    value={tempTranslationMessage}
                    onChange={(e) => setTempTranslationMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <button
                    onClick={async () => {
                  if (isGeneratingTranslationMessage) return;

                  let token = accessToken;
                  if (!token) {
                    try {
                      const { data: { session } } = await supabase.auth.getSession();
                      token = session?.access_token || null;
                      if (token) setAccessToken(token);
                    } catch (e) {
                      console.error("Failed to get session", e);
                    }
                  }

                  if (!token) {
                    toast.error('Please log in to generate messages');
                    return;
                  }

                  setIsGeneratingTranslationMessage(true);
                  toast.info('Generating message...');
                  
                  const actualCompanyName = companyName || businessName || '';
                  const businessType = lineOfBusiness || '';
                  
                  fetch(`https://${projectId}.supabase.co/functions/v1/make-server-35e72f4d/translation-message/generate`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                      companyName: actualCompanyName,
                      lineOfBusiness: businessType
                    })
                  })
                  .then(async response => {
                    const data = await response.json();
                    if (!response.ok) {
                      throw new Error(data.error || `Server error: ${response.status}`);
                    }
                    return data;
                  })
                  .then(data => {
                    if (data.success && data.message) {
                      setTempTranslationMessage(data.message);
                      setIsGeneratingTranslationMessage(false);
                      toast.success('Message generated successfully!');
                    } else {
                      console.error('Translation message generation error:', data.error || 'No message returned');
                      setIsGeneratingTranslationMessage(false);
                      toast.error(data.error || 'Failed to generate message');
                    }
                  })
                  .catch(error => {
                    console.error('Translation message generation error details:', error);
                    setIsGeneratingTranslationMessage(false);
                    toast.error(error.message || 'Network error. Please try again.');
                  });
                }}
                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md ${isGeneratingTranslationMessage ? 'text-blue-400 dark:text-blue-500' : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'} ${isGeneratingTranslationMessage ? 'cursor-wait' : 'cursor-pointer'} transition-all`}
              >
                <MagicalLoadingText isLoading={isGeneratingTranslationMessage} icon={<LucideBrain className="w-3 h-3" />}>
                  <span>Generate using AI</span>
                </MagicalLoadingText>
              </button>
            </div>
          )}
        </div>
        
        {/* AI Behavior to Spam or Hostile Users Section */}
        <div className="space-y-2">
          <div>
            <Label className="text-gray-900 dark:text-gray-100">AI Behavior to Spam or Hostile Users</Label>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Choose how the AI should respond to spam or hostile messages</p>
          </div>
          <div className="relative">
            {/* Custom Dropdown Button */}
            <button
              type="button"
              onClick={() => {
                const newState = !spamBehaviorDropdownOpen;
                setSpamBehaviorDropdownOpen(newState);
              }}
              className="w-full h-9 px-2.5 text-sm flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <span className="flex items-center gap-1.5">
                {tempSpamBehavior === 'let-ai-choose' && <ShieldCheck className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />}
                {tempSpamBehavior === 'ignore-user' && <Ban className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />}
                {tempSpamBehavior === 'custom-behavior' && <MessageSquareText className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />}
                <span className="text-gray-900 dark:text-gray-100">
                  {tempSpamBehavior === 'let-ai-choose' && 'Let AI Choose'}
                  {tempSpamBehavior === 'ignore-user' && 'Ignore User'}
                  {tempSpamBehavior === 'custom-behavior' && 'Custom Behavior'}
                </span>
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-600 dark:text-gray-400 transition-transform duration-200 ${spamBehaviorDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Custom Dropdown Menu */}
            {spamBehaviorDropdownOpen && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setSpamBehaviorDropdownOpen(false)}
                />
                
                {/* Dropdown Menu */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg overflow-hidden"
                >
                  <div className="py-0.5">
                    {[
                      { value: 'let-ai-choose', icon: ShieldCheck, label: 'Let AI Choose' },
                      { value: 'ignore-user', icon: Ban, label: 'Ignore User' },
                      { value: 'custom-behavior', icon: MessageSquareText, label: 'Custom Behavior' },
                    ].map((option) => {
                      const Icon = option.icon;
                      const isSelected = tempSpamBehavior === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setTempSpamBehavior(option.value as 'let-ai-choose' | 'ignore-user' | 'custom-behavior');
                            setSpamBehaviorDropdownOpen(false);
                          }}
                          className={`w-full px-2.5 py-1.5 text-sm flex items-center gap-1.5 transition-colors duration-150 ${
                            isSelected 
                              ? 'bg-blue-50 dark:bg-blue-900/30' 
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`} />
                          <span className={`flex-1 text-left ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'}`}>
                            {option.label}
                          </span>
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </>
            )}
          </div>
          
          {/* Custom Behavior Textarea */}
          <AnimatePresence>
            {tempSpamBehavior === 'custom-behavior' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Define how the AI should behave when encountering spam or hostile users</p>
                  <textarea
                    rows={2}
                    placeholder="Write your custom behavior..."
                    value={tempCustomSpamBehavior}
                    onChange={(e) => setTempCustomSpamBehavior(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <button
                    onClick={() => {
                      if (isGeneratingSpamBehavior) return;
                      setIsGeneratingSpamBehavior(true);
                      toast.info('Generating behavior instructions...');
                      
                      const actualCompanyName = companyName || businessName || '';
                      const businessType = lineOfBusiness || '';
                      
                      fetch(`https://${projectId}.supabase.co/functions/v1/make-server-35e72f4d/spam-behavior/generate`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${accessToken}`
                        },
                        body: JSON.stringify({
                          companyName: actualCompanyName,
                          lineOfBusiness: businessType
                        })
                      })
                      .then(async response => {
                        const data = await response.json();
                        return data;
                      })
                      .then(data => {
                        if (data.success && data.behavior) {
                          setTempCustomSpamBehavior(data.behavior);
                          setIsGeneratingSpamBehavior(false);
                          toast.success('Behavior generated successfully!');
                        } else {
                          console.error('Spam behavior generation error:', data.error || data);
                          setIsGeneratingSpamBehavior(false);
                          toast.error(data.error || 'Failed to generate behavior');
                        }
                      })
                      .catch(error => {
                        console.error('Spam behavior generation network error:', error);
                        setIsGeneratingSpamBehavior(false);
                        toast.error('Network error. Please try again.');
                      });
                    }}
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md ${isGeneratingSpamBehavior ? 'text-blue-400 dark:text-blue-500' : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'} ${isGeneratingSpamBehavior ? 'cursor-wait' : 'cursor-pointer'} transition-all`}
                  >
                    <MagicalLoadingText isLoading={isGeneratingSpamBehavior} icon={<LucideBrain className="w-3 h-3" />}>
                      <span>Generate using AI</span>
                    </MagicalLoadingText>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <Button 
          onClick={() => {
            setChatMemory(tempChatMemory);
            setChatMemoryScope(tempChatMemoryScope);
            setAutoTranslationDetection(tempAutoTranslationDetection);
            setTranslationMessage(tempTranslationMessage);
            // Update completion flags for the filter system
            try {
              const rawFlags = localStorage.getItem('acesai_setup_completion_flags');
              const flags = rawFlags ? JSON.parse(rawFlags) : {};
              flags['Manage AI Behavior'] = true;
              localStorage.setItem('acesai_setup_completion_flags', JSON.stringify(flags));
            } catch (e) {
              console.error('Error updating completion flags:', e);
            }
            onSave?.();
            setActiveSubmenu('edit-template');
            toast.success('Chat behavior settings updated successfully');
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
}
