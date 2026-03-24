SelectLanguagesSubmenu.tsx - Full Source Code
import React, { useState, useMemo } from 'react';
import { Check, Search, CheckCircle2, Circle } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from "sonner";

// Extensive list of languages
const ALL_LANGUAGES = [
  "Afrikaans", "Albanian", "Amharic", "Arabic", "Armenian", "Azerbaijani", "Basque", "Belarusian", "Bengali", 
  "Bosnian", "Bulgarian", "Catalan", "Cebuano", "Chinese (Simplified)", "Chinese (Traditional)", "Corsican", 
  "Croatian", "Czech", "Danish", "Dutch", "English", "Esperanto", "Estonian", "Finnish", "French", "Frisian", 
  "Galician", "Georgian", "German", "Greek", "Gujarati", "Haitian Creole", "Hausa", "Hawaiian", "Hebrew", "Hindi", 
  "Hmong", "Hungarian", "Icelandic", "Igbo", "Indonesian", "Irish", "Italian", "Japanese", "Javanese", "Kannada", 
  "Kazakh", "Khmer", "Kinyarwanda", "Korean", "Kurdish", "Kyrgyz", "Lao", "Latin", "Latvian", "Lithuanian", 
  "Luxembourgish", "Macedonian", "Malagasy", "Malay", "Malayalam", "Maltese", "Maori", "Marathi", "Mongolian", 
  "Myanmar (Burmese)", "Nepali", "Norwegian", "Nyanja (Chichewa)", "Odia (Oriya)", "Pashto", "Persian", "Polish", 
  "Portuguese", "Punjabi", "Romanian", "Russian", "Samoan", "Scots Gaelic", "Serbian", "Sesotho", "Shona", 
  "Sindhi", "Sinhala (Sinhalese)", "Slovak", "Slovenian", "Somali", "Spanish", "Sundanese", "Swahili", "Swedish", 
  "Tagalog (Filipino)", "Tajik", "Tamil", "Tatar", "Telugu", "Thai", "Turkish", "Turkmen", "Ukrainian", "Urdu", 
  "Uyghur", "Uzbek", "Vietnamese", "Welsh", "Xhosa", "Yiddish", "Yoruba", "Zulu"
];

interface SelectLanguagesSubmenuProps {
  userTier: string; // 'Basic', 'Pro', 'Premium', 'Enterprise'
}

