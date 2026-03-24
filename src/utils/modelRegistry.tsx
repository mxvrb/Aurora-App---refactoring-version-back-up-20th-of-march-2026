import React from 'react';
import { Cpu, Rocket, Shield, Languages } from 'lucide-react';
import ThreeDGlasses from '../imports/ThreeDGlasses-3792-273';

export type ModelSlot = 'openai-best' | 'openai-fast' | 'anthropic-sonnet' | 'anthropic-opus' | 'google-best';

export interface AIModel {
  id: string;
  name: string;
  slot: ModelSlot;
  desc: string;
  icon: React.ReactNode;
  isNew?: boolean;
  created?: number;
}

const DESCRIPTIONS: Record<ModelSlot, string> = {
  'openai-best': 'Online stores, product sales. Best for complex questions.',
  'openai-fast': 'Recommended for service based businesses. Fastest & most reliable.',
  'anthropic-sonnet': 'Consultants, coaches, advisors. Ideal for natural conversations.',
  'anthropic-opus': 'Doctors, lawyers, accountants. Most accurate & professional.',
  'google-best': 'Restaurants, hotels, tourism. Great for multiple languages.'
};

function getIconForSlot(slot: ModelSlot) {
  const props = { className: "w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" };
  switch (slot) {
    case 'openai-best': return <Cpu {...props} />;
    case 'openai-fast': return <Rocket {...props} />;
    case 'anthropic-sonnet': return <Shield {...props} />;
    case 'anthropic-opus': return (
      <div className="w-5 h-5 flex-shrink-0 text-blue-600 dark:text-blue-400 [--stroke-0:currentColor]">
        <ThreeDGlasses className="w-full h-full relative" />
      </div>
    );
    case 'google-best': return <Languages {...props} />;
  }
}

export async function listModels(): Promise<AIModel[]> {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models');
    if (!response.ok) throw new Error('Failed to fetch');
    const json = await response.json();
    
    const rawModels = json.data;
    const now = Date.now() / 1000;
    const thirtyDaysInSeconds = 30 * 24 * 60 * 60;

    const getBestMatch = (
      slot: ModelSlot,
      providerPrefix: string,
      includes: string[],
      excludes: string[],
      fallbackName: string
    ): AIModel => {
      // Find models matching criteria
      const candidates = rawModels.filter((m: any) => {
        const id = m.id.toLowerCase();
        // Check provider prefix
        if (!id.startsWith(providerPrefix)) return false;
        
        const hasIncludes = includes.length === 0 || includes.some(inc => id.includes(inc));
        const hasExcludes = excludes.some(exc => id.includes(exc) || (m.name && m.name.toLowerCase().includes(exc)));
        
        // Exclude snapshot dates like -0613 or -2024-08-06
        const isSnapshotDate = /-\d{4}(?:-\d{2}-\d{2})?$/.test(id);
        
        return hasIncludes && !hasExcludes && !isSnapshotDate;
      });

      // Sort by newest
      candidates.sort((a: any, b: any) => (b.created || 0) - (a.created || 0));

      let name = fallbackName;
      let created = 0;
      let id = `${providerPrefix}-fallback`;

      if (candidates.length > 0) {
        const best = candidates[0];
        id = best.id;
        created = best.created || 0;
        
        // Clean up OpenRouter names (e.g., "OpenAI: GPT-4o")
        name = best.name.split(':').pop()?.trim() || best.name;
        
        // Strip out trailing parentheticals like (beta)
        name = name.replace(/\s*\(.*?\)/g, '');

        if (providerPrefix === 'google/') {
          // Strictly extract "Gemini X.X Pro" and drop everything else
          const geminiMatch = name.match(/Gemini\s+[\d\.]+\s+Pro/i);
          if (geminiMatch) {
            name = geminiMatch[0];
          } else {
            name = name.replace(/Preview|Experimental|Custom Tools/gi, '');
          }
        } else {
          // General cleanup
          name = name.replace(/Preview|Experimental|Custom Tools|Codex/gi, '');
          // Replace dashes with spaces (e.g. gpt-4o-mini -> gpt 4o mini)
          name = name.replace(/-/g, ' ');
        }
        
        // Remove extra spaces
        name = name.replace(/\s+/g, ' ').trim();
      }

      return {
        id,
        name,
        slot,
        desc: DESCRIPTIONS[slot],
        icon: getIconForSlot(slot),
        created
      };
    };

    const finalModels = [
      getBestMatch('openai-best', 'openai/', [], ['mini', 'vision', 'audio', 'realtime', 'embedding', 'moderation', 'tts', 'o1', 'o3'], 'GPT 4o'),
      getBestMatch('openai-fast', 'openai/', ['mini'], ['vision', 'audio', 'realtime', 'embedding', 'moderation', 'tts'], 'GPT 4o Mini'),
      getBestMatch('anthropic-sonnet', 'anthropic/', ['sonnet'], [], 'Claude 3.7 Sonnet'),
      getBestMatch('anthropic-opus', 'anthropic/', ['opus'], [], 'Claude 3 Opus'),
      getBestMatch('google-best', 'google/', ['pro'], ['vision', 'learnmath', 'flash'], 'Gemini 1.5 Pro'),
    ];

    // Sort by creation date and strictly limit the "New" badge to the top 2 absolute newest models
    const sortedByCreated = [...finalModels].sort((a, b) => (b.created || 0) - (a.created || 0));
    const top2NewestIds = new Set(sortedByCreated.slice(0, 2).map(m => m.id));

    return finalModels.map(m => ({
      ...m,
      isNew: top2NewestIds.has(m.id) && (m.created || 0) > 0 && (now - (m.created || 0)) < thirtyDaysInSeconds
    }));
  } catch (error) {
    console.error('Registry fetch failed:', error);
    return getFallbackModels();
  }
}

function getFallbackModels(): AIModel[] {
  return [
    { id: 'openai-best', name: 'GPT 4o', slot: 'openai-best', desc: DESCRIPTIONS['openai-best'], icon: getIconForSlot('openai-best'), isNew: true },
    { id: 'openai-fast', name: 'GPT 4o Mini', slot: 'openai-fast', desc: DESCRIPTIONS['openai-fast'], icon: getIconForSlot('openai-fast'), isNew: false },
    { id: 'anthropic-sonnet', name: 'Claude 3.7 Sonnet', slot: 'anthropic-sonnet', desc: DESCRIPTIONS['anthropic-sonnet'], icon: getIconForSlot('anthropic-sonnet'), isNew: true },
    { id: 'anthropic-opus', name: 'Claude 3 Opus', slot: 'anthropic-opus', desc: DESCRIPTIONS['anthropic-opus'], icon: getIconForSlot('anthropic-opus'), isNew: false },
    { id: 'google-best', name: 'Gemini 1.5 Pro', slot: 'google-best', desc: DESCRIPTIONS['google-best'], icon: getIconForSlot('google-best'), isNew: false },
  ];
}