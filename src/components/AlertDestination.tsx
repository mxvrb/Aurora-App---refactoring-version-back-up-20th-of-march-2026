import React, { useState, useEffect } from 'react';
import { ChevronLeft, Bell, Phone, Mail, Plus, Minus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { toast } from "sonner";

interface AlertDestinationProps {
  onBack: () => void;
}

export function AlertDestination({ onBack }: AlertDestinationProps) {
  // Load initial state from localStorage
  const [initialState] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem('alertDestinationSettings');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const defaultSettings = {
    phoneNumbers: [''],
    whatsappNumber: '',
    emailAddresses: [''],
    sendToMultiple: false
  };

  const [phoneNumbers, setPhoneNumbers] = useState<string[]>(initialState?.phoneNumbers ?? defaultSettings.phoneNumbers);
  const [whatsappNumber, setWhatsappNumber] = useState(initialState?.whatsappNumber ?? defaultSettings.whatsappNumber);
  const [emailAddresses, setEmailAddresses] = useState<string[]>(initialState?.emailAddresses ?? defaultSettings.emailAddresses);
  const [sendToMultiple, setSendToMultiple] = useState(initialState?.sendToMultiple ?? defaultSettings.sendToMultiple);



  const handleSave = () => {
    const settings = {
      phoneNumbers: phoneNumbers.filter(p => p.trim()),
      whatsappNumber,
      emailAddresses: emailAddresses.filter(e => e.trim()),
      sendToMultiple
    };
    
    localStorage.setItem('alertDestinationSettings', JSON.stringify(settings));
    toast.success('Alert destination settings saved!');
  };

  const addPhoneNumber = () => {
    setPhoneNumbers([...phoneNumbers, '']);
  };

  const removePhoneNumber = (index: number) => {
    if (phoneNumbers.length > 1) {
      setPhoneNumbers(phoneNumbers.filter((_, i) => i !== index));
    }
  };

  const updatePhoneNumber = (index: number, value: string) => {
    const newNumbers = [...phoneNumbers];
    newNumbers[index] = value;
    setPhoneNumbers(newNumbers);
  };

  const addEmailAddress = () => {
    setEmailAddresses([...emailAddresses, '']);
  };

  const removeEmailAddress = (index: number) => {
    if (emailAddresses.length > 1) {
      setEmailAddresses(emailAddresses.filter((_, i) => i !== index));
    }
  };

  const updateEmailAddress = (index: number, value: string) => {
    const newEmails = [...emailAddresses];
    newEmails[index] = value;
    setEmailAddresses(newEmails);
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
        <span className="font-medium text-gray-900 dark:text-gray-100">Alert Destination</span>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Phone Numbers */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">SMS Phone Numbers</Label>
            <Button
              onClick={addPhoneNumber}
              size="sm"
              variant="ghost"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {phoneNumbers.map((phone, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    value={phone}
                    onChange={(e) => updatePhoneNumber(index, e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 pl-10"
                  />
                </div>
                {phoneNumbers.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePhoneNumber(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp Number */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">WhatsApp Number (Optional)</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 pl-10"
            />
          </div>
        </div>

        {/* Email Addresses */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Addresses (Optional)</Label>
            <Button
              onClick={addEmailAddress}
              size="sm"
              variant="ghost"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {emailAddresses.map((email, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => updateEmailAddress(index, e.target.value)}
                    placeholder="owner@business.com"
                    className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 pl-10"
                  />
                </div>
                {emailAddresses.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEmailAddress(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Send to Multiple Staff */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <Switch
              checked={sendToMultiple}
              onCheckedChange={setSendToMultiple}
            />
            <div className="flex flex-col">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Send to Multiple Recipients</Label>
              <span className="text-xs text-gray-500 dark:text-gray-400">Send booking alerts to all configured contacts</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}