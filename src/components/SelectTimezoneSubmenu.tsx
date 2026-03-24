import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronsUpDown, ChevronDown, Check, MapPin, ThumbsUp, MessageCircleQuestion, Package, Navigation, MapPinned, PenTool, Search, Ban, Plus, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { toast } from "sonner";
import { COUNTRIES_LIST } from '../data/appConstants';

export type LocationResponseMode = 'acknowledge' | 'ask' | 'alternatives' | 'inform' | 'suggest-location' | 'custom';

export interface TimezoneEntry {
  offset: number;
  value: string;
  city: string;
  country: string;
  abbr: string;
  aliases: string;
}

export interface CountryCodeEntry {
  code: string;
  country: string;
  aliases: string;
}

export interface StoreLocation {
  id: string;
  title: string;
  country: string;
}

export interface SelectTimezoneSubmenuProps {
  // Data arrays
  timezones: TimezoneEntry[];
  countryCodes: CountryCodeEntry[];

  // Temp state (managed in App.tsx for unsaved changes dialog flow)
  tempTimezone: string;
  setTempTimezone: React.Dispatch<React.SetStateAction<string>>;
  tempPreferredCountryCode: string;
  setTempPreferredCountryCode: React.Dispatch<React.SetStateAction<string>>;
  tempCallerLocationDetection: boolean;
  setTempCallerLocationDetection: React.Dispatch<React.SetStateAction<boolean>>;
  tempLocationResponseMode: LocationResponseMode;
  setTempLocationResponseMode: React.Dispatch<React.SetStateAction<LocationResponseMode>>;
  tempLocationCustomMessage: string;
  setTempLocationCustomMessage: React.Dispatch<React.SetStateAction<string>>;
  tempOtherStoreLocations: StoreLocation[];
  setTempOtherStoreLocations: React.Dispatch<React.SetStateAction<StoreLocation[]>>;

  // Validation errors (managed in App.tsx for handleSaveChanges/discardChanges)
  locationValidationErrors: Set<string>;
  setLocationValidationErrors: React.Dispatch<React.SetStateAction<Set<string>>>;

  // Navigation / unsaved changes
  hasUnsavedChanges: (submenu: string) => boolean;
  setActiveSubmenu: (submenu: string | null) => void;
  setPendingNavigation: React.Dispatch<React.SetStateAction<string | null>>;
  setUnsavedSubmenu: React.Dispatch<React.SetStateAction<string | null>>;
  setShowUnsavedChangesDialog: React.Dispatch<React.SetStateAction<boolean>>;

  // Committed state setters (for save button)
  setTimezone: React.Dispatch<React.SetStateAction<string>>;
  setPreferredCountryCode: React.Dispatch<React.SetStateAction<string>>;
  setCallerLocationDetection: React.Dispatch<React.SetStateAction<boolean>>;
  setLocationResponseMode: React.Dispatch<React.SetStateAction<LocationResponseMode>>;
  setLocationCustomMessage: React.Dispatch<React.SetStateAction<string>>;
  setOtherStoreLocations: React.Dispatch<React.SetStateAction<StoreLocation[]>>;
}

