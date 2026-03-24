import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronDown, ChevronUp, Check, WandSparkles, Edit3, AlignJustify, List, ListOrderedIcon, MessageSquare, Scroll, Blend, Plus, X } from 'lucide-react';
import { MailIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { toast } from "sonner";
import { MagicalLoadingText } from './MagicalLoadingText';
import LucideBrain from '../imports/LucideBrain';
import { projectId } from '../utils/supabase/info';

export interface CustomizeResponsesSubmenuProps {
  handleNavigationAttempt: (target: string | null) => void;
  tempInitialGreetingMode: 'none' | 'ai' | 'custom';
  setTempInitialGreetingMode: React.Dispatch<React.SetStateAction<'none' | 'ai' | 'custom'>>;
  tempAiInitialGreeting: string;
  setTempAiInitialGreeting: React.Dispatch<React.SetStateAction<string>>;
  tempAutoSignatureEnabled: boolean;
  setTempAutoSignatureEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  tempAutoSignatureText: string;
  setTempAutoSignatureText: React.Dispatch<React.SetStateAction<string>>;
  tempResponseStructure: 'let-ai-choose' | 'paragraphs' | 'bullet-points' | 'email-style' | 'custom' | 'mixed';
  setTempResponseStructure: React.Dispatch<React.SetStateAction<'let-ai-choose' | 'paragraphs' | 'bullet-points' | 'email-style' | 'custom' | 'mixed'>>;
  tempResponseStructureCustom: string;
  setTempResponseStructureCustom: React.Dispatch<React.SetStateAction<string>>;
  tempMixedFormats: string[];
  setTempMixedFormats: React.Dispatch<React.SetStateAction<string[]>>;
  tempKeywordScenarios: Array<{id: string, keyword: string, response: string}>;
  setTempKeywordScenarios: React.Dispatch<React.SetStateAction<Array<{id: string, keyword: string, response: string}>>>;
  tempCustomResponses: string;
  setCustomResponses: React.Dispatch<React.SetStateAction<string>>;
  setActiveSubmenu: (submenu: string | null) => void;
  companyName: string;
  businessName: string;
  lineOfBusiness: string;
  accessToken: string | null;
  onSave?: () => void;
}

export function CustomizeResponsesSubmenu(props: CustomizeResponsesSubmenuProps) {
  const {
    handleNavigationAttempt,
    tempInitialGreetingMode, setTempInitialGreetingMode,
    tempAiInitialGreeting, setTempAiInitialGreeting,
    tempAutoSignatureEnabled, setTempAutoSignatureEnabled,
    tempAutoSignatureText, setTempAutoSignatureText,
    tempResponseStructure, setTempResponseStructure,
    tempResponseStructureCustom, setTempResponseStructureCustom,
    tempMixedFormats, setTempMixedFormats,
    tempKeywordScenarios, setTempKeywordScenarios,
    tempCustomResponses, setCustomResponses,
    setActiveSubmenu,
    companyName, businessName, lineOfBusiness,
    accessToken,
    onSave,
  } = props;

  // Local state - only used within this submenu
  const [isGeneratingAiGreeting, setIsGeneratingAiGreeting] = useState(false);
  const [isGeneratingSignature, setIsGeneratingSignature] = useState(false);
  const [isGeneratingCustomFormat, setIsGeneratingCustomFormat] = useState(false);
  const [isGeneratingMixedCustomFormat, setIsGeneratingMixedCustomFormat] = useState(false);
  const [customFormatInput, setCustomFormatInput] = useState('');
  const [showCustomFormatInput, setShowCustomFormatInput] = useState(false);
  const [generatingScenarioId, setGeneratingScenarioId] = useState<string | null>(null);
  const [generatingScenarioType, setGeneratingScenarioType] = useState<'keyword' | 'response' | null>(null);
  const [responseStructureExpanded, setResponseStructureExpanded] = useState(false);
  const responseStructureButtonRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  // Handle response structure dropdown positioning and interactions
  useEffect(() => {
    if (!responseStructureExpanded) return;

    // Update dropdown position
    const updatePosition = () => {
      if (responseStructureButtonRef.current) {
        const rect = responseStructureButtonRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + 4,
          left: rect.left,
          width: rect.width,
        });
      }
    };

    // Initial position update
    updatePosition();

    // Handle click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (responseStructureButtonRef.current && !responseStructureButtonRef.current.contains(event.target as Node)) {
        const dropdownElement = document.querySelector('[data-dropdown="response-structure"]');
        if (dropdownElement && dropdownElement.contains(event.target as Node)) {
          return;
        }
        setResponseStructureExpanded(false);
      }
    };

    // Handle scroll - update position in real-time
    const handleScroll = () => {
      updatePosition();
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [responseStructureExpanded]);

  return (
                  <div className="w-full bg-white dark:bg-gray-800">
                  {/* Floating glassmorphism back button */}
                  <div 
                    onClick={() => handleNavigationAttempt('edit-template')}
                    style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
                    className="flex items-center px-6 mx-4 mt-3 mb-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-2" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">Customize Responses</span>
                  </div>
                  
                  <div className="p-6 space-y-8">
                    {/* 1. Create AI Initial Greeting */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-gray-900 dark:text-gray-100">Create AI Initial Greeting</Label>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Choose how the AI greets customers</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {tempInitialGreetingMode !== 'none' ? 'Greeting On' : 'Greeting Off'}
                          </span>
                          <Switch
                            checked={tempInitialGreetingMode !== 'none'}
                            onCheckedChange={(checked) => {
                              if (!checked) {
                                setTempInitialGreetingMode('none');
                              } else {
                                setTempInitialGreetingMode('ai');
                              }
                            }}
                            className="data-[state=checked]:bg-blue-600"
                          />
                        </div>
                      </div>
                      
                      {/* Toggle between AI and Custom - Only show if not 'none' */}
                      <AnimatePresence>
                        {tempInitialGreetingMode !== 'none' && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            style={{ overflow: 'visible' }}
                          >
                            <div className="space-y-2 pt-2">
                          <div 
                            onClick={() => setTempInitialGreetingMode('ai')}
                            className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all cursor-pointer ${
                              tempInitialGreetingMode === 'ai' 
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <WandSparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Let AI Choose</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Auto-generates greeting</p>
                              </div>
                            </div>
                            {tempInitialGreetingMode === 'ai' && (
                              <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            )}
                          </div>
                          
                          <div 
                            onClick={() => setTempInitialGreetingMode('custom')}
                            className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all cursor-pointer ${
                              tempInitialGreetingMode === 'custom' 
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Edit3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Custom</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Write your own greeting</p>
                              </div>
                            </div>
                            {tempInitialGreetingMode === 'custom' && (
                              <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            )}
                          </div>
                          
                          {/* Greeting textarea - Only show when Custom is selected */}
                          {tempInitialGreetingMode === 'custom' && (
                            <div className="pl-4 border-l-2 border-blue-200 dark:border-blue-800">
                              <textarea
                                rows={2}
                                placeholder="Enter your custom greeting message..."
                                value={tempAiInitialGreeting}
                                onChange={(e) => setTempAiInitialGreeting(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <div 
                                onClick={() => {
                                  if (isGeneratingAiGreeting) return;
                                  setIsGeneratingAiGreeting(true);
                                  toast.info('Generating greeting...');
                                  
                                  const actualCompanyName = companyName || businessName || '';
                                  const businessType = lineOfBusiness || '';
                                  
                                  fetch(`https://${projectId}.supabase.co/functions/v1/make-server-35e72f4d/greeting/generate`, {
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
                                  .then(async response => await response.json())
                                  .then(data => {
                                    if (data.success && data.greeting) {
                                      setTempAiInitialGreeting(data.greeting);
                                      setIsGeneratingAiGreeting(false);
                                      toast.success('Greeting generated successfully!');
                                    } else {
                                      setIsGeneratingAiGreeting(false);
                                      toast.error(data.error || 'Failed to generate greeting');
                                    }
                                  })
                                  .catch(() => {
                                    setIsGeneratingAiGreeting(false);
                                    toast.error('Network error. Please try again.');
                                  });
                                }}
                                className={`flex items-center gap-1 mt-2 text-sm ${isGeneratingAiGreeting ? 'text-blue-400 dark:text-blue-500' : 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'} ${isGeneratingAiGreeting ? 'cursor-wait' : 'cursor-pointer'} transition-colors`}
                              >
                                <MagicalLoadingText isLoading={isGeneratingAiGreeting} icon={<LucideBrain className="w-3.5 h-3.5" />}>
                                  <span>Generate using AI</span>
                                </MagicalLoadingText>
                              </div>
                            </div>
                          )}
                        </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* 2. Auto Signature */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-gray-900 dark:text-gray-100">Auto Signature</Label>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Add a sign-off to all responses</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {tempAutoSignatureEnabled ? 'Signature On' : 'Signature Off'}
                          </span>
                          <Switch
                            checked={tempAutoSignatureEnabled}
                            onCheckedChange={(checked) => {
                              setTempAutoSignatureEnabled(checked);
                            }}
                            className="data-[state=checked]:bg-blue-600"
                          />
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {tempAutoSignatureEnabled && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="pl-4 border-l-2 border-blue-200 dark:border-blue-800">
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder="Write your sign-off..."
                                  value={tempAutoSignatureText}
                                  onChange={(e) => setTempAutoSignatureText(e.target.value)}
                                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <div 
                                onClick={() => {
                                  if (isGeneratingSignature) return;
                                  setIsGeneratingSignature(true);
                                  toast.info('Generating signature...');
                                  
                                  const actualCompanyName = companyName || businessName || '';
                                  
                                  fetch(`https://${projectId}.supabase.co/functions/v1/make-server-35e72f4d/signature/generate`, {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                      'Authorization': `Bearer ${accessToken}`
                                    },
                                    body: JSON.stringify({
                                      companyName: actualCompanyName
                                    })
                                  })
                                  .then(async response => await response.json())
                                  .then(data => {
                                    if (data.success && data.signature) {
                                      setTempAutoSignatureText(data.signature);
                                      setIsGeneratingSignature(false);
                                      toast.success('Signature generated successfully!');
                                    } else {
                                      setIsGeneratingSignature(false);
                                      toast.error(data.error || 'Failed to generate signature');
                                    }
                                  })
                                  .catch(() => {
                                    setIsGeneratingSignature(false);
                                    toast.error('Network error. Please try again.');
                                  });
                                }}
                                className={`flex items-center gap-1 mt-2 text-sm ${isGeneratingSignature ? 'text-blue-400 dark:text-blue-500' : 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'} ${isGeneratingSignature ? 'cursor-wait' : 'cursor-pointer'} transition-colors`}
                              >
                                <MagicalLoadingText isLoading={isGeneratingSignature} icon={<LucideBrain className="w-3.5 h-3.5" />}>
                                  <span>Generate using AI</span>
                                </MagicalLoadingText>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* 3. Response Structure */}
                    <div className="space-y-2">
                      <Label className="text-gray-900 dark:text-gray-100">Response Structure</Label>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Define how AI formats responses</p>
                      
                      {/* Dropdown Container */}
                      <div>
                        {/* Selected Option Display */}
                        <div 
                          ref={responseStructureButtonRef}
                          onClick={() => {
                            if (!responseStructureExpanded && responseStructureButtonRef.current) {
                              // Calculate position immediately before opening
                              const rect = responseStructureButtonRef.current.getBoundingClientRect();
                              setDropdownPosition({
                                top: rect.bottom + 4,
                                left: rect.left,
                                width: rect.width,
                              });
                            }
                            setResponseStructureExpanded(!responseStructureExpanded);
                          }}
                          className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border-2 border-blue-500 rounded-lg cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            {tempResponseStructure === 'let-ai-choose' && <WandSparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                            {tempResponseStructure === 'paragraphs' && <AlignJustify className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                            {tempResponseStructure === 'bullet-points' && <List className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                            {tempResponseStructure === 'email-style' && <MailIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                            {tempResponseStructure === 'custom' && <Edit3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                            {tempResponseStructure === 'mixed' && <Blend className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {tempResponseStructure === 'let-ai-choose' && 'Let AI Choose'}
                                {tempResponseStructure === 'paragraphs' && 'Paragraphs'}
                                {tempResponseStructure === 'bullet-points' && 'Bullet Points'}
                                {tempResponseStructure === 'email-style' && 'Email Style'}
                                {tempResponseStructure === 'custom' && 'Custom Format'}
                                {tempResponseStructure === 'mixed' && 'Select Formats'}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {tempResponseStructure === 'let-ai-choose' && 'Auto-chooses format'}
                                {tempResponseStructure === 'numbered-lists' && 'Numbered list format'}
                                {tempResponseStructure === 'short-answers' && 'Brief and concise'}
                                {tempResponseStructure === 'custom' && 'Your custom format'}
                                {tempResponseStructure === 'mixed' && 'Pick or Combine formats'}
                              </p>
                            </div>
                          </div>
                          {responseStructureExpanded ? (
                            <ChevronUp className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        
                        {/* Dropdown Options - Fixed positioned to float over entire page */}
                        {responseStructureExpanded && (
                          <div 
                            data-dropdown="response-structure"
                            className="fixed space-y-2 border-2 border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-800 shadow-xl z-[9999]"
                            style={{
                              top: `${dropdownPosition.top}px`,
                              left: `${dropdownPosition.left}px`,
                              width: `${dropdownPosition.width}px`,
                            }}
                          >
                          <div 
                            onClick={() => {
                              setTempResponseStructure('let-ai-choose');
                              setResponseStructureExpanded(false);
                            }}
                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                              tempResponseStructure === 'let-ai-choose'
                                ? 'bg-blue-50 dark:bg-blue-900/20'
                                : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <WandSparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Let AI Choose</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Auto-chooses format</p>
                              </div>
                            </div>
                            {tempResponseStructure === 'let-ai-choose' && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                          </div>
                          
                          <div 
                            onClick={() => {
                              setTempResponseStructure('mixed');
                              setResponseStructureExpanded(false);
                            }}
                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                              tempResponseStructure === 'mixed'
                                ? 'bg-blue-50 dark:bg-blue-900/20'
                                : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Blend className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Select Formats</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Pick or Combine formats</p>
                              </div>
                            </div>
                            {tempResponseStructure === 'mixed' && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                          </div>
                          
                          <div 
                            onClick={() => {
                              setTempResponseStructure('custom');
                              setResponseStructureExpanded(false);
                            }}
                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                              tempResponseStructure === 'custom'
                                ? 'bg-blue-50 dark:bg-blue-900/20'
                                : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Edit3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Custom Format</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Your custom format</p>
                              </div>
                            </div>
                            {tempResponseStructure === 'custom' && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                          </div>
                        </div>
                      )}
                      </div>
                      
                      {/* Custom Format Input */}
                      {tempResponseStructure === 'custom' && !responseStructureExpanded && (
                        <div className="pl-4 border-l-2 border-blue-200 dark:border-blue-800">
                          <textarea
                            rows={2}
                            placeholder="Describe your custom format (e.g., Start with summary, key points, then question)"
                            value={tempResponseStructureCustom}
                            onChange={(e) => setTempResponseStructureCustom(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <div 
                            onClick={() => {
                              if (isGeneratingCustomFormat) return;
                              setIsGeneratingCustomFormat(true);
                              toast.info('Generating format suggestion...');
                              
                              const actualCompanyName = companyName || businessName || '';
                              const businessType = lineOfBusiness || '';
                              
                              fetch(`https://${projectId}.supabase.co/functions/v1/make-server-35e72f4d/format/generate`, {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'Authorization': `Bearer ${accessToken}`
                                },
                                body: JSON.stringify({
                                  companyName: actualCompanyName,
                                  lineOfBusiness: businessType,
                                  type: 'custom'
                                })
                              })
                              .then(async response => await response.json())
                              .then(data => {
                                if (data.success && data.format) {
                                  setTempResponseStructureCustom(data.format);
                                  setIsGeneratingCustomFormat(false);
                                  toast.success('Format generated successfully!');
                                } else {
                                  setIsGeneratingCustomFormat(false);
                                  toast.error(data.error || 'Failed to generate format');
                                }
                              })
                              .catch(() => {
                                setIsGeneratingCustomFormat(false);
                                toast.error('Network error. Please try again.');
                              });
                            }}
                            className={`flex items-center gap-1 mt-2 text-sm ${isGeneratingCustomFormat ? 'text-blue-400 dark:text-blue-500' : 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'} ${isGeneratingCustomFormat ? 'cursor-wait' : 'cursor-pointer'} transition-colors`}
                          >
                            <MagicalLoadingText isLoading={isGeneratingCustomFormat} icon={<LucideBrain className="w-3.5 h-3.5" />}>
                              <span>Generate using AI</span>
                            </MagicalLoadingText>
                          </div>
                        </div>
                      )}
                      
                      {/* Mixed Format Pills Selection */}
                      {tempResponseStructure === 'mixed' && !responseStructureExpanded && (
                        <div className="space-y-2">
                          <div className="pl-4 border-l-2 border-blue-200 dark:border-blue-800 space-y-2">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Select formats to include (at least one required):</p>
                          
                            {/* Pills Container */}
                            <div className="flex flex-wrap gap-2 items-start">
                              {/* Predefined Format Pills */}
                              {[
                              { id: 'paragraphs', label: 'Paragraphs', icon: AlignJustify },
                              { id: 'bullet-points', label: 'Bullet Points', icon: List },
                              { id: 'numbered-lists', label: 'Numbered Lists', icon: ListOrderedIcon },
                              { id: 'short-answers', label: 'Short Answers', icon: MessageSquare },
                              { id: 'long-answers', label: 'Long Answers', icon: Scroll },
                              { id: 'email-style', label: 'Email Style', icon: MailIcon },
                            ].map((format) => {
                              const Icon = format.icon;
                              const isSelected = tempMixedFormats.includes(format.id);
                              
                              return (
                                <button
                                  key={format.id}
                                  onClick={() => {
                                    if (isSelected) {
                                      // Don't allow removing if it's the last selected format
                                      if (tempMixedFormats.length > 1) {
                                        setTempMixedFormats(tempMixedFormats.filter(f => f !== format.id));
                                      } else {
                                        toast.error('At least one format must be selected');
                                      }
                                    } else {
                                      setTempMixedFormats([...tempMixedFormats, format.id]);
                                    }
                                  }}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
                                    isSelected
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                  }`}
                                >
                                  <Icon className="w-3.5 h-3.5" />
                                  <span>{format.label}</span>
                                  {isSelected && <Check className="w-3.5 h-3.5" />}
                                </button>
                              );
                            })}
                            
                            {/* Custom Format Pills */}
                            {tempMixedFormats
                              .filter(f => !['paragraphs', 'bullet-points', 'numbered-lists', 'short-answers', 'long-answers', 'email-style'].includes(f))
                              .map((customFormat) => (
                                <button
                                  key={customFormat}
                                  onClick={() => {
                                    // Don't allow removing if it's the last selected format
                                    if (tempMixedFormats.length > 1) {
                                      setTempMixedFormats(tempMixedFormats.filter(f => f !== customFormat));
                                    } else {
                                      toast.error('At least one format must be selected');
                                    }
                                  }}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-blue-500 text-white transition-all hover:bg-blue-600"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>{customFormat}</span>
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              ))}
                            
                            {/* Add Custom Format Button/Input - Inside bordered section with pills */}
                            {showCustomFormatInput ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="text"
                                  value={customFormatInput}
                                  onChange={(e) => setCustomFormatInput(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && customFormatInput.trim()) {
                                      e.preventDefault();
                                      const trimmedInput = customFormatInput.trim();
                                      if (!tempMixedFormats.includes(trimmedInput)) {
                                        setTempMixedFormats([...tempMixedFormats, trimmedInput]);
                                      }
                                      setCustomFormatInput('');
                                      setShowCustomFormatInput(false);
                                    } else if (e.key === 'Escape') {
                                      setCustomFormatInput('');
                                      setShowCustomFormatInput(false);
                                    }
                                  }}
                                  placeholder="Enter custom format..."
                                  className="px-3 py-1.5 rounded-full text-sm bg-white dark:bg-gray-700 border-2 border-blue-400 dark:border-blue-500 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 min-w-[180px]"
                                  autoFocus
                                />
                                <button
                                  onClick={() => {
                                    const trimmedInput = customFormatInput.trim();
                                    if (trimmedInput) {
                                      if (!tempMixedFormats.includes(trimmedInput)) {
                                        setTempMixedFormats([...tempMixedFormats, trimmedInput]);
                                      }
                                      setCustomFormatInput('');
                                    }
                                    setShowCustomFormatInput(false);
                                  }}
                                  className="p-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setCustomFormatInput('');
                                    setShowCustomFormatInput(false);
                                  }}
                                  className="p-1.5 rounded-full bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-500 transition-all"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setShowCustomFormatInput(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-2 border-dashed border-blue-400 dark:border-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add Custom</span>
                              </button>
                            )}
                          </div>
                          </div>
                          
                          {/* Generate using AI - Outside bordered section, shown only when input is visible */}
                          {showCustomFormatInput && (
                            <div 
                                onClick={() => {
                                  if (isGeneratingMixedCustomFormat) return;
                                  setIsGeneratingMixedCustomFormat(true);
                                  toast.info('Generating format suggestion...');
                                  
                                  const predefinedFormats = ['paragraphs', 'bullet-points', 'numbered-lists', 'short-answers', 'long-answers', 'email-style'];
                                  const existingCustomFormats = tempMixedFormats.filter(f => !predefinedFormats.includes(f));
                                  
                                  fetch(`https://${projectId}.supabase.co/functions/v1/make-server-35e72f4d/format/generate`, {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                      'Authorization': `Bearer ${accessToken}`
                                    },
                                    body: JSON.stringify({
                                      type: 'mixed',
                                      existingFormats: [...predefinedFormats, ...existingCustomFormats]
                                    })
                                  })
                                  .then(async response => await response.json())
                                  .then(data => {
                                    if (data.success && data.format) {
                                      setCustomFormatInput(data.format);
                                      setIsGeneratingMixedCustomFormat(false);
                                      toast.success('Format generated! Press Enter or click ✓ to add it.');
                                    } else {
                                      setIsGeneratingMixedCustomFormat(false);
                                      toast.error(data.error || 'Failed to generate format');
                                    }
                                  })
                                  .catch(() => {
                                    setIsGeneratingMixedCustomFormat(false);
                                    toast.error('Network error. Please try again.');
                                  });
                                }}
                                className={`flex items-center gap-1 text-sm ml-1 ${isGeneratingMixedCustomFormat ? 'text-blue-400 dark:text-blue-500' : 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'} ${isGeneratingMixedCustomFormat ? 'cursor-wait' : 'cursor-pointer'} transition-colors`}
                              >
                                <MagicalLoadingText isLoading={isGeneratingMixedCustomFormat} icon={<LucideBrain className="w-3.5 h-3.5" />}>
                                  <span>Generate using AI</span>
                                </MagicalLoadingText>
                            </div>
                            )}
                        </div>
                      )}
                    </div>

                    {/* 4. Keyword Custom Scenarios */}
                    <div className="space-y-2">
                      <Label className="text-gray-900 dark:text-gray-100">Keyword Custom Scenarios</Label>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Set up trigger keywords and their corresponding automated responses</p>
                      <div className="space-y-2">
                        {tempKeywordScenarios.map((scenario, index) => (
                          <div key={scenario.id} className="p-3 bg-white dark:bg-gray-800 rounded-lg border-2 border-blue-500 dark:border-blue-500 shadow-sm hover:shadow-md transition-shadow">
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Trigger Keyword</label>
                                  <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">The specific customer phrase or question that will activate this automated response</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTempKeywordScenarios(tempKeywordScenarios.filter(s => s.id !== scenario.id));
                                  }}
                                  className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <input
                                type="text"
                                placeholder="Write Keyword..."
                                value={scenario.keyword}
                                onChange={(e) => {
                                  const updated = [...tempKeywordScenarios];
                                  updated[index].keyword = e.target.value;
                                  setTempKeywordScenarios(updated);
                                }}
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (generatingScenarioId === scenario.id && generatingScenarioType === 'keyword') return;
                                  setGeneratingScenarioId(scenario.id);
                                  setGeneratingScenarioType('keyword');
                                  toast.info('Generating keyword...');
                                  
                                  const actualCompanyName = companyName || businessName || '';
                                  const businessType = lineOfBusiness || '';
                                  
                                  fetch(`https://${projectId}.supabase.co/functions/v1/make-server-35e72f4d/scenario-keyword/generate`, {
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
                                    if (data.success && data.keyword) {
                                      const updated = [...tempKeywordScenarios];
                                      updated[index].keyword = data.keyword;
                                      setTempKeywordScenarios(updated);
                                      setGeneratingScenarioId(null);
                                      setGeneratingScenarioType(null);
                                      toast.success('Keyword generated successfully!');
                                    } else {
                                      console.error('Keyword generation error:', data.error);
                                      setGeneratingScenarioId(null);
                                      setGeneratingScenarioType(null);
                                      toast.error(data.error || 'Failed to generate keyword');
                                    }
                                  })
                                  .catch(error => {
                                    console.error('Keyword generation network error:', error);
                                    setGeneratingScenarioId(null);
                                    setGeneratingScenarioType(null);
                                    toast.error('Network error. Please try again.');
                                  });
                                }}
                                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md ${(generatingScenarioId === scenario.id && generatingScenarioType === 'keyword') ? 'text-blue-400 dark:text-blue-500' : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'} ${(generatingScenarioId === scenario.id && generatingScenarioType === 'keyword') ? 'cursor-wait' : 'cursor-pointer'} transition-all`}
                              >
                                <MagicalLoadingText isLoading={generatingScenarioId === scenario.id && generatingScenarioType === 'keyword'} icon={<LucideBrain className="w-3 h-3" />}>
                                  <span>Generate using AI</span>
                                </MagicalLoadingText>
                              </button>
                            </div>
                            
                            <div className="space-y-1.5">
                              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">AI Response</label>
                              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">The automated message that will be sent when the trigger phrase is detected</p>
                              <textarea
                                rows={2}
                                placeholder={!scenario.keyword.trim() ? "Enter keyword first..." : "Define the response..."}
                                value={scenario.response}
                                onChange={(e) => {
                                  const updated = [...tempKeywordScenarios];
                                  updated[index].response = e.target.value;
                                  setTempKeywordScenarios(updated);
                                }}
                                disabled={!scenario.keyword.trim()}
                                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                                  !scenario.keyword.trim() 
                                    ? 'bg-gray-100 dark:bg-gray-900/50 border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                                    : 'bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100'
                                }`}
                              />
                              {scenario.keyword.trim() && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (generatingScenarioId === scenario.id && generatingScenarioType === 'response') return;
                                    setGeneratingScenarioId(scenario.id);
                                    setGeneratingScenarioType('response');
                                    toast.info('Generating response...');
                                    
                                    const actualCompanyName = companyName || businessName || '';
                                    const businessType = lineOfBusiness || '';
                                    
                                    fetch(`https://${projectId}.supabase.co/functions/v1/make-server-35e72f4d/scenario-response/generate`, {
                                      method: 'POST',
                                      headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${accessToken}`
                                      },
                                      body: JSON.stringify({
                                        companyName: actualCompanyName,
                                        lineOfBusiness: businessType,
                                        keyword: scenario.keyword
                                      })
                                    })
                                    .then(async response => {
                                      const data = await response.json();
                                      return data;
                                    })
                                    .then(data => {
                                      if (data.success && data.response) {
                                        const updated = [...tempKeywordScenarios];
                                        updated[index].response = data.response;
                                        setTempKeywordScenarios(updated);
                                        setGeneratingScenarioId(null);
                                        setGeneratingScenarioType(null);
                                        toast.success('Response generated successfully!');
                                      } else {
                                        console.error('Response generation error:', data.error);
                                        setGeneratingScenarioId(null);
                                        setGeneratingScenarioType(null);
                                        toast.error(data.error || 'Failed to generate response');
                                      }
                                    })
                                    .catch(error => {
                                      console.error('Response generation network error:', error);
                                      setGeneratingScenarioId(null);
                                      setGeneratingScenarioType(null);
                                      toast.error('Network error. Please try again.');
                                    });
                                  }}
                                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md ${(generatingScenarioId === scenario.id && generatingScenarioType === 'response') ? 'text-blue-400 dark:text-blue-500' : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'} ${(generatingScenarioId === scenario.id && generatingScenarioType === 'response') ? 'cursor-wait' : 'cursor-pointer'} transition-all`}
                                >
                                  <MagicalLoadingText isLoading={generatingScenarioId === scenario.id && generatingScenarioType === 'response'} icon={<LucideBrain className="w-3 h-3" />}>
                                    <span>Generate using AI</span>
                                  </MagicalLoadingText>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                        
                        {/* Add button */}
                        <button
                          type="button"
                          onClick={() => {
                            setTempKeywordScenarios([...tempKeywordScenarios, {
                              id: `scenario-${Date.now()}`,
                              keyword: '',
                              response: ''
                            }]);
                          }}
                          className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all flex items-center justify-center gap-2"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Scenario</span>
                        </button>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => {
                        setCustomResponses(tempCustomResponses);
                        // Update completion flags for the filter system
                        try {
                          const rawFlags = localStorage.getItem('acesai_setup_completion_flags');
                          const flags = rawFlags ? JSON.parse(rawFlags) : {};
                          flags['Customize Responses'] = true;
                          localStorage.setItem('acesai_setup_completion_flags', JSON.stringify(flags));
                        } catch (e) {
                          console.error('Error updating completion flags:', e);
                        }
                        onSave?.();
                        setActiveSubmenu('edit-template');
                        toast.success('Customizations saved successfully');
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Save Changes
                    </Button>
                  </div>
                  </div>
  );
}
