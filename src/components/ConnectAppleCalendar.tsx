import React, { useState, useEffect } from 'react';
import { ChevronLeft, Info, CheckCircle2, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { toast } from "sonner";
import appleLogo from 'figma:asset/4bf250083dafea26bfa8ac1fd8dc4cafa7c3abd3.png';

interface ConnectAppleCalendarProps {
  onBack: () => void;
}

export function ConnectAppleCalendar({ onBack }: ConnectAppleCalendarProps) {
  // Load initial state from localStorage
  const [initialState] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem('appleCalendarSettings');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const defaultSettings = {
    isConnected: false,
    appPassword: '',
    selectedCalendar: '',
    syncDirection: 'one-way',
    syncBookings: true,
    syncCancellations: true,
    syncModifications: true,
    syncCustomerNotes: false,
    useAvailability: true
  };

  const [isConnected, setIsConnected] = useState(initialState?.isConnected ?? defaultSettings.isConnected);
  const [appPassword, setAppPassword] = useState(initialState?.appPassword ?? defaultSettings.appPassword);
  const [selectedCalendar, setSelectedCalendar] = useState(initialState?.selectedCalendar ?? defaultSettings.selectedCalendar);
  const [syncDirection, setSyncDirection] = useState(initialState?.syncDirection ?? defaultSettings.syncDirection);
  const [syncBookings, setSyncBookings] = useState(initialState?.syncBookings ?? defaultSettings.syncBookings);
  const [syncCancellations, setSyncCancellations] = useState(initialState?.syncCancellations ?? defaultSettings.syncCancellations);
  const [syncModifications, setSyncModifications] = useState(initialState?.syncModifications ?? defaultSettings.syncModifications);
  const [syncCustomerNotes, setSyncCustomerNotes] = useState(initialState?.syncCustomerNotes ?? defaultSettings.syncCustomerNotes);
  const [useAvailability, setUseAvailability] = useState(initialState?.useAvailability ?? defaultSettings.useAvailability);

  // Mock calendars for demonstration
  const availableCalendars = [
    { value: 'personal', label: 'Personal' },
    { value: 'work', label: 'Work' },
    { value: 'bookings', label: 'Bookings' },
    { value: 'home', label: 'Home Calendar' }
  ];

  const handleConnect = () => {
    if (!appPassword.trim()) {
      toast.error('Please enter your app-specific password');
      return;
    }
    // Simulate connection with app-specific password
    setIsConnected(true);
    toast.success('Successfully connected to Apple Calendar!');
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setAppPassword('');
    setSelectedCalendar('');
    toast.success('Disconnected from Apple Calendar');
  };

  const handleSave = () => {
    const settings = {
      isConnected,
      appPassword,
      selectedCalendar,
      syncDirection,
      syncBookings,
      syncCancellations,
      syncModifications,
      syncCustomerNotes,
      useAvailability
    };
    
    // Save settings
    localStorage.setItem('appleCalendarSettings', JSON.stringify(settings));

    // Update completion flags for filter system
    try {
      const rawFlags = localStorage.getItem('acesai_setup_completion_flags');
      const flags = rawFlags ? JSON.parse(rawFlags) : {};
      flags['Connect Apple Calendar'] = isConnected;
      localStorage.setItem('acesai_setup_completion_flags', JSON.stringify(flags));
    } catch (e) {
      console.error('Failed to update completion flags:', e);
    }

    // Dispatch event to trigger filter UI update
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('acesai-local-storage-changed', {
        detail: { key: 'appleCalendarSettings', value: JSON.stringify(settings) }
      }));
    }

    toast.success('Apple Calendar settings saved!');
    
    // Navigate back to previous page
    setTimeout(() => {
      onBack();
    }, 1000);
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
        <span className="font-medium text-gray-900 dark:text-gray-100">Connect Apple Calendar</span>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Information Box */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <span className="font-medium">Apple uses an app-specific password for calendar access.</span>
              <br />
              Generate one at <a href="https://appleid.apple.com" target="_blank" rel="noopener noreferrer" className="underline">appleid.apple.com</a> under Security settings.
            </p>
          </div>
        </div>

        {/* A. Connect Section with Logo */}
        <div className="space-y-3">
          <div 
            className={`relative rounded-2xl border transition-all duration-300 ${
              isConnected 
                ? 'bg-gradient-to-br from-gray-50/80 via-slate-50/60 to-gray-50/80 dark:from-gray-900/30 dark:via-slate-900/20 dark:to-gray-900/30 border-gray-300 dark:border-gray-700 shadow-lg shadow-gray-100/50 dark:shadow-gray-900/20' 
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm'
            }`}
          >
            <div className="p-6">
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-white dark:bg-gray-700 flex items-center justify-center shadow-md p-2 shrink-0">
                    <img src={appleLogo} alt="Apple Calendar" className="w-full h-full object-contain" />
                  </div>
                  <div className={`${isConnected ? '' : 'flex-1'}`}>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Apple Calendar</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">Sync with iCloud Calendar</p>
                  </div>
                  
                  {isConnected && (
                    <div className="ml-4 flex-1 flex items-center justify-between px-4 py-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-md overflow-hidden">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                        <span className="text-sm font-bold text-white tracking-wide">CONNECTED</span>
                      </div>
                      <span className="text-sm text-white/90 truncate ml-4 hidden sm:block">Your calendar is actively syncing</span>
                    </div>
                  )}
                </div>
                  
                {/* App-Specific Password Input */}
                <div className="space-y-3">
                  <Label htmlFor="app-password" className="text-gray-900 dark:text-gray-100">
                    App-Specific Password
                  </Label>
                  <Input
                    id="app-password"
                    type="password"
                    placeholder="xxxx-xxxx-xxxx-xxxx"
                    value={appPassword}
                    onChange={(e) => setAppPassword(e.target.value)}
                    className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100 transition-colors"
                    disabled={isConnected}
                  />
                </div>
                  
                {!isConnected ? (
                  <Button 
                    onClick={handleConnect}
                    className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Connect Apple Calendar
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleDisconnect}
                    variant="outline"
                    className="w-full cursor-pointer border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                  >
                    Disconnect
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {isConnected && (
          <>
            {/* B. Choose Calendar */}
            <div className="space-y-3">
              <Label htmlFor="calendar-select" className="text-gray-900 dark:text-gray-100">
                Choose Calendar
              </Label>
              <Select value={selectedCalendar} onValueChange={setSelectedCalendar}>
                <SelectTrigger id="calendar-select" className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100 transition-colors">
                  <SelectValue placeholder="Select a calendar" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-800">
                  {availableCalendars.map((calendar) => (
                    <SelectItem key={calendar.value} value={calendar.value} className="text-gray-900 dark:text-gray-100 focus:bg-blue-50 dark:focus:bg-blue-900/20">
                      {calendar.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* C. Sync Direction */}
            <div className="space-y-3">
              <Label className="text-gray-900 dark:text-gray-100">Sync Direction</Label>
              <div className="space-y-2">
                <div 
                  onClick={() => setSyncDirection('one-way')}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    syncDirection === 'one-way' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-900/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">One-way: AI → Apple Calendar</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">(Recommended) AI updates Apple Calendar only</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      syncDirection === 'one-way' ? 'border-blue-500' : 'border-blue-300 dark:border-blue-700'
                    }`}>
                      {syncDirection === 'one-way' && <div className="w-3 h-3 rounded-full bg-blue-500" />}
                    </div>
                  </div>
                </div>
                <div 
                  onClick={() => setSyncDirection('two-way')}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    syncDirection === 'two-way' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-900/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Two-way: AI ↔ Apple Calendar</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">(Optional) Sync both directions</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      syncDirection === 'two-way' ? 'border-blue-500' : 'border-blue-300 dark:border-blue-700'
                    }`}>
                      {syncDirection === 'two-way' && <div className="w-3 h-3 rounded-full bg-blue-500" />}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* D. What to Sync */}
            <div className="space-y-3">
              <Label className="text-gray-900 dark:text-gray-100">What to Sync</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="sync-bookings" 
                    checked={syncBookings}
                    onCheckedChange={(checked) => setSyncBookings(checked as boolean)}
                    className="data-[state=checked]:!bg-blue-600 data-[state=checked]:!border-blue-600"
                  />
                  <label htmlFor="sync-bookings" className="text-gray-900 dark:text-gray-100 cursor-pointer">
                    Bookings
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="sync-cancellations" 
                    checked={syncCancellations}
                    onCheckedChange={(checked) => setSyncCancellations(checked as boolean)}
                    className="data-[state=checked]:!bg-blue-600 data-[state=checked]:!border-blue-600"
                  />
                  <label htmlFor="sync-cancellations" className="text-gray-900 dark:text-gray-100 cursor-pointer">
                    Cancellations
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="sync-modifications" 
                    checked={syncModifications}
                    onCheckedChange={(checked) => setSyncModifications(checked as boolean)}
                    className="data-[state=checked]:!bg-blue-600 data-[state=checked]:!border-blue-600"
                  />
                  <label htmlFor="sync-modifications" className="text-gray-900 dark:text-gray-100 cursor-pointer">
                    Modifications
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="sync-notes" 
                    checked={syncCustomerNotes}
                    onCheckedChange={(checked) => setSyncCustomerNotes(checked as boolean)}
                    className="data-[state=checked]:!bg-blue-600 data-[state=checked]:!border-blue-600"
                  />
                  <label htmlFor="sync-notes" className="text-gray-900 dark:text-gray-100 cursor-pointer">
                    Customer notes (optional)
                  </label>
                </div>
              </div>
            </div>

            {/* E. Availability Sync */}
            <div className="space-y-3">
              <Label className="text-gray-900 dark:text-gray-100">Availability Sync</Label>
              <div className="flex items-center justify-between p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">Block times already filled in Apple Calendar</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">AI won't offer times where Apple Calendar is blocked</p>
                </div>
                <Switch 
                  checked={useAvailability}
                  onCheckedChange={setUseAvailability}
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleSave}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save Settings
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}