export function SelectTimezoneSubmenu(props: SelectTimezoneSubmenuProps) {
  const {
    timezones, countryCodes,
    tempTimezone, setTempTimezone,
    tempPreferredCountryCode, setTempPreferredCountryCode,
    tempCallerLocationDetection, setTempCallerLocationDetection,
    tempLocationResponseMode, setTempLocationResponseMode,
    tempLocationCustomMessage, setTempLocationCustomMessage,
    tempOtherStoreLocations, setTempOtherStoreLocations,
    locationValidationErrors, setLocationValidationErrors,
    hasUnsavedChanges, setActiveSubmenu,
    setPendingNavigation, setUnsavedSubmenu, setShowUnsavedChangesDialog,
    setTimezone, setPreferredCountryCode, setCallerLocationDetection,
    setLocationResponseMode, setLocationCustomMessage, setOtherStoreLocations,
  } = props;

  // Local UI state
  const [timezoneSearchOpen, setTimezoneSearchOpen] = useState(false);
  const [timezoneSearchValue, setTimezoneSearchValue] = useState('');
  const [countryCodeSearchOpen, setCountryCodeSearchOpen] = useState(false);
  const [countryCodeSearchValue, setCountryCodeSearchValue] = useState('');
  const [locationResponseDropdownOpen, setLocationResponseDropdownOpen] = useState(false);
  const [locationResponseDropdownPosition, setLocationResponseDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const locationResponseButtonRef = useRef<HTMLButtonElement>(null);
  const locationResponseDropdownRef = useRef<HTMLDivElement>(null);
  const [countryDropdownStates, setCountryDropdownStates] = useState<Record<string, {
    isOpen: boolean;
    searchQuery: string;
    position: { top: number; left: number; width: number } | null;
  }>>({});
  const countryDropdownRefs = React.useRef<Record<string, {
    buttonRef: HTMLButtonElement | null;
    menuRef: HTMLDivElement | null;
  }>>({});

  // Live timezone clock
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Helper function to calculate time in a timezone
  const getTimeForTimezone = (offset: number, timezoneId?: string): string => {
    try {
      if (timezoneId) {
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: timezoneId,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
        return formatter.format(currentTime);
      }
    } catch (e) {
      // Fallback to offset calculation if timezone identifier is invalid
    }
    const now = new Date(currentTime);
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const tzTime = new Date(utc + (3600000 * offset));
    const hours = tzTime.getHours().toString().padStart(2, '0');
    const minutes = tzTime.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Calculate and update dropdown position smoothly on scroll
  useEffect(() => {
    if (!locationResponseDropdownOpen || !locationResponseButtonRef.current || !locationResponseDropdownRef.current) return;

    let rafId: number;

    const updatePosition = () => {
      if (locationResponseButtonRef.current && locationResponseDropdownRef.current) {
        const buttonRect = locationResponseButtonRef.current.getBoundingClientRect();
        const dropdown = locationResponseDropdownRef.current;
        dropdown.style.top = `${buttonRect.bottom + 8}px`;
        dropdown.style.left = `${buttonRect.left}px`;
        dropdown.style.width = `${buttonRect.width}px`;
      }
    };

    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updatePosition);
    };

    updatePosition();
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [locationResponseDropdownOpen]);

  // Click-outside handler for location response dropdown
  useEffect(() => {
    if (!locationResponseDropdownOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        locationResponseButtonRef.current &&
        !locationResponseButtonRef.current.contains(target) &&
        !(target as Element).closest('.location-response-dropdown')
      ) {
        setLocationResponseDropdownOpen(false);
      }
    };

    setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [locationResponseDropdownOpen]);

  // Country dropdown click-outside detection and scroll
  useEffect(() => {
    const openDropdownIds = Object.keys(countryDropdownStates).filter(id => countryDropdownStates[id]?.isOpen);
    if (openDropdownIds.length === 0) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      openDropdownIds.forEach(id => {
        const refs = countryDropdownRefs.current[id];
        if (refs?.buttonRef && refs?.menuRef) {
          if (!refs.buttonRef.contains(target) && !refs.menuRef.contains(target)) {
            setCountryDropdownStates(prev => ({
              ...prev,
              [id]: { ...prev[id], isOpen: false, searchQuery: '' }
            }));
          }
        }
      });
    };

    const updateDropdownPositions = () => {
      openDropdownIds.forEach(id => {
        const refs = countryDropdownRefs.current[id];
        if (refs?.buttonRef && countryDropdownStates[id]?.isOpen) {
          const rect = refs.buttonRef.getBoundingClientRect();
          setCountryDropdownStates(prev => ({
            ...prev,
            [id]: {
              ...prev[id],
              position: {
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width
              }
            }
          }));
        }
      });
    };

    setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    window.addEventListener('scroll', updateDropdownPositions, true);
    window.addEventListener('resize', updateDropdownPositions);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', updateDropdownPositions, true);
      window.removeEventListener('resize', updateDropdownPositions);
    };
  }, [countryDropdownStates]);

  const handleBackClick = () => {
    // Only validate if location detection is enabled
    if (tempCallerLocationDetection) {
      // Validation: if custom mode is selected, ensure custom message is not empty
      if (tempLocationResponseMode === 'custom' && tempLocationCustomMessage.trim() === '') {
        const errors = new Set<string>();
        errors.add('custom-message');
        setLocationValidationErrors(errors);
        toast.error('Please enter a custom message or choose another option before exiting');
        return;
      }

      // Validation: if suggest-location is selected, ensure at least one location is filled
      if (tempLocationResponseMode === 'suggest-location') {
        const errors = new Set<string>();
        let hasAtLeastOneValid = false;

        tempOtherStoreLocations.forEach((loc) => {
          const titleEmpty = loc.title.trim() === '';
          const countryEmpty = loc.country.trim() === '';

          if (titleEmpty) {
            errors.add(`${loc.id}-title`);
          }
          if (countryEmpty) {
            errors.add(`${loc.id}-country`);
          }

          if (!titleEmpty && !countryEmpty) {
            hasAtLeastOneValid = true;
          }
        });

        if (errors.size > 0 || !hasAtLeastOneValid) {
          setLocationValidationErrors(errors);
          toast.error('Please fill in all location fields or choose another option before exiting');
          return;
        }
      }
    }

    // Check for unsaved changes
    if (hasUnsavedChanges('select-timezone')) {
      setPendingNavigation(null);
      setUnsavedSubmenu('select-timezone');
      setShowUnsavedChangesDialog(true);
    } else {
      setLocationValidationErrors(new Set());
      setActiveSubmenu(null);
    }
  };

  const handleSave = () => {
    // Only validate if location detection is enabled
    if (tempCallerLocationDetection) {
      // Validation: if suggest-location is selected, ensure at least one location is filled
      if (tempLocationResponseMode === 'suggest-location') {
        const errors = new Set<string>();
        let hasAtLeastOneValid = false;

        tempOtherStoreLocations.forEach((loc) => {
          const titleEmpty = loc.title.trim() === '';
          const countryEmpty = loc.country.trim() === '';

          if (titleEmpty) {
            errors.add(`${loc.id}-title`);
          }
          if (countryEmpty) {
            errors.add(`${loc.id}-country`);
          }

          if (!titleEmpty && !countryEmpty) {
            hasAtLeastOneValid = true;
          }
        });

        if (errors.size > 0 || !hasAtLeastOneValid) {
          setLocationValidationErrors(errors);
          toast.error('Please fill in all location fields or choose another option');
          return;
        }
      }

      // Validation: if custom mode is selected, ensure custom message is not empty
      if (tempLocationResponseMode === 'custom') {
        if (tempLocationCustomMessage.trim() === '') {
          const errors = new Set<string>();
          errors.add('custom-message');
          setLocationValidationErrors(errors);
          toast.error('Please enter a custom message or choose another option');
          return;
        }
      }
    }

    // Clear any validation errors
    setLocationValidationErrors(new Set());

    setTimezone(tempTimezone);
    setPreferredCountryCode(tempPreferredCountryCode);
    setCallerLocationDetection(tempCallerLocationDetection ?? false);
    setLocationResponseMode(tempLocationResponseMode);
    setLocationCustomMessage(tempLocationCustomMessage);
    setOtherStoreLocations(tempOtherStoreLocations);
    setActiveSubmenu(null);

    // Set completion flag for filter system
    localStorage.setItem('acesai_setup_timezone_saved', 'true');

    // Also set in completion flags
    try {
      const rawFlags = localStorage.getItem('acesai_setup_completion_flags');
      const flags = rawFlags ? JSON.parse(rawFlags) : {};
      flags['Select Timezone & Location'] = true;
      localStorage.setItem('acesai_setup_completion_flags', JSON.stringify(flags));
    } catch {
      // ignore storage errors
    }

    // Dispatch event to trigger filter UI update
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('acesai-local-storage-changed', {
        detail: { key: 'acesai_setup_timezone_saved', value: 'true' }
      }));
    }

    toast.success('Timezone and location settings updated successfully');
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 overflow-visible">
      {/* Header with Back Button */}
      <div
        onClick={handleBackClick}
        style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
        className="flex items-center px-6 mx-4 mt-3 mb-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg"
      >
        <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-2" />
        <span className="font-medium text-gray-900 dark:text-gray-100">Select Timezone & Location</span>
      </div>

      <div className="px-6 pt-4 pb-6 space-y-6 overflow-visible">
        <div className="space-y-2">
          <Label htmlFor="timezone" className="text-gray-900 dark:text-gray-100">Business Timezone</Label>
          <Popover open={timezoneSearchOpen} onOpenChange={setTimezoneSearchOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={timezoneSearchOpen}
                className="w-full justify-between bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
              >
                {tempTimezone
                  ? (() => {
                    const selectedTz = timezones.find((tz) => tz.value === tempTimezone);
                    return selectedTz
                      ? `${getTimeForTimezone(selectedTz.offset, selectedTz.value)} ${selectedTz.city}${selectedTz.abbr ? ` (${selectedTz.abbr})` : ''}`
                      : "Select timezone";
                  })()
                  : "Select timezone"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start" style={{ width: 'var(--radix-popover-trigger-width)' }}>
              <div className="bg-white dark:bg-gray-800">
                <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                  <input
                    type="text"
                    placeholder="Search city or country..."
                    value={timezoneSearchValue}
                    onChange={(e) => setTimezoneSearchValue(e.target.value)}
                    className="w-full px-3 py-2 bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none"
                  />
                </div>
                <div className="max-h-[280px] overflow-y-auto">
                  {timezones
                    .filter((tz) => {
                      const searchTerm = timezoneSearchValue.toLowerCase();
                      return (
                        tz.city.toLowerCase().includes(searchTerm) ||
                        tz.country.toLowerCase().includes(searchTerm) ||
                        tz.abbr.toLowerCase().includes(searchTerm) ||
                        tz.aliases.toLowerCase().includes(searchTerm)
                      );
                    })
                    .map((tz, index) => (
                      <button
                        key={`${tz.value}-${index}`}
                        onClick={() => {
                          setTempTimezone(tz.value);
                          setTimezoneSearchOpen(false);
                          setTimezoneSearchValue('');
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${tempTimezone === tz.value
                          ? 'bg-blue-50 dark:bg-blue-950/20'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                          }`}
                      >
                        {tempTimezone === tz.value ? (
                          <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-5 h-5 text-blue-600 dark:text-blue-500 flex-shrink-0"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 flex-shrink-0" />
                        )}
                        <div className="flex flex-col items-start flex-1 min-w-0">
                          <span className={`text-sm truncate ${tempTimezone === tz.value
                            ? 'text-gray-900 dark:text-gray-100'
                            : 'text-gray-900 dark:text-gray-100'
                            }`}>
                            {tz.city}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {getTimeForTimezone(tz.offset, tz.value)} • {tz.country}{tz.abbr && ` • ${tz.abbr}`}
                          </span>
                        </div>
                      </button>
                    ))}
                  {timezones.filter((tz) => {
                    const searchTerm = timezoneSearchValue.toLowerCase();
                    return (
                      tz.city.toLowerCase().includes(searchTerm) ||
                      tz.country.toLowerCase().includes(searchTerm) ||
                      tz.abbr.toLowerCase().includes(searchTerm) ||
                      tz.aliases.toLowerCase().includes(searchTerm)
                    );
                  }).length === 0 && (
                      <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                        No timezone found.
                      </div>
                    )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Set your business location's timezone
          </p>
        </div>

        {/* Preferred Country Code Section */}
        <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Label htmlFor="countryCode" className="text-gray-900 dark:text-gray-100">Preferred Customer Country Code</Label>
          <Popover open={countryCodeSearchOpen} onOpenChange={setCountryCodeSearchOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={countryCodeSearchOpen}
                className="w-full justify-between bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
              >
                {tempPreferredCountryCode
                  ? (() => {
                    const selected = countryCodes.find((cc) => cc.code === tempPreferredCountryCode);
                    return selected ? `${selected.code} - ${selected.country}` : "Select country code";
                  })()
                  : "Select country code"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start" style={{ width: 'var(--radix-popover-trigger-width)' }}>
              <div className="bg-white dark:bg-gray-800">
                <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                  <input
                    type="text"
                    placeholder="Search country or code..."
                    value={countryCodeSearchValue}
                    onChange={(e) => setCountryCodeSearchValue(e.target.value)}
                    className="w-full px-3 py-2 bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none"
                  />
                </div>
                <div className="max-h-[170px] overflow-y-auto">
                  {countryCodes
                    .filter((cc) => {
                      const searchTerm = countryCodeSearchValue.toLowerCase();
                      return (
                        cc.country.toLowerCase().includes(searchTerm) ||
                        cc.code.includes(searchTerm) ||
                        cc.aliases.toLowerCase().includes(searchTerm)
                      );
                    })
                    .map((cc, index) => (
                      <button
                        key={`${cc.code}-${cc.country}-${index}`}
                        onClick={() => {
                          setTempPreferredCountryCode(cc.code);
                          setCountryCodeSearchOpen(false);
                          setCountryCodeSearchValue('');
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${tempPreferredCountryCode === cc.code
                          ? 'bg-blue-50 dark:bg-blue-950/20'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                          }`}
                      >
                        {tempPreferredCountryCode === cc.code ? (
                          <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-5 h-5 text-blue-600 dark:text-blue-500 flex-shrink-0"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 flex-shrink-0" />
                        )}
                        <div className="flex flex-col items-start flex-1 min-w-0">
                          <span className={`text-sm truncate ${tempPreferredCountryCode === cc.code
                            ? 'text-gray-900 dark:text-gray-100'
                            : 'text-gray-900 dark:text-gray-100'
                            }`}>
                            {cc.country}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {cc.code}
                          </span>
                        </div>
                      </button>
                    ))}
                  {countryCodes.filter((cc) => {
                    const searchTerm = countryCodeSearchValue.toLowerCase();
                    return (
                      cc.country.toLowerCase().includes(searchTerm) ||
                      cc.code.includes(searchTerm) ||
                      cc.aliases.toLowerCase().includes(searchTerm)
                    );
                  }).length === 0 && (
                      <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                        No country code found.
                      </div>
                    )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Select your preferred country code to enable location awareness features
          </p>
        </div>

        {/* Customer Location Detection Section - Only show if country code is entered */}
        {tempPreferredCountryCode && tempPreferredCountryCode.trim() !== '' && (
          <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700 overflow-visible">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Label className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Customer Location Awareness
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  AI detects when customers are from outside your country
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium ${tempCallerLocationDetection ? 'text-blue-600 dark:text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}>
                  {tempCallerLocationDetection ? 'Activated' : 'Do nothing'}
                </span>
                <Switch
                  checked={tempCallerLocationDetection ?? false}
                  onCheckedChange={setTempCallerLocationDetection}
                />
              </div>
            </div>

            {/* Response Options - Only show when enabled */}
            {tempCallerLocationDetection && (
              <div className="space-y-3 mt-4 pl-4 border-l-2 border-blue-200 dark:border-blue-800 overflow-visible">
                <Label className="text-gray-900 dark:text-gray-100 text-sm">AI Response Behavior</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Choose how the AI should respond to out-of-country customers
                </p>

                {/* Dropdown Container with Relative Positioning */}
                <div className="relative overflow-visible">
                  {/* Dropdown Trigger */}
                  <button
                    ref={locationResponseButtonRef}
                    onClick={() => setLocationResponseDropdownOpen(!locationResponseDropdownOpen)}
                    className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all flex items-center justify-between gap-2"
                  >
                    {/* Icon */}
                    {tempLocationResponseMode === 'acknowledge' && <ThumbsUp className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />}
                    {tempLocationResponseMode === 'ask' && <MessageCircleQuestion className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />}
                    {tempLocationResponseMode === 'alternatives' && <Package className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />}
                    {tempLocationResponseMode === 'inform' && <Navigation className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />}
                    {tempLocationResponseMode === 'suggest-location' && <MapPinned className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />}
                    {tempLocationResponseMode === 'custom' && <PenTool className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />}

                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {tempLocationResponseMode === 'acknowledge' && 'Friendly Acknowledgment'}
                        {tempLocationResponseMode === 'ask' && 'Ask About Status'}
                        {tempLocationResponseMode === 'alternatives' && 'Offer Alternatives'}
                        {tempLocationResponseMode === 'inform' && 'Inform About Distance'}
                        {tempLocationResponseMode === 'suggest-location' && 'Suggest Other Store Locations'}
                        {tempLocationResponseMode === 'custom' && 'Custom Message'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {tempLocationResponseMode === 'acknowledge' && 'AI notices the location difference and adjusts tone warmly'}
                        {tempLocationResponseMode === 'ask' && 'AI politely asks if they\'re visiting, relocated, or planning a visit'}
                        {tempLocationResponseMode === 'alternatives' && 'AI suggests remote options like online booking, shipping, or virtual services'}
                        {tempLocationResponseMode === 'inform' && 'AI mentions physical location limitations and helps accordingly'}
                        {tempLocationResponseMode === 'suggest-location' && 'AI suggests other store locations that may be closer to the customer'}
                        {tempLocationResponseMode === 'custom' && 'Use your own custom message for out-of-region customers'}
                      </p>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ml-2 flex-shrink-0 ${locationResponseDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Options - Portal Rendered Above Everything */}
                  {locationResponseDropdownOpen && createPortal(
                    <div
                      ref={locationResponseDropdownRef}
                      className="location-response-dropdown fixed space-y-2 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg p-2 shadow-2xl z-[9999] max-h-[200px] overflow-y-auto"
                      style={{
                        top: `${locationResponseDropdownPosition.top}px`,
                        left: `${locationResponseDropdownPosition.left}px`,
                        width: `${locationResponseDropdownPosition.width}px`
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Friendly Acknowledgment */}
                      <div
                        onClick={() => {
                          setTempLocationResponseMode('acknowledge');
                          setLocationResponseDropdownOpen(false);
                          setLocationValidationErrors(new Set());
                        }}
                        className={`p-2.5 border rounded-lg cursor-pointer transition-all ${tempLocationResponseMode === 'acknowledge'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700'
                          }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <ThumbsUp className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Friendly Acknowledgment</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                              AI notices the location difference and adjusts tone warmly
                            </p>
                          </div>
                          {tempLocationResponseMode === 'acknowledge' && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                              <Check className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Ask Status */}
                      <div
                        onClick={() => {
                          setTempLocationResponseMode('ask');
                          setLocationResponseDropdownOpen(false);
                          setLocationValidationErrors(new Set());
                        }}
                        className={`p-2.5 border rounded-lg cursor-pointer transition-all ${tempLocationResponseMode === 'ask'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700'
                          }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <MessageCircleQuestion className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Ask About Status</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                              AI politely asks if they're visiting, relocated, or planning a visit
                            </p>
                          </div>
                          {tempLocationResponseMode === 'ask' && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                              <Check className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Offer Alternatives */}
                      <div
                        onClick={() => {
                          setTempLocationResponseMode('alternatives');
                          setLocationResponseDropdownOpen(false);
                          setLocationValidationErrors(new Set());
                        }}
                        className={`p-2.5 border rounded-lg cursor-pointer transition-all ${tempLocationResponseMode === 'alternatives'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700'
                          }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <Package className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Offer Alternatives</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                              AI suggests remote options like online booking, shipping, or virtual services
                            </p>
                          </div>
                          {tempLocationResponseMode === 'alternatives' && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                              <Check className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Inform Distance */}
                      <div
                        onClick={() => {
                          setTempLocationResponseMode('inform');
                          setLocationResponseDropdownOpen(false);
                          setLocationValidationErrors(new Set());
                        }}
                        className={`p-2.5 border rounded-lg cursor-pointer transition-all ${tempLocationResponseMode === 'inform'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700'
                          }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <Navigation className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Inform About Distance</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                              AI mentions physical location limitations and helps accordingly
                            </p>
                          </div>
                          {tempLocationResponseMode === 'inform' && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                              <Check className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Suggest Other Store Locations */}
                      <div
                        onClick={() => {
                          setTempLocationResponseMode('suggest-location');
                          setLocationResponseDropdownOpen(false);
                          setLocationValidationErrors(new Set());
                          if (tempOtherStoreLocations.length === 0) {
                            setTempOtherStoreLocations([{
                              id: `location-${Date.now()}`,
                              title: '',
                              country: ''
                            }]);
                          }
                        }}
                        className={`p-2.5 border rounded-lg cursor-pointer transition-all ${tempLocationResponseMode === 'suggest-location'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700'
                          }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <MapPinned className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Suggest Other Store Locations</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                              AI suggests other store locations that may be closer to the customer
                            </p>
                          </div>
                          {tempLocationResponseMode === 'suggest-location' && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                              <Check className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Custom Message */}
                      <div
                        onClick={() => {
                          setTempLocationResponseMode('custom');
                          setLocationResponseDropdownOpen(false);
                          setLocationValidationErrors(new Set());
                        }}
                        className={`p-2.5 border rounded-lg cursor-pointer transition-all ${tempLocationResponseMode === 'custom'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700'
                          }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <PenTool className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Custom Message</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                              Use your own custom message for out-of-region customers
                            </p>
                          </div>
                          {tempLocationResponseMode === 'custom' && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                              <Check className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>,
                    document.body
                  )}
                </div>

                {/* Custom Message Textarea - Show when custom mode is selected */}
                {tempLocationResponseMode === 'custom' && (
                  <div className="space-y-2 mt-4">
                    <Label className="text-gray-900 dark:text-gray-100 text-sm">Custom Message</Label>
                    <textarea
                      value={tempLocationCustomMessage}
                      onChange={(e) => {
                        setTempLocationCustomMessage(e.target.value);
                        if (locationValidationErrors.has('custom-message')) {
                          const newErrors = new Set(locationValidationErrors);
                          newErrors.delete('custom-message');
                          setLocationValidationErrors(newErrors);
                        }
                      }}
                      placeholder="Enter your custom message for customers with different country codes..."
                      className={`w-full min-h-[60px] p-3 border-2 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none resize-y transition-colors ${locationValidationErrors.has('custom-message')
                        ? 'border-red-500 dark:border-red-500 focus:border-red-600 dark:focus:border-red-600'
                        : 'border-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-600'
                        }`}
                    />
                    {locationValidationErrors.has('custom-message') && (
                      <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                        Please enter a custom message or choose another option
                      </p>
                    )}
                    {!locationValidationErrors.has('custom-message') && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        This message will be used when the AI detects a customer with a different country code
                      </p>
                    )}
                  </div>
                )}

                {/* Store Locations - Show when suggest-location mode is selected */}
                {tempLocationResponseMode === 'suggest-location' && (
                  <div className="space-y-2 mt-4">
                    <Label className="text-gray-900 dark:text-gray-100 text-sm">Your Store Locations</Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Add store locations so AI can suggest the closest one based on customer's country code
                    </p>

                    <div className="space-y-2 mt-2">
                      {tempOtherStoreLocations.map((location, index) => {
                        const titleErrorKey = `${location.id}-title`;
                        const countryErrorKey = `${location.id}-country`;
                        const hasTitleError = locationValidationErrors.has(titleErrorKey);
                        const hasCountryError = locationValidationErrors.has(countryErrorKey);

                        return (
                          <div key={location.id} className="flex items-start gap-2">
                            <div className="flex-1 space-y-1">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <Input
                                    value={location.title}
                                    onChange={(e) => {
                                      const updated = [...tempOtherStoreLocations];
                                      updated[index].title = e.target.value;
                                      setTempOtherStoreLocations(updated);
                                      if (hasTitleError) {
                                        const newErrors = new Set(locationValidationErrors);
                                        newErrors.delete(titleErrorKey);
                                        setLocationValidationErrors(newErrors);
                                      }
                                    }}
                                    placeholder="Enter location name"
                                    className={`w-full p-3 border-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none ${hasTitleError
                                      ? 'border-red-500 dark:border-red-500 focus:border-red-600 dark:focus:border-red-600'
                                      : 'border-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-600'
                                      }`}
                                  />
                                  {hasTitleError && (
                                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                      Please enter location name
                                    </p>
                                  )}
                                </div>
                                <div>
                                  {/* Country Dropdown Button */}
                                  <button
                                    ref={(el) => {
                                      if (!countryDropdownRefs.current[location.id]) {
                                        countryDropdownRefs.current[location.id] = { buttonRef: null, menuRef: null };
                                      }
                                      countryDropdownRefs.current[location.id].buttonRef = el;
                                    }}
                                    onClick={() => {
                                      const buttonRef = countryDropdownRefs.current[location.id]?.buttonRef;
                                      if (buttonRef) {
                                        const rect = buttonRef.getBoundingClientRect();
                                        setCountryDropdownStates(prev => ({
                                          ...prev,
                                          [location.id]: {
                                            isOpen: !prev[location.id]?.isOpen,
                                            searchQuery: '',
                                            position: {
                                              top: rect.bottom + window.scrollY,
                                              left: rect.left + window.scrollX,
                                              width: rect.width
                                            }
                                          }
                                        }));
                                      }
                                    }}
                                    className={`w-full h-9 px-3 border-2 rounded-lg bg-white dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all flex items-center justify-between gap-2 ${hasCountryError
                                      ? 'border-red-500 dark:border-red-500'
                                      : 'border-gray-300 dark:border-gray-600'
                                      }`}
                                  >
                                    <span className={`text-sm ${location.country ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}`}>
                                      {location.country || 'Select country'}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform ${countryDropdownStates[location.id]?.isOpen ? 'rotate-180' : ''}`} />
                                  </button>
                                  {hasCountryError && (
                                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                      Please select country
                                    </p>
                                  )}

                                  {/* Country Dropdown Portal */}
                                  {countryDropdownStates[location.id]?.isOpen && countryDropdownStates[location.id]?.position && createPortal(
                                    <div
                                      ref={(el) => {
                                        if (!countryDropdownRefs.current[location.id]) {
                                          countryDropdownRefs.current[location.id] = { buttonRef: null, menuRef: null };
                                        }
                                        countryDropdownRefs.current[location.id].menuRef = el;
                                      }}
                                      className="fixed bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-xl overflow-hidden"
                                      style={{
                                        top: `${countryDropdownStates[location.id].position!.top}px`,
                                        left: `${countryDropdownStates[location.id].position!.left}px`,
                                        width: `${countryDropdownStates[location.id].position!.width}px`,
                                        zIndex: 99999,
                                        maxHeight: '220px'
                                      }}
                                    >
                                      {/* Search Input */}
                                      <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                                        <div className="relative">
                                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                                          <input
                                            type="text"
                                            value={countryDropdownStates[location.id]?.searchQuery || ''}
                                            onChange={(e) => {
                                              setCountryDropdownStates(prev => ({
                                                ...prev,
                                                [location.id]: {
                                                  ...prev[location.id],
                                                  searchQuery: e.target.value
                                                }
                                              }));
                                            }}
                                            placeholder="Search countries..."
                                            className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-blue-400 dark:focus:border-blue-600"
                                            autoFocus
                                          />
                                        </div>
                                      </div>

                                      {/* Countries List */}
                                      <div className="overflow-y-auto" style={{ maxHeight: '160px' }}>
                                        {COUNTRIES_LIST
                                          .filter(country =>
                                            country.toLowerCase().includes((countryDropdownStates[location.id]?.searchQuery || '').toLowerCase())
                                          )
                                          .map(country => {
                                            const matchesPreferredCountry = tempPreferredCountryCode &&
                                              countryCodes.some(cc =>
                                                cc.code === tempPreferredCountryCode && cc.country === country
                                              );

                                            return (
                                              <button
                                                key={country}
                                                onClick={() => {
                                                  if (matchesPreferredCountry) return;

                                                  const updated = [...tempOtherStoreLocations];
                                                  updated[index].country = country;
                                                  setTempOtherStoreLocations(updated);

                                                  if (hasCountryError) {
                                                    const newErrors = new Set(locationValidationErrors);
                                                    newErrors.delete(countryErrorKey);
                                                    setLocationValidationErrors(newErrors);
                                                  }

                                                  setCountryDropdownStates(prev => ({
                                                    ...prev,
                                                    [location.id]: {
                                                      ...prev[location.id],
                                                      isOpen: false,
                                                      searchQuery: ''
                                                    }
                                                  }));
                                                }}
                                                disabled={matchesPreferredCountry}
                                                className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center justify-between ${matchesPreferredCountry
                                                  ? 'cursor-not-allowed bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-600 opacity-50'
                                                  : location.country === country
                                                    ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20'
                                                    : 'text-gray-900 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-950/20'
                                                  }`}
                                              >
                                                <span>{country}</span>
                                                {matchesPreferredCountry ? (
                                                  <Ban className="w-4 h-4 text-gray-400 dark:text-gray-600" />
                                                ) : location.country === country ? (
                                                  <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                ) : null}
                                              </button>
                                            );
                                          })}
                                        {COUNTRIES_LIST.filter(country =>
                                          country.toLowerCase().includes((countryDropdownStates[location.id]?.searchQuery || '').toLowerCase())
                                        ).length === 0 && (
                                            <div className="px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                              No countries found
                                            </div>
                                          )}
                                      </div>
                                    </div>,
                                    document.body
                                  )}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setTempOtherStoreLocations(
                                  tempOtherStoreLocations.filter((_, i) => i !== index)
                                );
                                const newErrors = new Set(locationValidationErrors);
                                newErrors.delete(titleErrorKey);
                                newErrors.delete(countryErrorKey);
                                setLocationValidationErrors(newErrors);
                              }}
                              className="flex-shrink-0 p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors mt-1"
                              title="Remove location"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => {
                        const newLocation = {
                          id: `location-${Date.now()}`,
                          title: '',
                          country: ''
                        };
                        setTempOtherStoreLocations([...tempOtherStoreLocations, newLocation]);
                      }}
                      className="flex items-center justify-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-sm mt-2 mx-auto"
                    >
                      <Plus className="w-4 h-4" />
                      Add Location
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <Button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
}