export function SelectLanguagesSubmenu({ userTier }: SelectLanguagesSubmenuProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [primaryLanguage, setPrimaryLanguage] = useState('English');
  const [allowedLanguages, setAllowedLanguages] = useState<string[]>([]);

  // Helper to check if user has access to secondary languages
  const isBasicTier = userTier === 'Basic';

  // Filter languages based on search
  const filteredLanguages = useMemo(() => {
    return ALL_LANGUAGES.filter(lang => 
      lang.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Handle Primary Language Selection
  const handlePrimarySelect = (lang: string) => {
    if (lang === primaryLanguage) return;
    
    // If the new primary was in allowed list, remove it from allowed
    if (allowedLanguages.includes(lang)) {
      setAllowedLanguages(allowedLanguages.filter(l => l !== lang));
    }
    
    setPrimaryLanguage(lang);
    toast.success(`Primary language set to ${lang}`);
  };

  // Handle Allowed Language Toggle
  const handleAllowedToggle = (lang: string) => {
    if (isBasicTier) {
      toast.error("Upgrade to Pro or higher to add secondary languages.");
      return;
    }

    if (lang === primaryLanguage) {
      toast.info("This is already your primary language.");
      return;
    }

    if (allowedLanguages.includes(lang)) {
      setAllowedLanguages(allowedLanguages.filter(l => l !== lang));
    } else {
      setAllowedLanguages([...allowedLanguages, lang]);
    }
  };

  // Handle Select All (Pro+ only)
  const handleSelectAll = () => {
    if (isBasicTier) return;

    const languagesToAdd = filteredLanguages.filter(l => l !== primaryLanguage && !allowedLanguages.includes(l));
    
    if (languagesToAdd.length === 0) {
      return;
    }

    setAllowedLanguages([...allowedLanguages, ...languagesToAdd]);
    toast.success(`Added ${languagesToAdd.length} languages to allowed list.`);
  };

  const handleDeselectAll = () => {
      if (isBasicTier) return;
      setAllowedLanguages([]);
      toast.info("Cleared all secondary languages.");
  }

  return (
    <div className="w-full h-[345px] flex flex-col bg-white dark:bg-gray-800 overflow-hidden">
      {/* Sticky Header Section */}
      <div className="flex-none sticky top-0 z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 pb-3 pt-0 space-y-3 shadow-sm">
        
        {/* Top Row: Search (Left) + Actions (Right) */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Search languages..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

           {/* Action Buttons */}
          {!isBasicTier && (
             <div className="flex items-center gap-2 shrink-0">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleDeselectAll}
                  className="text-xs h-8 px-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Clear All
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleSelectAll}
                  className="text-xs h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Select All
                </Button>
             </div>
          )}
        </div>

        {/* Bottom Row: Legend / Explanation */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center shadow-sm shrink-0">
                <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
              </div>
              <span>Default Language (AI initiates conversation in this language)</span>
          </div>
          <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center shadow-sm shrink-0">
                <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
              </div>
              <span>Allowed Language (AI can switch to these if user speaks them)</span>
          </div>
        </div>
      </div>

      {/* Scrollable Language List Area */}
      <div className="h-[257px] relative overflow-hidden bg-gray-50/50 dark:bg-gray-900/30">
        {/* Gradient Masks for "Rolling" Feel */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white dark:from-gray-800 to-transparent z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-800 to-transparent z-10 pointer-events-none" />

        <div className="absolute inset-0 overflow-y-auto scroll-smooth px-4 py-4">
          <div className="space-y-1">
            {filteredLanguages.map((lang) => {
              const isPrimary = lang === primaryLanguage;
              const isAllowed = allowedLanguages.includes(lang);
              
              return (
                <div 
                  key={lang}
                  className={`
                    group flex items-center justify-between px-4 py-2 rounded-lg border transition-all duration-200 cursor-pointer select-none
                    ${isPrimary 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 shadow-sm scale-[1.005]' 
                      : isAllowed 
                        ? 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600' 
                        : 'bg-white dark:bg-gray-800 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-[1.005]'
                    }
                  `}
                  onClick={() => handleAllowedToggle(lang)}
                >
                  <span className={`text-sm font-medium ${isPrimary ? 'text-green-800 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'}`}>
                    {lang}
                  </span>
                  
                  <div className="flex items-center gap-3">
                     {/* Primary Toggle Button */}
                     <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrimarySelect(lang);
                        }}
                        className={`
                          w-6 h-6 rounded-full flex items-center justify-center transition-all hover:scale-110
                          ${isPrimary 
                            ? 'bg-green-500 shadow-md cursor-default ring-2 ring-green-100 dark:ring-green-900' 
                            : 'bg-gray-100 dark:bg-gray-700 hover:bg-green-200 dark:hover:bg-green-900/50 cursor-pointer text-transparent hover:text-green-600'
                          }
                        `}
                        title="Set as Primary Language"
                     >
                        <Check className={`w-3.5 h-3.5 ${isPrimary ? 'text-white' : ''}`} strokeWidth={3} />
                     </div>

                     {/* Secondary Indicator */}
                     {!isPrimary && !isBasicTier && (
                       <div 
                          className={`
                            w-5 h-5 rounded-full flex items-center justify-center border transition-all
                            ${isAllowed 
                               ? 'bg-gray-400 border-gray-400' 
                               : 'border-gray-300 dark:border-gray-600'
                            }
                          `}
                       >
                          {isAllowed && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                       </div>
                     )}
                     
                     {isBasicTier && !isPrimary && (
                        <div className="w-5 h-5 flex items-center justify-center opacity-20">
                           <Circle className="w-3.5 h-3.5 text-gray-400" />
                        </div>
                     )}
                  </div>
                </div>
              );
            })}
            
            {filteredLanguages.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p>No languages found matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
Key Features That Make It Satisfying:
Gradient Masks (Lines 153-155): Creates the "rolling" effect

<div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white dark:from-gray-800 to-transparent z-10 pointer-events-none" />
<div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-800 to-transparent z-10 pointer-events-none" />
Smooth Scrolling: scroll-smooth class on the container

Hover Scale Effect: hover:scale-[1.005] on language items

Transition Animations: transition-all duration-200 for smooth state changes

Fixed Height Container: h-[257px] with overflow-y-auto for controlled scrolling

Visual Feedback: Green highlighting for primary, border changes for selected, scale on hover