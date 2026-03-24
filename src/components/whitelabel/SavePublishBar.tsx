import React, { useState } from 'react';
import { Save, Send, X, AlertCircle, Loader2 } from 'lucide-react';
import CustomButton from '../Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';

interface SavePublishBarProps {
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  isPublishing: boolean;
  onSave: () => void;
  onPublish: () => void;
  onCancel: () => void;
}

export function SavePublishBar({
  hasUnsavedChanges,
  isSaving,
  isPublishing,
  onSave,
  onPublish,
  onCancel,
}: SavePublishBarProps) {
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);

  const handlePublishClick = () => {
    if (hasUnsavedChanges) {
      // Show warning if there are unsaved changes
      alert('Please save your changes before publishing.');
      return;
    }
    setShowPublishConfirm(true);
  };

  const handleConfirmPublish = () => {
    setShowPublishConfirm(false);
    onPublish();
  };

  return (
    <>
      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 shadow-lg z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Unsaved Changes Indicator */}
            <div className="flex items-center gap-3">
              {hasUnsavedChanges ? (
                <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-sm font-medium text-amber-900 dark:text-amber-100">
                    You have unsaved changes
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full" />
                  <span className="text-sm font-medium">All changes saved</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <CustomButton
                onClick={onCancel}
                disabled={isSaving || isPublishing}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
              >
                <X className="w-4 h-4" />
                Cancel
              </CustomButton>

              <CustomButton
                onClick={onSave}
                disabled={!hasUnsavedChanges || isSaving || isPublishing}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </CustomButton>

              <CustomButton
                onClick={handlePublishClick}
                disabled={hasUnsavedChanges || isSaving || isPublishing}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-md"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Publish to WhatsApp
                  </>
                )}
              </CustomButton>
            </div>
          </div>
        </div>
      </div>

      {/* Publish Confirmation Modal */}
      <Dialog open={showPublishConfirm} onOpenChange={setShowPublishConfirm}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Publish WhatsApp Branding?
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400 text-base mt-2">
              This will apply your white label branding to all WhatsApp messages and booking pages. Your customers will see these changes immediately.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 text-sm">
              What will be updated:
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
              <li>Business logo and display name</li>
              <li>Brand colors for buttons and cards</li>
              <li>WhatsApp message templates</li>
              <li>Booking page appearance</li>
              <li>Footer text (if configured)</li>
            </ul>
          </div>

          <DialogFooter className="flex gap-3 sm:justify-end">
            <CustomButton
              onClick={() => setShowPublishConfirm(false)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
            >
              Cancel
            </CustomButton>
            <CustomButton
              onClick={handleConfirmPublish}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
            >
              Confirm & Publish
            </CustomButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
