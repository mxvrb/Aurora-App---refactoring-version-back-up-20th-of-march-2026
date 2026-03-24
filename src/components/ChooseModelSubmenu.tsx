import React, { useState, useEffect } from 'react';
import { ChevronLeft, Info, Key, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from "sonner";
import { listModels, AIModel, ModelSlot } from '../utils/modelRegistry';

export interface ChooseModelSubmenuProps {
  tempSelectedModel: string;
  setTempSelectedModel: React.Dispatch<React.SetStateAction<string>>;
  tempUseCustomAI: boolean;
  setTempUseCustomAI: React.Dispatch<React.SetStateAction<boolean>>;
  getRecommendedModel: (businessCategory: string) => string;
  lineOfBusiness: string;
  showModelApiKey: boolean;
  setShowModelApiKey: React.Dispatch<React.SetStateAction<boolean>>;
  showModelApiSecret: boolean;
  setShowModelApiSecret: React.Dispatch<React.SetStateAction<boolean>>;
  tempApiCredentials: Record<string, { apiKey: string; apiSecret: string }>;
  setTempApiCredentials: React.Dispatch<React.SetStateAction<Record<string, { apiKey: string; apiSecret: string }>>>;
  modelValidationError: string;
  setModelValidationError: React.Dispatch<React.SetStateAction<string>>;
  setSelectedModel: React.Dispatch<React.SetStateAction<string>>;
  setUseCustomAI: React.Dispatch<React.SetStateAction<boolean>>;
  setApiCredentials: React.Dispatch<React.SetStateAction<Record<string, { apiKey: string; apiSecret: string }>>>;
  setApiProvider: React.Dispatch<React.SetStateAction<string>>;
  setActiveSubmenu: (submenu: string | null) => void;
  handleNavigationAttempt: (target: string | null) => void;
}

export function ChooseModelSubmenu(props: ChooseModelSubmenuProps) {
  const {
    tempSelectedModel, setTempSelectedModel,
    tempUseCustomAI, setTempUseCustomAI,
    getRecommendedModel, lineOfBusiness,
    showModelApiKey, setShowModelApiKey,
    showModelApiSecret, setShowModelApiSecret,
    tempApiCredentials, setTempApiCredentials,
    modelValidationError, setModelValidationError,
    setSelectedModel, setUseCustomAI, setApiCredentials, setApiProvider,
    setActiveSubmenu, handleNavigationAttempt,
  } = props;

  const [models, setModels] = useState<AIModel[]>([]);
  const [loadingModels, setLoadingModels] = useState(true);

  useEffect(() => {
    async function fetchModels() {
      setLoadingModels(true);
      const fetched = await listModels();
      setModels(fetched);
      setLoadingModels(false);
    }
    fetchModels();
  }, []);

  return (
    <div className="w-full bg-white dark:bg-gray-800">
      {/* Header with Back Button */}
      <div 
        onClick={() => handleNavigationAttempt(null)}
        style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
        className="flex items-center px-6 mx-4 mt-3 mb-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg"
      >
        <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-2" />
        <span className="font-medium text-gray-900 dark:text-gray-100">Choose Model</span>
      </div>
      
      <div className="px-6 pt-4 pb-6 space-y-3">
        <div className="space-y-2">
          <Label className="text-gray-900 dark:text-gray-100 mb-2 block">Select AI Model for Your Business</Label>
          
          {loadingModels ? (
            <div className="py-8 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p className="text-sm">Fetching latest models...</p>
            </div>
          ) : (
            <div className="space-y-2">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => { setTempSelectedModel(prev => prev === model.name ? '' : model.name); setTempUseCustomAI(false); }}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left cursor-pointer ${
                    tempSelectedModel === model.name
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/20'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {model.icon}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{model.name}</h3>
                        {model.isNew && (
                          <span className="px-1.5 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[9px] font-bold rounded uppercase tracking-wider">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5 truncate">{model.desc}</p>
                    </div>
                    {getRecommendedModel(lineOfBusiness) === model.slot && (
                      <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-[10px] rounded flex-shrink-0">
                        Recommended
                      </span>
                    )}
                    {tempSelectedModel === model.name ? (
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-blue-600 dark:text-blue-500 flex-shrink-0"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Use Custom AI Provider Checkbox */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => {
                const newVal = !tempUseCustomAI;
                setTempUseCustomAI(newVal);
                if (newVal) {
                  setTempSelectedModel('');
                } else {
                  const recommendedSlot = getRecommendedModel(lineOfBusiness);
                  const recommendedModel = models.find(m => m.slot === recommendedSlot);
                  setTempSelectedModel(recommendedModel ? recommendedModel.name : '');
                }
              }}
              className="w-full flex items-center gap-3 px-1 py-2 text-left cursor-pointer group"
            >
              <div className={`w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all ${
                tempUseCustomAI
                  ? 'bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500'
                  : 'border-gray-400 dark:border-gray-500 bg-white dark:bg-gray-700 group-hover:border-blue-500 dark:group-hover:border-blue-400'
              }`}>
                {tempUseCustomAI && (
                  <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Use Custom AI Provider</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Connect your own AI model or use a different provider
                </p>
              </div>
            </button>

            {/* Custom AI Credentials */}
            <AnimatePresence>
              {tempUseCustomAI && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }} 
                  transition={{ duration: 0.25, ease: 'easeInOut' }} 
                  className="overflow-hidden"
                >
                  <div className="mt-3 space-y-3">
                    {/* Warning Banner */}
                    <div className="rounded-xl border border-amber-300/60 dark:border-amber-500/30 bg-amber-50/80 dark:bg-amber-950/20 p-3.5">
                      <div className="flex items-start gap-2.5">
                        <Info className="w-4 h-4 text-[#92400e] dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <div className="space-y-1.5">
                          <p className="text-sm font-semibold text-[#78350f] dark:text-amber-400">Advanced Settings {'\u2013'} Not Required</p>
                          <p className="text-xs text-[#92400e]/80 dark:text-amber-400/80 leading-relaxed">
                            This section is <span className="font-bold text-[#78350f] dark:text-amber-300">only for developers</span> who want to integrate their own AI model instead of using our pre-configured AI system. Our platform works perfectly without any API credentials.
                          </p>
                          <p className="text-xs text-[#92400e]/80 dark:text-amber-400/80 leading-relaxed">
                            <span className="font-bold text-[#78350f] dark:text-amber-300">Please do not modify these settings</span> unless you fully understand how to configure and use custom AI API integrations.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* API Key */}
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-400">API Key</Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                          <Key className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        </div>
                        <Input 
                          type={showModelApiKey ? 'text' : 'password'} 
                          placeholder="Enter API key" 
                          value={tempApiCredentials['Custom']?.apiKey || ''} 
                          onChange={(e) => setTempApiCredentials(prev => ({ ...prev, 'Custom': { apiKey: e.target.value, apiSecret: prev['Custom']?.apiSecret || '' } }))} 
                          className="pl-10 pr-10 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-lg shadow-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400" 
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowModelApiKey(!showModelApiKey)} 
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          {showModelApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* API Secret */}
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-400">API Secret</Label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                          <Lock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        </div>
                        <Input 
                          type={showModelApiSecret ? 'text' : 'password'} 
                          placeholder="Enter API secret" 
                          value={tempApiCredentials['Custom']?.apiSecret || ''} 
                          onChange={(e) => setTempApiCredentials(prev => ({ ...prev, 'Custom': { apiKey: prev['Custom']?.apiKey || '', apiSecret: e.target.value } }))} 
                          className="pl-10 pr-10 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-lg shadow-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400" 
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowModelApiSecret(!showModelApiSecret)} 
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          {showModelApiSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {modelValidationError && (
          <div className="mx-1 mb-2 px-3 py-2.5 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-red-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            <span className="text-sm text-red-600 dark:text-red-400">{modelValidationError}</span>
          </div>
        )}

        <Button 
          onClick={() => {
            let errorMsg = '';
            
            if (tempUseCustomAI) {
              const creds = tempApiCredentials['Custom'] || { apiKey: '', apiSecret: '' };
              const key = creds.apiKey?.trim();
              const secret = creds.apiSecret?.trim();
              
              if (!key && !secret) {
                errorMsg = 'Please enter both API Key and API Secret for your custom AI provider.';
              } else if (!key) {
                errorMsg = 'API Key is required. Please enter a valid API Key.';
              } else if (!secret) {
                errorMsg = 'API Secret is required. Please enter a valid API Secret.';
              } else if (key.length < 10) {
                errorMsg = 'API Key appears to be invalid. Please check and try again.';
              } else if (secret.length < 10) {
                errorMsg = 'API Secret appears to be invalid. Please check and try again.';
              }
              
              if (errorMsg) {
                setModelValidationError(errorMsg);
                setTimeout(() => toast.error(errorMsg), 50);
                return;
              }
              
              setApiCredentials({ ...tempApiCredentials });
              const isOpenAI = creds.apiKey?.startsWith('sk-');
              setApiProvider(isOpenAI ? 'OpenAI' : 'Custom');
            } else if (!tempSelectedModel) {
              errorMsg = 'Please select an AI model before saving.';
              setModelValidationError(errorMsg);
              setTimeout(() => toast.error(errorMsg), 50);
              return;
            }
            
            setModelValidationError('');
            setSelectedModel(tempSelectedModel);
            setUseCustomAI(tempUseCustomAI);
            setActiveSubmenu(null);
            
            const modelName = tempUseCustomAI ? 'Custom AI Provider' : tempSelectedModel;
            setTimeout(() => toast.success(`AI model changed to ${modelName}`), 50);
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={!tempSelectedModel && !tempUseCustomAI}
        >
          Save Model
        </Button>
      </div>
    </div>
  );
}
