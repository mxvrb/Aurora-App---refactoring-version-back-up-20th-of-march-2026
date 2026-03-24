import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, CheckCircle2, Info, ExternalLink, Globe, Server, Lock, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { toast } from "sonner";

interface ConnectCalDAVCalendarProps {
  onBack: () => void;
}

export function ConnectCalDAVCalendar({ onBack }: ConnectCalDAVCalendarProps) {
  const [editingId, setEditingId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('editingCaldavId') || null;
  });

  // Load initial state from localStorage
  const [initialState] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const editId = localStorage.getItem('editingCaldavId');
      if (editId) {
        const saved = localStorage.getItem('caldavCalendarSettingsList');
        if (saved) {
          const list = JSON.parse(saved);
          return list.find((item: any) => item.id === editId) || null;
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  });

  const defaultSettings = {
    isConnected: false,
    serverUrl: '',
    username: '',
    appPassword: '',
    selectedCalendar: '',
    syncDirection: 'one-way',
    syncBookings: true,
    syncCancellations: true,
    syncModifications: true,
    syncCustomerNotes: false,
    useAvailability: true,
    createNewCalendar: false,
    colorCodeBookings: false,
    defaultDuration: '60',
    syncInterval: '15',
    serverPort: '443',
    useSSL: true
  };

  const [isConnected, setIsConnected] = useState(initialState?.isConnected ?? defaultSettings.isConnected);
  const [serverUrl, setServerUrl] = useState(initialState?.serverUrl ?? defaultSettings.serverUrl);
  const [username, setUsername] = useState(initialState?.username ?? defaultSettings.username);
  const [appPassword, setAppPassword] = useState(initialState?.appPassword ?? defaultSettings.appPassword);
  
  const [selectedCalendar, setSelectedCalendar] = useState(initialState?.selectedCalendar ?? defaultSettings.selectedCalendar);
  const [syncDirection, setSyncDirection] = useState(initialState?.syncDirection ?? defaultSettings.syncDirection);
  const [syncBookings, setSyncBookings] = useState(initialState?.syncBookings ?? defaultSettings.syncBookings);
  const [syncCancellations, setSyncCancellations] = useState(initialState?.syncCancellations ?? defaultSettings.syncCancellations);
  const [syncModifications, setSyncModifications] = useState(initialState?.syncModifications ?? defaultSettings.syncModifications);
  const [syncCustomerNotes, setSyncCustomerNotes] = useState(initialState?.syncCustomerNotes ?? defaultSettings.syncCustomerNotes);
  const [useAvailability, setUseAvailability] = useState(initialState?.useAvailability ?? defaultSettings.useAvailability);
  const [createNewCalendar, setCreateNewCalendar] = useState(initialState?.createNewCalendar ?? defaultSettings.createNewCalendar);
  const [colorCodeBookings, setColorCodeBookings] = useState(initialState?.colorCodeBookings ?? defaultSettings.colorCodeBookings);
  const [defaultDuration, setDefaultDuration] = useState(initialState?.defaultDuration ?? defaultSettings.defaultDuration);
  const [syncInterval, setSyncInterval] = useState(initialState?.syncInterval ?? defaultSettings.syncInterval);
  const [serverPort, setServerPort] = useState(initialState?.serverPort ?? defaultSettings.serverPort);
  const [useSSL, setUseSSL] = useState(initialState?.useSSL ?? defaultSettings.useSSL);

  const [isDiscovering, setIsDiscovering] = useState(false);
  const [showAdvancedConnection, setShowAdvancedConnection] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Exact Apple-style animation timing
  const springConfig = { duration: 0.45, ease: [0.23, 1, 0.32, 1] };

  // Mock calendars for demonstration
  const availableCalendars = [
    { value: 'personal', label: 'Personal' },
    { value: 'work', label: 'Work' },
    { value: 'bookings', label: 'Bookings' },
    { value: 'other', label: 'Other' }
  ];

  const handleConnect = async () => {
    if (!serverUrl || !username || !appPassword) {
      toast.error('Please fill in all connection details.');
      return;
    }
    
    setIsDiscovering(true);
    
    // Simulate CalDAV Discovery Process (.well-known/caldav)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsDiscovering(false);
    setIsConnected(true);
    
    // Auto-save initial connection state
    const newId = editingId || Date.now().toString();
    if (!editingId) setEditingId(newId);

    const settings = {
      id: newId,
      isConnected: true,
      serverUrl,
      username,
      appPassword,
      selectedCalendar,
      syncDirection,
      syncBookings,
      syncCancellations,
      syncModifications,
      syncCustomerNotes,
      useAvailability,
      createNewCalendar,
      colorCodeBookings,
      defaultDuration,
      syncInterval,
      serverPort,
      useSSL
    };

    try {
      const saved = localStorage.getItem('caldavCalendarSettingsList');
      let list = saved ? JSON.parse(saved) : [];
      const existingIndex = list.findIndex((item: any) => item.id === newId);
      
      if (existingIndex >= 0) {
        list[existingIndex] = settings;
      } else {
        list.push(settings);
      }
      
      localStorage.setItem('caldavCalendarSettingsList', JSON.stringify(list));
      localStorage.setItem('caldavCalendarSettings', JSON.stringify(settings));
    } catch(e) {}

    toast.success('Successfully connected to external calendar!');
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setSelectedCalendar('');
    
    // Remove from list if disconnected
    try {
      if (editingId) {
        const saved = localStorage.getItem('caldavCalendarSettingsList');
        if (saved) {
          const list = JSON.parse(saved);
          const newList = list.filter((item: any) => item.id !== editingId);
          localStorage.setItem('caldavCalendarSettingsList', JSON.stringify(newList));
        }
      }
    } catch(e) {}

    toast.success('Disconnected from external calendar');
    onBack();
  };

  const handleSave = () => {
    const newId = editingId || Date.now().toString();
    if (!editingId) {
      setEditingId(newId);
    }

    const settings = {
      id: newId,
      isConnected,
      serverUrl,
      username,
      appPassword,
      selectedCalendar,
      syncDirection,
      syncBookings,
      syncCancellations,
      syncModifications,
      syncCustomerNotes,
      useAvailability,
      createNewCalendar,
      colorCodeBookings,
      defaultDuration,
      syncInterval,
      serverPort,
      useSSL
    };
    
    try {
      const saved = localStorage.getItem('caldavCalendarSettingsList');
      let list = saved ? JSON.parse(saved) : [];
      const existingIndex = list.findIndex((item: any) => item.id === newId);
      
      if (existingIndex >= 0) {
        list[existingIndex] = settings;
      } else {
        list.push(settings);
      }
      
      localStorage.setItem('caldavCalendarSettingsList', JSON.stringify(list));
      
      // Keep backward compatibility for single-item readers if needed
      localStorage.setItem('caldavCalendarSettings', JSON.stringify(settings));
    } catch(e) {}

    toast.success('External Calendar settings saved!');
    onBack();
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
        <span className="font-medium text-gray-900 dark:text-gray-100">External Calendar</span>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* A. Connect Section */}
        <div className="space-y-3">
          <div 
            className={`relative rounded-2xl border transition-all duration-300 ${ 
              isConnected 
                ? 'bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-blue-50/80 dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-blue-950/30 border-blue-200 dark:border-blue-800 shadow-lg shadow-blue-100/50 dark:shadow-blue-900/20' 
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm'
            }`}
          >
            <div className="p-6">
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-md p-2 shrink-0">
                    <Globe className="w-8 h-8" />
                  </div>
                  <div className={`${isConnected ? '' : 'flex-1'}`}>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">External Calendar</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">Connect using CalDAV</p>
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
                
                {!isConnected ? (
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2 relative">
                      <Label className="text-gray-900 dark:text-gray-100">Server URL (CalDAV)</Label>
                      <div className="relative">
                        <Server className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input 
                          placeholder="https://calendar.zoho.com" 
                          value={serverUrl}
                          onChange={(e) => setServerUrl(e.target.value)}
                          className="pl-10 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-900 dark:text-gray-100">Username / Email</Label>
                      <Input 
                        placeholder="you@example.com" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-900 dark:text-gray-100">App Password</Label>
                      <div className="relative">
                        <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          value={appPassword}
                          onChange={(e) => setAppPassword(e.target.value)}
                          className="pl-10 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20"
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>For security, use an App-Specific Password instead of your main password.</span>
                      </p>
                    </div>

                    <div className="pt-2 pb-1">
                      <button 
                        onClick={() => setShowAdvancedConnection(!showAdvancedConnection)}
                        className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        {showAdvancedConnection ? 'Hide advanced settings' : 'Show advanced settings'}
                      </button>
                    </div>

                    <AnimatePresence>
                      {showAdvancedConnection && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={springConfig}
                          className="overflow-hidden"
                        >
                          <div className="space-y-4 pt-2 pb-4 border-t border-gray-200/50 dark:border-gray-700/50">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-gray-900 dark:text-gray-100">Port</Label>
                                <Input 
                                  placeholder="443" 
                                  value={serverPort}
                                  onChange={(e) => setServerPort(e.target.value)}
                                  className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-gray-700"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-gray-900 dark:text-gray-100 mb-2 block">Use SSL/TLS</Label>
                                <div className="flex items-center h-[40px]">
                                  <Switch 
                                    checked={useSSL}
                                    onCheckedChange={setUseSSL}
                                  />
                                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Secure connection</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Button 
                      onClick={handleConnect}
                      disabled={isDiscovering}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 cursor-pointer mt-4 py-6 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
                    >
                      {isDiscovering ? (
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          <span>Discovering Calendars...</span>
                        </div>
                      ) : (
                        <>
                          <span>Connect Calendar</span>
                          <ExternalLink className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Button 
                      onClick={() => {
                        setIsSyncing(true);
                        setTimeout(() => {
                          setIsSyncing(false);
                          toast.success('Calendar sync completed successfully');
                        }, 1500);
                      }}
                      variant="outline"
                      disabled={isSyncing}
                      className="w-full cursor-pointer bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all"
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                      {isSyncing ? 'Syncing...' : 'Force Sync Now'}
                    </Button>
                    <Button 
                      onClick={handleDisconnect}
                      variant="outline"
                      className="w-full cursor-pointer border-red-200/50 dark:border-red-900/30 text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-900/10 hover:bg-red-100/50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      Disconnect Server
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isConnected && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={springConfig}
              className="space-y-6"
            >
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
                      <p className="font-medium text-gray-900 dark:text-gray-100">One-way: AI → Calendar</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">(Recommended) AI updates calendar only</p>
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
                      <p className="font-medium text-gray-900 dark:text-gray-100">Two-way: AI ↔ Calendar</p>
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
              <div className="flex items-center justify-between p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-lg transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">Use calendar availability to decide booking times</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">AI won't offer times where the calendar is blocked</p>
                </div>
                <Switch 
                  checked={useAvailability}
                  onCheckedChange={setUseAvailability}
                />
              </div>
            </div>

            {/* F. Advanced Options */}
            <div className="space-y-3">
              <Label className="text-gray-900 dark:text-gray-100">Advanced Options</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-lg transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">Create a new calendar for AI bookings</p>
                  </div>
                  <Switch 
                    checked={createNewCalendar}
                    onCheckedChange={setCreateNewCalendar}
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-lg transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100">Color-code AI bookings</p>
                  </div>
                  <Switch 
                    checked={colorCodeBookings}
                    onCheckedChange={setColorCodeBookings}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default-duration" className="text-gray-900 dark:text-gray-100 font-medium">
                    Default booking duration (minutes)
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1.5 pb-1">
                    <Info className="w-4 h-4 shrink-0 text-blue-500" />
                    How long a typical appointment usually takes. The AI will automatically reserve this amount of time on your calendar for new bookings.
                  </p>
                  <Input
                    id="default-duration"
                    type="number"
                    value={defaultDuration}
                    onChange={(e) => setDefaultDuration(e.target.value)}
                    className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100 transition-colors"
                    min="15"
                    step="15"
                  />
                </div>
                <div className="space-y-2 pt-2">
                  <Label htmlFor="sync-interval" className="text-gray-900 dark:text-gray-100 font-medium">
                    Sync interval (minutes)
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1.5 pb-1">
                    <Info className="w-4 h-4 shrink-0 text-blue-500" />
                    How often the system pulls new events from your CalDAV server. Shorter intervals use more resources.
                  </p>
                  <Select value={syncInterval} onValueChange={setSyncInterval}>
                    <SelectTrigger id="sync-interval" className="bg-white/50 dark:bg-gray-900/10 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100 transition-colors">
                      <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-800">
                      <SelectItem value="5" className="text-gray-900 dark:text-gray-100 focus:bg-blue-50 dark:focus:bg-blue-900/20">5 minutes</SelectItem>
                      <SelectItem value="15" className="text-gray-900 dark:text-gray-100 focus:bg-blue-50 dark:focus:bg-blue-900/20">15 minutes (Default)</SelectItem>
                      <SelectItem value="30" className="text-gray-900 dark:text-gray-100 focus:bg-blue-50 dark:focus:bg-blue-900/20">30 minutes</SelectItem>
                      <SelectItem value="60" className="text-gray-900 dark:text-gray-100 focus:bg-blue-50 dark:focus:bg-blue-900/20">1 hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex gap-3 pt-6 pb-4">
              <Button 
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] py-6 rounded-xl text-lg font-medium"
              >
                Save Integration Settings
              </Button>
            </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
