import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";

interface UnsavedChangesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDiscard: () => void;
  onSave: () => void;
}

export function UnsavedChangesDialog({ open, onOpenChange, onDiscard, onSave }: UnsavedChangesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#1F2937] border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">Unsaved Changes</DialogTitle>
          <DialogDescription className="text-gray-400 text-base mt-2">
            You have unsaved changes. Do you want to save them before leaving?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-3 sm:justify-end mt-4">
          <Button 
            variant="secondary" 
            onClick={onDiscard}
            className="bg-[#374151] hover:bg-[#4B5563] text-white border-none font-medium"
          >
            Discard Changes
          </Button>
          <Button 
            onClick={onSave}
            className="bg-blue-600 hover:bg-blue-700 text-white border-none font-medium"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
