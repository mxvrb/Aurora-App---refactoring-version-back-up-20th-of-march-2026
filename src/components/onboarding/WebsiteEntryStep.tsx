import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Loader2, Building, Palette, Link as LinkIcon, Plus, ChevronDown, ClipboardList, ArrowLeft, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { AcesLogo } from '../AcesLogo';
import globeIcon from "figma:asset/ef08d3f22c4abc4edffa8cecec7e2f230e846e07.png";
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface WebsiteEntryStepProps {
  onContinue: (data: { url: string; useCase: string; crawledData?: any }) => void;
  onManualSetup: () => void;
  onBack?: () => void;
  isLoading?: boolean;
  initialData?: { url: string; useCase: string; crawledData?: any };
  showVideoBackground?: boolean;
  side?: 'left' | 'right' | 'both';
  externalIsCrawling?: boolean;
  externalCrawlSteps?: any[];
  onCrawlStateChange?: (isCrawling: boolean, steps: any[]) => void;
}

export const WebsiteEntryStep: React.FC<WebsiteEntryStepProps> = ({
  onContinue,
  onManualSetup,
  onBack,
  isLoading = false,
  initialData,
  showVideoBackground = true,
  side = 'both',
  externalIsCrawling,
  externalCrawlSteps,
  onCrawlStateChange
}) => {
  const [protocol, setProtocol] = useState(() => {
    if (initialData?.url) {
      return initialData.url.startsWith('http://') ? 'http://' : 'https://';
    }
    return 'https://';
  });
  const [protocolOpen, setProtocolOpen] = useState(false);
  const [url, setUrl] = useState(() => {
    if (initialData?.url) {
      return initialData.url.replace(/^https?:\/\//, '');
    }
    return '';
  });
  const STANDARD_USE_CASES = ['General Business', 'Customer Support', 'Sales & Bookings'];

  const [useCase, setUseCase] = useState(initialData?.useCase || 'General Business');
  const [isCustomUseCase, setIsCustomUseCase] = useState(() => {
    if (initialData?.useCase && !STANDARD_USE_CASES.includes(initialData.useCase)) {
      return true;
    }
    return false;
  });
  const [businessTypeOpen, setBusinessTypeOpen] = useState(false);
  const [internalIsCrawling, setInternalIsCrawling] = useState(false);

  const isCrawling = externalIsCrawling !== undefined ? externalIsCrawling : internalIsCrawling;

  const setIsCrawling = (val: boolean) => {
    if (externalIsCrawling !== undefined) return;
    if (onCrawlStateChange) {
      onCrawlStateChange(val, crawlSteps);
    }
    setInternalIsCrawling(val);
  };

  const [isUrlFocused, setIsUrlFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const protocolRef = useRef<HTMLDivElement>(null);
  const businessTypeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (protocolRef.current && !protocolRef.current.contains(event.target as Node)) {
        setProtocolOpen(false);
      }
      if (businessTypeRef.current && !businessTypeRef.current.contains(event.target as Node)) {
        setBusinessTypeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [internalCrawlSteps, setInternalCrawlSteps] = useState(() => {
    const steps = [
      { id: 'logo', label: 'Finding logo', status: 'pending' },
      { id: 'color', label: 'Matching brand colors', status: 'pending' },
      { id: 'links', label: 'Reading website pages', status: 'pending' },
      { id: 'prompt', label: 'Training your assistant', status: 'pending' }
    ];
    if (initialData?.url) {
      return steps.map(step => ({ ...step, status: 'complete' }));
    }
    return steps;
  });

  const crawlSteps = externalCrawlSteps !== undefined ? externalCrawlSteps : internalCrawlSteps;

  const setCrawlSteps = (updater: any) => {
    if (externalCrawlSteps !== undefined) return;
    const nextSteps = typeof updater === 'function' ? updater(crawlSteps) : updater;
    if (onCrawlStateChange) {
      onCrawlStateChange(isCrawling, nextSteps);
    }
    setInternalCrawlSteps(nextSteps);
  };

  const validateUrl = (value: string) => {
    const urlPattern = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    return urlPattern.test(value);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (error) setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isCustomUseCaseInvalid = isCustomUseCase && !useCase;
    if (e.key === 'Enter' && url && !isCustomUseCaseInvalid && !isCrawling && !isLoading) {
      startCrawling();
    }
  };

  const isRestored = !isCrawling && initialData && (protocol + url === initialData.url);

  const startCrawling = async () => {
    if (!url) return;
    if (!validateUrl(url)) {
      setError('Please enter a valid website address');
      return;
    }
    if (isRestored) {
      onContinue({ url: `${protocol}${url}`, useCase, crawledData: initialData?.crawledData });
      return;
    }
    setIsCrawling(true);
    const fullUrl = `${protocol}${url}`;
    const initialSteps = [
      { id: 'logo', label: 'Finding logo', status: 'loading' },
      { id: 'color', label: 'Matching brand colors', status: 'pending' },
      { id: 'links', label: 'Reading website pages', status: 'pending' },
      { id: 'prompt', label: 'Training your assistant', status: 'pending' }
    ];
    setCrawlSteps(initialSteps);
    try {
      const crawlPromise = fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3f7de5a4/crawl`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ url: fullUrl })
      }).then(res => res.json());
      await new Promise(r => setTimeout(r, 1000));
      updateStepStatus('logo', 'complete');
      updateStepStatus('color', 'loading');
      await new Promise(r => setTimeout(r, 1000));
      updateStepStatus('color', 'complete');
      updateStepStatus('links', 'loading');
      const result = await crawlPromise;
      updateStepStatus('links', 'complete');
      updateStepStatus('prompt', 'loading');
      await new Promise(r => setTimeout(r, 800));
      updateStepStatus('prompt', 'complete');
      await new Promise(r => setTimeout(r, 500));
      onContinue({ url: fullUrl, useCase, crawledData: result.success ? result.data : null });
    } catch (error) {
      console.error("Crawl failed:", error);
      setError("Could not scan website completely, but proceeding...");
      setTimeout(() => { onContinue({ url: fullUrl, useCase }); }, 1000);
    }
  };

  const updateStepStatus = (id: string, status: string) => {
    setCrawlSteps((prev: any[]) => prev.map(step => step.id === id ? { ...step, status } : step));
  };

  const getStatusIcon = (status: string) => {
    if (status === 'loading') return <Loader2 className="w-4 h-4 animate-spin text-blue-600" />;
    if (status === 'complete') return <Check className="w-4 h-4 text-green-500" />;
    return <div className="w-4 h-4 rounded-full border border-gray-300" />;
  };

  return (
    <div className={side === 'both' ? `flex w-full min-h-screen text-gray-900 overflow-x-hidden font-sans ${showVideoBackground ? 'bg-transparent' : 'bg-white'} items-stretch` : 'w-full h-full'}>
      {onBack && side !== 'right' && (
        <button onClick={onBack} className="absolute top-8 left-8 p-2 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100 cursor-pointer z-30">
          <ArrowLeft className="w-6 h-6" />
        </button>
      )}

      {(side === 'both' || side === 'left') && (
        <motion.div
          layoutId="onboarding-surface"
          className={`${showVideoBackground && side === 'both' ? 'w-full lg:w-1/2 min-h-screen' : 'w-full'} flex flex-col relative ${showVideoBackground ? 'bg-white/95 backdrop-blur-sm shadow-[20px_0_50px_-12px_rgba(0,0,0,0.15)] z-20' : 'bg-transparent'}`}
        >
          <div className="absolute top-12 left-0 right-0 flex justify-center z-20">
            <AcesLogo className="w-10 h-10" />
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-12">
            <div className="w-full max-w-[420px] space-y-8 mt-12">
              <div className="text-left w-full">
                <h1 className="text-[32px] leading-tight font-bold text-gray-900 mb-3 tracking-tight">Link your website</h1>
                <p className="text-gray-500 text-lg leading-relaxed">Enter your website link below. We will scan it to instantly learn about your business and answer customer questions.</p>
              </div>
              <div className="space-y-6 w-full">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900 block text-left">Website Link</label>
                  <div className={`flex items-center rounded-xl border transition-all duration-200 bg-white shadow-sm ${error ? 'border-red-500 ring-4 ring-red-500/10' : isUrlFocused ? 'border-blue-600 ring-4 ring-blue-600/10' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="relative" ref={protocolRef}>
                      <button type="button" onClick={() => setProtocolOpen(!protocolOpen)} className="flex items-center gap-1.5 h-12 pl-4 pr-3 text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors outline-none border-r border-gray-100 cursor-pointer">
                        {protocol}
                        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${protocolOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {protocolOpen && (
                          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute top-full left-0 mt-2 w-32 bg-white border border-gray-100 rounded-lg shadow-xl py-1 z-50 overflow-hidden">
                            {['https://', 'http://'].map((p) => (
                              <button key={p} type="button" onClick={() => { setProtocol(p); setProtocolOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors font-medium flex items-center justify-between group cursor-pointer">{p}{protocol === p && <Check className="w-4 h-4 text-blue-600" />}</button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <input type="text" placeholder="acesai.me" value={url} onChange={handleUrlChange} onKeyDown={handleKeyDown} onFocus={() => setIsUrlFocused(true)} onBlur={() => setIsUrlFocused(false)} className="flex-1 min-w-0 bg-transparent border-none focus:ring-0 h-12 px-4 text-base placeholder:text-gray-400 text-gray-900 outline-none" autoFocus />
                  </div>
                  {error && <p className="text-sm text-red-500 mt-2 flex items-center gap-1.5 animate-in slide-in-from-top-1"><X className="w-4 h-4" />{error}</p>}
                </div>
                <div className="space-y-2 relative" ref={businessTypeRef}>
                  <label className="text-sm font-semibold text-gray-900 block text-left">I need my AI to assist me with</label>
                  <button type="button" onClick={() => setBusinessTypeOpen(!businessTypeOpen)} className={`w-full h-12 px-3 text-base border bg-white shadow-sm rounded-xl transition-all duration-200 text-left flex items-center justify-between font-normal text-gray-900 outline-none cursor-pointer ${businessTypeOpen ? 'border-blue-600 ring-4 ring-blue-600/10' : 'border-gray-200 hover:border-gray-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10'}`}>
                    <span className={(!useCase && !isCustomUseCase) ? "text-gray-500" : ""}>{isCustomUseCase ? "Other..." : (useCase || "Select business type")}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${businessTypeOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {businessTypeOpen && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-100 shadow-xl rounded-xl p-1 z-50 overflow-hidden">
                        {STANDARD_USE_CASES.map((option) => (
                          <button key={option} type="button" onClick={() => { setUseCase(option); setIsCustomUseCase(false); setBusinessTypeOpen(false); }} className="w-full text-left px-3 py-2.5 text-base text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors rounded-lg flex items-center justify-between group cursor-pointer">{option}{useCase === option && !isCustomUseCase && <Check className="w-4 h-4 text-blue-600" />}</button>
                        ))}
                        <button type="button" onClick={() => { setUseCase(''); setIsCustomUseCase(true); setBusinessTypeOpen(false); }} className="w-full text-left px-3 py-2.5 text-base text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors rounded-lg flex items-center justify-between group cursor-pointer">Other...{isCustomUseCase && <Check className="w-4 h-4 text-blue-600" />}</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <AnimatePresence>
                  {isCustomUseCase && (
                    <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: 8 }} exit={{ opacity: 0, height: 0, marginTop: 0 }} className="overflow-hidden px-1 -mx-1 pb-1">
                      <label className="text-sm font-semibold text-gray-900 block text-left mb-2">Please specify purpose</label>
                      <Input type="text" placeholder="Describe your business activity..." value={useCase} onChange={(e) => setUseCase(e.target.value)} onKeyDown={handleKeyDown} className="h-12 text-base px-4 rounded-xl border-gray-200 bg-white shadow-sm focus-visible:ring-4 focus-visible:ring-blue-600/10 focus-visible:border-blue-600 transition-all duration-200" autoFocus />
                    </motion.div>
                  )}
                </AnimatePresence>
                <Button onClick={startCrawling} disabled={!url || (isCustomUseCase && !useCase) || isCrawling || isLoading} className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl mt-4 cursor-pointer">{isCrawling ? (<><Loader2 className="w-5 h-5 mr-2 animate-spin" />Scanning...</>) : 'Continue'}</Button>
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-3 text-gray-400 font-medium">Or</span></div>
                </div>
                <Button variant="outline" onClick={onManualSetup} disabled={isCrawling || isLoading} className="w-full h-12 text-base font-medium border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 text-gray-700 transition-all duration-200 rounded-xl cursor-pointer">I don't have a website</Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {(side === 'both' || side === 'right') && showVideoBackground && (
        <div className={`${side === 'both' ? 'hidden lg:flex w-1/2' : 'flex w-full'} relative items-center justify-center p-12 overflow-hidden border-l border-gray-100 min-h-screen ${showVideoBackground ? 'bg-transparent' : 'bg-gray-50'}`}>
          <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          <div className="relative z-10 w-full max-w-lg">
            <AnimatePresence mode="wait">
              {(!isCrawling && !isRestored) ? (
                <motion.div key="preview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5 }} className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 flex flex-col items-center justify-center aspect-[4/3] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50/50 pointer-events-none" />
                  <div className="relative z-10 flex flex-col items-center w-full">
                    <div className="w-24 h-24 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                      <img src={globeIcon} alt="Globe" className="w-10 h-10 object-contain" style={{ filter: "invert(26%) sepia(95%) saturate(2260%) hue-rotate(206deg) brightness(97%) contrast(105%)" }} />
                    </div>
                    <div className="w-full space-y-4 max-w-xs">
                      <div className="h-3 bg-gray-100 rounded-full w-full" />
                      <div className="h-3 bg-gray-100 rounded-full w-2/3 mx-auto" />
                    </div>
                    {url && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-900 rounded-full text-sm font-medium border border-gray-200 shadow-sm">
                        <LinkIcon className="w-3.5 h-3.5 text-gray-400" />
                        <span className="truncate max-w-[200px]">{protocol}{url}</span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div key="crawling" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="relative w-full">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full h-24 w-[1px] bg-gradient-to-b from-transparent to-emerald-200" />
                  <div className="relative z-10 w-full max-w-md mx-auto p-[3px] rounded-2xl bg-gradient-to-br from-emerald-300 via-cyan-400 to-blue-500 shadow-2xl">
                    <div className="bg-white rounded-xl p-8 w-full h-full">
                      <div className="space-y-5">
                        {crawlSteps.map((step: any) => (
                          <div key={step.id} className="flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 border ${step.status === 'complete' ? 'bg-green-50 text-green-600 border-green-100' : step.status === 'loading' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                                {step.id === 'logo' && <Building className="w-5 h-5" />}
                                {step.id === 'color' && <Palette className="w-5 h-5" />}
                                {step.id === 'links' && <LinkIcon className="w-5 h-5" />}
                                {step.id === 'prompt' && <ClipboardList className="w-5 h-5" />}
                              </div>
                              <span className={`text-base font-medium transition-colors duration-300 ${step.status === 'pending' ? 'text-gray-400' : 'text-gray-900'}`}>{step.label}</span>
                            </div>
                            <div className="transition-all duration-300">{getStatusIcon(step.status)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center mt-0 relative z-0">
                    <div className="w-[1px] h-12 bg-gradient-to-b from-blue-500 to-blue-600/50" />
                    <div className="bg-white rounded-2xl p-4 shadow-xl border border-gray-100 relative z-10"><AcesLogo className="w-10 h-10 text-black" /></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};