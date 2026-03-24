import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, AlertCircle, X, Plus, Mail, MessageSquareText, Monitor, CheckCircle, ShieldCheck, Info, Brain, Loader2, ChevronDown, Wand2, Pencil, Eye, Link, CreditCard, Pointer, BarChart3, ThumbsUp, CheckSquare, SquarePen } from 'lucide-react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from "sonner";
import { MagicalLoadingText } from './MagicalLoadingText';

// ─── Confirmation style definitions ──────────────────────────────────────────
const CONFIRMATION_STYLES = [
  { id: 'yes-no-buttons',   icon: CheckSquare,       iconColor: 'text-emerald-500',  label: 'Yes / No Buttons',    desc: 'Two inline Approve & Decline buttons' },
  { id: 'quick-reply',      icon: MessageSquareText, iconColor: 'text-blue-500',     label: 'Quick Reply',          desc: '3 tap options: Confirm, Reschedule, Cancel' },
  { id: 'text-response',    icon: Pencil,            iconColor: 'text-indigo-500',   label: 'Text Response',        desc: 'Staff types a reply to approve or decline' },
  { id: 'one-click-link',   icon: Link,              iconColor: 'text-purple-500',   label: 'One-Click Link',       desc: 'Approval hyperlink embedded in message' },
  { id: 'interactive-card', icon: CreditCard,        iconColor: 'text-rose-500',     label: 'Interactive Card',     desc: 'Rich card with structured booking details' },
  { id: 'tap-confirm',      icon: Pointer,           iconColor: 'text-orange-500',   label: 'Tap to Confirm',       desc: 'Single large confirm button, small decline link' },
  { id: 'poll-vote',        icon: BarChart3,         iconColor: 'text-amber-500',    label: 'Poll / Vote',          desc: 'Staff votes via Approve / Decline poll bars' },
  { id: 'emoji-react',      icon: ThumbsUp,          iconColor: 'text-yellow-500',   label: 'Emoji React',          desc: '👍 to approve · 👎 to decline' },
];

const STAFF_MSG_VARIATIONS = [
  "Hello team, you have a new booking request for Aces AI! Please review the details below:",
  "Hi there! A new reservation has been made at Aces AI. Check the information below:",
  "Great news! We have a new booking for Aces AI. Please confirm the details:",
  "New booking alert for Aces AI! Please see the customer details below and respond:",
  "Action required: A new booking request just came in for Aces AI. Details are as follows:"
];

// Custom WhatsApp icon using the official logo silhouette
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

