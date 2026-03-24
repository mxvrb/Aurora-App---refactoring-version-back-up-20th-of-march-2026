import React, { useState, useEffect } from 'react';
import { ChevronLeft, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { toast } from "sonner";

interface AlertInstructionsProps {
  onBack: () => void;
}

export function AlertInstructions({ onBack }: AlertInstructionsProps) {
  // Load initial state from localStorage
  const [initialState] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem('alertInstructionsSettings');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const defaultSettings = {
    includeCustomerPhone: true,
    includeNotes: true,
    includeSeatNumber: true,
    messageFormat: 'detailed',
    customLabels: ''
  };

  const [includeCustomerPhone, setIncludeCustomerPhone] = useState(initialState?.includeCustomerPhone ?? defaultSettings.includeCustomerPhone);
  const [includeNotes, setIncludeNotes] = useState(initialState?.includeNotes ?? defaultSettings.includeNotes);
  const [includeSeatNumber, setIncludeSeatNumber] = useState(initialState?.includeSeatNumber ?? defaultSettings.includeSeatNumber);
  const [messageFormat, setMessageFormat] = useState(initialState?.messageFormat ?? defaultSettings.messageFormat);
  const [customLabels, setCustomLabels] = useState(initialState?.customLabels ?? defaultSettings.customLabels);



  const handleSave = () => {
    const settings = {
      includeCustomerPhone,
      includeNotes,
      includeSeatNumber,
      messageFormat,
      customLabels
    };
    
    localStorage.setItem('alertInstructionsSettings', JSON.stringify(settings));
    toast.success('Alert instructions saved!');
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800">
      {/* Floating glassmorphism back button */}
      <div 
        onClick={onBack}
        style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
        className="flex items-center px-6 mx-4 mt-3 mb-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg"
      >
        <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-2" />
        <span className="font-medium text-gray-900 dark:text-gray-100">Alert Instructions for AI</span>
      </div>
      
      <div className="p-6 space-y-6">
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-900 dark:text-blue-200">
            Configure how the AI structures booking alerts sent to your team. These settings control what information is included in the internal notification.
          </p>
        </div>

        {/* Include Customer Phone */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <Switch
              checked={includeCustomerPhone}
              onCheckedChange={setIncludeCustomerPhone}
            />
            <div className="flex flex-col">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Include Customer Phone Number</Label>
              <span className="text-xs text-gray-500 dark:text-gray-400">Show customer contact in alert</span>
            </div>
          </div>
        </div>

        {/* Include Notes */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <Switch
              checked={includeNotes}
              onCheckedChange={setIncludeNotes}
            />
            <div className="flex flex-col">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Include Customer Notes/Requests</Label>
              <span className="text-xs text-gray-500 dark:text-gray-400">Display any special requests from customer</span>
            </div>
          </div>
        </div>

        {/* Include Seat/Table Number */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <Switch
              checked={includeSeatNumber}
              onCheckedChange={setIncludeSeatNumber}
            />
            <div className="flex flex-col">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Include Seat/Table Number</Label>
              <span className="text-xs text-gray-500 dark:text-gray-400">Show assigned seat or table in alert</span>
            </div>
          </div>
        </div>

        {/* Message Format */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Alert Message Format</Label>
          <Select value={messageFormat} onValueChange={setMessageFormat}>
            <SelectTrigger className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Short Format (Quick summary)</SelectItem>
              <SelectItem value="detailed">Detailed Format (Full information)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Custom Labels */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Custom Labels & Instructions</Label>
          <Textarea
            value={customLabels}
            onChange={(e) => setCustomLabels(e.target.value)}
            placeholder="Example: 'Chef: you must confirm this within 3 minutes' or 'Nail tech: please prepare station 2 for gel'"
            className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 min-h-[100px]"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Add any custom labels or special instructions that should appear in alerts sent to your team
          </p>
        </div>

        {/* Preview Section */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Alert Preview</Label>
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <p className="font-medium">🔔 New Booking Alert</p>
              <p>Time: 3:00 PM - June 15, 2024</p>
              <p>Type: Table for 2</p>
              {includeCustomerPhone && <p>Customer: +1 (555) 123-4567</p>}
              {includeSeatNumber && <p>Table: #5</p>}
              {includeNotes && <p>Notes: Window seat preferred</p>}
              {customLabels && (
                <p className="text-purple-600 dark:text-purple-400 mt-2 italic">{customLabels}</p>
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}