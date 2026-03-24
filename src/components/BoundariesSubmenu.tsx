import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { toast } from "sonner";
import { MagicalLoadingText } from './MagicalLoadingText';
import LucideBrain from '../imports/LucideBrain';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export interface BoundariesSubmenuProps {
  handleNavigationAttempt: (target: string | null) => void;
  tempCustomResponses: string;
  setTempCustomResponses: React.Dispatch<React.SetStateAction<string>>;
  isGeneratingResponses: boolean;
  setIsGeneratingResponses: React.Dispatch<React.SetStateAction<boolean>>;
  ageRestrictionsEnabled: boolean;
  setAgeRestrictionsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  ageRestrictionValue: number;
  setAgeRestrictionValue: React.Dispatch<React.SetStateAction<number>>;
  verificationsEnabled: boolean;
  setVerificationsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  maxMessagesEnabled: boolean;
  setMaxMessagesEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  maxMessagesInfinite: boolean;
  setMaxMessagesInfinite: React.Dispatch<React.SetStateAction<boolean>>;
  maxMessagesValue: number;
  setMaxMessagesValue: React.Dispatch<React.SetStateAction<number>>;
  sensitivitiesEnabled: boolean;
  setSensitivitiesEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  sensitivityInstructions: string;
  setSensitivityInstructions: React.Dispatch<React.SetStateAction<string>>;
  isGeneratingSensitivity: boolean;
  setIsGeneratingSensitivity: React.Dispatch<React.SetStateAction<boolean>>;
  setCustomResponses: React.Dispatch<React.SetStateAction<string>>;
  setActiveSubmenu: (submenu: string | null) => void;
  companyName: string;
  businessName: string;
  lineOfBusiness: string;
  accessToken: string | null;
  onSave?: () => void;
}

