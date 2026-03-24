import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Plus, Trash2, Upload, Download, ChevronDown, UserX, Info, X, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { toast } from "sonner";
import { motion, AnimatePresence } from 'motion/react';
import { UnsavedChangesDialog } from './UnsavedChangesDialog';

interface CustomerExclusionListProps {
  onBack: () => void;
  onSave?: () => void;
}

interface ExcludedCustomer {
  id: string;
  name: string;
  phone: string;
}

export function CustomerExclusionList({ onBack, onSave }: CustomerExclusionListProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [showUnsavedChanges, setShowUnsavedChanges] = useState(false);
  
  // Load initial state from localStorage
  const [initialState] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem('customerExclusionListSettings');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const defaultSettings = {
    isEnabled: false,
    excludedCustomers: [] as ExcludedCustomer[],
    autoExcludeStop: true,
    autoExcludeDontRemind: true,
    autoExcludeStaff: false,
    addCustomerEnabled: true,
    listEnabled: true,
    autoExclusionEnabled: true,
  };

  const savedSettings = initialState || defaultSettings;

  const [isEnabled, setIsEnabled] = useState(savedSettings.isEnabled ?? false);
  const [excludedCustomers, setExcludedCustomers] = useState<ExcludedCustomer[]>(savedSettings.excludedCustomers);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [autoExcludeStop, setAutoExcludeStop] = useState(savedSettings.autoExcludeStop);
  const [autoExcludeDontRemind, setAutoExcludeDontRemind] = useState(savedSettings.autoExcludeDontRemind);
  const [autoExcludeStaff, setAutoExcludeStaff] = useState(savedSettings.autoExcludeStaff);
  const [addCustomerEnabled, setAddCustomerEnabled] = useState(savedSettings.addCustomerEnabled ?? true);
  const [listEnabled, setListEnabled] = useState(savedSettings.listEnabled ?? true);
  const [autoExclusionEnabled, setAutoExclusionEnabled] = useState(savedSettings.autoExclusionEnabled ?? true);

  const [autoExclusionDropdownOpen, setAutoExclusionDropdownOpen] = useState(false);
  const [autoExclusionExpanded, setAutoExclusionExpanded] = useState(savedSettings.autoExclusionEnabled ?? true);
  const autoExclusionDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (autoExclusionDropdownRef.current && !autoExclusionDropdownRef.current.contains(event.target as Node)) {
        setAutoExclusionDropdownOpen(false);
      }
    };
    if (autoExclusionDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [autoExclusionDropdownOpen]);

  // Auto-exclusion config
  const autoExclusionItems = [
    { key: 'autoExcludeStop' as const, label: 'Exclude customers who reply "STOP"', checked: autoExcludeStop, toggle: setAutoExcludeStop },
    { key: 'autoExcludeDontRemind' as const, label: 'Exclude customers who say "Don\'t remind me"', checked: autoExcludeDontRemind, toggle: setAutoExcludeDontRemind },
    { key: 'autoExcludeStaff' as const, label: 'Exclude internal staff numbers', checked: autoExcludeStaff, toggle: setAutoExcludeStaff },
  ];

  const selectedAutoExclusions = autoExclusionItems.filter(c => c.checked);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (!isMounted) return;
    
    const settings = {
      isEnabled,
      excludedCustomers,
      autoExcludeStop,
      autoExcludeDontRemind,
      autoExcludeStaff,
      addCustomerEnabled,
      listEnabled,
      autoExclusionEnabled,
    };
    
    localStorage.setItem('customerExclusionListSettings', JSON.stringify(settings));
  }, [isMounted, isEnabled, excludedCustomers, autoExcludeStop, autoExcludeDontRemind, autoExcludeStaff, addCustomerEnabled, listEnabled, autoExclusionEnabled]);

  const hasUnsavedChanges = () => {
    const currentSettings = {
      isEnabled,
      excludedCustomers,
      autoExcludeStop,
      autoExcludeDontRemind,
      autoExcludeStaff,
      addCustomerEnabled,
      listEnabled,
      autoExclusionEnabled,
    };
    
    return JSON.stringify(currentSettings) !== JSON.stringify({
      isEnabled: savedSettings.isEnabled ?? false,
      excludedCustomers: savedSettings.excludedCustomers,
      autoExcludeStop: savedSettings.autoExcludeStop,
      autoExcludeDontRemind: savedSettings.autoExcludeDontRemind,
      autoExcludeStaff: savedSettings.autoExcludeStaff,
      addCustomerEnabled: savedSettings.addCustomerEnabled,
      listEnabled: savedSettings.listEnabled,
      autoExclusionEnabled: savedSettings.autoExclusionEnabled,
    });
  };

  const handleBack = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedChanges(true);
    } else {
      onBack();
    }
  };

  const handleDiscard = () => {
    if (initialState) {
      localStorage.setItem('customerExclusionListSettings', JSON.stringify(initialState));
    }
    setShowUnsavedChanges(false);
    onBack();
  };

  const handleSaveAndExit = () => {
    // Update completion flags for the filter system
    try {
      const rawFlags = localStorage.getItem('acesai_setup_completion_flags');
      const flags = rawFlags ? JSON.parse(rawFlags) : {};
      flags['Customer Exclusion List'] = true;
      localStorage.setItem('acesai_setup_completion_flags', JSON.stringify(flags));
    } catch (e) {
      console.error('Error updating completion flags:', e);
    }

    onSave?.();
    toast.success('Exclusion list settings saved!');
    onBack();
  };

  const handleAddCustomer = () => {
    if (!newName.trim() && !newPhone.trim()) {
      toast.error('Please enter a name or phone number');
      return;
    }

    const newCustomer: ExcludedCustomer = {
      id: Date.now().toString(),
      name: newName.trim(),
      phone: newPhone.trim(),
    };
    setExcludedCustomers([...excludedCustomers, newCustomer]);
    setNewName('');
    setNewPhone('');
    toast.success('Customer added to exclusion list');
  };

  const handleRemoveCustomer = (id: string) => {
    setExcludedCustomers(excludedCustomers.filter(c => c.id !== id));
    toast.success('Customer removed from exclusion list');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.txt';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          const lines = text.split('\n');
          const imported: ExcludedCustomer[] = [];

          lines.forEach((line) => {
            const [name, phone] = line.split(',').map(s => s.trim());
            if (name || phone) {
              imported.push({
                id: Date.now().toString() + Math.random(),
                name: name || '',
                phone: phone || '',
              });
            }
          });

          setExcludedCustomers([...excludedCustomers, ...imported]);
          toast.success(`Imported ${imported.length} customers`);
        } catch (error) {
          toast.error('Failed to import file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleExport = () => {
    const csv = excludedCustomers.map(c => `${c.name},${c.phone}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exclusion-list.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exclusion list exported');
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800">
      <UnsavedChangesDialog 
        open={showUnsavedChanges} 
        onOpenChange={setShowUnsavedChanges}
        onDiscard={handleDiscard}
        onSave={handleSaveAndExit}
      />

      {/* Header */}
      <div 
        onClick={handleBack}
        style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
        className="flex items-center px-6 mx-4 mt-3 mb-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg"
      >
        <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-2" />
        <span className="font-medium text-gray-900 dark:text-gray-100">Exclude Customers From Receiving</span>
      </div>

      <div className="p-6 space-y-8">
        
        {/* Main Toggle */}
        <div className="space-y-2">
          <div 
            className={`relative rounded-2xl border p-4 transition-all duration-300 ${
              isEnabled 
                ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 shadow-md shadow-blue-100/50 dark:shadow-blue-900/20' 
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Left: Icon + Text */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                  isEnabled 
                    ? 'bg-blue-100 dark:bg-blue-900/50' 
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <UserX className={`w-5 h-5 transition-colors duration-300 ${
                    isEnabled 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-400 dark:text-gray-500'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-sm font-medium transition-colors duration-300 ${
                      isEnabled 
                        ? 'text-gray-900 dark:text-gray-100' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      Activate Exclude Customers From Receiving
                    </span>
                    <div 
                      className="relative group"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Info className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-help transition-colors" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                        Customers on this list won't receive any reminders.
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
                      </div>
                    </div>
                  </div>
                  <p className={`text-xs mt-0.5 transition-colors duration-300 ${
                    isEnabled 
                      ? 'text-gray-600 dark:text-gray-400' 
                      : 'text-gray-400 dark:text-gray-500'
                  }`}>
                    Manage customers excluded from all reminders
                  </p>
                </div>
              </div>

              {/* Right: Toggle + Status */}
              <div className="flex items-center gap-2.5 flex-shrink-0">
                <span className={`text-xs font-medium transition-colors duration-300 ${
                  isEnabled 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {isEnabled ? 'Enabled' : 'Disabled'}
                </span>
                <Switch 
                  checked={isEnabled} 
                  onCheckedChange={setIsEnabled}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
            </div>
          </div>

          <div className="relative mt-4">
              <motion.div
                initial={false}
                animate={{ opacity: isEnabled ? 1 : 0.4 }}
                transition={{ duration: 0.3 }}
              >
                <div 
                  className={`space-y-4 transition-colors duration-300`}
                  style={{ pointerEvents: isEnabled ? 'auto' : 'none' }}
                >
                  
                  {/* Add Customer */}
                  <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Add Customer to Exclusion List</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Enter customer details to exclude them from all reminders</p>
                      </div>
                      <Switch 
                        checked={addCustomerEnabled} 
                        onCheckedChange={setAddCustomerEnabled}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>

                    <AnimatePresence>
                      {addCustomerEnabled && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="border-l-2 border-blue-400 dark:border-blue-600 pl-4 space-y-3">
                            <div className="space-y-2">
                              <Label className="text-sm text-gray-700 dark:text-gray-300">Customer Name</Label>
                              <Input
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="John Doe"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm text-gray-700 dark:text-gray-300">Phone Number</Label>
                              <Input
                                value={newPhone}
                                onChange={(e) => setNewPhone(e.target.value)}
                                placeholder="+1 234 567 8900"
                              />
                            </div>
                            <Button onClick={handleAddCustomer} size="sm" className="w-full rounded-xl">
                              <Plus className="w-4 h-4 mr-2" />
                              Add to Exclusion List
                            </Button>

                            {/* Import/Export */}
                            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                              <Label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Import / Export</Label>
                              <div className="flex gap-2">
                                <Button onClick={handleImport} variant="outline" size="sm" className="flex-1 rounded-xl">
                                  <Upload className="w-4 h-4 mr-2" />
                                  Import CSV
                                </Button>
                                <Button onClick={handleExport} variant="outline" size="sm" className="flex-1 rounded-xl">
                                  <Download className="w-4 h-4 mr-2" />
                                  Export
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Excluded Customers List */}
                  <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Excluded Customers ({excludedCustomers.length})</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Manage customers who won't receive reminders</p>
                      </div>
                      <Switch 
                        checked={listEnabled} 
                        onCheckedChange={setListEnabled}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>

                    <AnimatePresence>
                      {listEnabled && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="border-l-2 border-blue-400 dark:border-blue-600 pl-4">
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                              {excludedCustomers.length === 0 ? (
                                <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">
                                  No customers excluded yet
                                </p>
                              ) : (
                                excludedCustomers.map((customer) => (
                                  <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                                    <div>
                                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{customer.name || 'Unknown'}</p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">{customer.phone || 'No phone'}</p>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemoveCustomer(customer.id)}
                                      className="hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0 p-1"
                                    >
                                      <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* AI Auto-Exclusion */}
                  <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">AI Auto-Exclusion</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Automatically exclude customers based on their responses</p>
                      </div>
                      <Switch 
                        checked={autoExclusionEnabled} 
                        onCheckedChange={(val) => {
                          if (!val) {
                            setAutoExclusionExpanded(false);
                            setAutoExclusionDropdownOpen(false);
                          }
                          setAutoExclusionEnabled(val);
                        }}
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>

                    <AnimatePresence>
                      {autoExclusionEnabled && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          onAnimationComplete={(definition: any) => {
                            if (definition?.opacity === 1) {
                              setAutoExclusionExpanded(true);
                            }
                          }}
                          style={{ overflow: autoExclusionExpanded ? 'visible' : 'hidden' }}
                        >
                          <div className="border-l-2 border-blue-400 dark:border-blue-600 pl-4 space-y-3">
                            {/* Selected auto-exclusion rules as removable tags */}
                            <AnimatePresence>
                              {selectedAutoExclusions.length > 0 && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.15 }}
                                  className="flex flex-wrap gap-2"
                                >
                                  {selectedAutoExclusions.map((rule) => (
                                    <motion.div
                                      key={rule.key}
                                      initial={{ opacity: 0, scale: 0.9 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.9 }}
                                      transition={{ duration: 0.15 }}
                                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg"
                                    >
                                      <span className="text-xs text-blue-700 dark:text-blue-300">{rule.label}</span>
                                      <button
                                        onClick={() => rule.toggle(false)}
                                        className="flex-shrink-0 p-0.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors"
                                      >
                                        <X className="w-3 h-3 text-blue-500 dark:text-blue-400" />
                                      </button>
                                    </motion.div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Custom dropdown */}
                            <div ref={autoExclusionDropdownRef} className="relative">
                              <button
                                onClick={() => setAutoExclusionDropdownOpen(!autoExclusionDropdownOpen)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all text-sm ${
                                  autoExclusionDropdownOpen
                                    ? 'border-blue-400 dark:border-blue-500 ring-2 ring-blue-100 dark:ring-blue-900/40 bg-white dark:bg-gray-800'
                                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                                }`}
                              >
                                <span className="text-gray-500 dark:text-gray-400">
                                  {selectedAutoExclusions.length === 0
                                    ? 'Select auto-exclusion rules...'
                                    : `${selectedAutoExclusions.length} rule${selectedAutoExclusions.length > 1 ? 's' : ''} selected`}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${autoExclusionDropdownOpen ? 'rotate-180' : ''}`} />
                              </button>

                              <AnimatePresence>
                                {autoExclusionDropdownOpen && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute z-20 left-0 right-0 mt-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg overflow-hidden"
                                  >
                                    {autoExclusionItems.map((rule, index) => (
                                      <button
                                        key={rule.key}
                                        onClick={() => rule.toggle(!rule.checked)}
                                        className={`w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors ${
                                          index < autoExclusionItems.length - 1 ? 'border-b border-gray-100 dark:border-gray-700/50' : ''
                                        }`}
                                      >
                                        <div className={`flex-shrink-0 rounded flex items-center justify-center transition-all duration-150 ${
                                          rule.checked
                                            ? 'bg-blue-600 dark:bg-blue-500'
                                            : 'border-2 border-gray-300 dark:border-gray-600'
                                        }`}
                                          style={{ width: '18px', height: '18px' }}
                                        >
                                          {rule.checked && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                        <span className={`text-sm ${
                                          rule.checked 
                                            ? 'text-gray-900 dark:text-gray-100' 
                                            : 'text-gray-600 dark:text-gray-400'
                                        }`}>
                                          {rule.label}
                                        </span>
                                      </button>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              </motion.div>
              {/* Invisible overlay to block all interactions when disabled */}
              {!isEnabled && (
                <div className="absolute inset-0 z-10 cursor-not-allowed" />
              )}
          </div>
        </div>

      </div>
    </div>
  );
}
