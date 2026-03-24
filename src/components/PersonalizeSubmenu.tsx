import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, PencilLine } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { MagicalLoadingText } from './MagicalLoadingText';
import { CreativityTooltipNew } from './CreativityTooltipNew';
import { EmojiUsageSelect } from './EmojiUsageSelect';
import LucideBrain from '../imports/LucideBrain';
import Vector from '../imports/Vector';
import { projectId } from '../utils/supabase/info';

interface PersonalizeSubmenuProps {
  activeSubmenu: string | null;
  setActiveSubmenu: (submenu: string | null) => void;
  handleNavigationAttempt: (target: string | null) => void;
  hasUnsavedChanges: (submenu: string) => boolean;
  setIsLearnModalOpen: (open: boolean) => void;

  // AI Persona
  aiPersona: string;
  tempAiPersona: string;
  setTempAiPersona: (v: string) => void;
  setAiPersona: (v: string) => void;
  creativityLevel: number;
  tempCreativityLevel: number;
  setTempCreativityLevel: (v: number) => void;
  setCreativityLevel: (v: number) => void;
  emojiUse: string;
  tempEmojiUse: string;
  setTempEmojiUse: (v: string) => void;
  setEmojiUse: (v: string) => void;
  isGeneratingPersona: boolean;
  setIsGeneratingPersona: (v: boolean) => void;
  companyName: string;
  businessName: string;
  lineOfBusiness: string;
  accessToken: string;

  // Chat Memory
  chatMemory: boolean;
  tempChatMemory: boolean;
  setTempChatMemory: (v: boolean) => void;
  chatMemoryScope: string;
  tempChatMemoryScope: string;
  setTempChatMemoryScope: (v: string) => void;
  autoTranslationDetection: boolean;
  tempAutoTranslationDetection: boolean;
  setTempAutoTranslationDetection: (v: boolean) => void;
  translationMessage: string;
  tempTranslationMessage: string;
  setTempTranslationMessage: (v: string) => void;

  // Customize Responses
  customResponses: string;
  tempCustomResponses: string;
  setTempCustomResponses: (v: string) => void;
  aiInitialGreeting: string;
  tempAiInitialGreeting: string;
  setTempAiInitialGreeting: (v: string) => void;
  initialGreetingMode: string;
  tempInitialGreetingMode: string;
  setTempInitialGreetingMode: (v: string) => void;
  responseStructure: string;
  tempResponseStructure: string;
  setTempResponseStructure: (v: string) => void;
  responseStructureCustom: string;
  tempResponseStructureCustom: string;
  setTempResponseStructureCustom: (v: string) => void;
  mixedFormats: string[];
  tempMixedFormats: string[];
  setTempMixedFormats: (v: string[]) => void;
  autoSignatureText: string;
  tempAutoSignatureText: string;
  setTempAutoSignatureText: (v: string) => void;
  autoSignatureEnabled: boolean;
  tempAutoSignatureEnabled: boolean;
  setTempAutoSignatureEnabled: (v: boolean) => void;
  keywordScenarios: any[];
  tempKeywordScenarios: any[];
  setTempKeywordScenarios: (v: any[]) => void;

  // Response Timing
  responseTiming: string;
  tempResponseTiming: string;
  setTempResponseTiming: (v: string) => void;
  randomTimingPattern: number[];
  tempRandomTimingPattern: number[];
  setTempRandomTimingPattern: (v: number[]) => void;

  // Humanize
  humanize: boolean;
  tempHumanize: boolean;
  setTempHumanize: (v: boolean) => void;
  setHumanizeDirty: (v: boolean) => void;

  // Boundaries
  sensitivitiesEnabled: boolean;
  tempSensitivitiesEnabled: boolean;
  setTempSensitivitiesEnabled: (v: boolean) => void;
  sensitivityInstructions: string;
  tempSensitivityInstructions: string;
  setTempSensitivityInstructions: (v: string) => void;
  ageRestrictionsEnabled: boolean;
  tempAgeRestrictionsEnabled: boolean;
  setTempAgeRestrictionsEnabled: (v: boolean) => void;
  ageRestrictionValue: number;
  tempAgeRestrictionValue: number;
  setTempAgeRestrictionValue: (v: number) => void;
  verificationsEnabled: boolean;
  tempVerificationsEnabled: boolean;
  setTempVerificationsEnabled: (v: boolean) => void;
  maxMessagesEnabled: boolean;
  tempMaxMessagesEnabled: boolean;
  setTempMaxMessagesEnabled: (v: boolean) => void;
  maxMessagesInfinite: boolean;
  tempMaxMessagesInfinite: boolean;
  setTempMaxMessagesInfinite: (v: boolean) => void;
  maxMessagesValue: number;
  tempMaxMessagesValue: number;
  setTempMaxMessagesValue: (v: number) => void;

