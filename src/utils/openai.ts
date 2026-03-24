// ============================================================
// OpenAI Utility — Aces AI Booking System
// Manages API key storage, daily model fetching, and AI generation
// All calls go directly to OpenAI — no Supabase required
// ============================================================

const OPENAI_API_KEY_KEY = 'acesai_openai_api_key';
const OPENAI_MODELS_CACHE_KEY = 'acesai_openai_models_cache';
const OPENAI_MODELS_CACHE_DATE_KEY = 'acesai_openai_models_cache_date';
const BUSINESS_CONTEXT_KEY = 'acesai_business_context';

// ── API Key Management ───────────────────────────────────────

export function getOpenAIKey(): string {
  try {
    return localStorage.getItem(OPENAI_API_KEY_KEY) || '';
  } catch {
    return '';
  }
}

export function setOpenAIKey(key: string): void {
  try {
    localStorage.setItem(OPENAI_API_KEY_KEY, key.trim());
  } catch {}
}

export function clearOpenAIKey(): void {
  try {
    localStorage.removeItem(OPENAI_API_KEY_KEY);
  } catch {}
}

export function hasOpenAIKey(): boolean {
  const key = getOpenAIKey();
  return key.startsWith('sk-') && key.length > 20;
}

// ── Business Context (read by components without state access) ─

export interface BusinessContext {
  companyName: string;
  lineOfBusiness: string;
}

export function saveBusinessContext(ctx: BusinessContext): void {
  try {
    localStorage.setItem(BUSINESS_CONTEXT_KEY, JSON.stringify(ctx));
  } catch {}
}

export function getBusinessContext(): BusinessContext {
  try {
    const saved = localStorage.getItem(BUSINESS_CONTEXT_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { companyName: '', lineOfBusiness: '' };
}

// ── Model Fetching — cached for 24 hours ─────────────────────

function getDefaultOpenAIModels(): string[] {
  return [
    'gpt-4o',
    'gpt-4o-mini',
    'gpt-4-turbo',
    'gpt-3.5-turbo',
  ];
}

export async function fetchOpenAIModels(): Promise<string[]> {
  const key = getOpenAIKey();
  if (!key) return getDefaultOpenAIModels();

  // Check 24-hour cache
  try {
    const cacheDate = localStorage.getItem(OPENAI_MODELS_CACHE_DATE_KEY);
    const cachedModels = localStorage.getItem(OPENAI_MODELS_CACHE_KEY);
    if (cacheDate && cachedModels) {
      const hoursDiff = (Date.now() - new Date(cacheDate).getTime()) / (1000 * 60 * 60);
      if (hoursDiff < 24) {
        return JSON.parse(cachedModels);
      }
    }
  } catch {}

  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: { Authorization: `Bearer ${key}` },
    });

    if (!response.ok) throw new Error(`API ${response.status}`);

    const data = await response.json();

    const chatModels: string[] = (data.data as Array<{ id: string }>)
      .filter((m) => {
        const id = m.id;
        return (
          (id.startsWith('gpt-') ||
            id.startsWith('o1') ||
            id.startsWith('o3') ||
            id.startsWith('o4')) &&
          !id.includes('instruct') &&
          !id.includes('audio') &&
          !id.includes('search') &&
          !id.includes('tts') &&
          !id.includes('whisper') &&
          !id.includes('dall-e') &&
          !id.includes('embedding') &&
          !id.includes('moderation') &&
          !id.includes('realtime') &&
          !id.includes('preview') // optional: keep or remove
        );
      })
      .map((m) => m.id)
      .sort()
      .reverse();

    // Persist cache
    localStorage.setItem(OPENAI_MODELS_CACHE_KEY, JSON.stringify(chatModels));
    localStorage.setItem(OPENAI_MODELS_CACHE_DATE_KEY, new Date().toISOString());

    return chatModels.length > 0 ? chatModels : getDefaultOpenAIModels();
  } catch {
    // Return stale cache if available
    try {
      const stale = localStorage.getItem(OPENAI_MODELS_CACHE_KEY);
      if (stale) return JSON.parse(stale);
    } catch {}
    return getDefaultOpenAIModels();
  }
}

/** Force-refresh the model cache on next call (e.g., after key change) */
export function invalidateModelCache(): void {
  try {
    localStorage.removeItem(OPENAI_MODELS_CACHE_KEY);
    localStorage.removeItem(OPENAI_MODELS_CACHE_DATE_KEY);
  } catch {}
}

// ── Core Generation Function ──────────────────────────────────

export async function generateWithOpenAI(
  systemPrompt: string,
  userPrompt: string,
  model = 'gpt-4o-mini',
  maxTokens = 500,
): Promise<string> {
  const key = getOpenAIKey();

  if (!key) {
    throw new Error(
      'No OpenAI API key configured. Click "Set API Key" in your settings to add one.',
    );
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: maxTokens,
      temperature: 0.75,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    if (response.status === 401) {
      throw new Error(
        'Invalid API key. Please check your OpenAI API key in Settings.',
      );
    }
    if (response.status === 429) {
      throw new Error('Rate limit reached. Please wait a moment and try again.');
    }
    throw new Error(
      (err as any)?.error?.message || `OpenAI error ${response.status}`,
    );
  }

  const data = await response.json();
  return (data.choices[0]?.message?.content as string)?.trim() ?? '';
}

// ── Validate Key (quick test call) ───────────────────────────

export async function validateOpenAIKey(key: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: { Authorization: `Bearer ${key}` },
    });
    return response.ok;
  } catch {
    return false;
  }
}
