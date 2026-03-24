import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AIPlaygroundStep } from './onboarding/AIPlaygroundStep';
import { toast } from 'sonner';

interface EditAIPreviewOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    color?: string;
    logo?: string | null;
    greeting?: string;
  };
  onSave: (data: { color?: string; logo?: string | null; greeting?: string }) => void;
  websiteData?: any;
}

export const EditAIPreviewOverlay: React.FC<EditAIPreviewOverlayProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
  websiteData
}) => {
  // Track the live values as the user edits - these sync to parent in real-time
  const liveColor = useRef(initialData.color);
  const liveLogo = useRef(initialData.logo);
  const liveGreeting = useRef(initialData.greeting);

  // Snapshot of original values when overlay opens, for undo on cancel
  const originalData = useRef(initialData);

  // Reset refs when opening
  useEffect(() => {
    if (isOpen) {
      originalData.current = { ...initialData };
      liveColor.current = initialData.color;
      liveLogo.current = initialData.logo;
      liveGreeting.current = initialData.greeting;
    }
  }, [isOpen]);

  // Real-time sync handlers - push changes to parent immediately
  const handleColorChange = useCallback((color: string) => {
    liveColor.current = color;
    onSave({ color, logo: liveLogo.current, greeting: liveGreeting.current });
  }, [onSave]);

  const handleLogoChange = useCallback((logo: string | null) => {
    liveLogo.current = logo;
    onSave({ color: liveColor.current, logo, greeting: liveGreeting.current });
  }, [onSave]);

  const handleGreetingChange = useCallback((greeting: string) => {
    liveGreeting.current = greeting;
    onSave({ color: liveColor.current, logo: liveLogo.current, greeting });
  }, [onSave]);

  const handleSave = () => {
    // Final save with current live values (already synced, just confirm & close)
    onSave({
      color: liveColor.current,
      logo: liveLogo.current,
      greeting: liveGreeting.current
    });
    toast.success('AI Assistant updated successfully');
    onClose();
  };

  const handleCancel = () => {
    // Revert to original values when cancelling
    onSave({
      color: originalData.current.color,
      logo: originalData.current.logo,
      greeting: originalData.current.greeting
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-white dark:bg-gray-950 overflow-y-auto"
    >
      <AIPlaygroundStep
        onContinue={handleSave}
        onBack={handleCancel}
        websiteData={websiteData}
        initialColor={initialData.color}
        initialLogo={initialData.logo}
        initialGreeting={initialData.greeting}
        onColorChange={handleColorChange}
        onLogoChange={handleLogoChange}
        onGreetingChange={handleGreetingChange}
        submitLabel="Save"
        title="Edit AI Assistant"
        isEditing={true}
      />
    </motion.div>
  );
};