  // Unsaved changes dialog
  setPendingNavigation: (v: string) => void;
  setUnsavedSubmenu: (v: string) => void;
  setShowUnsavedChangesDialog: (v: boolean) => void;

  // Initial Greeting
  initialGreeting: string;
  tempInitialGreeting: string;
  setTempInitialGreeting: (v: string) => void;
  setInitialGreeting: (v: string) => void;
  isGeneratingGreeting: boolean;
  setIsGeneratingGreeting: (v: boolean) => void;
  onSave?: () => void;
}

export function PersonalizeSubmenu(props: PersonalizeSubmenuProps) {
  const {
    activeSubmenu, setActiveSubmenu, handleNavigationAttempt, hasUnsavedChanges,
    setIsLearnModalOpen, aiPersona, tempAiPersona, setTempAiPersona, setAiPersona,
    creativityLevel, tempCreativityLevel, setTempCreativityLevel, setCreativityLevel,
    emojiUse, tempEmojiUse, setTempEmojiUse, setEmojiUse,
    isGeneratingPersona, setIsGeneratingPersona, companyName, businessName,
    lineOfBusiness, accessToken, chatMemory, tempChatMemory, setTempChatMemory,
    chatMemoryScope, tempChatMemoryScope, setTempChatMemoryScope,
    autoTranslationDetection, tempAutoTranslationDetection, setTempAutoTranslationDetection,
    translationMessage, tempTranslationMessage, setTempTranslationMessage,
    customResponses, tempCustomResponses, setTempCustomResponses,
    aiInitialGreeting, tempAiInitialGreeting, setTempAiInitialGreeting,
    initialGreetingMode, tempInitialGreetingMode, setTempInitialGreetingMode,
    responseStructure, tempResponseStructure, setTempResponseStructure,
    responseStructureCustom, tempResponseStructureCustom, setTempResponseStructureCustom,
    mixedFormats, tempMixedFormats, setTempMixedFormats,
    autoSignatureText, tempAutoSignatureText, setTempAutoSignatureText,
    autoSignatureEnabled, tempAutoSignatureEnabled, setTempAutoSignatureEnabled,
    keywordScenarios, tempKeywordScenarios, setTempKeywordScenarios,
    responseTiming, tempResponseTiming, setTempResponseTiming,
    randomTimingPattern, tempRandomTimingPattern, setTempRandomTimingPattern,
    humanize, tempHumanize, setTempHumanize, setHumanizeDirty,
    sensitivitiesEnabled, tempSensitivitiesEnabled, setTempSensitivitiesEnabled,
    sensitivityInstructions, tempSensitivityInstructions, setTempSensitivityInstructions,
    ageRestrictionsEnabled, tempAgeRestrictionsEnabled, setTempAgeRestrictionsEnabled,
    ageRestrictionValue, tempAgeRestrictionValue, setTempAgeRestrictionValue,
    verificationsEnabled, tempVerificationsEnabled, setTempVerificationsEnabled,
    maxMessagesEnabled, tempMaxMessagesEnabled, setTempMaxMessagesEnabled,
    maxMessagesInfinite, tempMaxMessagesInfinite, setTempMaxMessagesInfinite,
    maxMessagesValue, tempMaxMessagesValue, setTempMaxMessagesValue,
    setPendingNavigation, setUnsavedSubmenu, setShowUnsavedChangesDialog,
    initialGreeting, tempInitialGreeting, setTempInitialGreeting, setInitialGreeting,
    isGeneratingGreeting, setIsGeneratingGreeting,
    onSave,
  } = props;

  if (activeSubmenu !== 'edit-template' && activeSubmenu !== 'ai-persona' && activeSubmenu !== 'initial-greeting') {
    return null;
  }

  // ── edit-template (Personalize) ──
  if (activeSubmenu === 'edit-template') {
    return (
      <div className="w-full bg-white dark:bg-gray-800">
        {/* Apple-style CTA Header - Structured as 4 stacked menu items */}
        <div className="relative bg-white dark:bg-gray-800">
          <div className="px-6 py-4 flex items-center justify-between border-b border-transparent">
            <span className="font-medium opacity-0">Spacer</span>
          </div>
          <div className="px-6 py-4 flex items-center justify-between border-b border-transparent">
            <span className="font-medium opacity-0">Spacer</span>
          </div>
          <div className="px-6 py-4 flex items-center justify-between border-b border-transparent">
            <span className="font-medium opacity-0">Spacer</span>
          </div>
          <div className="px-6 py-4 flex items-center justify-between border-b border-transparent">
            <span className="font-medium opacity-0">Spacer</span>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="w-[68px] h-[68px] rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-4 shadow-xl">
              <PencilLine className="w-[34px] h-[34px] text-white drop-shadow-lg" />
            </div>
            <span className="font-medium text-gray-900 dark:text-gray-100 mb-2 drop-shadow-md">Personalize</span>
            <p className="text-sm text-gray-900 dark:text-gray-100 text-center max-w-3xl px-4 drop-shadow-md">Fully customize your AI's persona and behavior. Configure personality traits, memory settings, custom responses, response timing, human-like imperfections, and operational boundaries.</p>
          </div>
          <button 
            onClick={() => {
              console.log('Learn button clicked - Personalize');
              setIsLearnModalOpen(true);
            }}
            title="Learn how to use Aces AI"
            className="absolute top-6 right-6 flex items-center space-x-2 text-gray-500 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors cursor-pointer pointer-events-auto"
          >
            <div className="w-5 h-5">
              <Vector />
            </div>
            <span className="font-medium">Learn</span>
          </button>
        </div>

        {/* Menu Items Container with spacing */}
        <div className="flex flex-col gap-3 px-4 pb-3">
          {/* 1. Shape AI Persona */}
          <div 
            onClick={() => {
              if (activeSubmenu && activeSubmenu !== 'edit-template' && hasUnsavedChanges(activeSubmenu)) {
                setTempAiPersona(aiPersona);
                setTempCreativityLevel(creativityLevel);
                setTempEmojiUse(emojiUse);
                setPendingNavigation('ai-persona');
                setUnsavedSubmenu(activeSubmenu);
                setShowUnsavedChangesDialog(true);
              } else {
                setTempAiPersona(aiPersona);
                setTempCreativityLevel(creativityLevel);
                setTempEmojiUse(emojiUse);
                setActiveSubmenu('ai-persona');
              }
            }}
            style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
            className="flex items-center justify-between px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg"
          >
            <span className="font-medium text-gray-900 dark:text-gray-100">Shape AI Persona</span>
            <div className="flex items-center space-x-2">
              {aiPersona && <span className="text-gray-600 dark:text-gray-400 max-w-[200px] truncate">{aiPersona}, {creativityLevel}%</span>}
              <ChevronRight className="w-5 h-5 text-gray-900 dark:text-gray-100" />
            </div>
          </div>

          {/* 2. Manage AI Behavior */}
          <div 
            onClick={() => {
              if (activeSubmenu && activeSubmenu !== 'edit-template' && hasUnsavedChanges(activeSubmenu)) {
                setTempChatMemory(chatMemory);
                setTempChatMemoryScope(chatMemoryScope);
                setTempAutoTranslationDetection(autoTranslationDetection);
                setTempTranslationMessage(translationMessage);
                setPendingNavigation('chat-memory');
                setUnsavedSubmenu(activeSubmenu);
                setShowUnsavedChangesDialog(true);
              } else {
                setTempChatMemory(chatMemory);
                setActiveSubmenu('chat-memory');
              }
            }}
            style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
            className="flex items-center justify-between px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg"
          >
            <span className="font-medium text-gray-900 dark:text-gray-100">Manage AI Behavior</span>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600 dark:text-gray-400">{chatMemory ? 'On' : 'Off'}</span>
              <ChevronRight className="w-5 h-5 text-gray-900 dark:text-gray-100" />
            </div>
          </div>

          {/* 3. Customize Responses */}
          <div 
            onClick={() => {
              if (activeSubmenu && activeSubmenu !== 'edit-template' && hasUnsavedChanges(activeSubmenu)) {
                setTempCustomResponses(customResponses);
                setTempAiInitialGreeting(aiInitialGreeting);
                setTempInitialGreetingMode(initialGreetingMode);
                setTempResponseStructure(responseStructure);
                setTempResponseStructureCustom(responseStructureCustom);
                setTempMixedFormats([...mixedFormats]);
                setTempAutoSignatureText(autoSignatureText);
                setTempAutoSignatureEnabled(autoSignatureEnabled);
                setTempKeywordScenarios([...keywordScenarios]);
                setPendingNavigation('customize-responses');
                setUnsavedSubmenu(activeSubmenu);
                setShowUnsavedChangesDialog(true);
              } else {
                setTempCustomResponses(customResponses);
                setTempAiInitialGreeting(aiInitialGreeting);
                setTempInitialGreetingMode(initialGreetingMode);
                setTempResponseStructure(responseStructure);
                setTempResponseStructureCustom(responseStructureCustom);
                setTempMixedFormats([...mixedFormats]);
                setTempAutoSignatureText(autoSignatureText);
                setTempAutoSignatureEnabled(autoSignatureEnabled);
                setTempKeywordScenarios([...keywordScenarios]);
                setActiveSubmenu('customize-responses');
              }
            }}
            style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
            className="flex items-center justify-between px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg"
          >
            <span className="font-medium text-gray-900 dark:text-gray-100">Customize Responses</span>
            <div className="flex items-center space-x-2">
              {customResponses && <span className="text-gray-600 dark:text-gray-400 max-w-[200px] truncate">{customResponses}</span>}
              <ChevronRight className="w-5 h-5 text-gray-900 dark:text-gray-100" />
            </div>
          </div>

          {/* 4. Adjust Response Timing */}
          <div 
            onClick={() => {
              if (activeSubmenu && activeSubmenu !== 'edit-template' && hasUnsavedChanges(activeSubmenu)) {
                setTempResponseTiming(responseTiming);
                setTempRandomTimingPattern([...randomTimingPattern]);
                setPendingNavigation('response-timing');
                setUnsavedSubmenu(activeSubmenu);
                setShowUnsavedChangesDialog(true);
              } else {
                setTempResponseTiming(responseTiming);
                setTempRandomTimingPattern([...randomTimingPattern]);
                setActiveSubmenu('response-timing');
              }
            }}
            style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
            className="flex items-center justify-between px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg"
          >
            <span className="font-medium text-gray-900 dark:text-gray-100">Adjust Response Timing</span>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600 dark:text-gray-400 capitalize">
                {responseTiming}
              </span>
              <ChevronRight className="w-5 h-5 text-gray-900 dark:text-gray-100" />
            </div>
          </div>

          {/* 5. Humanize AI */}
          <div 
            onClick={() => {
              if (activeSubmenu && activeSubmenu !== 'edit-template' && hasUnsavedChanges(activeSubmenu)) {
                setTempHumanize(humanize);
                setHumanizeDirty(false);
                setPendingNavigation('humanize');
                setUnsavedSubmenu(activeSubmenu);
                setShowUnsavedChangesDialog(true);
              } else {
                setTempHumanize(humanize);
                setHumanizeDirty(false);
                setActiveSubmenu('humanize');
              }
            }}
            style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
            className="flex items-center justify-between px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg"
          >
            <span className="font-medium text-gray-900 dark:text-gray-100">Humanize AI</span>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600 dark:text-gray-400">{humanize ? 'On' : 'Off'}</span>
              <ChevronRight className="w-5 h-5 text-gray-900 dark:text-gray-100" />
            </div>
          </div>

          {/* 6. Set Boundaries & Restrictions */}
          <div 
            onClick={() => {
              if (activeSubmenu && activeSubmenu !== 'edit-template' && hasUnsavedChanges(activeSubmenu)) {
                setTempSensitivitiesEnabled(sensitivitiesEnabled);
                setTempSensitivityInstructions(sensitivityInstructions);
                setTempAgeRestrictionsEnabled(ageRestrictionsEnabled);
                setTempAgeRestrictionValue(ageRestrictionValue);
                setTempVerificationsEnabled(verificationsEnabled);
                setTempMaxMessagesEnabled(maxMessagesEnabled);
                setTempMaxMessagesInfinite(maxMessagesInfinite);
                setTempMaxMessagesValue(maxMessagesValue);
                setPendingNavigation('boundaries-restrictions');
                setUnsavedSubmenu(activeSubmenu);
                setShowUnsavedChangesDialog(true);
              } else {
                setTempSensitivitiesEnabled(sensitivitiesEnabled);
                setTempSensitivityInstructions(sensitivityInstructions);
                setTempAgeRestrictionsEnabled(ageRestrictionsEnabled);
                setTempAgeRestrictionValue(ageRestrictionValue);
                setTempVerificationsEnabled(verificationsEnabled);
                setTempMaxMessagesEnabled(maxMessagesEnabled);
                setTempMaxMessagesInfinite(maxMessagesInfinite);
                setTempMaxMessagesValue(maxMessagesValue);
                setActiveSubmenu('boundaries-restrictions');
              }
            }}
            style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
            className="flex items-center justify-between px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg"
          >
            <span className="font-medium text-gray-900 dark:text-gray-100">Set Boundaries & Restrictions</span>
            <div className="flex items-center space-x-2">
              {customResponses && <span className="text-gray-600 dark:text-gray-400 max-w-[200px] truncate">{customResponses}</span>}
              <ChevronRight className="w-5 h-5 text-gray-900 dark:text-gray-100" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── ai-persona ──
  if (activeSubmenu === 'ai-persona') {
    return (
      <div className="w-full bg-white dark:bg-gray-800">
        {/* Floating glassmorphism back button */}
        <div 
          onClick={() => handleNavigationAttempt('edit-template')}
          style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
          className="flex items-center px-6 mx-4 mt-3 mb-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg"
        >
          <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-2" />
          <span className="font-medium text-gray-900 dark:text-gray-100">Shape AI Persona</span>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ai-persona" className="text-gray-900 dark:text-gray-100">Define AI Personality</Label>
            <div>
              <textarea
                id="ai-persona"
                rows={3}
                placeholder="Describe the personality and tone you want the AI to have (e.g., friendly and professional, casual and humorous, formal and concise)"
                value={tempAiPersona}
                onChange={(e) => setTempAiPersona(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div 
                onClick={() => {
                  if (isGeneratingPersona) return;
                  setIsGeneratingPersona(true);
                  toast.info('Generating AI persona...');
                  
                  const actualCompanyName = companyName || businessName || '';
                  const businessType = lineOfBusiness || '';
                  
                  fetch(`https://${projectId}.supabase.co/functions/v1/make-server-35e72f4d/personality/generate`, {
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
                    console.log('Personality API response status:', response.status);
                    console.log('Personality API response data:', data);
                    return data;
                  })
                  .then(data => {
                    if (data.success && data.personality) {
                      setTempAiPersona(data.personality);
                      setIsGeneratingPersona(false);
                      toast.success('AI persona generated successfully!');
                    } else {
                      console.error('Personality generation error:', data.error);
                      setIsGeneratingPersona(false);
                      toast.error(data.error || 'Failed to generate personality');
                    }
                  })
                  .catch(error => {
                    console.error('Personality generation network error:', error);
                    setIsGeneratingPersona(false);
                    toast.error('Network error. Please try again.');
                  });
                }}
                className={`flex items-center gap-1 mt-1 text-sm ${isGeneratingPersona ? 'text-blue-400 dark:text-blue-500' : 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'} ${isGeneratingPersona ? 'cursor-wait' : 'cursor-pointer'} transition-colors`}
              >
                <MagicalLoadingText isLoading={isGeneratingPersona} icon={<LucideBrain className="w-3.5 h-3.5" />}>
                  <span>Generate using AI</span>
                </MagicalLoadingText>
              </div>
            </div>
          </div>
          
          {/* Creativity Level Control */}
          <div className="space-y-2">
            <Label htmlFor="creativity-level" className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
              Creativity: {tempCreativityLevel}%
              <CreativityTooltipNew />
            </Label>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {tempCreativityLevel < 30 ? 'Conservative - More predictable and focused responses' : 
               tempCreativityLevel < 70 ? 'Balanced - Mix of creativity and consistency' : 
               'Creative - More varied and imaginative responses'}
            </p>
            <input
              id="creativity-level"
              type="range"
              min="0"
              max="100"
              value={tempCreativityLevel}
              onChange={(e) => setTempCreativityLevel(Number(e.target.value))}
              className="w-full apple-slider cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #8b5cf6 ${tempCreativityLevel / 2}%, #ec4899 ${tempCreativityLevel}%, #e5e7eb ${tempCreativityLevel}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Conservative</span>
              <span className="text-left" style={{ transform: 'translateX(-10px)' }}>Balanced</span>
              <span>Creative</span>
            </div>
          </div>
          
          {/* Emoji Usage Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="emoji-usage" className="text-gray-900 dark:text-gray-100">Emoji Usage</Label>
            <EmojiUsageSelect 
              value={tempEmojiUse} 
              onChange={setTempEmojiUse}
            />
          </div>
          
          <Button 
            onClick={() => {
              setAiPersona(tempAiPersona);
              setCreativityLevel(tempCreativityLevel);
              setEmojiUse(tempEmojiUse);
              // Update completion flags for the filter system
              try {
                const rawFlags = localStorage.getItem('acesai_setup_completion_flags');
                const flags = rawFlags ? JSON.parse(rawFlags) : {};
                flags['Shape AI Persona'] = true;
                localStorage.setItem('acesai_setup_completion_flags', JSON.stringify(flags));
              } catch (e) {
                console.error('Error updating completion flags:', e);
              }
              onSave?.();
              setActiveSubmenu('edit-template');
              toast.success('AI persona and creativity level updated successfully');
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save Persona
          </Button>
        </div>
      </div>
    );
  }

  // ── initial-greeting ──
  if (activeSubmenu === 'initial-greeting') {
    return (
      <div className="w-full bg-white dark:bg-gray-800">
        {/* Header with Back Button */}
        <div 
          onClick={() => handleNavigationAttempt('edit-template')}
          className="flex items-center px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-gray-100 mr-3" />
          <span className="font-medium text-gray-900 dark:text-gray-100">Create Initial Greeting</span>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="initial-greeting" className="text-gray-900 dark:text-gray-100">Welcome Message</Label>
            <div>
              <textarea
                id="initial-greeting"
                rows={4}
                placeholder="Enter the first message customers will see when they start a conversation"
                value={tempInitialGreeting}
                onChange={(e) => setTempInitialGreeting(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div 
                onClick={() => {
                  if (isGeneratingGreeting) return;
                  setIsGeneratingGreeting(true);
                  toast.info('Generating initial greeting...');
                  setTimeout(() => {
                    const actualCompanyName = companyName || businessName || '';
                    const businessType = lineOfBusiness || '';
                    
                    let generatedGreeting = '';
                    if (actualCompanyName) {
                      generatedGreeting = `Hello! Thank you for contacting ${actualCompanyName}. How may I assist you today?`;
                    } else if (businessType) {
                      generatedGreeting = `Hello! Thank you for reaching out. I'm here to assist you with ${businessType} services. How may I help you today?`;
                    } else {
                      generatedGreeting = `Hello! Thank you for reaching out. How may I assist you today?`;
                    }
                    
                    setTempInitialGreeting(generatedGreeting);
                    setIsGeneratingGreeting(false);
                    toast.success('Initial greeting generated successfully!');
                  }, 1500);
                }}
                className={`flex items-center gap-1 mt-1 text-sm ${isGeneratingGreeting ? 'text-blue-400 dark:text-blue-500' : 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'} ${isGeneratingGreeting ? 'cursor-wait' : 'cursor-pointer'} transition-colors`}
              >
                <MagicalLoadingText isLoading={isGeneratingGreeting} icon={<LucideBrain className="w-3.5 h-3.5" />}>
                  <span>Generate using AI</span>
                </MagicalLoadingText>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => {
              setInitialGreeting(tempInitialGreeting);
              setActiveSubmenu('edit-template');
              toast.success('Initial greeting updated successfully');
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save Greeting
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
