import React, { useState, useMemo, useEffect, useRef, useContext } from 'react';
import { Check, Search, Star, X, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from "sonner";
import Language80327 from '../imports/Language-803-27';
import Vector from '../imports/Vector';
import SecondaryLanguageIcon from '../imports/Icon-3770-1620';
import { FilterContext } from '../contexts/FilterContext';

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

// Country code to language mapping
const COUNTRY_LANGUAGE_MAP: { [key: string]: { primary: string, allowed: string[] } } = {
  'US': { primary: 'English', allowed: ['Spanish', 'Chinese (Simplified)', 'Tagalog (Filipino)', 'Vietnamese', 'French'] },
  'GB': { primary: 'English', allowed: ['Polish', 'Urdu', 'Punjabi', 'French', 'Spanish'] },
  'CA': { primary: 'English', allowed: ['French', 'Punjabi', 'Spanish', 'Chinese (Simplified)', 'Arabic'] },
  'AU': { primary: 'English', allowed: ['Chinese (Simplified)', 'Arabic', 'Vietnamese', 'Italian', 'Greek'] },
  'NZ': { primary: 'English', allowed: ['Maori', 'Samoan', 'Hindi', 'Chinese (Simplified)', 'French'] },
  'IE': { primary: 'English', allowed: ['Irish', 'Polish', 'French', 'Spanish', 'German'] },
  'AE': { primary: 'Arabic', allowed: ['English', 'Hindi', 'Urdu', 'Tagalog (Filipino)', 'Malayalam'] },
  'SA': { primary: 'Arabic', allowed: ['English', 'Urdu', 'Hindi', 'Tagalog (Filipino)', 'Bengali'] },
  'EG': { primary: 'Arabic', allowed: ['English', 'French', 'Spanish'] },
  'KW': { primary: 'Arabic', allowed: ['English', 'Hindi', 'Urdu', 'Tagalog (Filipino)'] },
  'QA': { primary: 'Arabic', allowed: ['English', 'Hindi', 'Urdu', 'Tagalog (Filipino)', 'Malayalam'] },
  'BH': { primary: 'Arabic', allowed: ['English', 'Hindi', 'Urdu', 'Tagalog (Filipino)'] },
  'OM': { primary: 'Arabic', allowed: ['English', 'Hindi', 'Urdu', 'Bengali'] },
  'JO': { primary: 'Arabic', allowed: ['English', 'French'] },
  'LB': { primary: 'Arabic', allowed: ['English', 'French', 'Armenian'] },
  'IN': { primary: 'Hindi', allowed: ['English', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'Urdu'] },
  'CN': { primary: 'Chinese (Simplified)', allowed: ['English', 'Cantonese'] },
  'JP': { primary: 'Japanese', allowed: ['English', 'Chinese (Simplified)', 'Korean'] },
  'KR': { primary: 'Korean', allowed: ['English', 'Chinese (Simplified)', 'Japanese'] },
  'PK': { primary: 'Urdu', allowed: ['English', 'Punjabi', 'Sindhi', 'Pashto'] },
  'BD': { primary: 'Bengali', allowed: ['English', 'Hindi'] },
  'PH': { primary: 'Tagalog (Filipino)', allowed: ['English', 'Cebuano', 'Ilocano'] },
  'VN': { primary: 'Vietnamese', allowed: ['English', 'Chinese (Simplified)', 'French'] },
  'TH': { primary: 'Thai', allowed: ['English', 'Chinese (Simplified)', 'Malay'] },
  'ID': { primary: 'Indonesian', allowed: ['English', 'Javanese', 'Sundanese'] },
  'MY': { primary: 'Malay', allowed: ['English', 'Chinese (Simplified)', 'Tamil'] },
  'SG': { primary: 'English', allowed: ['Chinese (Simplified)', 'Malay', 'Tamil'] },
  'HK': { primary: 'Chinese (Traditional)', allowed: ['English', 'Chinese (Simplified)'] },
  'TW': { primary: 'Chinese (Traditional)', allowed: ['English', 'Chinese (Simplified)'] },
  'FR': { primary: 'French', allowed: ['English', 'Arabic', 'Spanish', 'Portuguese', 'German'] },
  'DE': { primary: 'German', allowed: ['English', 'Turkish', 'Russian', 'Arabic', 'Polish'] },
  'ES': { primary: 'Spanish', allowed: ['English', 'Catalan', 'Galician', 'Basque', 'French'] },
  'IT': { primary: 'Italian', allowed: ['English', 'Romanian', 'Arabic', 'Albanian', 'Spanish'] },
  'PT': { primary: 'Portuguese', allowed: ['English', 'French', 'Spanish'] },
  'NL': { primary: 'Dutch', allowed: ['English', 'Turkish', 'Arabic', 'French', 'German'] },
  'PL': { primary: 'Polish', allowed: ['English', 'Ukrainian', 'Russian', 'German'] },
  'RU': { primary: 'Russian', allowed: ['English', 'Ukrainian', 'Tatar', 'Kazakh'] },
  'TR': { primary: 'Turkish', allowed: ['English', 'Arabic', 'Kurdish', 'German'] },
  'GR': { primary: 'Greek', allowed: ['English', 'Albanian', 'Turkish'] },
  'SE': { primary: 'Swedish', allowed: ['English', 'Arabic', 'Finnish', 'Persian'] },
  'NO': { primary: 'Norwegian', allowed: ['English', 'Polish', 'Urdu', 'Somali'] },
  'DK': { primary: 'Danish', allowed: ['English', 'German', 'Turkish', 'Arabic'] },
  'FI': { primary: 'Finnish', allowed: ['English', 'Swedish', 'Russian', 'Estonian'] },
  'UA': { primary: 'Ukrainian', allowed: ['Russian', 'English', 'Polish'] },
  'MX': { primary: 'Spanish', allowed: ['English', 'Nahuatl'] },
  'BR': { primary: 'Portuguese', allowed: ['English', 'Spanish', 'German', 'Italian'] },
  'AR': { primary: 'Spanish', allowed: ['English', 'Italian', 'German'] },
  'CL': { primary: 'Spanish', allowed: ['English', 'Mapuche'] },
  'CO': { primary: 'Spanish', allowed: ['English', 'Portuguese'] },
  'PE': { primary: 'Spanish', allowed: ['English', 'Quechua', 'Aymara'] },
  'VE': { primary: 'Spanish', allowed: ['English', 'Portuguese'] },
  'ZA': { primary: 'English', allowed: ['Afrikaans', 'Zulu', 'Xhosa', 'Sesotho', 'Swahili'] },
  'NG': { primary: 'English', allowed: ['Hausa', 'Yoruba', 'Igbo', 'Pidgin'] },
  'KE': { primary: 'Swahili', allowed: ['English', 'Kikuyu', 'Luhya'] },
  'GH': { primary: 'English', allowed: ['Akan', 'Ewe', 'Ga'] },
  'ET': { primary: 'Amharic', allowed: ['English', 'Oromo', 'Tigrinya'] },
  'IL': { primary: 'Hebrew', allowed: ['English', 'Arabic', 'Russian', 'Yiddish'] },
  'IR': { primary: 'Persian', allowed: ['English', 'Arabic', 'Kurdish', 'Azerbaijani'] },
};

interface SelectLanguagesSubmenuProps {
  userTier: string;
  onLearnClick?: () => void;
}

export function SelectLanguagesSubmenu({ userTier, onLearnClick }: SelectLanguagesSubmenuProps) {
  const { getFilterClasses } = useContext(FilterContext);
  const [view, setView] = useState<'main' | 'primary' | 'secondary'>('main');
  const [searchTerm, setSearchTerm] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  // Initialize from localStorage or use defaults
  const [primaryLanguage, setPrimaryLanguage] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('acesai_primary_language');
      if (saved) return saved;
    } catch (error) {
      console.error('Failed to load primary language from localStorage:', error);
    }
    return '';
  });

  const [allowedLanguages, setAllowedLanguages] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('acesai_allowed_languages');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed;
      }
    } catch (error) {
      console.error('Failed to load allowed languages from localStorage:', error);
    }
    return [];
  });

  // Auto-detect on first load (when localStorage is empty)
  useEffect(() => {
    const hasExistingPrimary = localStorage.getItem('acesai_primary_language');
    const hasExistingAllowed = localStorage.getItem('acesai_allowed_languages');

    if (!hasExistingPrimary && !hasExistingAllowed) {
      try {
        const userLocale = navigator.language || 'en-US';
        const countryCode = userLocale.split('-')[1]?.toUpperCase();

        if (countryCode && COUNTRY_LANGUAGE_MAP[countryCode]) {
          const languageConfig = COUNTRY_LANGUAGE_MAP[countryCode];
          setPrimaryLanguage(languageConfig.primary);

          if (userTier !== 'Basic') {
            setAllowedLanguages(languageConfig.allowed);
          }

          toast.success(`Auto-detected ${languageConfig.primary} as your primary language`);
        } else {
          setPrimaryLanguage('English');
          if (userTier !== 'Basic') {
            setAllowedLanguages(['Spanish', 'French', 'German', 'Chinese (Simplified)']);
          }
        }
      } catch (error) {
        console.error('Failed to auto-detect language:', error);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('acesai_primary_language', primaryLanguage);
      
      // Update completion flags
      const rawFlags = localStorage.getItem('acesai_setup_completion_flags');
      const flags = rawFlags ? JSON.parse(rawFlags) : {};
      flags['Primary Language'] = !!primaryLanguage;
      localStorage.setItem('acesai_setup_completion_flags', JSON.stringify(flags));

      // Dispatch event to trigger filter UI update
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('acesai-local-storage-changed', {
          detail: { key: 'acesai_primary_language', value: primaryLanguage }
        }));
      }
    } catch (error) {
      console.error('Failed to save primary language to localStorage:', error);
    }
  }, [primaryLanguage]);

  useEffect(() => {
    try {
      localStorage.setItem('acesai_allowed_languages', JSON.stringify(allowedLanguages));
      
      // Update completion flags
      const rawFlags = localStorage.getItem('acesai_setup_completion_flags');
      const flags = rawFlags ? JSON.parse(rawFlags) : {};
      flags['Secondary Languages'] = allowedLanguages.length > 0;
      localStorage.setItem('acesai_setup_completion_flags', JSON.stringify(flags));

      // Dispatch event to trigger filter UI update
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('acesai-local-storage-changed', {
          detail: { key: 'acesai_allowed_languages', value: JSON.stringify(allowedLanguages) }
        }));
      }
    } catch (error) {
      console.error('Failed to save allowed languages to localStorage:', error);
    }
  }, [allowedLanguages]);

  const isBasicTier = userTier === 'Basic';

  const filteredLanguages = useMemo(() => {
    return ALL_LANGUAGES.filter(lang =>
      lang.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleTogglePrimary = (lang: string) => {
    if (lang === primaryLanguage) {
      setPrimaryLanguage('');
      toast.info("Primary language cleared.");
      return;
    }
    setPrimaryLanguage(lang);
    setAllowedLanguages(prev => prev.filter(l => l !== lang));
    toast.success(`${lang} is now your Primary Language.`);
    setView('main');
  };

  const handleToggleSecondary = (lang: string) => {
    if (lang === primaryLanguage) {
      toast.error(`${lang} is already your Primary Language.`);
      return;
    }
    setAllowedLanguages(prev => {
      if (prev.includes(lang)) {
        return prev.filter(l => l !== lang);
      } else {
        return [...prev, lang];
      }
    });
  };

  const handleSelectAll = () => {
    if (isBasicTier) return;

    const languagesToAdd = filteredLanguages.filter(l => l !== primaryLanguage && !allowedLanguages.includes(l));

    if (languagesToAdd.length === 0) {
      return;
    }

    setAllowedLanguages([...allowedLanguages, ...languagesToAdd]);
    toast.success(`Added ${languagesToAdd.length} languages to secondary list.`);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800">
      {/* Top Banner — only shown on main view */}
      {view === 'main' && (
        <div className="relative bg-white dark:bg-gray-800">
          <div className="px-6 py-4 border-b border-transparent"><span className="font-medium opacity-0">Spacer</span></div>
          <div className="px-6 py-4 border-b border-transparent"><span className="font-medium opacity-0">Spacer</span></div>
          <div className="px-6 py-4 border-b border-transparent"><span className="font-medium opacity-0">Spacer</span></div>
          <div className="px-6 py-4 border-b border-transparent"><span className="font-medium opacity-0">Spacer</span></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="w-[68px] h-[68px] rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mb-4 shadow-xl">
              <Language80327 className="w-[34px] h-[34px] text-white drop-shadow-lg" />
            </div>
            <span className="font-medium text-gray-900 dark:text-gray-100 mb-2 drop-shadow-md">Select Languages</span>
            <p className="text-sm text-gray-900 dark:text-gray-100 text-center max-w-xl drop-shadow-md">
              Choose languages your AI can communicate in such as English, Arabic, Hindi and more. Input the default language and set secondary languages.
            </p>
          </div>
          {onLearnClick && (
            <button
              onClick={onLearnClick}
              title="Learn how to use Aces AI"
              className="absolute top-6 right-6 flex items-center space-x-2 text-gray-500 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors cursor-pointer pointer-events-auto"
            >
              <div className="w-5 h-5"><Vector /></div>
              <span className="font-medium">Learn</span>
            </button>
          )}
        </div>
      )}

      {view === 'main' && (
        /* Two side-by-side cards — glassmorphism style, medium height, icon+title+value+desc stacked, chevron centered right */
        <div className="flex flex-row gap-3 px-4 pb-4 pt-3">

          {/* Primary Language */}
          <div
            onClick={() => setView('primary')}
            className={`flex-1 flex items-center justify-between px-5 py-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg group ${getFilterClasses('Primary Language')}`}
          >
            <div className="flex flex-col gap-1.5">
              <div className="w-9 h-9 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center mb-0.5 group-hover:scale-105 transition-transform">
                <Star className="w-[18px] h-[18px] text-green-600 dark:text-green-400 fill-green-600 dark:fill-green-400" />
              </div>
              <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 leading-tight">Primary Language</span>
              <span className={`text-xs leading-tight font-medium ${primaryLanguage ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500 italic'}`}>
                {primaryLanguage || 'Unselected'}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500 leading-tight">AI initiates in this language</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-900 dark:text-gray-100 shrink-0 ml-3 group-hover:text-green-500 transition-colors" />
          </div>

          {/* Secondary Languages */}
          <div
            onClick={() => {
              if (isBasicTier) { toast.error("Upgrade to Pro or higher to add secondary languages."); return; }
              setView('secondary');
            }}
            className={`flex-1 flex items-center justify-between px-5 py-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg group ${isBasicTier ? 'opacity-60 grayscale' : ''} ${getFilterClasses('Secondary Languages')}`}
          >
            <div className="flex flex-col gap-1.5">
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-0.5 group-hover:scale-105 transition-transform">
                <div className="w-[18px] h-[18px]">
                  <SecondaryLanguageIcon />
                </div>
              </div>
              <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 leading-tight">Secondary Languages</span>
              {allowedLanguages.length > 0 ? (
                <span className="text-xs leading-tight font-medium text-blue-600 dark:text-blue-400 truncate max-w-[120px]">
                  {allowedLanguages.length >= ALL_LANGUAGES.length - 1
                    ? "All Languages Selected"
                    : `${allowedLanguages.slice(0, 2).join(', ')}${allowedLanguages.length > 2 ? ` +${allowedLanguages.length - 2}` : ''}`}
                </span>
              ) : (
                <span className="text-xs text-gray-400 dark:text-gray-500 italic leading-tight">Unselected</span>
              )}
              <span className="text-xs text-gray-400 dark:text-gray-500 leading-tight">AI switches if user speaks them</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-900 dark:text-gray-100 shrink-0 ml-3 group-hover:text-blue-500 transition-colors" />
          </div>

        </div>
      )}

      {/* Language Selection View — flows naturally, no h-full takeover */}
      {view !== 'main' && (
        <div className="w-full">
          {/* Header row */}
          <div
            onClick={() => { setView('main'); setSearchTerm(''); }}
            style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
            className="flex items-center justify-between px-6 mx-4 mt-3 mb-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg group"
          >
            <div className="flex items-center flex-1">
              <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-2 group-hover:-translate-x-0.5 transition-transform" />
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Select {view === 'primary' ? 'Primary' : 'Secondary'} Language{view === 'secondary' ? 's' : ''}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {view === 'secondary' && !isBasicTier && allowedLanguages.length > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded-md">{allowedLanguages.length} selected</span>
              )}
              {view === 'secondary' && !isBasicTier && (
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectAll();
                    }}
                    className="text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer px-2.5 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    Select All
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setAllowedLanguages([]);
                      toast.info("Cleared secondary languages.");
                    }}
                    className="text-xs font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer px-2.5 py-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search languages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
              />
            </div>
          </div>

          {/* Language rows — capped height so page doesn't overflow; scrolls internally */}
          <div className="bg-gray-50/50 dark:bg-gray-900/30 relative border-t border-gray-100 dark:border-gray-800 shadow-inner">
            {/* Gradient Masks for "Rolling" Feel */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-gray-50/50 dark:from-gray-900/30 to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-gray-50/50 dark:from-gray-900/30 to-transparent z-10 pointer-events-none" />

            <div ref={menuRef} className="overflow-y-auto space-y-1 scroll-smooth px-4 py-4" style={{ maxHeight: 'calc(100vh - 380px)' }}>
              {filteredLanguages.map((lang) => {
                const isPrimary = lang === primaryLanguage;
                const isSecondary = allowedLanguages.includes(lang);

                if (view === 'primary') {
                  return (
                    <div
                      key={lang}
                      onClick={() => handleTogglePrimary(lang)}
                      className={`group flex items-center justify-between px-4 py-2 rounded-lg border transition-all duration-200 cursor-pointer select-none ${isPrimary
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 shadow-sm scale-[1.005]'
                        : 'bg-white dark:bg-gray-800 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-[1.005]'
                        }`}
                    >
                      <span className={`text-sm font-medium ${isPrimary ? 'text-green-800 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'}`}>
                        {lang}
                      </span>
                      <div className="flex items-center gap-3">
                        {isSecondary && <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">Secondary</span>}
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all hover:scale-110 ${isPrimary
                            ? 'bg-green-500 shadow-md cursor-default ring-2 ring-green-100 dark:ring-green-900'
                            : 'bg-gray-100 dark:bg-gray-700 hover:bg-green-200 dark:hover:bg-green-900/50 cursor-pointer text-transparent hover:text-green-600'
                            }`}
                        >
                          <Check className={`w-3.5 h-3.5 ${isPrimary ? 'text-white' : ''}`} strokeWidth={3} />
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={lang}
                      onClick={() => handleToggleSecondary(lang)}
                      className={`group flex items-center justify-between px-4 py-2 rounded-lg border transition-all duration-200 select-none ${isPrimary
                        ? 'opacity-50 cursor-not-allowed bg-white dark:bg-gray-800 border-transparent'
                        : isSecondary
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-sm scale-[1.005]'
                          : 'bg-white dark:bg-gray-800 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-[1.005] cursor-pointer'
                        }`}
                    >
                      <span className={`text-sm font-medium ${isSecondary ? 'text-blue-800 dark:text-blue-300' : isPrimary ? 'text-gray-500 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                        {lang}
                      </span>
                      <div className="flex items-center gap-3">
                        {isPrimary && <span className="text-[10px] uppercase tracking-wider font-semibold text-green-500 dark:text-green-400">Primary</span>}
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${isSecondary
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-gray-300 dark:border-gray-600'
                            }`}
                        >
                          {isSecondary && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
              {filteredLanguages.length === 0 && (
                <div className="text-center py-10 text-gray-400 dark:text-gray-500 text-sm">
                  No languages found matching "{searchTerm}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}