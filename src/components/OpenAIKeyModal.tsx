import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Key, Eye, EyeOff, CheckCircle2, XCircle, Loader2, Sparkles, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import {
  getOpenAIKey,
  setOpenAIKey,
  clearOpenAIKey,
  hasOpenAIKey,
  validateOpenAIKey,
  fetchOpenAIModels,
  invalidateModelCache,
} from '../utils/openai';

interface OpenAIKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OpenAIKeyModal({ isOpen, onClose }: OpenAIKeyModalProps) {
  const [keyInput, setKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isFetchingModels, setIsFetchingModels] = useState(false);
  const [lastCacheDate, setLastCacheDate] = useState<string | null>(null);

  // Load existing key and cache info on open
  useEffect(() => {
    if (isOpen) {
      const existing = getOpenAIKey();
      setKeyInput(existing);
      setIsValid(hasOpenAIKey() ? true : null);

      const cached = localStorage.getItem('acesai_openai_models_cache_date');
      setLastCacheDate(cached);

      if (hasOpenAIKey()) {
        loadCachedModels();
      }
    }
  }, [isOpen]);

  const loadCachedModels = async () => {
    try {
      const cached = localStorage.getItem('acesai_openai_models_cache');
      if (cached) {
        setAvailableModels(JSON.parse(cached));
      }
    } catch { }
  };

  const handleValidate = async () => {
    const trimmed = keyInput.trim();
    if (!trimmed.startsWith('sk-') || trimmed.length < 20) {
      toast.error('Key must start with "sk-" and be at least 20 characters.');
      return;
    }

    setIsValidating(true);
    setIsValid(null);

    try {
      const valid = await validateOpenAIKey(trimmed);

      if (valid) {
        setOpenAIKey(trimmed);
        invalidateModelCache();
        setIsValid(true);
        toast.success('✅ API key validated and saved!');

        // Fetch models immediately
        setIsFetchingModels(true);
        const models = await fetchOpenAIModels();
        setAvailableModels(models);
        const date = localStorage.getItem('acesai_openai_models_cache_date');
        setLastCacheDate(date);
        setIsFetchingModels(false);
      } else {
        setIsValid(false);
        toast.error('❌ API key is invalid. Please check and try again.');
      }
    } catch {
      setIsValid(false);
      toast.error('Could not validate key. Check your internet connection.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleRefreshModels = async () => {
    if (!hasOpenAIKey()) return;
    setIsFetchingModels(true);
    invalidateModelCache();
    try {
      const models = await fetchOpenAIModels();
      setAvailableModels(models);
      const date = localStorage.getItem('acesai_openai_models_cache_date');
      setLastCacheDate(date);
      toast.success(`Refreshed — ${models.length} models loaded`);
    } catch {
      toast.error('Failed to refresh models.');
    } finally {
      setIsFetchingModels(false);
    }
  };

  const handleClearKey = () => {
    clearOpenAIKey();
    invalidateModelCache();
    setKeyInput('');
    setIsValid(null);
    setAvailableModels([]);
    setLastCacheDate(null);
    toast.info('API key removed.');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleValidate();
    if (e.key === 'Escape') onClose();
  };

  const formatCacheDate = (iso: string | null) => {
    if (!iso) return null;
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg">
                    <Key className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-gray-900 dark:text-white">OpenAI API Key</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Powers all "Generate using AI" features</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5">
                {/* Info banner */}
                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                  <Sparkles className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                    Your API key is stored <strong>locally in your browser</strong> — it never leaves your device.
                    Get your key at <span className="underline">platform.openai.com/api-keys</span>.
                    Models are refreshed automatically every 24 hours.
                  </div>
                </div>

                {/* Key Input */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-700 dark:text-gray-300">API Key</label>
                  <div className="relative">
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={keyInput}
                      onChange={(e) => {
                        setKeyInput(e.target.value);
                        setIsValid(null);
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder="sk-proj-..."
                      className="w-full px-4 py-3 pr-24 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      {/* Validity indicator */}
                      {isValid === true && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      {isValid === false && <XCircle className="w-4 h-4 text-red-500" />}

                      {/* Show/hide toggle */}
                      <button
                        onClick={() => setShowKey(!showKey)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleValidate}
                    disabled={isValidating || !keyInput.trim()}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm rounded-xl transition-colors"
                  >
                    {isValidating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Validating...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Validate & Save
                      </>
                    )}
                  </button>

                  {hasOpenAIKey() && (
                    <button
                      onClick={handleClearKey}
                      className="px-4 py-2.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-200 dark:border-red-800 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Models section */}
                {isValid === true && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        Available Models
                        {lastCacheDate && (
                          <span className="ml-2 text-xs text-gray-400">
                            (cached {formatCacheDate(lastCacheDate)})
                          </span>
                        )}
                      </div>
                      <button
                        onClick={handleRefreshModels}
                        disabled={isFetchingModels}
                        className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3 h-3 ${isFetchingModels ? 'animate-spin' : ''}`} />
                        Refresh
                      </button>
                    </div>

                    {isFetchingModels ? (
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 py-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Fetching latest models...
                      </div>
                    ) : availableModels.length > 0 ? (
                      <div className="max-h-40 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-800">
                        {availableModels.map((model) => (
                          <div key={model} className="px-3 py-2 text-xs font-mono text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750">
                            {model}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 dark:text-gray-500">No models cached yet. Click Refresh.</p>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                  This key is used for all AI generation features in Aces AI. Standard OpenAI API rates apply.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
