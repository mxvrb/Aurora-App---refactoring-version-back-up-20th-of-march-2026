import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface SettingsBottomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  businessLogoUrl?: string | null;
  onLogoUpdate?: (logoUrl: string | null) => void;
  onFaviconUpdate?: (faviconUrl: string | null) => void;
  onLoadingIconUpdate?: (loadingIconUrl: string | null) => void;
  onColorSchemeUpdate?: (color: string) => void;
  onColorSchemeReset?: () => void;
}

// LocalStorage keys
const STORAGE_KEYS = {
  LOGO: "whitelabel_logo",
  FAVICON: "whitelabel_favicon",
  LOADING_ICON: "whitelabel_loading_icon",
  COLOR_SCHEME: "whitelabel_color_scheme",
};

const DEFAULT_COLOR = "#3B82F6";

export function SettingsBottomDrawer({
  isOpen,
  onClose,
  isDarkMode,
  businessLogoUrl,
  onLogoUpdate,
  onFaviconUpdate,
  onLoadingIconUpdate,
  onColorSchemeUpdate,
  onColorSchemeReset,
}: SettingsBottomDrawerProps) {
  const [primaryColor, setPrimaryColor] = useState(DEFAULT_COLOR);
  const [isSaving, setIsSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [loadingIconPreview, setLoadingIconPreview] = useState<string | null>(null);

  // Track original saved values for individual reset
  const [savedColor, setSavedColor] = useState(DEFAULT_COLOR);
  const [savedLogo, setSavedLogo] = useState<string | null>(null);
  const [savedFavicon, setSavedFavicon] = useState<string | null>(null);
  const [savedLoadingIcon, setSavedLoadingIcon] = useState<string | null>(null);

  // Reset mode state
  const [isResetMode, setIsResetMode] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const loadingIconInputRef = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  // Load settings from localStorage when drawer opens
  useEffect(() => {
    if (isOpen) {
      loadSettings();
      setIsResetMode(false);
    }
  }, [isOpen]);

  const loadSettings = () => {
    let color = DEFAULT_COLOR;
    let logo: string | null = null;
    let favicon: string | null = null;
    let loadingIcon: string | null = null;

    const existingUserData = localStorage.getItem("acesai_user_data");
    if (existingUserData) {
      try {
        const userData = JSON.parse(existingUserData);
        if (userData.whiteLabel) {
          if (userData.whiteLabel.logo) logo = userData.whiteLabel.logo;
          if (userData.whiteLabel.favicon) favicon = userData.whiteLabel.favicon;
          if (userData.whiteLabel.loadingIcon) loadingIcon = userData.whiteLabel.loadingIcon;
          if (userData.whiteLabel.colorScheme) color = userData.whiteLabel.colorScheme;
        }
      } catch (error) {
        console.error("Error loading white-label settings from user data:", error);
      }
    }

    // Fallback to individual keys
    if (!logo) logo = localStorage.getItem(STORAGE_KEYS.LOGO);
    if (!favicon) favicon = localStorage.getItem(STORAGE_KEYS.FAVICON);
    if (!loadingIcon) loadingIcon = localStorage.getItem(STORAGE_KEYS.LOADING_ICON);
    if (color === DEFAULT_COLOR) {
      const storedColor = localStorage.getItem(STORAGE_KEYS.COLOR_SCHEME);
      if (storedColor) color = storedColor;
    }

    setPrimaryColor(color);
    setLogoPreview(logo);
    setFaviconPreview(favicon);
    setLoadingIconPreview(loadingIcon);

    // Store saved values for reset
    setSavedColor(color);
    setSavedLogo(logo);
    setSavedFavicon(favicon);
    setSavedLoadingIcon(loadingIcon);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large", { description: "Logo must be less than 5MB" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        if (onLogoUpdate) onLogoUpdate(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File too large", { description: "Favicon must be less than 2MB" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFaviconPreview(result);
        updateFavicon(result);
        if (onFaviconUpdate) onFaviconUpdate(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLoadingIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File too large", { description: "Loading icon must be less than 2MB" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLoadingIconPreview(result);
        if (onLoadingIconUpdate) onLoadingIconUpdate(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (color: string) => {
    setPrimaryColor(color);
    if (onColorSchemeUpdate) onColorSchemeUpdate(color);
  };

  const updateFavicon = (faviconUrl: string) => {
    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = faviconUrl;
  };

  // Individual reset handlers
  const handleResetColor = () => {
    setPrimaryColor(DEFAULT_COLOR);
    if (onColorSchemeUpdate) onColorSchemeUpdate(DEFAULT_COLOR);
    if (onColorSchemeReset) onColorSchemeReset();
    toast.success("Color scheme reset");
  };

  const handleResetLogo = () => {
    setLogoPreview(null);
    if (onLogoUpdate) onLogoUpdate(null);
    if (logoInputRef.current) logoInputRef.current.value = "";
    toast.success("Logo reset");
  };

  const handleResetFavicon = () => {
    setFaviconPreview(null);
    if (onFaviconUpdate) onFaviconUpdate(null);
    // Reset favicon to default
    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (link) link.href = "/favicon.ico";
    if (faviconInputRef.current) faviconInputRef.current.value = "";
    toast.success("Favicon reset");
  };

  const handleResetLoadingIcon = () => {
    setLoadingIconPreview(null);
    if (onLoadingIconUpdate) onLoadingIconUpdate(null);
    if (loadingIconInputRef.current) loadingIconInputRef.current.value = "";
    toast.success("Loading icon reset");
  };

  const handleCancelReset = () => {
    // Revert all changes back to saved values
    setPrimaryColor(savedColor);
    setLogoPreview(savedLogo);
    setFaviconPreview(savedFavicon);
    setLoadingIconPreview(savedLoadingIcon);

    // Revert live previews
    if (onColorSchemeUpdate) onColorSchemeUpdate(savedColor);
    if (savedColor === DEFAULT_COLOR && onColorSchemeReset) onColorSchemeReset();
    if (onLogoUpdate) onLogoUpdate(savedLogo);
    if (onFaviconUpdate) onFaviconUpdate(savedFavicon);
    if (savedFavicon) updateFavicon(savedFavicon);
    if (onLoadingIconUpdate) onLoadingIconUpdate(savedLoadingIcon);

    setIsResetMode(false);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      if (logoPreview) localStorage.setItem(STORAGE_KEYS.LOGO, logoPreview);
      else localStorage.removeItem(STORAGE_KEYS.LOGO);

      if (faviconPreview) {
        localStorage.setItem(STORAGE_KEYS.FAVICON, faviconPreview);
        updateFavicon(faviconPreview);
      } else {
        localStorage.removeItem(STORAGE_KEYS.FAVICON);
        // Reset favicon to default Aces AI
        let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
        if (link) link.href = "/favicon.ico";
      }

      if (loadingIconPreview) localStorage.setItem(STORAGE_KEYS.LOADING_ICON, loadingIconPreview);
      else localStorage.removeItem(STORAGE_KEYS.LOADING_ICON);

      localStorage.setItem(STORAGE_KEYS.COLOR_SCHEME, primaryColor);

      // Save to acesai_user_data for persistence
      const existingUserData = localStorage.getItem("acesai_user_data");
      const userData = existingUserData ? JSON.parse(existingUserData) : {};

      userData.whiteLabel = {
        logo: logoPreview || null,
        favicon: faviconPreview || null,
        loadingIcon: loadingIconPreview || null,
        colorScheme: primaryColor || DEFAULT_COLOR,
        lastUpdated: Date.now(),
      };

      // Also clear businessLogoUrl if logo was reset
      if (!logoPreview) {
        userData.businessLogoUrl = null;
      }

      localStorage.setItem(
        "acesai_user_data",
        JSON.stringify({ ...userData, lastUpdated: Date.now() })
      );

      // Notify parent components
      if (onLogoUpdate) onLogoUpdate(logoPreview);
      if (onFaviconUpdate) onFaviconUpdate(faviconPreview);
      if (onLoadingIconUpdate) onLoadingIconUpdate(loadingIconPreview);
      if (onColorSchemeUpdate) onColorSchemeUpdate(primaryColor);
      if (!logoPreview && !faviconPreview && !loadingIconPreview && primaryColor === DEFAULT_COLOR) {
        if (onColorSchemeReset) onColorSchemeReset();
      }

      // Update saved state so reset mode comparisons work correctly
      setSavedColor(primaryColor);
      setSavedLogo(logoPreview);
      setSavedFavicon(faviconPreview);
      setSavedLoadingIcon(loadingIconPreview);

      setIsResetMode(false);
      toast.success("Settings saved successfully!");
      onClose();
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Error saving settings", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Check if anything has changed from saved state
  const hasChanges =
    primaryColor !== savedColor ||
    logoPreview !== savedLogo ||
    faviconPreview !== savedFavicon ||
    loadingIconPreview !== savedLoadingIcon;

  // Revert all unsaved changes and close
  const handleCloseWithoutSaving = () => {
    // Revert color to saved value
    if (primaryColor !== savedColor) {
      setPrimaryColor(savedColor);
      if (onColorSchemeUpdate) onColorSchemeUpdate(savedColor);
      if (savedColor === DEFAULT_COLOR && onColorSchemeReset) onColorSchemeReset();
    }
    // Revert logo
    if (logoPreview !== savedLogo) {
      setLogoPreview(savedLogo);
      if (onLogoUpdate) onLogoUpdate(savedLogo);
    }
    // Revert favicon
    if (faviconPreview !== savedFavicon) {
      setFaviconPreview(savedFavicon);
      if (onFaviconUpdate) onFaviconUpdate(savedFavicon);
      if (savedFavicon) updateFavicon(savedFavicon);
      else {
        let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
        if (link) link.href = "/favicon.ico";
      }
    }
    // Revert loading icon
    if (loadingIconPreview !== savedLoadingIcon) {
      setLoadingIconPreview(savedLoadingIcon);
      if (onLoadingIconUpdate) onLoadingIconUpdate(savedLoadingIcon);
    }
    setIsResetMode(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Invisible backdrop for click-outside-to-close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseWithoutSaving}
            className="fixed inset-0 z-40"
          />

          {/* Bottom Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
            }}
            className="fixed bottom-0 left-0 right-0 z-50 ml-20 flex justify-center"
          >
            <div className="mx-6 mb-6">
              {/* Main pill container */}
              <div className="bg-white/80 dark:bg-gray-950/85 backdrop-blur-md rounded-full px-3.5 py-2.5 lg:px-5 lg:py-3 flex items-center gap-2.5 lg:gap-3 flex-nowrap" style={{ boxShadow: '0 0 1px 1px rgba(59,130,246,0.5), 0 0 8px 2px rgba(59,130,246,0.12), 0 0 20px 4px rgba(59,130,246,0.06)' }}>

                {/* Color Scheme */}
                <div
                  onClick={() => colorInputRef.current?.click()}
                  className="flex items-center gap-2.5 lg:gap-3 px-4 py-2 lg:px-5 lg:py-2.5 rounded-full shrink-0 group relative cursor-pointer border border-blue-400/30 dark:border-blue-500/25 hover:border-blue-400/60 dark:hover:border-blue-400/50 transition-all"
                  style={{ boxShadow: '0 0 4px rgba(59,130,246,0.1), inset 0 0 4px rgba(59,130,246,0.03)' }}
                >
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2.5 lg:gap-3">
                        <div className="relative w-8 h-8 lg:w-10 lg:h-10 shrink-0">
                          <input
                            ref={colorInputRef}
                            type="color"
                            value={primaryColor}
                            onInput={(e) => handleColorChange((e.target as HTMLInputElement).value)}
                            onChange={(e) => handleColorChange(e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div
                            className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-gray-200 dark:border-gray-600 pointer-events-none shadow-sm transition-colors duration-75"
                            style={{ backgroundColor: primaryColor }}
                          />
                        </div>
                        <span className="text-sm lg:text-base text-blue-600 dark:text-blue-400 whitespace-nowrap">
                          Color Scheme
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Applies to background only</p>
                    </TooltipContent>
                  </Tooltip>
                  {isResetMode && (primaryColor !== DEFAULT_COLOR) && (
                    <button
                      onClick={handleResetColor}
                      className="ml-1 w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center text-red-400 hover:text-red-500 transition-colors cursor-pointer shrink-0"
                      title="Reset color"
                    >
                      <X className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    </button>
                  )}
                </div>

                {/* Change Logo */}
                <button
                  onClick={() => logoInputRef.current?.click()}
                  className="flex items-center gap-2.5 lg:gap-3 px-4 py-2 lg:px-5 lg:py-2.5 rounded-full cursor-pointer shrink-0 group border border-blue-400/30 dark:border-blue-500/25 hover:border-blue-400/60 dark:hover:border-blue-400/50 transition-all"
                  style={{ boxShadow: '0 0 4px rgba(59,130,246,0.1), inset 0 0 4px rgba(59,130,246,0.03)' }}
                >
                  {logoPreview || businessLogoUrl ? (
                    <div className="w-7 h-7 lg:w-9 lg:h-9 rounded-full shrink-0 shadow-sm overflow-hidden border border-gray-200 dark:border-gray-600">
                      <img src={logoPreview || businessLogoUrl || ""} alt="Logo" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 lg:w-9 lg:h-9 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-sm">
                      <Upload className="w-3.5 h-3.5 lg:w-4.5 lg:h-4.5 text-white" />
                    </div>
                  )}
                  <span className="text-sm lg:text-base text-blue-600 dark:text-blue-400 whitespace-nowrap">
                    Change Logo
                  </span>
                  {isResetMode && logoPreview && (
                    <span
                      onClick={(e) => { e.stopPropagation(); handleResetLogo(); }}
                      className="ml-1 w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center text-red-400 hover:text-red-500 transition-colors cursor-pointer shrink-0"
                      title="Reset logo"
                    >
                      <X className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    </span>
                  )}
                </button>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />

                {/* Change Favicon */}
                <button
                  onClick={() => faviconInputRef.current?.click()}
                  className="flex items-center gap-2.5 lg:gap-3 px-4 py-2 lg:px-5 lg:py-2.5 rounded-full cursor-pointer shrink-0 group border border-blue-400/30 dark:border-blue-500/25 hover:border-blue-400/60 dark:hover:border-blue-400/50 transition-all"
                  style={{ boxShadow: '0 0 4px rgba(59,130,246,0.1), inset 0 0 4px rgba(59,130,246,0.03)' }}
                >
                  {faviconPreview ? (
                    <div className="w-7 h-7 lg:w-9 lg:h-9 rounded-full shrink-0 shadow-sm overflow-hidden border border-gray-200 dark:border-gray-600">
                      <img src={faviconPreview} alt="Favicon" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 lg:w-9 lg:h-9 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-sm">
                      <Upload className="w-3.5 h-3.5 lg:w-4.5 lg:h-4.5 text-white" />
                    </div>
                  )}
                  <span className="text-sm lg:text-base text-blue-600 dark:text-blue-400 whitespace-nowrap">
                    Change Favicon
                  </span>
                  {isResetMode && faviconPreview && (
                    <span
                      onClick={(e) => { e.stopPropagation(); handleResetFavicon(); }}
                      className="ml-1 w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center text-red-400 hover:text-red-500 transition-colors cursor-pointer shrink-0"
                      title="Reset favicon"
                    >
                      <X className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    </span>
                  )}
                </button>
                <input
                  ref={faviconInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFaviconChange}
                  className="hidden"
                />

                {/* Change Loading Icon */}
                <button
                  onClick={() => loadingIconInputRef.current?.click()}
                  className="flex items-center gap-2.5 lg:gap-3 px-4 py-2 lg:px-5 lg:py-2.5 rounded-full cursor-pointer shrink-0 group border border-blue-400/30 dark:border-blue-500/25 hover:border-blue-400/60 dark:hover:border-blue-400/50 transition-all"
                  style={{ boxShadow: '0 0 4px rgba(59,130,246,0.1), inset 0 0 4px rgba(59,130,246,0.03)' }}
                >
                  {loadingIconPreview ? (
                    <div className="w-7 h-7 lg:w-9 lg:h-9 rounded-full shrink-0 shadow-sm overflow-hidden border border-gray-200 dark:border-gray-600">
                      <img src={loadingIconPreview} alt="Loading icon" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 lg:w-9 lg:h-9 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-sm">
                      <Upload className="w-3.5 h-3.5 lg:w-4.5 lg:h-4.5 text-white" />
                    </div>
                  )}
                  <span className="text-sm lg:text-base text-blue-600 dark:text-blue-400 whitespace-nowrap">
                    Change Loading Icon
                  </span>
                  {isResetMode && loadingIconPreview && (
                    <span
                      onClick={(e) => { e.stopPropagation(); handleResetLoadingIcon(); }}
                      className="ml-1 w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center text-red-400 hover:text-red-500 transition-colors cursor-pointer shrink-0"
                      title="Reset loading icon"
                    >
                      <X className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    </span>
                  )}
                </button>
                <input
                  ref={loadingIconInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLoadingIconChange}
                  className="hidden"
                />

                {/* Save / Reset-Cancel Buttons */}
                <div className="flex items-center gap-2 lg:gap-2.5 shrink-0 pl-1">
                  {/* Save Button */}
                  <button
                    onClick={handleSave}
                    disabled={isSaving || (isResetMode && !hasChanges)}
                    className={`px-5 py-2 lg:px-6 lg:py-2.5 rounded-full text-sm lg:text-base transition-all whitespace-nowrap cursor-pointer ${
                      isResetMode && !hasChanges
                        ? "bg-gray-200/50 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60 border border-gray-300/30 dark:border-gray-600/30"
                        : "bg-blue-500/15 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-400/50 dark:border-blue-500/40 hover:bg-blue-500/25 dark:hover:bg-blue-500/30 hover:border-blue-400/70 dark:hover:border-blue-400/60"
                    }`}
                    style={!(isResetMode && !hasChanges) ? { boxShadow: '0 0 6px rgba(59,130,246,0.25), 0 0 12px rgba(59,130,246,0.1), inset 0 0 4px rgba(59,130,246,0.05)' } : undefined}
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>

                  {/* Reset / Cancel Button */}
                  <button
                    onClick={() => {
                      if (isResetMode) {
                        handleCancelReset();
                      } else {
                        setIsResetMode(true);
                      }
                    }}
                    className={`px-5 py-2 lg:px-6 lg:py-2.5 rounded-full text-sm lg:text-base transition-all whitespace-nowrap cursor-pointer ${
                      isResetMode
                        ? "bg-red-500/15 dark:bg-red-500/20 text-red-500 dark:text-red-400 border border-red-400/50 dark:border-red-500/40 hover:bg-red-500/25 dark:hover:bg-red-500/30 hover:border-red-400/70 dark:hover:border-red-400/60"
                        : "bg-red-500/10 dark:bg-red-500/15 text-red-500 dark:text-red-400 border border-red-400/35 dark:border-red-500/30 hover:bg-red-500/20 dark:hover:bg-red-500/25 hover:border-red-400/55 dark:hover:border-red-400/50"
                    }`}
                    style={{ boxShadow: isResetMode ? '0 0 6px rgba(239,68,68,0.25), 0 0 12px rgba(239,68,68,0.1), inset 0 0 4px rgba(239,68,68,0.05)' : '0 0 4px rgba(239,68,68,0.15), 0 0 8px rgba(239,68,68,0.06)' }}
                  >
                    {isResetMode ? "Cancel" : "Reset"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}