interface ContactItem {
  id: string;
  value: string;
  isSaved: boolean;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

interface ManualConfirmationProps {
  onBack: () => void;
  userEmail?: string; // Pass from App.tsx
}

interface PendingBooking {
  id: string;
  customerName: string;
  date: string;
  time: string;
  partySize: number;
  requestedAgo: string;
  phone: string;
}

export function ManualConfirmation({ onBack, userEmail = 'user@example.com' }: ManualConfirmationProps) {
  // Load saved settings
  const [savedSettings] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem('manualConfirmationSettings');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const defaultSettings = {
    enabled: true,
    confirmationMode: 'full-manual',
    hybridThreshold: 5,
    emailEnabled: true,
    emailAddresses: [userEmail],
    whatsappEnabled: false,
    whatsappNumbers: [],
    smsEnabled: false,
    smsNumbers: [],
    responseTemplate: "Let me check availability for {date} at {time} for {party_size} people. You'll hear back within {response_time}.",
    confirmationStyle: 'yes-no-buttons',
    staffNotifyMessage: '',
    previewFieldsData: [
      { id: 'name',    label: 'Customer Name', value: 'Sarah Johnson',         isActive: true, isGenerating: false },
      { id: 'date',    label: 'Date',          value: 'Sat, Mar 15',           isActive: true, isGenerating: false },
      { id: 'time',    label: 'Time',          value: '7:30 PM',               isActive: true, isGenerating: false },
      { id: 'party',   label: 'Party Size',    value: '4 guests',              isActive: true, isGenerating: false },
      { id: 'tables',  label: 'Tables',        value: '2 tables',              isActive: false, isGenerating: false },
      { id: 'phone',   label: 'Phone',         value: '+44 7700 900123',       isActive: false, isGenerating: false },
      { id: 'special', label: 'Notes',         value: 'Window seat preferred', isActive: false, isGenerating: false },
      { id: 'service', label: 'Service',       value: 'Dinner',                isActive: false, isGenerating: false },
    ]
  };

  const [enabled, setEnabled] = useState(savedSettings?.enabled ?? defaultSettings.enabled);
  const [confirmationMode, setConfirmationMode] = useState(savedSettings?.confirmationMode ?? defaultSettings.confirmationMode);
  const [hybridThreshold, setHybridThreshold] = useState(savedSettings?.hybridThreshold ?? defaultSettings.hybridThreshold);
  
  const [emailEnabled, setEmailEnabled] = useState(savedSettings?.emailEnabled ?? defaultSettings.emailEnabled);
  const [emails, setEmails] = useState<ContactItem[]>(() => 
    (savedSettings?.emailAddresses ?? defaultSettings.emailAddresses).map((v: string) => ({ id: generateId(), value: v, isSaved: true }))
  );
  
  const [whatsappEnabled, setWhatsappEnabled] = useState(savedSettings?.whatsappEnabled ?? defaultSettings.whatsappEnabled);
  const [whatsapps, setWhatsapps] = useState<ContactItem[]>(() => {
    const list = savedSettings?.whatsappNumbers ?? defaultSettings.whatsappNumbers;
    if (list.length === 0) return [{ id: generateId(), value: '', isSaved: false }];
    return list.map((v: string) => ({ id: generateId(), value: v, isSaved: true }));
  });

  const [smsEnabled, setSmsEnabled] = useState(savedSettings?.smsEnabled ?? defaultSettings.smsEnabled);
  const [smsList, setSmsList] = useState<ContactItem[]>(() => {
    const list = savedSettings?.smsNumbers ?? defaultSettings.smsNumbers;
    if (list.length === 0) return [{ id: generateId(), value: '', isSaved: false }];
    return list.map((v: string) => ({ id: generateId(), value: v, isSaved: true }));
  });
  
  const [responseTemplate, setResponseTemplate] = useState(savedSettings?.responseTemplate ?? defaultSettings.responseTemplate);
  const [expectedResponseTime, setExpectedResponseTime] = useState(savedSettings?.expectedResponseTime ?? defaultSettings.expectedResponseTime);
  
  const [savingStates, setSavingStates] = useState<Record<string, boolean>>({});

  // Tooltip states
  const [showEmailTooltip, setShowEmailTooltip] = useState(false);
  const [showWhatsappTooltip, setShowWhatsappTooltip] = useState(false);
  const [showSmsTooltip, setShowSmsTooltip] = useState(false);
  const [showHeaderTooltip, setShowHeaderTooltip] = useState(false);
  const [isGeneratingTemplate, setIsGeneratingTemplate] = useState(false);

  // ── Notification Message & Preview ────────────────────────────────────────
  const [confirmationStyle, setConfirmationStyle] = useState(savedSettings?.confirmationStyle ?? defaultSettings.confirmationStyle);
  const [styleDropdownOpen, setStyleDropdownOpen] = useState(false);
  const styleDropdownRef = useRef<HTMLDivElement>(null);
  const [staffNotifyMessage, setStaffNotifyMessage] = useState(savedSettings?.staffNotifyMessage ?? defaultSettings.staffNotifyMessage);
  const [isGeneratingStaffMsg, setIsGeneratingStaffMsg] = useState(false);
  const [previewFieldsData, setPreviewFieldsData] = useState(savedSettings?.previewFieldsData ?? defaultSettings.previewFieldsData);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [isAddingCustom, setIsAddingCustom] = useState(false);

  // AI-generated response template variations
  const templateVariations = [
    "Thank you for your interest! I'd love to help you book a table for {party_size} on {date} at {time}. Let me confirm availability with our team — you'll receive a confirmation within {response_time}.",
    "Great choice! I'm checking availability for {party_size} guests on {date} at {time}. Our team will review and get back to you within {response_time}. We look forward to hosting you!",
    "I've noted your booking request for {party_size} people on {date} at {time}. Our staff will review this shortly and confirm within {response_time}. Thank you for your patience!",
    "Thanks for reaching out! A reservation for {party_size} on {date} at {time} sounds wonderful. I'll pass this to our team right away — expect a confirmation within {response_time}.",
    "Perfect! I'll submit your reservation request for {party_size} guests on {date} at {time} to our team. You should hear back within {response_time}. Is there anything else you'd like to add?",
    "Lovely! Let me arrange a table for {party_size} on {date} at {time}. Our team will confirm your booking within {response_time}. Feel free to let me know if you have any special requests!",
    "I'd be happy to help! Your request for {party_size} guests on {date} at {time} has been noted. A team member will confirm within {response_time}. Thank you for choosing us!",
    "Wonderful! I'm processing your booking for {party_size} on {date} at {time}. Hang tight — our staff will verify availability and confirm within {response_time}.",
  ];

  const handleGenerateTemplate = () => {
    if (isGeneratingTemplate) return;
    setIsGeneratingTemplate(true);
    toast.info('Generating AI response template...');

    // Simulate AI generation with a delay
    setTimeout(() => {
      // Pick a random template that's different from the current one
      let newTemplate = responseTemplate;
      let attempts = 0;
      while (newTemplate === responseTemplate && attempts < 10) {
        newTemplate = templateVariations[Math.floor(Math.random() * templateVariations.length)];
        attempts++;
      }
      setResponseTemplate(newTemplate);
      setIsGeneratingTemplate(false);
      toast.success('AI response template generated!');
    }, 1500);
  };

  // ── Generate staff notification message ──────────────────────────────────
  const handleGenerateStaffMsg = () => {
    if (isGeneratingStaffMsg) return;
    setIsGeneratingStaffMsg(true);
    toast.info('Generating AI staff notification...');
    setTimeout(() => {
      let msg = staffNotifyMessage;
      let attempts = 0;
      while (msg === staffNotifyMessage && attempts < 10) {
        msg = STAFF_MSG_VARIATIONS[Math.floor(Math.random() * STAFF_MSG_VARIATIONS.length)];
        attempts++;
      }
      setStaffNotifyMessage(msg);
      setIsGeneratingStaffMsg(false);
      toast.success('Staff notification generated!');
    }, 1400);
  };

  const togglePreviewField = (id: string) => {
    setPreviewFieldsData(prev => {
      // If it's a custom field and it's currently active (meaning we're toggling it off), remove it entirely
      if (id.startsWith('custom_')) {
        const field = prev.find(f => f.id === id);
        if (field && field.isActive) {
          return prev.filter(f => f.id !== id);
        }
      }
      return prev.map(f => f.id === id ? { ...f, isActive: !f.isActive } : f);
    });
  };

  const handleAddCustomField = () => {
    if (!newFieldLabel.trim()) {
      setIsAddingCustom(false);
      return;
    }
    const label = newFieldLabel.trim();
    const id = 'custom_' + Date.now().toString();
    
    // Add the new field immediately as generating
    setPreviewFieldsData(prev => [...prev, {
      id,
      label,
      value: '',
      isActive: true,
      isGenerating: true
    }]);
    
    setNewFieldLabel('');
    setIsAddingCustom(false);

    // Simulate AI generation
    setTimeout(() => {
      let aiValue = 'Sample value';
      const l = label.toLowerCase();
      if (l.includes('haircut') || l.includes('cut')) aiValue = 'Long hair'; // Starts with Long hair so user can correct
      else if (l.includes('car') || l.includes('vehicle')) aiValue = 'Tesla Model 3';
      else if (l.includes('color')) aiValue = 'Midnight Black';
      else if (l.includes('staff') || l.includes('barber') || l.includes('stylist')) aiValue = 'Alex M.';
      else aiValue = `Sample ${label}`;

      setPreviewFieldsData(prev => prev.map(f => f.id === id ? { ...f, value: aiValue, isGenerating: false } : f));
    }, 1200);
  };

  const handleCorrectAI = (id: string, instruction: string) => {
    setPreviewFieldsData(prev => prev.map(f => f.id === id ? { ...f, isGenerating: true } : f));
    
    setTimeout(() => {
      setPreviewFieldsData(prev => prev.map(f => {
        if (f.id === id) {
          let newValue = f.value;
          const i = instruction.toLowerCase();
          if (i.includes('style') || i.includes('fade')) newValue = 'Skin Fade';
          else if (i.includes('long') || i.includes('length')) newValue = 'Shoulder length';
          else if (i.includes('name')) newValue = 'John Doe';
          else newValue = 'Adjusted: ' + f.label;
          return { ...f, value: newValue, isGenerating: false };
        }
        return f;
      }));
    }, 1500);
  };

  // Update email when userEmail prop changes
  useEffect(() => {
    if (userEmail && !savedSettings?.emailAddresses) {
      if (emails.length === 0) {
        setEmails([{ id: generateId(), value: userEmail, isSaved: true }]);
      }
    }
  }, [userEmail, savedSettings, emails.length]);

  // Mock pending bookings
  const [pendingBookings] = useState<PendingBooking[]>([]);

  // Check if other booking methods are active
  const hasOtherBookingMethodsActive = () => {
    // TODO: Check if Aces AI Booking System is enabled
    const acesAIEnabled = false; // Get from localStorage or App state
    
    // TODO: Check if External Sync is connected
    const externalSyncConnected = false; // Get from localStorage
    
    return acesAIEnabled || externalSyncConnected;
  };

  // Check if we can disable email (need at least one other notification method)
  const canDisableEmail = () => {
    return whatsappEnabled || smsEnabled;
  };

  const handleEmailToggle = (checked: boolean) => {
    if (!checked && !canDisableEmail()) {
      setShowEmailTooltip(true);
      setTimeout(() => setShowEmailTooltip(false), 3000);
      toast.error("Enable WhatsApp or SMS notifications first");
      return;
    }
    setEmailEnabled(checked);
  };

  const canDisableWhatsapp = () => {
    return emailEnabled || smsEnabled;
  };

  const handleWhatsappToggle = (checked: boolean) => {
    if (!checked && !canDisableWhatsapp()) {
      setShowWhatsappTooltip(true);
      setTimeout(() => setShowWhatsappTooltip(false), 3000);
      toast.error("Enable Email or SMS notifications first");
      return;
    }
    setWhatsappEnabled(checked);
  };

  const canDisableSms = () => {
    return emailEnabled || whatsappEnabled;
  };

  const handleSmsToggle = (checked: boolean) => {
    if (!checked && !canDisableSms()) {
      setShowSmsTooltip(true);
      setTimeout(() => setShowSmsTooltip(false), 3000);
      toast.error("Enable Email or WhatsApp notifications first");
      return;
    }
    setSmsEnabled(checked);
  };

  const handleIndividualSave = async (type: string, id: string, listType: 'email' | 'wa' | 'sms') => {
    setSavingStates(prev => ({ ...prev, [id]: true }));
    // Simulate a quick network request to save
    await new Promise(resolve => setTimeout(resolve, 600));

    let newEmails = emails;
    let newWa = whatsapps;
    let newSms = smsList;

    if (listType === 'email') {
      newEmails = emails.map(item => item.id === id ? { ...item, isSaved: true } : item);
      setEmails(newEmails);
    } else if (listType === 'wa') {
      newWa = whatsapps.map(item => item.id === id ? { ...item, isSaved: true } : item);
      setWhatsapps(newWa);
    } else {
      newSms = smsList.map(item => item.id === id ? { ...item, isSaved: true } : item);
      setSmsList(newSms);
    }

    // Auto-save the main settings when an individual item is saved
    const settings = {
      enabled,
      confirmationMode,
      hybridThreshold,
      emailEnabled,
      emailAddresses: newEmails.map(e => e.value),
      whatsappEnabled,
      whatsappNumbers: newWa.map(w => w.value),
      smsEnabled,
      smsNumbers: newSms.map(s => s.value),
      responseTemplate,
      expectedResponseTime,
    };
    
    localStorage.setItem('manualConfirmationSettings', JSON.stringify(settings));
    toast.success(`${type} saved successfully`);
    setSavingStates(prev => ({ ...prev, [id]: false }));
  };

  const handleSave = () => {
    const settings = {
      enabled,
      confirmationMode,
      hybridThreshold,
      emailEnabled,
      emailAddresses: emails.map(e => e.value),
      whatsappEnabled,
      whatsappNumbers: whatsapps.map(w => w.value),
      smsEnabled,
      smsNumbers: smsList.map(s => s.value),
      responseTemplate,
      expectedResponseTime,
      confirmationStyle,
      staffNotifyMessage,
      previewFieldsData,
    };
    
    localStorage.setItem('manualConfirmationSettings', JSON.stringify(settings));
    
    // Mark all as saved
    setEmails(emails.map(e => ({ ...e, isSaved: true })));
    setWhatsapps(whatsapps.map(w => ({ ...w, isSaved: true })));
    setSmsList(smsList.map(s => ({ ...s, isSaved: true })));
    
    toast.success('Approval settings saved!');
    setTimeout(() => {
      onBack();
    }, 500);
  };

  const handleConfirmBooking = (bookingId: string) => {
    toast.success('Booking confirmed!');
    // TODO: Handle confirmation logic
  };

  const handleDeclineBooking = (bookingId: string) => {
    toast.success('Booking declined');
    // TODO: Handle decline logic
  };

  // Close style dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (styleDropdownRef.current && !styleDropdownRef.current.contains(e.target as Node)) {
        setStyleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Notification preview renderer ─────────────────────────────────────────
  const renderNotificationPreview = () => {
    const phoneBg  = 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]';
    const bubbleBg = 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700/80';

    const EV = ({ field }: { field: typeof previewFieldsData[0] }) => {
      const [showPrompt, setShowPrompt] = useState(false);
      const [prompt, setPrompt] = useState('');
      const isCustom = field.id.startsWith('custom_');

      if (field.isGenerating) {
        return <span className="flex items-center gap-1 text-blue-500"><Loader2 className="w-3 h-3 animate-spin" /> <span className="text-[11px] italic">thinking...</span></span>;
      }

      if (isCustom) {
        if (showPrompt) {
          return (
            <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
              <textarea
                autoFocus
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey && prompt.trim()) {
                    e.preventDefault();
                    handleCorrectAI(field.id, prompt.trim());
                    setShowPrompt(false);
                    setPrompt('');
                  } else if (e.key === 'Escape') {
                    setShowPrompt(false);
                  }
                }}
                placeholder="Describe what information you want the AI to actually get..."
                rows={2}
                className="text-[10px] px-1.5 py-1 rounded border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/30 text-gray-800 dark:text-gray-200 outline-none w-full resize-none leading-tight"
              />
              <div className="flex gap-1">
                <button 
                  onClick={() => {
                    if (prompt.trim()) {
                      handleCorrectAI(field.id, prompt.trim());
                    }
                    setShowPrompt(false);
                    setPrompt('');
                  }} 
                  className="text-[9px] bg-blue-500 hover:bg-blue-600 text-white px-1.5 py-0.5 rounded transition-colors"
                >
                  Update
                </button>
                <button 
                  onClick={() => setShowPrompt(false)} 
                  className="text-[9px] text-gray-500 px-1.5 py-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          );
        }

        return (
          <div className="group flex items-start gap-1.5 mt-[1px]">
            <span className="font-medium text-gray-900 dark:text-gray-100 break-words">{field.value}</span>
            <button 
              onClick={() => setShowPrompt(true)}
              className="opacity-30 group-hover:opacity-100 transition-opacity p-0.5 text-gray-400 hover:text-blue-500 rounded"
              title="Correct AI"
            >
              <SquarePen className="w-3 h-3" />
            </button>
          </div>
        );
      } else {
        if (editingField === field.id) {
          return (
            <input
              autoFocus
              value={field.value}
              onChange={e => setPreviewFieldsData(prev => prev.map(f => f.id === field.id ? { ...f, value: e.target.value } : f))}
              onBlur={() => setEditingField(null)}
              onKeyDown={e => e.key === 'Enter' && setEditingField(null)}
              className="font-medium text-gray-900 dark:text-gray-100 border-b border-blue-400 outline-none bg-transparent"
              style={{ width: Math.max(field.value.length * 7.5, 40) }}
            />
          );
        }
        return (
          <span
            className="font-medium text-gray-900 dark:text-gray-100 cursor-pointer border-b border-transparent hover:border-blue-400 transition-colors"
            onClick={() => setEditingField(field.id)}
            title="Click to edit"
          >
            {field.value}
          </span>
        );
      }
    };

    const Fields = () => (
      <div className="space-y-1 text-[12px] pt-1">
        {previewFieldsData.filter(f => f.isActive).map(f => (
          <div key={f.id} className="flex items-start gap-2 min-h-[20px] pt-0.5">
            <span className="text-[11px] text-gray-500 dark:text-gray-400 w-14 flex-shrink-0">{f.label}</span>
            <EV field={f} />
          </div>
        ))}
      </div>
    );

    const MessageText = () => (
      <div className="text-[13px] text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed pb-1.5 border-b border-gray-100 dark:border-gray-700/50 mb-1.5">
        {staffNotifyMessage || <span className="text-gray-400 italic">Your notification message will appear here...</span>}
      </div>
    );

    const AISender = () => (
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
          <Brain className="w-3.5 h-3.5" />
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold text-gray-900 dark:text-gray-100 leading-none">Aces Bot</span>
          <span className="text-[9px] font-medium text-gray-500">Just now</span>
        </div>
      </div>
    );

    switch (confirmationStyle) {
      case 'yes-no-buttons':
        return (
          <div className={`${phoneBg} rounded-[20px] p-3.5`}>
            <AISender />
            <div className={`rounded-2xl rounded-tl-sm border p-3 ${bubbleBg} shadow-sm space-y-1 mb-2.5`}>
              <MessageText />
              <Fields />
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2 rounded-xl bg-[#34C759] hover:bg-[#30b753] text-white text-[13px] font-semibold shadow-sm shadow-green-200 dark:shadow-none transition-colors">Approve</button>
              <button className="flex-1 py-2 rounded-xl bg-[#FF3B30] hover:bg-[#eb362c] text-white text-[13px] font-semibold shadow-sm shadow-red-200 dark:shadow-none transition-colors">Decline</button>
            </div>
          </div>
        );

      case 'quick-reply':
        return (
          <div className={`${phoneBg} rounded-[20px] p-3.5`}>
            <AISender />
            <div className={`rounded-2xl rounded-tl-sm border p-3 ${bubbleBg} shadow-sm space-y-1 mb-2.5`}>
              <MessageText />
              <Fields />
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button className="px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-[11px] font-medium bg-white dark:bg-gray-800 hover:bg-gray-50 transition-colors shadow-sm">✅ Confirm</button>
              <button className="px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-[11px] font-medium bg-white dark:bg-gray-800 hover:bg-gray-50 transition-colors shadow-sm">🔄 Reschedule</button>
              <button className="px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-[11px] font-medium bg-white dark:bg-gray-800 hover:bg-gray-50 transition-colors shadow-sm">❌ Cancel</button>
            </div>
          </div>
        );

      case 'text-response':
        return (
          <div className={`${phoneBg} rounded-[20px] p-3.5`}>
            <AISender />
            <div className={`rounded-2xl rounded-tl-sm border p-3 ${bubbleBg} shadow-sm space-y-1 mb-2.5`}>
              <MessageText />
              <Fields />
              <p className="text-[10px] text-gray-400 mt-2">Reply <strong>"yes"</strong> to approve or <strong>"no"</strong> to decline</p>
            </div>
            <div className={`flex items-center gap-2 border rounded-full px-3 py-1.5 ${bubbleBg} shadow-sm`}>
              <span className="text-[12px] text-gray-400 flex-1">Type a reply...</span>
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3 ml-0.5"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
              </div>
            </div>
          </div>
        );

      case 'one-click-link':
        return (
          <div className={`${phoneBg} rounded-[20px] p-3.5`}>
            <AISender />
            <div className={`rounded-2xl rounded-tl-sm border p-3 ${bubbleBg} shadow-sm space-y-1`}>
              <MessageText />
              <Fields />
              <div className="flex flex-col gap-1 pt-2 mt-1">
                <span className="text-blue-500 dark:text-blue-400 text-[12px] font-medium cursor-pointer hover:underline">Click here to Approve →</span>
                <span className="text-red-500 dark:text-red-400 text-[12px] font-medium cursor-pointer hover:underline">Click here to Decline →</span>
              </div>
            </div>
          </div>
        );

      case 'interactive-card':
        return (
          <div className={`${phoneBg} rounded-[20px] p-3.5`}>
            <AISender />
            <div className={`rounded-2xl border ${bubbleBg} shadow-sm overflow-hidden`}>
              <div className="bg-gray-100 dark:bg-gray-800/80 px-3 py-2 border-b border-gray-200 dark:border-gray-700/80">
                <p className="text-gray-900 dark:text-gray-100 font-semibold text-[12px]">Booking Request</p>
              </div>
              <div className="p-3">
                <MessageText />
                <Fields />
              </div>
              <div className="border-t border-gray-100 dark:border-gray-700 flex bg-gray-50/50 dark:bg-gray-800/30">
                <button className="flex-1 py-2 text-[#34C759] text-[12px] font-semibold border-r border-gray-100 dark:border-gray-700 hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors">Approve</button>
                <button className="flex-1 py-2 text-[#FF3B30] text-[12px] font-semibold hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">Decline</button>
              </div>
            </div>
          </div>
        );

      case 'tap-confirm':
        return (
          <div className={`${phoneBg} rounded-[20px] p-3.5`}>
            <AISender />
            <div className={`rounded-2xl rounded-tl-sm border p-3 ${bubbleBg} shadow-sm space-y-1 mb-2.5`}>
              <MessageText />
              <Fields />
            </div>
            <button className="w-full py-2.5 rounded-xl bg-blue-500 text-white text-[13px] font-semibold shadow-sm shadow-blue-200 dark:shadow-none hover:bg-blue-600 transition-all">
              Confirm Booking
            </button>
            <button className="w-full py-1.5 mt-1 text-gray-500 text-[11px] font-medium text-center hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              Decline instead
            </button>
          </div>
        );

      case 'poll-vote':
        return (
          <div className={`${phoneBg} rounded-[20px] p-3.5`}>
            <AISender />
            <div className={`rounded-2xl border ${bubbleBg} shadow-sm overflow-hidden`}>
              <div className="p-3 space-y-1">
                <MessageText />
                <Fields />
              </div>
              <div className="border-t border-gray-100 dark:border-gray-700 p-3 bg-gray-50/50 dark:bg-gray-800/30 space-y-2">
                {[{ label: 'Approve', color: 'bg-[#34C759]' }, { label: 'Decline', color: 'bg-[#FF3B30]' }].map(opt => (
                  <div key={opt.label}>
                    <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
                      <span className="text-gray-700 dark:text-gray-200">{opt.label}</span>
                      <span className="text-gray-400">0 votes</span>
                    </div>
                    <div className="h-6 rounded-md bg-gray-200/50 dark:bg-gray-700/50 overflow-hidden cursor-pointer">
                      <div className={`h-full rounded-md transition-all ${opt.color} opacity-20`} style={{width: '0%'}} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'emoji-react':
        return (
          <div className={`${phoneBg} rounded-[20px] p-3.5`}>
            <AISender />
            <div className={`rounded-2xl rounded-tl-sm border p-3 ${bubbleBg} shadow-sm space-y-1 mb-2.5`}>
              <MessageText />
              <Fields />
            </div>
            <div className={`flex gap-3 justify-center border rounded-xl py-2 shadow-sm bg-white dark:bg-gray-800`}>
              <button className="flex items-center gap-1.5 px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <span className="text-lg">👍</span>
              </button>
              <div className="w-px bg-gray-200 dark:bg-gray-700 my-1" />
              <button className="flex items-center gap-1.5 px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <span className="text-lg">👎</span>
              </button>
            </div>
          </div>
        );

      default: return null;
    }
  };

  const canToggleOff = hasOtherBookingMethodsActive();
  const toggleTitle = !canToggleOff 
    ? "To turn off Require Booking Approval, activate either Sync External Platform or Aces AI Booking System"
    : enabled ? "Turn off Require Booking Approval" : "Turn on Require Booking Approval";

  return (
    <div className="w-full bg-white dark:bg-gray-800">
      {/* Back button header - clean, no toggle */}
      <div 
        onClick={onBack}
        style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
        className="flex items-center px-6 mx-4 mt-3 mb-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg"
      >
        <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-2" />
        <span className="font-medium text-gray-900 dark:text-gray-100">Require Booking Approval</span>
      </div>

      {/* Content area */}
      <div className="px-4 pt-4 pb-6 space-y-4">
        
        {/* ── Enable Manual Confirmation Card ── */}
        <div 
          className={`relative rounded-2xl border p-4 transition-all duration-300 ${
            enabled 
              ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 shadow-md shadow-blue-100/50 dark:shadow-blue-900/20' 
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-4">
            {/* Left: Icon + Text */}
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                enabled 
                  ? 'bg-blue-100 dark:bg-blue-900/50' 
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                <ShieldCheck className={`w-5 h-5 transition-colors duration-300 ${
                  enabled 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-400 dark:text-gray-500'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={`text-sm font-medium transition-colors duration-300 ${
                    enabled 
                      ? 'text-gray-900 dark:text-gray-100' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    Require Booking Approval
                  </span>
                  {/* Tooltip icon */}
                  <div 
                    className="relative group"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Info className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-help transition-colors" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                      Bookings will not be automatically confirmed.<br />Staff approval is required.
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
                    </div>
                  </div>
                </div>
                <p className={`text-xs mt-0.5 transition-colors duration-300 ${
                  enabled 
                    ? 'text-gray-600 dark:text-gray-400' 
                    : 'text-gray-400 dark:text-gray-500'
                }`}>
                  When enabled, all booking requests require staff approval before confirmation.
                </p>
              </div>
            </div>

            {/* Right: Toggle + Status */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <span className={`text-xs font-medium transition-colors duration-300 ${
                enabled 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-400 dark:text-gray-500'
              }`}>
                {enabled ? 'Enabled' : 'Disabled'}
              </span>
              <div 
                className="relative"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onMouseLeave={() => setShowHeaderTooltip(false)}
              >
                <Switch 
                  checked={enabled}
                  onCheckedChange={(checked) => setEnabled(checked)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Rest of content fades when disabled */}
        <div style={{ opacity: enabled ? 1 : 0.5, pointerEvents: enabled ? 'auto' : 'none' }} className="space-y-4 transition-opacity duration-300">
        
        {/* Confirmation Mode Section - REMOVED */}

        {/* Notification Settings - REORDERED: Email, WhatsApp, SMS */}
        <div className="space-y-3 pt-2">
          <div className="px-1">
            <h3 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100 tracking-tight">Notification Channels</h3>
            <p className="text-[13px] text-gray-500 mt-0.5">Where should staff receive these requests?</p>
          </div>
          
          {/* Grid Layout: Email | WhatsApp | SMS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            
            {/* Email */}
            <div className="p-4 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Email</Label>
                </div>
                <div 
                  className="relative"
                  onMouseEnter={() => {
                    if (!canDisableEmail()) {
                      setShowEmailTooltip(true);
                    }
                  }}
                  onMouseLeave={() => setShowEmailTooltip(false)}
                >
                  <Switch 
                    checked={emailEnabled}
                    onCheckedChange={handleEmailToggle}
                    disabled={!canDisableEmail() && emailEnabled}
                  />
                  {showEmailTooltip && !canDisableEmail() && (
                    <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg whitespace-nowrap z-50 shadow-lg">
                      Enable WhatsApp or SMS to disable email
                    </div>
                  )}
                </div>
              </div>
              <div className={`space-y-2 transition-opacity duration-300 ${emailEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                {emails.map((item) => (
                  <div key={item.id} className="flex items-center gap-1.5">
                    <div className="relative flex-1">
                      <Input 
                        value={item.value}
                        onChange={(e) => {
                          setEmails(emails.map(emp => emp.id === item.id ? { ...emp, value: e.target.value, isSaved: false } : emp));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (item.value.trim() && !item.isSaved) handleIndividualSave('Email', item.id, 'email');
                          }
                        }}
                        placeholder="Enter email address"
                        className="w-full text-sm bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 pr-[4rem]"
                      />
                      {!item.isSaved && (
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleIndividualSave('Email', item.id, 'email')}
                          disabled={savingStates[item.id] || !item.value.trim()}
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-6 px-3 text-[11px] font-medium rounded bg-blue-600 text-white hover:bg-blue-700 transition-all disabled:opacity-50"
                        >
                          {savingStates[item.id] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save"}
                        </Button>
                      )}
                    </div>
                    {emails.length > 1 && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setEmails(emails.filter(e => e.id !== item.id))}
                        className="shrink-0 w-8 h-8 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {emails.length === 0 && (
                  <Button 
                    size="sm"
                    onClick={() => setEmails([{ id: generateId(), value: '', isSaved: false }])}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Email
                  </Button>
                )}
                {emails.length > 0 && (
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={() => setEmails([...emails, { id: generateId(), value: '', isSaved: false }])}
                    className="w-full mt-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Email
                  </Button>
                )}
              </div>
            </div>

            {/* WhatsApp */}
            <div className="p-4 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <WhatsAppIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">WhatsApp</Label>
                </div>
                <div 
                  className="relative"
                  onMouseEnter={() => {
                    if (!canDisableWhatsapp()) {
                      setShowWhatsappTooltip(true);
                    }
                  }}
                  onMouseLeave={() => setShowWhatsappTooltip(false)}
                >
                  <Switch 
                    checked={whatsappEnabled}
                    onCheckedChange={handleWhatsappToggle}
                    disabled={!canDisableWhatsapp() && whatsappEnabled}
                  />
                  {showWhatsappTooltip && !canDisableWhatsapp() && (
                    <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg whitespace-nowrap z-50 shadow-lg">
                      Enable Email or SMS to disable WhatsApp
                    </div>
                  )}
                </div>
              </div>
              <div className={`space-y-2 transition-opacity duration-300 ${whatsappEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                {whatsapps.map((item) => (
                  <div key={item.id} className="flex items-center gap-1.5">
                    <div className="relative flex-1">
                      <Input 
                        value={item.value}
                        onChange={(e) => {
                          setWhatsapps(whatsapps.map(wa => wa.id === item.id ? { ...wa, value: e.target.value, isSaved: false } : wa));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (item.value.trim() && !item.isSaved) handleIndividualSave('WhatsApp number', item.id, 'wa');
                          }
                        }}
                        placeholder="Enter phone number"
                        className="w-full text-sm bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 pr-[4rem]"
                      />
                      {!item.isSaved && (
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleIndividualSave('WhatsApp number', item.id, 'wa')}
                          disabled={savingStates[item.id] || !item.value.trim()}
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-6 px-3 text-[11px] font-medium rounded bg-blue-600 text-white hover:bg-blue-700 transition-all disabled:opacity-50"
                        >
                          {savingStates[item.id] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save"}
                        </Button>
                      )}
                    </div>
                    {whatsapps.length > 1 && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setWhatsapps(whatsapps.filter(w => w.id !== item.id))}
                        className="shrink-0 w-8 h-8 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {whatsapps.length === 0 && (
                  <Button 
                    size="sm"
                    onClick={() => setWhatsapps([{ id: generateId(), value: '', isSaved: false }])}
                    className="w-full bg-green-600 hover:bg-green-700 text-white mt-2"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Number
                  </Button>
                )}
                {whatsapps.length > 0 && (
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={() => setWhatsapps([...whatsapps, { id: generateId(), value: '', isSaved: false }])}
                    className="w-full mt-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Number
                  </Button>
                )}
              </div>
            </div>

            {/* SMS */}
            <div className="p-4 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <MessageSquareText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">SMS</Label>
                </div>
                <div 
                  className="relative"
                  onMouseEnter={() => {
                    if (!canDisableSms()) {
                      setShowSmsTooltip(true);
                    }
                  }}
                  onMouseLeave={() => setShowSmsTooltip(false)}
                >
                  <Switch 
                    checked={smsEnabled}
                    onCheckedChange={handleSmsToggle}
                    disabled={!canDisableSms() && smsEnabled}
                  />
                  {showSmsTooltip && !canDisableSms() && (
                    <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg whitespace-nowrap z-50 shadow-lg">
                      Enable Email or WhatsApp to disable SMS
                    </div>
                  )}
                </div>
              </div>
              <div className={`space-y-2 transition-opacity duration-300 ${smsEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                {smsList.map((item) => (
                  <div key={item.id} className="flex items-center gap-1.5">
                    <div className="relative flex-1">
                      <Input 
                        value={item.value}
                        onChange={(e) => {
                          setSmsList(smsList.map(sms => sms.id === item.id ? { ...sms, value: e.target.value, isSaved: false } : sms));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (item.value.trim() && !item.isSaved) handleIndividualSave('SMS number', item.id, 'sms');
                          }
                        }}
                        placeholder="Enter phone number"
                        className="w-full text-sm bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 pr-[4rem]"
                      />
                      {!item.isSaved && (
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleIndividualSave('SMS number', item.id, 'sms')}
                          disabled={savingStates[item.id] || !item.value.trim()}
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-6 px-3 text-[11px] font-medium rounded bg-blue-600 text-white hover:bg-blue-700 transition-all disabled:opacity-50"
                        >
                          {savingStates[item.id] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save"}
                        </Button>
                      )}
                    </div>
                    {smsList.length > 1 && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setSmsList(smsList.filter(s => s.id !== item.id))}
                        className="shrink-0 w-8 h-8 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {smsList.length === 0 && (
                  <Button 
                    size="sm"
                    onClick={() => setSmsList([{ id: generateId(), value: '', isSaved: false }])}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-2"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Number
                  </Button>
                )}
                {smsList.length > 0 && (
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={() => setSmsList([...smsList, { id: generateId(), value: '', isSaved: false }])}
                    className="w-full mt-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Number
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Notification Message & Preview ────────────────────────────── */}
        <div className="mt-4 space-y-6 pt-4 border-t border-gray-100 dark:border-gray-800/60">
          
          {/* AI Message Generation Section */}
          <div className="space-y-2">
            <Label htmlFor="staff-notification" className="text-gray-900 dark:text-gray-100 font-semibold text-[15px]">Staff Notification Message</Label>
            <p className="text-[13px] text-gray-500">Enter the message staff will receive when a new booking request arrives.</p>
            <div className="pt-1">
              <textarea
                id="staff-notification"
                rows={4}
                placeholder="Write the message the AI sends to staff when a new booking comes in..."
                value={staffNotifyMessage}
                onChange={(e) => setStaffNotifyMessage(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm leading-relaxed"
              />
              
              <div className="flex items-center justify-between mt-2">
                <div 
                  onClick={() => {
                    if (isGeneratingStaffMsg) return;
                    handleGenerateStaffMsg();
                  }}
                  className={`flex items-center gap-1.5 text-[13px] font-medium ${isGeneratingStaffMsg ? 'text-blue-400 dark:text-blue-500 cursor-wait' : 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer'} transition-colors`}
                >
                  {isGeneratingStaffMsg ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Brain className="w-3.5 h-3.5" />}
                  <span>Generate using AI</span>
                </div>
              </div>
            </div>
          </div>

          {/* Message Preview Section */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <Label className="text-gray-900 dark:text-gray-100 font-semibold text-[15px]">Live Preview</Label>
                <p className="text-[13px] text-gray-500">Tap values to edit or select a different notification format.</p>
              </div>

              {/* Format Dropdown inside Preview section */}
              <div className="relative" ref={styleDropdownRef}>
                <button
                  onClick={() => setStyleDropdownOpen(v => !v)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[13px] font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-all"
                >
                  {(() => {
                    const activeStyle = CONFIRMATION_STYLES.find(s => s.id === confirmationStyle);
                    const Icon = activeStyle?.icon || CheckCircle;
                    return <Icon className={`w-4 h-4 ${activeStyle?.iconColor || 'text-gray-500'}`} />;
                  })()}
                  <span>{CONFIRMATION_STYLES.find(s => s.id === confirmationStyle)?.label}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${styleDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {styleDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl shadow-black/10 dark:shadow-black/40 z-50 overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                    {CONFIRMATION_STYLES.map(style => {
                      const Icon = style.icon;
                      return (
                        <button
                          key={style.id}
                          onClick={() => { setConfirmationStyle(style.id); setStyleDropdownOpen(false); }}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${confirmationStyle === style.id ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-50 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/50 shadow-sm`}>
                            <Icon className={`w-4 h-4 ${style.iconColor}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-[13px] font-medium ${confirmationStyle === style.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'}`}>{style.label}</p>
                            <p className="text-[11px] text-gray-500 mt-0.5 leading-snug truncate">{style.desc}</p>
                          </div>
                          {confirmationStyle === style.id && (
                            <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Field toggle chips */}
            <div className="flex flex-wrap items-center gap-1.5 mb-4">
              {previewFieldsData.map(f => {
                const isActive = f.isActive;
                return (
                  <button
                    key={f.id}
                    onClick={() => togglePreviewField(f.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
                      isActive
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    {isActive ? (
                      f.id.startsWith('custom_') ? <X className="w-3 h-3 text-blue-500" /> : <CheckCircle className="w-3 h-3 text-blue-500" />
                    ) : (
                      <Plus className="w-3 h-3 text-gray-400" />
                    )}
                    {f.label}
                  </button>
                );
              })}

              {isAddingCustom ? (
                <input
                  autoFocus
                  type="text"
                  value={newFieldLabel}
                  onChange={e => setNewFieldLabel(e.target.value)}
                  placeholder="Field name..."
                  className="px-2.5 py-1 rounded-full border border-blue-300 dark:border-blue-700 bg-white dark:bg-gray-800 text-[11px] text-gray-900 dark:text-gray-100 outline-none w-24 focus:ring-1 focus:ring-blue-500 shadow-sm"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleAddCustomField();
                    } else if (e.key === 'Escape') {
                      setIsAddingCustom(false);
                      setNewFieldLabel('');
                    }
                  }}
                  onBlur={() => {
                    if (newFieldLabel.trim()) {
                      handleAddCustomField();
                    } else {
                      setIsAddingCustom(false);
                    }
                  }}
                />
              ) : (
                <button
                  onClick={() => setIsAddingCustom(true)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border border-dashed border-gray-300 dark:border-gray-600 bg-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                >
                  <Plus className="w-3 h-3" /> Custom
                </button>
              )}
            </div>

            {/* Actual Preview Canvas */}
            <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/40 dark:to-gray-900/60 border border-gray-200 dark:border-gray-700/80 rounded-2xl shadow-inner overflow-hidden flex justify-center items-center relative">
              <div className="w-full max-w-[320px] relative z-10 flex flex-col scale-[0.95]">
                {renderNotificationPreview()}
              </div>
            </div>
          </div>
        </div>
        {/* ── End Notification Message ───────────────────────────────────── */}

        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handleSave}
        >
          Save Settings
        </Button>
        </div>
      </div>
    </div>
  );
}