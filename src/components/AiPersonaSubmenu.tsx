import React, { useState } from 'react';
import { ChevronLeft, Brain as LucideBrain } from 'lucide-react';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { toast } from "sonner";
import { MagicalLoadingText } from './MagicalLoadingText';
import { EmojiUsageSelect } from './EmojiUsageSelect';
import { CreativityTooltipNew } from './CreativityTooltipNew';

interface AiPersonaSubmenuProps {
  initialPersona: string;
  initialCreativityLevel: number;
  initialEmojiUse: string;
  projectId: string;
  accessToken: string;
  companyName: string;
  lineOfBusiness: string;
  onBack: () => void;
  onSave: (persona: string, creativityLevel: number, emojiUse: string) => void;
}

export function AiPersonaSubmenu({
  initialPersona,
  initialCreativityLevel,
  initialEmojiUse,
  projectId,
  accessToken,
  companyName,
  lineOfBusiness,
  onBack,
  onSave
}: AiPersonaSubmenuProps) {
  const [tempAiPersona, setTempAiPersona] = useState(initialPersona);
  const [tempCreativityLevel, setTempCreativityLevel] = useState(initialCreativityLevel);
  const [tempEmojiUse, setTempEmojiUse] = useState(initialEmojiUse);
  const [isGeneratingPersona, setIsGeneratingPersona] = useState(false);

  const handleGeneratePersona = () => {
    if (isGeneratingPersona) return;
    setIsGeneratingPersona(true);
    toast.info('Generating AI persona...');
    
    fetch(`https://${projectId}.supabase.co/functions/v1/make-server-35e72f4d/personality/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        companyName: companyName,
        lineOfBusiness: lineOfBusiness
      })
    })
    .then(async response => {
      const data = await response.json();
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
  };

  const handleSave = () => {
    onSave(tempAiPersona, tempCreativityLevel, tempEmojiUse);
    toast.success('AI persona and creativity level updated successfully');
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800">
      {/* Floating glassmorphism back button */}
      <div 
        onClick={onBack}
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
              onClick={handleGeneratePersona}
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
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Save Persona
        </Button>
      </div>
    </div>
  );
}
