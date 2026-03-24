import React from 'react';
import { Check, CheckCheck, Phone, Video, MoreVertical, Smile, Mic, Paperclip, Camera } from 'lucide-react';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface WhatsAppPreviewProps {
  businessName: string;
  logoUrl: string | null;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  footerText?: string | null;
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
}

const templates = {
  booking_confirmation: {
    title: 'Booking Confirmation',
    message: "Great news! Your booking has been confirmed 🎉\n\n📅 Date: March 15, 2026\n⏰ Time: 2:30 PM\n📍 Location: Main Office\n\nWe look forward to seeing you!",
  },
  appointment_reminder: {
    title: 'Appointment Reminder',
    message: "Hi there! 👋\n\nThis is a friendly reminder about your upcoming appointment:\n\n📅 Tomorrow at 2:30 PM\n📍 Main Office\n\nPlease reply to confirm or reschedule if needed.",
  },
  review_request: {
    title: 'Review Request',
    message: "Thank you for choosing us! ⭐\n\nWe'd love to hear about your experience. Your feedback helps us improve our service.\n\nCould you spare a moment to leave us a review?",
  },
  follow_up: {
    title: 'Follow-up Message',
    message: "Hello! 👋\n\nWe wanted to check in and see how everything went. Is there anything else we can help you with?\n\nFeel free to reach out anytime!",
  },
};

export function WhatsAppPreview({
  businessName,
  logoUrl,
  primaryColor,
  accentColor,
  backgroundColor,
  footerText,
  selectedTemplate,
  onTemplateChange,
}: WhatsAppPreviewProps) {
  const currentTemplate = templates[selectedTemplate as keyof typeof templates] || templates.booking_confirmation;
  const currentTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <div className="space-y-4">
      {/* Template Selector */}
      <div className="space-y-2">
        <Label className="text-gray-900 dark:text-gray-100 font-medium">
          Preview Template
        </Label>
        <Select value={selectedTemplate} onValueChange={onTemplateChange}>
          <SelectTrigger className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="booking_confirmation">Booking Confirmation</SelectItem>
            <SelectItem value="appointment_reminder">Appointment Reminder</SelectItem>
            <SelectItem value="review_request">Review Request</SelectItem>
            <SelectItem value="follow_up">Follow-up Message</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* WhatsApp Phone Mockup */}
      <div className="relative mx-auto max-w-sm">
        {/* Phone Frame */}
        <div className="bg-gray-900 rounded-[3rem] p-3 shadow-2xl border-8 border-gray-900">
          {/* Screen */}
          <div className="bg-[#E5DDD5] rounded-[2.5rem] overflow-hidden">
            {/* WhatsApp Header */}
            <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3">
              <div className="flex items-center gap-3 flex-1">
                {/* Business Logo or Avatar */}
                {logoUrl ? (
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white/20">
                    <img src={logoUrl} alt={businessName} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                    {businessName.charAt(0).toUpperCase()}
                  </div>
                )}
                
                {/* Business Name */}
                <div className="flex-1">
                  <h3 className="text-white font-medium text-sm">{businessName || 'Business Name'}</h3>
                  <p className="text-white/70 text-xs">online</p>
                </div>
              </div>
              
              {/* Header Actions */}
              <div className="flex items-center gap-4">
                <Video className="w-5 h-5 text-white/90" />
                <Phone className="w-5 h-5 text-white/90" />
                <MoreVertical className="w-5 h-5 text-white/90" />
              </div>
            </div>

            {/* Chat Area */}
            <div className="p-4 space-y-3 min-h-[400px] max-h-[400px] overflow-y-auto bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0icGF0dGVybiIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIj48cGF0aCBkPSJNMCAwTDQwIDQwTTQwIDBMMCA0MCIgc3Ryb2tlPSIjZGNmOGM2IiBzdHJva2Utd2lkdGg9IjAuNSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+PC9zdmc+')]">
              {/* Date Divider */}
              <div className="flex justify-center mb-4">
                <div className="px-3 py-1 bg-white/80 rounded-lg shadow-sm">
                  <p className="text-xs text-gray-700">TODAY</p>
                </div>
              </div>

              {/* Business Message Card */}
              <div className="flex justify-start">
                <div 
                  className="max-w-[80%] rounded-lg shadow-md overflow-hidden"
                  style={{ backgroundColor: backgroundColor }}
                >
                  {/* Logo Header (if logo exists) */}
                  {logoUrl && (
                    <div className="flex items-center gap-3 p-3 border-b border-gray-200">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
                        <img src={logoUrl} alt={businessName} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">{businessName}</h4>
                        <p className="text-xs text-gray-600">Automated Message</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Message Content */}
                  <div className="p-3">
                    <p className="text-gray-800 text-sm whitespace-pre-line leading-relaxed">
                      {currentTemplate.message}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-3 pt-0 space-y-2">
                    <button
                      className="w-full py-2.5 rounded-lg text-white font-medium text-sm transition-colors hover:opacity-90"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Confirm Booking
                    </button>
                    <button
                      className="w-full py-2.5 rounded-lg text-white font-medium text-sm transition-colors hover:opacity-90"
                      style={{ backgroundColor: accentColor }}
                    >
                      View Details
                    </button>
                  </div>

                  {/* Footer Text */}
                  {footerText && (
                    <div className="px-3 pb-3">
                      <p className="text-xs text-gray-600 text-center border-t border-gray-200 pt-2">
                        {footerText}
                      </p>
                    </div>
                  )}

                  {/* Message Time */}
                  <div className="px-3 pb-2 flex items-center justify-end gap-1">
                    <span className="text-xs text-gray-500">{currentTime}</span>
                    <CheckCheck className="w-4 h-4 text-blue-500" />
                  </div>
                </div>
              </div>

              {/* Customer Reply Example */}
              <div className="flex justify-end mt-3">
                <div className="max-w-[70%] bg-[#DCF8C6] rounded-lg p-3 shadow-md">
                  <p className="text-gray-800 text-sm">Thank you! See you then 👍</p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-xs text-gray-600">{currentTime}</span>
                    <CheckCheck className="w-4 h-4 text-blue-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Input Area */}
            <div className="bg-[#F0F0F0] px-2 py-2 flex items-center gap-2">
              <button className="p-2 text-gray-600 hover:bg-white/50 rounded-full transition-colors">
                <Smile className="w-5 h-5" />
              </button>
              <div className="flex-1 bg-white rounded-full px-4 py-2">
                <p className="text-sm text-gray-400">Type a message</p>
              </div>
              <button className="p-2 text-gray-600 hover:bg-white/50 rounded-full transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-white/50 rounded-full transition-colors">
                <Camera className="w-5 h-5" />
              </button>
              <button className="p-2.5 text-white rounded-full transition-colors" style={{ backgroundColor: primaryColor }}>
                <Mic className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Info */}
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          <strong>Live Preview:</strong> This shows how your WhatsApp messages will appear to customers with your branding applied. Changes are instant.
        </p>
      </div>
    </div>
  );
}
