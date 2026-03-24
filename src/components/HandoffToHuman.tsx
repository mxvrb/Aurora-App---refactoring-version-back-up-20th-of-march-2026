import React, { useState, useEffect } from 'react';
import { ChevronLeft, Info, Mail, MessageSquareText, Plus, ShieldAlert, ShieldCheck, X, AlertCircle, Sparkles, Loader2, Brain } from 'lucide-react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from "sonner";
import { projectId, publicAnonKey } from '../utils/supabase/info';

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

interface HandoffToHumanProps {
  onBack: () => void;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  onSave: () => void;
  userEmail?: string;
}

export function HandoffToHuman({ onBack, enabled, setEnabled, onSave, userEmail = 'user@example.com' }: HandoffToHumanProps) {
  const [savedSettings] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem('handoffSettings');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const defaultSettings = {
    emailEnabled: true,
    emailAddresses: [userEmail],
    whatsappEnabled: false,
    whatsappNumbers: [],
    smsEnabled: false,
    smsNumbers: [],
    notificationMessage: "",
  };

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
  
  const [notificationMessage, setNotificationMessage] = useState(() => {
    const savedMsg = savedSettings?.notificationMessage ?? defaultSettings.notificationMessage;
    // If the saved message matches the old hardcoded alert or is a known AI generated placeholder the user wants cleared, clear it out.
    if (savedMsg.includes("Alert: A customer requires human assistance") || savedMsg.includes("Urgent: A customer has requested human support")) {
      return "";
    }
    return savedMsg;
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [savingStates, setSavingStates] = useState<Record<string, boolean>>({});

  const [showEmailTooltip, setShowEmailTooltip] = useState(false);
  const [showWhatsappTooltip, setShowWhatsappTooltip] = useState(false);
  const [showSmsTooltip, setShowSmsTooltip] = useState(false);
  const [showHeaderTooltip, setShowHeaderTooltip] = useState(false);

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

  const saveToLocal = (
    currentEmails = emails,
    currentWa = whatsapps,
    currentSms = smsList
  ) => {
    const settings = {
      emailEnabled,
      emailAddresses: currentEmails.map(e => e.value),
      whatsappEnabled,
      whatsappNumbers: currentWa.map(w => w.value),
      smsEnabled,
      smsNumbers: currentSms.map(s => s.value),
      notificationMessage,
    };
    localStorage.setItem('handoffSettings', JSON.stringify(settings));
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

    saveToLocal(newEmails, newWa, newSms);
    setSavingStates(prev => ({ ...prev, [id]: false }));
    toast.success(`${type} saved successfully!`);
  };

  const handleSave = () => {
    // Mark all existing as saved
    setEmails(emails.map(e => ({ ...e, isSaved: true })));
    setWhatsapps(whatsapps.map(w => ({ ...w, isSaved: true })));
    setSmsList(smsList.map(s => ({ ...s, isSaved: true })));
    
    saveToLocal();
    onSave();
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-35e72f4d/handoff-message/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { error: errorText };
        }
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success || !data.message) {
        throw new Error(data.error || 'Failed to generate message in Edge Function');
      }

      setNotificationMessage(data.message.replace(/^["']|["']$/g, '').trim());
      toast.success("Message generated by AI!");
    } catch (error: any) {
      console.error("AI Generation Error:", error);
      toast.error(error.message || "Failed to generate message.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 flex flex-col h-full overflow-hidden">
      {/* Floating glassmorphism back button/header */}
      <div 
        onClick={onBack}
        style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
        className="flex items-center px-6 mx-4 mt-3 mb-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg shrink-0"
      >
        <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-2" />
        <span className="font-medium text-gray-900 dark:text-gray-100">Enable Human Assistance</span>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="px-4 pt-4 pb-6 space-y-4">
          
          {/* ── Enable Human Assistance Card ── */}
          <div 
            className={`relative rounded-2xl border p-4 transition-all duration-300 ${
              enabled 
                ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 shadow-md shadow-blue-100/50 dark:shadow-blue-900/20' 
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Left: Icon + Text */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                  enabled 
                    ? 'bg-blue-100 dark:bg-blue-900/50' 
                    : 'bg-red-100 dark:bg-red-900/50'
                }`}>
                  {enabled ? (
                    <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-sm font-medium transition-colors duration-300 ${
                      enabled 
                        ? 'text-gray-900 dark:text-gray-100' 
                        : 'text-red-900 dark:text-red-400'
                    }`}>
                      Enable Human Assistance
                    </span>
                    {/* Tooltip icon */}
                    <div 
                      className="relative group"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Info className={`w-3.5 h-3.5 ${enabled ? 'text-gray-400 hover:text-gray-600' : 'text-red-400 hover:text-red-600'} cursor-help transition-colors`} />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                        Transfer to a real person when AI needs help.
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
                      </div>
                    </div>
                  </div>
                  <p className={`text-xs mt-0.5 transition-colors duration-300 ${
                    enabled 
                      ? 'text-gray-600 dark:text-gray-400' 
                      : 'text-red-700 dark:text-red-300'
                  }`}>
                    Allow AI to transfer complex or unhandled conversations to human assistance.
                  </p>
                </div>
              </div>

              {/* Right: Toggle + Status */}
              <div className="flex items-center gap-2.5 flex-shrink-0">
                <span className={`text-xs font-medium transition-colors duration-300 ${
                  enabled 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {enabled ? 'Enabled' : 'Disabled'}
                </span>
                <div 
                  className="relative"
                  onMouseLeave={() => setShowHeaderTooltip(false)}
                >
                  <Switch 
                    checked={enabled}
                    onCheckedChange={(checked) => setEnabled(checked)}
                  />
                </div>
              </div>
            </div>
            
            {/* Warning if disabled */}
            {!enabled && (
              <div className="mt-4 pt-3 border-t border-red-200 dark:border-red-800/50 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-800 dark:text-red-300 leading-relaxed">
                  <strong>Recommended:</strong> Keep this enabled so your team is promptly notified whenever a customer inquiry requires human assistance.
                </p>
              </div>
            )}
          </div>

          {/* Senders Section */}
          <div style={{ opacity: enabled ? 1 : 0.5, pointerEvents: enabled ? 'auto' : 'none' }} className="space-y-4 transition-opacity duration-300">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 px-2">Notify Staff Via</h3>
              
              {/* Grid Layout: Email | WhatsApp | SMS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
                
                {/* Email */}
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
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
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
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
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
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

              {/* AI Message Generation Section */}
              <div className="mt-8 space-y-2">
                <Label htmlFor="staff-notification" className="text-gray-900 dark:text-gray-100">Staff Notification Message</Label>
                <div>
                  <textarea
                    id="staff-notification"
                    rows={3}
                    placeholder="Enter the message staff will receive..."
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div 
                    onClick={() => {
                      if (isGenerating) return;
                      handleGenerateAI();
                    }}
                    className={`flex items-center gap-1 mt-1 text-sm ${isGenerating ? 'text-blue-400 dark:text-blue-500' : 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'} ${isGenerating ? 'cursor-wait' : 'cursor-pointer'} transition-colors`}
                  >
                    {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Brain className="w-3.5 h-3.5" />}
                    <span>Generate using AI</span>
                  </div>
                </div>
              </div>

              {/* Message Preview */}
              <div className="mt-6 space-y-2">
                <Label className="text-gray-900 dark:text-gray-100">Preview</Label>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
                      <Brain className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Aces Bot</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Just now</span>
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                        {notificationMessage || <span className="italic text-gray-400">Your notification message will appear here...</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save All Settings Button */}
              <Button 
                onClick={handleSave}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save Settings
              </Button>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
