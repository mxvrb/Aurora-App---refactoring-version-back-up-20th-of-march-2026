import React, { useState, useEffect, useContext } from "react";
import {
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Info,
  ArrowLeft,
} from "lucide-react";
import CustomButton from "./Button";
import CustomInput from "./Input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { LogoUploader } from "./whitelabel/LogoUploader";
import { Skeleton } from "./ui/skeleton";
import { FilterContext } from "../contexts/FilterContext";
import {
  getCurrentBusinessId,
  fetchWhiteLabelSettings,
  upsertWhiteLabelSettings,
  uploadWhiteLabelLogo,
  publishWhatsAppBranding,
  isUsingFallbackMode,
  type WhiteLabelSettings,
  type WhiteLabelPayload,
} from "../utils/whitelabel-service";
import BuildingBuilding from "../imports/BuildingBuilding2-1144-335";

interface WhiteLabelProps {
  onBack: () => void;
  businessLogoUrl?: string | null;
  onLogoUpdate?: (logoUrl: string | null) => void;
}

type MenuView =
  | "main"
  | "logo"
  | "loadingicon"
  | "favicon"
  | "colors"
  | "branding";

export function WhiteLabel({ onBack, businessLogoUrl, onLogoUpdate }: WhiteLabelProps) {
  const { getFilterClasses } = useContext(FilterContext);
  const [currentView, setCurrentView] =
    useState<MenuView>("main");

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  // Business context
  const [businessId, setBusinessId] = useState<string | null>(
    null,
  );

  // Form state
  const [displayName, setDisplayName] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#3B82F6");
  const [secondaryColor, setSecondaryColor] =
    useState("#10B981");
  const [accentColor, setAccentColor] = useState("#8B5CF6");
  const [whatsappBgColor, setWhatsappBgColor] =
    useState("#F3F4F6");
  const [footerText, setFooterText] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(
    "booking_confirmation",
  );

  // Original state for comparison
  const [originalSettings, setOriginalSettings] =
    useState<WhiteLabelSettings | null>(null);

  // Error states
  const [logoError, setLogoError] = useState<string | null>(
    null,
  );

  // Pending logo file (before save)
  const [pendingLogoFile, setPendingLogoFile] =
    useState<File | null>(null);
  const [pendingLogoPreview, setPendingLogoPreview] = useState<
    string | null
  >(null);

  // Check for unsaved changes
  const hasUnsavedChanges = originalSettings
    ? displayName !== originalSettings.display_name ||
      primaryColor !== originalSettings.primary_color ||
      secondaryColor !== originalSettings.secondary_color ||
      accentColor !== originalSettings.accent_color ||
      whatsappBgColor !==
        (originalSettings.whatsapp_bg_color || "#F3F4F6") ||
      footerText !== (originalSettings.footer_text || "") ||
      pendingLogoFile !== null ||
      (logoUrl !== originalSettings.logo_url &&
        !pendingLogoFile)
    : false;

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Load logo from offline storage if provided
  useEffect(() => {
    if (businessLogoUrl && !logoUrl) {
      setLogoUrl(businessLogoUrl);
    }
  }, [businessLogoUrl]);

  const loadSettings = async () => {
    try {
      setIsLoading(true);

      // Load logo from offline storage first (passed as prop)
      if (businessLogoUrl) {
        setLogoUrl(businessLogoUrl);
      }

      // Get business ID
      const currentBusinessId = await getCurrentBusinessId();
      if (!currentBusinessId) {
        toast.error("Authentication error", {
          description:
            "Please log in to access white label settings.",
        });
        return;
      }
      setBusinessId(currentBusinessId);

      // Fetch settings
      const settings = await fetchWhiteLabelSettings(
        currentBusinessId,
      );
      if (settings) {
        setOriginalSettings(settings);
        setDisplayName(settings.display_name);
        // Use businessLogoUrl from offline storage if available, otherwise use server logo
        if (!businessLogoUrl) {
          setLogoUrl(settings.logo_url);
        }
        setPrimaryColor(settings.primary_color);
        setSecondaryColor(settings.secondary_color);
        setAccentColor(settings.accent_color);
        setWhatsappBgColor(
          settings.whatsapp_bg_color || "#F3F4F6",
        );
        setFooterText(settings.footer_text || "");
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      // Don't show error toast, fallback mode handles it gracefully
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoChange = (file: File) => {
    setLogoError(null);
    setPendingLogoFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPendingLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleLogoRemove = () => {
    setPendingLogoFile(null);
    setPendingLogoPreview(null);
    setLogoUrl(null);
    setLogoError(null);
  };

  const handleResetColors = () => {
    setPrimaryColor("#3B82F6");
    setSecondaryColor("#10B981");
  };

  const handleSave = async () => {
    if (!businessId) {
      toast.error("No business ID found");
      return;
    }

    try {
      setIsSaving(true);
      setLogoError(null);

      let finalLogoUrl = logoUrl;

      // Upload logo if there's a pending file
      if (pendingLogoFile) {
        try {
          finalLogoUrl = await uploadWhiteLabelLogo(
            businessId,
            pendingLogoFile,
          );
          setPendingLogoFile(null);
          setPendingLogoPreview(null);
          setLogoUrl(finalLogoUrl);
        } catch (error: any) {
          setLogoError(
            error.message || "Failed to upload logo",
          );
          toast.error("Logo upload failed", {
            description: error.message || "Please try again",
          });
          return;
        }
      }

      // Prepare payload
      const payload: WhiteLabelPayload = {
        display_name: displayName,
        logo_url: finalLogoUrl,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        accent_color: accentColor,
        whatsapp_bg_color: whatsappBgColor,
        footer_text: footerText || null,
      };

      // Save settings
      const updatedSettings = await upsertWhiteLabelSettings(
        businessId,
        payload,
      );
      setOriginalSettings(updatedSettings);

      // Update parent component with the new logo URL (always update to ensure sync)
      if (onLogoUpdate) {
        console.log('Updating parent with logo URL:', finalLogoUrl);
        onLogoUpdate(finalLogoUrl);
      }

      toast.success("Settings saved successfully!", {
        description: "Your changes have been saved.",
      });
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings", {
        description: error.message || "Please try again",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!businessId) {
      toast.error("No business ID found");
      return;
    }

    if (hasUnsavedChanges) {
      toast.error("Please save your changes first");
      return;
    }

    try {
      setIsPublishing(true);

      const result = await publishWhatsAppBranding(businessId);

      if (result.success) {
        toast.success("Branding published!", {
          description: "Your WhatsApp branding is now live.",
          duration: 5000,
        });
      } else {
        toast.error("Publishing failed", {
          description: result.message,
        });
      }
    } catch (error: any) {
      console.error("Error publishing branding:", error);
      toast.error("Failed to publish branding", {
        description: error.message || "Please try again",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to discard them?",
      );
      if (!confirmed) return;

      // Reset to original settings
      if (originalSettings) {
        setDisplayName(originalSettings.display_name);
        setLogoUrl(originalSettings.logo_url);
        setPrimaryColor(originalSettings.primary_color);
        setSecondaryColor(originalSettings.secondary_color);
        setAccentColor(originalSettings.accent_color);
        setWhatsappBgColor(
          originalSettings.whatsapp_bg_color || "#F3F4F6",
        );
        setFooterText(originalSettings.footer_text || "");
        setPendingLogoFile(null);
        setPendingLogoPreview(null);
      }
    }
    if (currentView === "main") {
      onBack();
    } else {
      setCurrentView("main");
    }
  };

  // Get effective logo URL (pending preview or saved URL)
  const effectiveLogoUrl = pendingLogoPreview || logoUrl;

  // Main Menu View
  if (currentView === "main") {
    return (
      <div className="w-full bg-white dark:bg-gray-800 relative">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="absolute top-8 left-8 p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer z-20"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="relative bg-white dark:bg-gray-800">
          <div className="px-6 py-4 flex items-center justify-between border-b border-transparent">
            <span className="font-medium opacity-0">
              Spacer
            </span>
          </div>
          <div className="px-6 py-4 flex items-center justify-between border-b border-transparent">
            <span className="font-medium opacity-0">
              Spacer
            </span>
          </div>
          <div className="px-6 py-4 flex items-center justify-between border-b border-transparent">
            <span className="font-medium opacity-0">
              Spacer
            </span>
          </div>
          <div className="px-6 py-4 flex items-center justify-between border-b border-transparent">
            <span className="font-medium opacity-0">
              Spacer
            </span>
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="w-[68px] h-[68px] rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-4 shadow-xl">
              <div
                className="text-white drop-shadow-lg"
                style={
                  {
                    width: "34px",
                    height: "34px",
                    "--stroke-0": "currentColor",
                  } as React.CSSProperties
                }
              >
                <BuildingBuilding />
              </div>
            </div>
            <span className="font-medium text-gray-900 dark:text-gray-100 mb-2 drop-shadow-md">
              White Label
            </span>
            <p className="text-sm text-gray-900 dark:text-gray-100 text-center max-w-xl drop-shadow-md px-4">
              Customize your platform branding such as logo,
              colors, and business name display.
            </p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-6 space-y-3">
          {/* Change Logo */}
          <div
            onClick={() => setCurrentView("logo")}
            style={{
              paddingTop: "0.6rem",
              paddingBottom: "0.6rem",
            }}
            className={`flex items-center justify-between px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg ${getFilterClasses('Change Logo')}`}
          >
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Change Logo
            </span>
            <ChevronRight className="w-5 h-5 text-gray-900 dark:text-gray-100" />
          </div>

          {/* Customize Loading Icon */}
          <div
            onClick={() => setCurrentView("loadingicon")}
            style={{
              paddingTop: "0.6rem",
              paddingBottom: "0.6rem",
            }}
            className={`flex items-center justify-between px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg ${getFilterClasses('Customize Loading Icon')}`}
          >
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Customize Loading Icon
            </span>
            <ChevronRight className="w-5 h-5 text-gray-900 dark:text-gray-100" />
          </div>

          {/* Favicon Upload */}
          <div
            onClick={() => setCurrentView("favicon")}
            style={{
              paddingTop: "0.6rem",
              paddingBottom: "0.6rem",
            }}
            className={`flex items-center justify-between px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg ${getFilterClasses('Favicon Upload')}`}
          >
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Favicon Upload
            </span>
            <ChevronRight className="w-5 h-5 text-gray-900 dark:text-gray-100" />
          </div>

          {/* Customize Colors */}
          <div
            onClick={() => setCurrentView("colors")}
            style={{
              paddingTop: "0.6rem",
              paddingBottom: "0.6rem",
            }}
            className={`flex items-center justify-between px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg ${getFilterClasses('Customize Colors')}`}
          >
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Customize Colors
            </span>
            <ChevronRight className="w-5 h-5 text-gray-900 dark:text-gray-100" />
          </div>

          {/* Remove Aces AI Branding */}
          <div
            onClick={() => setCurrentView("branding")}
            style={{
              paddingTop: "0.6rem",
              paddingBottom: "0.6rem",
            }}
            className={`flex items-center justify-between px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg ${getFilterClasses('Remove Aces AI Branding')}`}
          >
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Remove Aces AI Branding
            </span>
            <ChevronRight className="w-5 h-5 text-gray-900 dark:text-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  // Logo Sub-Screen
  if (currentView === "logo") {
    return (
      <div className="w-full h-full bg-white dark:bg-gray-800 flex flex-col">
        {/* Page Header */}
        <div
          onClick={handleCancel}
          style={{
            paddingTop: "0.6rem",
            paddingBottom: "0.6rem",
          }}
          className="flex items-center px-6 mx-4 mt-3 mb-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg"
        >
          <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-2" />
          <span className="font-medium text-gray-900 dark:text-gray-100">
            Change Logo
          </span>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-6 space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-48 w-full" />
              </div>
            ) : (
              <>
                {/* Logo Uploader */}
                <LogoUploader
                  currentLogoUrl={effectiveLogoUrl}
                  onLogoChange={handleLogoChange}
                  onLogoRemove={handleLogoRemove}
                  isUploading={isUploadingLogo}
                  error={logoError}
                />
              </>
            )}
          </div>
        </div>

        {/* Save Settings Button */}
        {!isLoading && (
          <div className="mx-5 mb-5">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Branding Sub-Screen
  if (currentView === "branding") {
    return (
      <div className="w-full h-full bg-white dark:bg-gray-800 flex flex-col">
        {/* Page Header */}
        <div
          onClick={handleCancel}
          style={{
            paddingTop: "0.6rem",
            paddingBottom: "0.6rem",
          }}
          className="flex items-center px-6 mx-4 mt-3 mb-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg"
        >
          <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-2" />
          <span className="font-medium text-gray-900 dark:text-gray-100">
            Remove Aces AI Branding
          </span>
        </div>

        <div className="px-6 py-6 space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <>
              {/* Simple Text Content */}
              <div className="p-8 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Remove Aces AI Branding
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  This feature will be available soon. You'll be
                  able to completely remove Aces AI branding
                  from your platform.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-6">
                  Contact support to enable white label branding
                  removal.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Loading Icon Sub-Screen
  if (currentView === "loadingicon") {
    return (
      <div className="w-full h-full bg-white dark:bg-gray-800 flex flex-col">
        {/* Page Header */}
        <div
          onClick={handleCancel}
          style={{
            paddingTop: "0.6rem",
            paddingBottom: "0.6rem",
          }}
          className="flex items-center px-6 mx-4 mt-3 mb-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg"
        >
          <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-2" />
          <span className="font-medium text-gray-900 dark:text-gray-100">
            Customize Loading Icon
          </span>
        </div>

        <div className="px-6 py-6 space-y-8">
          {isLoading ? (
            <div className="space-y-8">
              <div className="space-y-4">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-48 w-full" />
              </div>
            </div>
          ) : (
            <>
              <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Loading Icon Settings
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Customize your loading icon (placeholder for
                  future implementation)
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Favicon Sub-Screen
  if (currentView === "favicon") {
    return (
      <div className="w-full h-full bg-white dark:bg-gray-800 flex flex-col">
        {/* Page Header */}
        <div
          onClick={handleCancel}
          style={{
            paddingTop: "0.6rem",
            paddingBottom: "0.6rem",
          }}
          className="flex items-center px-6 mx-4 mt-3 mb-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg"
        >
          <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-2" />
          <span className="font-medium text-gray-900 dark:text-gray-100">
            Favicon Upload
          </span>
        </div>

        <div className="px-6 py-6 space-y-8">
          {isLoading ? (
            <div className="space-y-8">
              <div className="space-y-4">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-48 w-full" />
              </div>
            </div>
          ) : (
            <>
              <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Favicon Settings
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Upload your custom favicon (placeholder for
                  future implementation)
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Colors Sub-Screen
  if (currentView === "colors") {
    return (
      <div className="w-full h-full bg-white dark:bg-gray-800 flex flex-col">
        {/* Page Header */}
        <div
          onClick={handleCancel}
          style={{
            paddingTop: "0.6rem",
            paddingBottom: "0.6rem",
          }}
          className="flex items-center px-6 mx-4 mt-3 mb-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg"
        >
          <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-2" />
          <span className="font-medium text-gray-900 dark:text-gray-100">
            Customize Colors
          </span>
        </div>

        <div className="px-6 py-6 space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <>
              {/* Color Pickers Container */}
              <div className="space-y-6">
                {/* Primary Color Picker */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-gray-900 dark:text-gray-100 font-medium">
                      Primary Color
                    </Label>
                    <div className="group relative">
                      <Info className="w-4 h-4 text-gray-400 dark:text-gray-500 cursor-help" />
                      <div className="absolute right-0 top-6 w-56 p-3 bg-gray-900 dark:bg-gray-950 text-white text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        This color is used for text throughout
                        the app
                        <div className="absolute -top-1 right-3 w-2 h-2 bg-gray-900 dark:bg-gray-950 rotate-45"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Main brand color for buttons and links
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) =>
                        setPrimaryColor(e.target.value)
                      }
                      className="w-16 h-16 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                    <CustomInput
                      type="text"
                      value={primaryColor}
                      onChange={(e) =>
                        setPrimaryColor(e.target.value)
                      }
                      placeholder="#3B82F6"
                      className="flex-1 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                {/* Secondary Color Picker */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-gray-900 dark:text-gray-100 font-medium">
                      Secondary Color
                    </Label>
                    <div className="group relative">
                      <Info className="w-4 h-4 text-gray-400 dark:text-gray-500 cursor-help" />
                      <div className="absolute right-0 top-6 w-56 p-3 bg-gray-900 dark:bg-gray-950 text-white text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        This color is used for backgrounds
                        throughout the app
                        <div className="absolute -top-1 right-3 w-2 h-2 bg-gray-900 dark:bg-gray-950 rotate-45"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Supporting color for highlights
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) =>
                        setSecondaryColor(e.target.value)
                      }
                      className="w-16 h-16 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                    <CustomInput
                      type="text"
                      value={secondaryColor}
                      onChange={(e) =>
                        setSecondaryColor(e.target.value)
                      }
                      placeholder="#10B981"
                      className="flex-1 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                {/* Color Preview Panel */}
                <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Color Preview
                  </h4>
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-2">
                      <div
                        className="h-12 rounded-lg flex items-center justify-center text-white font-medium"
                        style={{
                          backgroundColor: primaryColor,
                        }}
                      >
                        Primary
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div
                        className="h-12 rounded-lg flex items-center justify-center text-white font-medium"
                        style={{
                          backgroundColor: secondaryColor,
                        }}
                      >
                        Secondary
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reset Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleResetColors}
                    className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Reset to Default
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
}