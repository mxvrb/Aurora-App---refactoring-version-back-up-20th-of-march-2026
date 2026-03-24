import React, { useState, useEffect } from 'react';
import { ChevronLeft, MessageSquare, CheckCircle, XCircle, Clock, MessageCircleQuestion } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from "sonner";

interface CustomizeMessageProps {
  onBack: () => void;
}

export function CustomizeMessage({ onBack }: CustomizeMessageProps) {
  // Load initial state from localStorage
  const [initialState] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem('customizeMessageSettings');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const defaultSettings = {
    confirmationMessage: "Your table is booked for {time} — see you soon! 🎉",
    rejectionMessage: "We're fully booked at this time. Want another slot? 🤔",
    pendingMessage: "Let me check availability for you… ⏳",
    followUpMessage: "You haven't confirmed yet — want me to reserve this slot? 💭"
  };

  const [confirmationMessage, setConfirmationMessage] = useState(initialState?.confirmationMessage ?? defaultSettings.confirmationMessage);
  const [rejectionMessage, setRejectionMessage] = useState(initialState?.rejectionMessage ?? defaultSettings.rejectionMessage);
  const [pendingMessage, setPendingMessage] = useState(initialState?.pendingMessage ?? defaultSettings.pendingMessage);
  const [followUpMessage, setFollowUpMessage] = useState(initialState?.followUpMessage ?? defaultSettings.followUpMessage);

  const handleSave = () => {
    const settings = {
      confirmationMessage,
      rejectionMessage,
      pendingMessage,
      followUpMessage
    };
    
    localStorage.setItem('customizeMessageSettings', JSON.stringify(settings));
    toast.success('Message templates saved!');
  };

  const handleReset = () => {
    setConfirmationMessage(defaultSettings.confirmationMessage);
    setRejectionMessage(defaultSettings.rejectionMessage);
    setPendingMessage(defaultSettings.pendingMessage);
    setFollowUpMessage(defaultSettings.followUpMessage);
    toast.info('Reset to default messages');
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
        <span className="font-medium text-gray-900 dark:text-gray-100">Customize Message</span>
      </div>
      
      <div className="p-6 space-y-6">
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-900 dark:text-blue-200">
            Customize the messages customers see during the booking process. Use <code className="bg-blue-200 dark:bg-blue-800 px-1 rounded">{'{time}'}</code> to insert the booking time dynamically.
          </p>
        </div>

        {/* Confirmation Message */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirmation Message</Label>
          </div>
          <Textarea
            value={confirmationMessage}
            onChange={(e) => setConfirmationMessage(e.target.value)}
            placeholder="Message sent when booking is confirmed"
            className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 min-h-[80px]"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Sent when the booking is successfully confirmed
          </p>
        </div>

        {/* Rejection Message */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Rejection Message</Label>
          </div>
          <Textarea
            value={rejectionMessage}
            onChange={(e) => setRejectionMessage(e.target.value)}
            placeholder="Message sent when no slots available"
            className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 min-h-[80px]"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Sent when the requested time slot is not available
          </p>
        </div>

        {/* Pending Message */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            </div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Pending Message</Label>
          </div>
          <Textarea
            value={pendingMessage}
            onChange={(e) => setPendingMessage(e.target.value)}
            placeholder="Message sent while checking availability"
            className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 min-h-[80px]"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Sent while the AI is checking availability
          </p>
        </div>

        {/* Follow-up Message */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <MessageCircleQuestion className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Follow-up Message</Label>
          </div>
          <Textarea
            value={followUpMessage}
            onChange={(e) => setFollowUpMessage(e.target.value)}
            placeholder="Message sent as a reminder"
            className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 min-h-[80px]"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Sent as a reminder if customer hasn't confirmed
          </p>
        </div>

        {/* Message Preview Card */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Message Preview</Label>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 space-y-3">
            
            {/* Confirmation Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-800 shadow-sm">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {confirmationMessage.replace('{time}', '7:00 PM')}
                </div>
              </div>
            </div>

            {/* Rejection Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-red-200 dark:border-red-800 shadow-sm">
              <div className="flex items-start space-x-2">
                <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {rejectionMessage}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Save and Reset Buttons */}
        <div className="flex justify-end space-x-2">
          <Button
            onClick={handleReset}
            variant="ghost"
            className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Reset to Default
          </Button>
          <Button
            onClick={handleSave}
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg"
          >
            Save Changes
          </Button>
        </div>

      </div>
    </div>
  );
}