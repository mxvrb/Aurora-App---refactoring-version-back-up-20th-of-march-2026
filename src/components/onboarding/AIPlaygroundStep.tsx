import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, Send, Moon, Sun, RefreshCw, Check, Upload, MessageSquare, Loader2, Mic, Signal, Wifi, Battery } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { AcesLogo } from '../AcesLogo';
import { Label } from '../ui/label';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import LucidePipette from '../../imports/LucidePipette';
import { TextWithAppleEmojis } from '../TextWithAppleEmojis';

interface AIPlaygroundStepProps {
  onContinue: () => void;
  onBack: () => void;
  websiteData?: { url: string; useCase: string; crawledData?: any };
  precomputedColor?: string | null;
  onColorChange?: (color: string) => void;
  onLogoChange?: (logo: string | null) => void;
  onGreetingChange?: (greeting: string) => void;
  initialColor?: string;
  initialLogo?: string | null;
  initialGreeting?: string;
  submitLabel?: string;
  title?: string;
  isEditing?: boolean;
}

export const AIPlaygroundStep: React.FC<AIPlaygroundStepProps> = ({
  onContinue,
  onBack,
  websiteData,
  precomputedColor,
  onColorChange,
  onLogoChange,
  onGreetingChange,
  initialColor: propInitialColor,
  initialLogo: propInitialLogo,
  initialGreeting: propInitialGreeting,
  submitLabel = "Onboard",
  title = "Customize your AI Assistant",
  isEditing = false
}) => {
  // Extract initial values from websiteData if available
  // Priority: Prop > Precomputed > Crawled > Default
  const initialColor = propInitialColor || precomputedColor || websiteData?.crawledData?.themeColor || '#2563EB';
  const initialLogo = propInitialLogo || websiteData?.crawledData?.logo || null;
  const companyName = websiteData?.crawledData?.title || 'this business';

  // Helper function to get luminance of a hex color
  const getLuminance = (hex: string) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    // Calculate luminance (perceived brightness)
    // Formula: 0.2126*R + 0.7152*G + 0.0722*B
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance;
  };

  // State for customization
  const [headerColor, setHeaderColor] = useState(initialColor);
  const [logoUrl, setLogoUrl] = useState<string | null>(initialLogo);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Sync changes to parent
  useEffect(() => {
    onColorChange?.(headerColor);
  }, [headerColor, onColorChange]);

  useEffect(() => {
    onLogoChange?.(logoUrl);
  }, [logoUrl, onLogoChange]);

  // Frontend Fallback for Logo if backend extraction failed
  useEffect(() => {
    // Only try fallback if we have no initial logo AND we have a website URL
    // And ensure we haven't already set a logo (to avoid loop)
    if (!initialLogo && !logoUrl && websiteData?.url) {
      try {
        const hostname = new URL(websiteData.url).hostname;
        const fallbackUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
        setLogoUrl(fallbackUrl);
      } catch (e) {
        console.log("Could not parse hostname for fallback logo");
      }
    }
  }, [initialLogo, websiteData?.url]);

  // Function to extract dominant color from image
  const extractDominantColor = async (imageUrl: string) => {
    try {
      let imageSrc = imageUrl;
      let shouldUseProxy = imageUrl.startsWith('http') || imageUrl.startsWith('//');
      
      // If it's a blob URL (already local), don't proxy
      if (imageUrl.startsWith('blob:')) shouldUseProxy = false;

      // Handle protocol-relative URLs
      if (shouldUseProxy && imageUrl.startsWith('//')) {
        imageUrl = 'https:' + imageUrl;
      }
      
      if (shouldUseProxy) {
         const proxyUrl = `https://${projectId}.supabase.co/functions/v1/make-server-3f7de5a4/util/proxy-image?url=${encodeURIComponent(imageUrl)}`;
         
         try {
             const response = await fetch(proxyUrl, {
                headers: {
                   'Authorization': `Bearer ${publicAnonKey}`
                }
             });
             
             if (!response.ok) {
                // Silently fail if proxy fails, don't throw to avoid console noise
                return null;
             }
             
             const blob = await response.blob();
             imageSrc = URL.createObjectURL(blob);
         } catch (e) {
             return null;
         }
      }

      const img = new Image();
      // Important: Do NOT set crossOrigin for Blob URLs created from fetch, 
      // as it can cause "isTrusted: true" load errors in some environments.
      // We already bypassed CORS via the proxy fetch.
      if (!shouldUseProxy && !imageUrl.startsWith('data:') && !imageUrl.startsWith('blob:')) {
          img.crossOrigin = "Anonymous";
      }
      
      img.src = imageSrc;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error("Image load failed"));
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Clean up object URL if we created one
      if (imageSrc !== imageUrl && imageSrc.startsWith('blob:')) {
         URL.revokeObjectURL(imageSrc);
      }

      // Analyze the image data to find the most frequent color (Dominant Color)
      // We focus on the center 80% to avoid border artifacts
      const width = img.width;
      const height = img.height;
      
      // If image is too small, don't try to crop too much
      const x = width > 10 ? width * 0.1 : 0;
      const y = height > 10 ? height * 0.1 : 0;
      const w = width > 10 ? width * 0.8 : width;
      const h = height > 10 ? height * 0.8 : height;

      const imageData = ctx.getImageData(x, y, w, h).data;
      
      const colorCounts: Record<string, { count: number, r: number, g: number, b: number }> = {};
      let maxCount = 0;
      let dominantColor = null;

      // Quantization step to group similar colors
      const QUANTIZE = 15;

      for (let i = 0; i < imageData.length; i += 4) {
        const a = imageData[i + 3];
        // Skip transparent or semi-transparent pixels
        if (a < 200) continue;

        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        
        // Skip white/near-white and black/near-black backgrounds to find the BRAND color
        // White: r,g,b > 230
        // Black: r,g,b < 30
        if ((r > 230 && g > 230 && b > 230) || (r < 30 && g < 30 && b < 30)) continue;

        // Round to nearest bucket
        const rQ = Math.round(r / QUANTIZE) * QUANTIZE;
        const gQ = Math.round(g / QUANTIZE) * QUANTIZE;
        const bQ = Math.round(b / QUANTIZE) * QUANTIZE;

        const key = `${rQ},${gQ},${bQ}`;
        
        if (!colorCounts[key]) {
            colorCounts[key] = { count: 0, r: rQ, g: gQ, b: bQ };
        }
        
        colorCounts[key].count++;
        
        if (colorCounts[key].count > maxCount) {
            maxCount = colorCounts[key].count;
            dominantColor = colorCounts[key];
        }
      }

      if (dominantColor) {
        // Convert back to hex
        const toHex = (n: number) => {
            const hex = Math.min(255, Math.max(0, n)).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(dominantColor.r)}${toHex(dominantColor.g)}${toHex(dominantColor.b)}`;
      }
      
      return null;

    } catch (e) {
      // Quietly fail for color extraction
      return null;
    }
  };

  // Auto-detect color from logo
  useEffect(() => {
    // When editing an existing setup with a saved color, skip auto-extraction
    // on the initial logo to preserve the user's chosen color.
    // Only re-extract if the user uploads a NEW logo (logoUrl !== initialLogo).
    const isInitialLogo = logoUrl === initialLogo;
    const hasPrecomputedColor = !!precomputedColor;
    const hasSavedColor = isEditing && !!propInitialColor;
    
    // Only extract if:
    // 1. We have a logo URL
    // 2. AND (It's a new logo OR (We don't have a precomputed/saved color))
    if (logoUrl && (!isInitialLogo || (!hasPrecomputedColor && !hasSavedColor))) {
        extractDominantColor(logoUrl).then(color => {
            if (color) {
                setHeaderColor(color);
                
                // Auto-set dark mode if color is very dark
                const lum = getLuminance(color);
                if (lum < 40) {
                    setIsDarkMode(true);
                } else {
                    setIsDarkMode(false);
                }
            }
        });
    }
  }, [logoUrl, precomputedColor, initialLogo]);

  // Determine text color based on header background
  const headerTextColor = getLuminance(headerColor) > 160 ? 'text-gray-900' : 'text-white';
  const headerIconColor = getLuminance(headerColor) > 160 ? 'text-gray-700' : 'text-white/80';


  // State for chat
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);
  const [isGreetingLoading, setIsGreetingLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Predefined colors
  const presetColors = [
    '#2563EB', // Blue
    '#DC2626', // Red
    '#16A34A', // Green
    '#9333EA', // Purple
    '#EA580C', // Orange
    '#000000', // Black
  ];

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Fetch initial greeting
  useEffect(() => {
    // When editing an existing setup, use the saved greeting instead of fetching a new one
    if (isEditing && propInitialGreeting) {
      setMessages([{ role: 'assistant', text: propInitialGreeting }]);
      setIsGreetingLoading(false);
      return;
    }

    const fetchGreeting = async () => {
      try {
        setIsGreetingLoading(true);
        // Add a small delay to make it feel natural if the API is too fast, 
        // and to allow the component to fully render first
        await new Promise(resolve => setTimeout(resolve, 500));

        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-35e72f4d/ai/playground/greeting`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            context: {
              companyName: websiteData?.crawledData?.title,
              lineOfBusiness: websiteData?.useCase,
              crawledContent: websiteData?.crawledData?.contentSnippet?.substring(0, 4000)
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const greeting = data.greeting || "Hello! I'm your AI assistant. How can I help you today?";
          setMessages([{ role: 'assistant', text: greeting }]);
          onGreetingChange?.(greeting);
        } else {
           const greeting = "Hello! I'm your AI assistant. How can I help you today?";
           setMessages([{ role: 'assistant', text: greeting }]);
           onGreetingChange?.(greeting);
        }
      } catch (error) {
         console.error("Failed to fetch greeting:", error);
         const greeting = "Hello! I'm your AI assistant. How can I help you today?";
         setMessages([{ role: 'assistant', text: greeting }]);
         onGreetingChange?.(greeting);
      } finally {
        setIsGreetingLoading(false);
      }
    };

    fetchGreeting();
  }, [websiteData?.url]); // Only re-fetch if website URL changes (or on mount)

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMsg = inputValue;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-35e72f4d/ai/playground/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          message: userMsg,
          history: messages.slice(-10), // Send last 10 messages for context
          context: {
            companyName: websiteData?.crawledData?.title,
            description: websiteData?.crawledData?.description,
            websiteUrl: websiteData?.url,
            lineOfBusiness: websiteData?.useCase,
            crawledContent: websiteData?.crawledData?.contentSnippet?.substring(0, 4000)
          }
        })
      });

      if (!response.ok) {
        let errorMessage = 'Failed to fetch AI response';
        try {
            const errorData = await response.json();
            if (errorData.error) errorMessage = errorData.error;
            else if (errorData.message) errorMessage = errorData.message;
            else errorMessage = `Server error: ${response.status} (No details)`;
        } catch (e) {
            errorMessage = `Server error: ${response.status} (Response not JSON)`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: data.response || "I'm having trouble connecting to my brain right now. Please try again."
      }]);
    } catch (error: any) {
      console.error('Chat error:', error);
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: `Error: ${error.message || "I'm experiencing a temporary network issue."} Please try again.`
      }]);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
    }
  };

  return (
    <div className="flex w-full h-screen bg-white dark:bg-gray-950 items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute top-[40%] -left-[10%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      {/* Back Button */}
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer z-20"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 max-h-full overflow-hidden">
        
        {/* Left Column: Configuration */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-8 overflow-y-auto max-h-full">
          <div>
            <div className="flex justify-center w-full">
              <AcesLogo className="w-12 h-12 mb-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {title}
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Personalize how your AI looks and feels to match your brand identity.
            </p>
          </div>

          <div className="space-y-6 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            {/* Logo Upload */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Assistant Logo</Label>
              <div className="flex items-center gap-5 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-center shrink-0 shadow-sm relative group">
                  {logoUrl ? (
                    <img 
                      src={logoUrl} 
                      alt="Logo" 
                      className="w-full h-full object-cover" 
                      onError={() => {
                        if (!logoUrl.includes('google.com')) {
                           try {
                             const hostname = new URL(websiteData?.url || '').hostname;
                             setLogoUrl(`https://www.google.com/s2/favicons?domain=${hostname}&sz=128`);
                           } catch (e) { setLogoUrl(null); }
                        } else {
                           setLogoUrl(null);
                        }
                      }}
                    />
                  ) : (
                    <MessageSquare className="w-8 h-8 text-gray-400" />
                  )}
                  
                  {/* Overlay for quick action */}
                  <label htmlFor="logo-upload" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                     <Upload className="w-5 h-5 text-white" />
                  </label>
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="file"
                      id="logo-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                    <label
                      htmlFor="logo-upload"
                      className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-all hover:border-gray-300 dark:hover:border-gray-600"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Replace Logo
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Recommended: Square PNG or JPG, min 100x100px
                  </p>
                </div>
              </div>
            </div>

            {/* Header Color */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Header Color</Label>
              <div className="flex flex-wrap gap-3">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setHeaderColor(color)}
                    className={`w-10 h-10 rounded-full cursor-pointer transition-transform hover:scale-110 focus:outline-none ring-2 ring-offset-2 dark:ring-offset-gray-900 ${
                      headerColor === color ? 'ring-gray-900 dark:ring-white scale-110' : 'ring-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  />
                ))}
                <div className="relative group">
                  <div className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center bg-white dark:bg-gray-800 shadow-sm transition-transform group-hover:scale-105">
                    <div className="w-5 h-5 text-gray-600 dark:text-gray-300">
                      <LucidePipette />
                    </div>
                  </div>
                  <input
                    type="color"
                    value={headerColor}
                    onChange={(e) => setHeaderColor(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    title="Custom color"
                  />
                </div>
              </div>
            </div>

             {/* Theme Toggle */}
             <div className="space-y-3">
              <Label className="text-base font-semibold">Preview Mode</Label>
              <div className="flex items-center gap-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-max">
                <button
                  onClick={() => setIsDarkMode(false)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                    !isDarkMode 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                  }`}
                >
                  <Sun className="w-4 h-4" /> Light
                </button>
                <button
                  onClick={() => setIsDarkMode(true)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                    isDarkMode 
                      ? 'bg-gray-700 text-white shadow-sm' 
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                  }`}
                >
                  <Moon className="w-4 h-4" /> Dark
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={onContinue}
              className="h-14 px-8 text-lg rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all w-full max-w-sm cursor-pointer"
            >
              {submitLabel} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-7 flex items-center justify-center max-h-full overflow-hidden">
          <div className="relative w-full max-w-[320px] mx-auto transform transition-all duration-500">
            {/* Phone Mockup Frame */}
            <div className={`
              relative rounded-[3rem] overflow-hidden border-[8px] shadow-2xl transition-colors duration-300 h-[min(720px,calc(100vh-6rem))] flex flex-col
              ${isDarkMode ? 'border-gray-800 bg-gray-950' : 'border-gray-900 bg-white'}
            `}>
              {/* Status Bar Mockup */}
              <div className={`h-12 w-full flex justify-between items-end pb-2 px-6 text-[12px] font-bold ${isDarkMode ? 'text-white' : 'text-black'} z-20 absolute top-0 left-0 right-0`}>
                <span className="ml-2">
                  {React.createElement(() => {
                    const [time, setTime] = useState(new Date());
                    useEffect(() => {
                      const timer = setInterval(() => setTime(new Date()), 1000);
                      return () => clearInterval(timer);
                    }, []);
                    return time.toLocaleTimeString('en-US', {
                      timeZone: 'Asia/Dubai',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: false,
                    });
                  })}
                </span>
                <div className="flex items-center gap-1 mr-2">
                  <Signal className="w-3.5 h-3.5" />
                  <Wifi className="w-3.5 h-3.5" />
                  <Battery className="w-4 h-3.5" />
                </div>
              </div>

              {/* Chat Header */}
              <div 
                className="pt-14 pb-4 px-5 shadow-md z-10 transition-colors duration-300 flex items-center gap-4"
                style={{ backgroundColor: headerColor }}
              >
                <button className={`${headerIconColor} hover:opacity-100 cursor-pointer`}>
                  <ArrowLeft className="w-6 h-6" />
                </button>
                
                <div className="w-10 h-10 rounded-full bg-white/20 overflow-hidden flex items-center justify-center border border-white/30">
                  {logoUrl ? (
                    <img 
                      src={logoUrl} 
                      alt="Logo" 
                      className="w-full h-full object-cover" 
                      onError={() => {
                        // If standard logo fails, try Google fallback if not already tried
                        if (!logoUrl.includes('google.com')) {
                           try {
                             const hostname = new URL(websiteData?.url || '').hostname;
                             setLogoUrl(`https://www.google.com/s2/favicons?domain=${hostname}&sz=128`);
                           } catch (e) { setLogoUrl(null); }
                        } else {
                           setLogoUrl(null);
                        }
                      }}
                    />
                  ) : (
                    <MessageSquare className="w-6 h-6 text-white" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className={`font-semibold ${headerTextColor} text-base`}>AI Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
                    <span className={`text-xs ${headerTextColor} opacity-90 font-medium`}>Online</span>
                  </div>
                </div>
                
                <button className={`${headerIconColor} hover:opacity-100 cursor-pointer`}>
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Area */}
              <div 
                ref={chatContainerRef}
                className={`flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth ${isDarkMode ? 'bg-[#0f0f0f]' : 'bg-gray-50'}`}
              >
                <div className="text-center py-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-[#1a1a1a] text-gray-400' : 'bg-gray-200 text-gray-500'}`}>
                    Today
                  </span>
                </div>

                {isGreetingLoading && messages.length === 0 && (
                  <div className="flex justify-start animate-pulse">
                     <div className={`
                        p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-3
                        ${isDarkMode ? 'bg-[#1a1a1a] text-gray-100' : 'bg-white text-gray-800 border border-gray-100'}
                     `}>
                        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                        <span className="text-sm opacity-70">Creating your agent...</span>
                     </div>
                  </div>
                )}

                <AnimatePresence>
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`
                          max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm whitespace-pre-wrap leading-relaxed
                          ${msg.role === 'user' 
                            ? 'text-white rounded-br-none' 
                            : `rounded-bl-none ${isDarkMode ? 'bg-[#1a1a1a] text-gray-100' : 'bg-white text-gray-800 border border-gray-100'}`
                          }
                        `}
                        style={msg.role === 'user' ? { backgroundColor: headerColor, color: getLuminance(headerColor) > 160 ? '#111827' : 'white' } : {}}
                      >
                        <TextWithAppleEmojis text={msg.text} />
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                       <div className={`
                          p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1 items-center h-10
                          ${isDarkMode ? 'bg-[#1a1a1a] text-gray-100' : 'bg-white text-gray-800 border border-gray-100'}
                       `}>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Input Area */}
              <div className={`pt-4 px-4 pb-10 border-t ${isDarkMode ? 'bg-[#000000] border-[#1a1a1a]' : 'bg-white border-gray-100'}`}>
                <div className="relative flex items-center gap-2">
                   <div className={`flex-1 flex items-center rounded-full px-4 py-2 border ${isDarkMode ? 'bg-[#1a1a1a] border-[#2a2a2a]' : 'bg-gray-50 border-gray-200'}`}>
                     <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className={`flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-sm ${isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
                     />
                     <Mic className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                   </div>
                   <button 
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md
                      ${!inputValue.trim() ? 'opacity-50 cursor-not-allowed bg-gray-400' : 'hover:scale-105 cursor-pointer'}
                    `}
                    style={{ backgroundColor: !inputValue.trim() ? undefined : headerColor }}
                   >
                     <Send className={`w-4 h-4 ml-0.5 ${getLuminance(headerColor) > 160 ? 'text-gray-900' : 'text-white'}`} />
                   </button>
                </div>
              </div>
              
              {/* Home Indicator */}
              <div className={`h-8 w-full absolute bottom-0 left-0 right-0 flex justify-center items-end pb-2.5 z-20 pointer-events-none`}>
                 <div className={`w-36 h-1.5 rounded-full ${isDarkMode ? 'bg-white/20' : 'bg-black/20'}`}></div>
              </div>
            </div>
            
            {/* Decorative blob behind phone */}
            <div 
              className="absolute -inset-4 bg-gradient-to-tr from-blue-500 to-purple-500 opacity-20 blur-xl -z-10 rounded-[3rem]"
              style={{ 
                background: `linear-gradient(to top right, ${headerColor}, ${headerColor}88)`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};