export function BoundariesSubmenu(props: BoundariesSubmenuProps) {
  const {
    handleNavigationAttempt,
    tempCustomResponses, setTempCustomResponses,
    isGeneratingResponses, setIsGeneratingResponses,
    ageRestrictionsEnabled, setAgeRestrictionsEnabled,
    ageRestrictionValue, setAgeRestrictionValue,
    verificationsEnabled, setVerificationsEnabled,
    maxMessagesEnabled, setMaxMessagesEnabled,
    maxMessagesInfinite, setMaxMessagesInfinite,
    maxMessagesValue, setMaxMessagesValue,
    sensitivitiesEnabled, setSensitivitiesEnabled,
    sensitivityInstructions, setSensitivityInstructions,
    isGeneratingSensitivity, setIsGeneratingSensitivity,
    setCustomResponses, setActiveSubmenu,
    companyName, businessName, lineOfBusiness,
    accessToken,
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
        <span className="font-medium text-gray-900 dark:text-gray-100">Set Boundaries & Restrictions</span>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="custom-responses" className="text-gray-900 dark:text-gray-100">Response Guidelines</Label>
          <div>
            <textarea
              id="custom-responses"
              rows={3}
              placeholder="Provide specific instructions for how the AI should respond (e.g., always mention pricing, include links to resources, ask follow-up questions)"
              value={tempCustomResponses}
              onChange={(e) => setTempCustomResponses(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div 
              onClick={() => {
                if (isGeneratingResponses) return;
                setIsGeneratingResponses(true);
                toast.info('Generating response guidelines...');
                
                const actualCompanyName = companyName || businessName || '';
                const businessType = lineOfBusiness || '';
                
                fetch(`https://${projectId}.supabase.co/functions/v1/make-server-35e72f4d/guidelines/generate`, {
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
                  console.log('Guidelines API response status:', response.status);
                  console.log('Guidelines API response data:', data);
                  return data;
                })
                .then(data => {
                  if (data.success && data.guidelines) {
                    setTempCustomResponses(data.guidelines);
                    setIsGeneratingResponses(false);
                    toast.success('Response guidelines generated successfully!');
                  } else {
                    console.error('Guidelines generation error:', data.error);
                    setIsGeneratingResponses(false);
                    toast.error(data.error || 'Failed to generate guidelines');
                  }
                })
                .catch(error => {
                  console.error('Guidelines generation network error:', error);
                  setIsGeneratingResponses(false);
                  toast.error('Network error. Please try again.');
                });
              }}
              className={`flex items-center gap-1 mt-1 text-sm ${isGeneratingResponses ? 'text-blue-400 dark:text-blue-500' : 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'} ${isGeneratingResponses ? 'cursor-wait' : 'cursor-pointer'} transition-colors`}
            >
              <MagicalLoadingText isLoading={isGeneratingResponses} icon={<LucideBrain className="w-3.5 h-3.5" />}>
                <span>Generate using AI</span>
              </MagicalLoadingText>
            </div>
          </div>
        </div>
        
        {/* Age Restrictions */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-900 dark:text-gray-100">Age Restrictions</Label>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">If AI detects, AI will ask for minimum age before proceeding to conversation</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {ageRestrictionsEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <Switch 
                checked={ageRestrictionsEnabled} 
                onCheckedChange={setAgeRestrictionsEnabled}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
          </div>

          <AnimatePresence>
            {ageRestrictionsEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="pl-4 space-y-2 border-l-2 border-blue-200 dark:border-blue-800">
                  {/* Age Value Input */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-700 dark:text-gray-300">Minimum Age Required</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={ageRestrictionValue}
                        onChange={(e) => setAgeRestrictionValue(Math.max(1, Math.min(99, parseInt(e.target.value) || 18)))}
                        className="w-16 px-2 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-xs text-gray-600 dark:text-gray-400">years old</span>
                    </div>
                  </div>

                  {/* Verifications Toggle */}
                  <div className="flex items-center justify-between p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                    <div>
                      <Label className="text-sm text-gray-900 dark:text-gray-100">Require ID Verification</Label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">AI will request and verify age using ID or Passport photo</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {verificationsEnabled ? 'On' : 'Off'}
                      </span>
                      <Switch 
                        checked={verificationsEnabled} 
                        onCheckedChange={setVerificationsEnabled}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Set Maximum allowed messages */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-900 dark:text-gray-100">Set Maximum Allowed Messages</Label>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Limit the number of messages per conversation</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {maxMessagesEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <Switch 
                checked={maxMessagesEnabled} 
                onCheckedChange={setMaxMessagesEnabled}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
          </div>

          <AnimatePresence>
            {maxMessagesEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="pl-4 space-y-1.5 border-l-2 border-blue-200 dark:border-blue-800">
                  <Label className="text-xs text-gray-700 dark:text-gray-300">Maximum Messages</Label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <Checkbox
                        id="infinite-messages"
                        checked={maxMessagesInfinite}
                        onCheckedChange={(checked) => setMaxMessagesInfinite(checked as boolean)}
                        className="data-[state=checked]:!bg-blue-600 data-[state=checked]:!border-blue-600 data-[state=checked]:!text-white"
                      />
                      <Label htmlFor="infinite-messages" className="text-xs text-gray-900 dark:text-gray-100 cursor-pointer">
                        Infinite
                      </Label>
                    </div>
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      value={maxMessagesValue}
                      onChange={(e) => setMaxMessagesValue(Math.max(1, parseInt(e.target.value) || 100))}
                      disabled={maxMessagesInfinite}
                      className="w-20 px-2 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400">messages per conversation per day</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Legal or Cultural Sensitivities */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-900 dark:text-gray-100">Legal or Cultural Sensitivities</Label>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Define sensitive topics to handle with extra care.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {sensitivitiesEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <Switch 
                checked={sensitivitiesEnabled} 
                onCheckedChange={setSensitivitiesEnabled}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
          </div>

          <AnimatePresence>
            {sensitivitiesEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="pl-4 border-l-2 border-blue-200 dark:border-blue-800">
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-700 dark:text-gray-300">Sensitivity Instructions</Label>
                    <textarea
                      rows={3}
                      placeholder="Describe any topics the AI should handle carefully or avoid entirely..."
                      value={sensitivityInstructions}
                      onChange={(e) => setSensitivityInstructions(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div 
                      onClick={async () => {
                        if (isGeneratingSensitivity) return;
                        setIsGeneratingSensitivity(true);
                        
                        try {
                          const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-35e72f4d/humanize/generate`, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${publicAnonKey}`
                            },
                            body: JSON.stringify({ type: 'sensitivity' })
                          });

                          if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.error || 'Failed to generate response');
                          }

                          const data = await response.json();
                          setSensitivityInstructions(data.text);
                          toast.success('Guidelines generated!');
                        } catch (error) {
                          console.error('Error generating sensitivity guidelines:', error);
                          toast.error('Failed to generate guidelines. Please try again.');
                        } finally {
                          setIsGeneratingSensitivity(false);
                        }
                      }}
                      className={`flex items-center gap-1 text-sm ${isGeneratingSensitivity ? 'text-blue-400 dark:text-blue-500' : 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'} ${isGeneratingSensitivity ? 'cursor-wait' : 'cursor-pointer'} transition-colors`}
                    >
                      <MagicalLoadingText isLoading={isGeneratingSensitivity} icon={<LucideBrain className="w-3.5 h-3.5" />}>
                        <span>Generate using AI</span>
                      </MagicalLoadingText>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Button 
          onClick={() => {
            setCustomResponses(tempCustomResponses);
            // Update completion flags for the filter system
            try {
              const rawFlags = localStorage.getItem('acesai_setup_completion_flags');
              const flags = rawFlags ? JSON.parse(rawFlags) : {};
              flags['Set Boundaries & Restrictions'] = true;
              localStorage.setItem('acesai_setup_completion_flags', JSON.stringify(flags));
            } catch (e) {
              console.error('Error updating completion flags:', e);
            }
            onSave?.();
            setActiveSubmenu('edit-template');
            toast.success('Response guidelines updated successfully');
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Save Guidelines
        </Button>
      </div>
    </div>
  );
}
