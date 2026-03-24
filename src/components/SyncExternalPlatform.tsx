import React, { useState } from 'react';
import { ChevronLeft, AlertCircle, Check, RefreshCw, Wrench, Globe, CloudUpload, Link, Webhook, Calendar as CalendarIcon, Plus, Mail, PhoneCall } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from "sonner";

interface SyncExternalPlatformProps {
  onBack: () => void;
}

type ConnectionType = 'api-key' | 'ical' | 'caldav' | 'webhook' | null;

interface ConnectedPlatform {
  id: string;
  platform: string;
  connectionType: ConnectionType;
  lastSynced: Date;
  apiKey: string;
  connected: boolean;
  isConnected?: boolean;
}

export function SyncExternalPlatform({ onBack }: SyncExternalPlatformProps) {
  // Load saved platforms
  const [connectedPlatforms, setConnectedPlatforms] = useState<ConnectedPlatform[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('externalSyncPlatforms');
      return saved ? JSON.parse(saved).map((p: any) => ({
        ...p,
        lastSynced: new Date(p.lastSynced),
        connected: p.connected !== undefined ? p.connected : true,
        isConnected: p.isConnected !== undefined ? p.isConnected : true
      })) : [];
    } catch (e) {
      return [];
    }
  });

  // Store failed states per connection type
  const [failedStates, setFailedStates] = useState<Record<string, {
    input: string;
    failed: boolean;
    troubleshootSent: boolean;
  }>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const saved = localStorage.getItem('failedConnectionStates');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const [selectedMethod, setSelectedMethod] = useState<ConnectionType>('api-key');
  const [connectionInput, setConnectionInput] = useState('');
  const [detectedType, setDetectedType] = useState<ConnectionType>(null);
  const [connectionFailed, setConnectionFailed] = useState(false);
  const [troubleshootSent, setTroubleshootSent] = useState(false);

  const [showTroubleshootModal, setShowTroubleshootModal] = useState(false);
  const [troubleshootMessage, setTroubleshootMessage] = useState('');
  const [troubleshootError, setTroubleshootError] = useState(false);
  const [isConnectedPlatformTroubleshoot, setIsConnectedPlatformTroubleshoot] = useState(false);

  const [showContactUsModal, setShowContactUsModal] = useState(false);
  const [contactUsMessage, setContactUsMessage] = useState('');
  const [contactUsError, setContactUsError] = useState(false);

  const [isAddingPlatform, setIsAddingPlatform] = useState(false);

  const detectConnectionType = (input: string): ConnectionType => {
    if (!input.trim()) return null;

    if (input.includes('caldav')) return 'caldav';
    if (input.startsWith('webcal://') || input.endsWith('.ics')) return 'ical';
    if (input.includes('webhook')) return 'webhook';
    if (input.includes('BEGIN:VCALENDAR')) return 'ical';

    return 'api-key';
  };

  const getConnectionTypeLabel = (type: ConnectionType): string => {
    const labels: Record<string, string> = {
      'api-key': 'API Key',
      'ical': 'iCal Feed',
      'caldav': 'CalDAV',
      'webhook': 'Webhook',
    };
    return type ? labels[type] : '';
  };

  const handleConnect = async () => {
    if (!connectionInput.trim() && !selectedMethod) return;

    setIsTesting(true);
    const type = selectedMethod || detectConnectionType(connectionInput);
    setDetectedType(type);

    // Simulate testing connection
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsTesting(false);

    // Prototype: Only "key" works, anything else fails
    if (connectionInput.trim().toLowerCase() === 'key') {
      // Successful connection
      const newPlatform: ConnectedPlatform = {
        id: Date.now().toString(),
        platform: 'OpenTable',
        connectionType: type,
        lastSynced: new Date(),
        apiKey: connectionInput,
        connected: true,
        isConnected: true
      };

      const updated = [...connectedPlatforms, newPlatform];
      setConnectedPlatforms(updated);
      localStorage.setItem('externalSyncPlatforms', JSON.stringify(updated));

      // Dispatch event to trigger filter UI update
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('acesai-local-storage-changed', {
          detail: { key: 'externalSyncPlatforms', value: JSON.stringify(updated) }
        }));
      }

      // Clear failed state on success
      setConnectionInput('');
      setSelectedMethod('api-key');
      setConnectionFailed(false);
      setTroubleshootSent(false);
      setIsAddingPlatform(false);

      // Remove this connection type from failed states (handleConnect)
      const newStates = { ...failedStates };
      delete newStates[type || 'api-key'];
      setFailedStates(newStates);
      localStorage.setItem('failedConnectionStates', JSON.stringify(newStates));

      if (type === 'ical') {
        toast.warning("iCal is read-only. Consider enabling Aces AI Booking System.");
      } else {
        toast.success("Successfully connected!");
      }
    } else {
      // Connection failed - Save state per connection type
      setConnectionFailed(true);
      const newStates = {
        ...failedStates,
        [selectedMethod || type || 'api-key']: {
          input: connectionInput,
          failed: true,
          troubleshootSent: false
        }
      };
      setFailedStates(newStates);
      localStorage.setItem('failedConnectionStates', JSON.stringify(newStates));
      toast.error("Connection failed. Please check your credentials.");
    }
  };

  const handleTroubleshoot = async () => {
    // For failed connection - send diagnostics immediately without modal
    setIsConnectedPlatformTroubleshoot(false);

    // Simulate sending email to support@acesai.me
    await new Promise(resolve => setTimeout(resolve, 1500));

    setTroubleshootSent(true);

    // Save troubleshoot sent state per connection type
    const newStates = {
      ...failedStates,
      [selectedMethod || 'api-key']: {
        input: connectionInput,
        failed: connectionFailed,
        troubleshootSent: true
      }
    };
    setFailedStates(newStates);
    localStorage.setItem('failedConnectionStates', JSON.stringify(newStates));

    toast.success("Diagnostics sent to our support team!");

    // In real implementation, send email here
    console.log('Email sent to support@acesai.me with connection failure diagnostics');
  };

  const handleTryAgain = async () => {
    // Don't reset anything, just retry the connection with existing input
    if (!connectionInput.trim() && !selectedMethod) return;

    setIsTesting(true);
    const type = selectedMethod || detectConnectionType(connectionInput);
    setDetectedType(type);

    // Simulate testing connection
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsTesting(false);

    // Prototype: Only "key" works, anything else fails
    if (connectionInput.trim().toLowerCase() === 'key') {
      // Successful connection
      const newPlatform: ConnectedPlatform = {
        id: Date.now().toString(),
        platform: 'OpenTable',
        connectionType: type,
        lastSynced: new Date(),
        apiKey: connectionInput,
        connected: true,
        isConnected: true
      };

      const updated = [...connectedPlatforms, newPlatform];
      setConnectedPlatforms(updated);
      localStorage.setItem('externalSyncPlatforms', JSON.stringify(updated));

      // Dispatch event to trigger filter UI update
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('acesai-local-storage-changed', {
          detail: { key: 'externalSyncPlatforms', value: JSON.stringify(updated) }
        }));
      }

      // Clear failed state on success
      setConnectionInput('');
      setSelectedMethod('api-key');
      setConnectionFailed(false);
      setTroubleshootSent(false);
      setIsAddingPlatform(false);

      // Remove this connection type from failed states (handleTryAgain)
      const newStates = { ...failedStates };
      delete newStates[type || 'api-key'];
      setFailedStates(newStates);
      localStorage.setItem('failedConnectionStates', JSON.stringify(newStates));

      if (type === 'ical') {
        toast.warning("iCal is read-only. Consider enabling Aces AI Booking System.");
      } else {
        toast.success("Successfully connected!");
      }
    } else {
      // Connection failed again - keep the same troubleshootSent state
      setConnectionFailed(true);
      // Don't change troubleshootSent - keep it as is
      const currentTroubleshootState = failedStates[selectedMethod || type || 'api-key']?.troubleshootSent || troubleshootSent;
      const newStates = {
        ...failedStates,
        [selectedMethod || type || 'api-key']: {
          input: connectionInput,
          failed: true,
          troubleshootSent: currentTroubleshootState
        }
      };
      setFailedStates(newStates);
      localStorage.setItem('failedConnectionStates', JSON.stringify(newStates));
      toast.error("Connection failed. Please check your credentials.");
    }
  };

  const handleContactUs = () => {
    setContactUsMessage('');
    setContactUsError(false);
    setShowContactUsModal(true);
  };

  const handleSendContactUs = async () => {
    // Validate minimum 5 characters
    if (contactUsMessage.trim().length < 5) {
      setContactUsError(true);
      return;
    }

    // Simulate sending email to support@acesai.me
    await new Promise(resolve => setTimeout(resolve, 1500));

    setShowContactUsModal(false);
    toast.success("Message sent to our support team!");

    // In real implementation, send email here
    console.log('Email sent to support@acesai.me with user message:', contactUsMessage);
  };

  const handleSyncNow = async (platformId: string) => {
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const updated = connectedPlatforms.map(p =>
      p.id === platformId ? { ...p, lastSynced: new Date() } : p
    );
    setConnectedPlatforms(updated);
    localStorage.setItem('externalSyncPlatforms', JSON.stringify(updated));

    setIsSyncing(false);
    toast.success("Sync completed successfully!");
  };

  const handlePlatformTroubleshoot = () => {
    setTroubleshootMessage('');
    setTroubleshootError(false);
    setShowTroubleshootModal(true);
    setIsConnectedPlatformTroubleshoot(true);
  };

  const handleSendDiagnostics = async () => {
    // Only validate if it's from connected platform troubleshoot
    if (isConnectedPlatformTroubleshoot) {
      if (troubleshootMessage.trim().length < 5) {
        setTroubleshootError(true);
        return;
      }
    }

    // Simulate sending email to support@acesai.me
    await new Promise(resolve => setTimeout(resolve, 1500));

    setShowTroubleshootModal(false);
    toast.success("Diagnostics sent to our support team!");

    // In real implementation, send email here
    if (isConnectedPlatformTroubleshoot) {
      console.log('Email sent to support@acesai.me with user message:', troubleshootMessage);
    } else {
      console.log('Email sent to support@acesai.me with connection failure diagnostics');
    }
  };

  const handleDisconnect = (platformId: string) => {
    const updated = connectedPlatforms.filter(p => p.id !== platformId);
    setConnectedPlatforms(updated);
    localStorage.setItem('externalSyncPlatforms', JSON.stringify(updated));
    toast.success("Platform disconnected successfully");
  };

  const handleAddPlatform = () => {
    setIsAddingPlatform(true);
    setSelectedMethod('api-key');

    // Load state for API key if it exists
    if (failedStates['api-key']) {
      setConnectionInput(failedStates['api-key'].input);
      setConnectionFailed(failedStates['api-key'].failed);
      setTroubleshootSent(failedStates['api-key'].troubleshootSent);
      setDetectedType('api-key');
    } else {
      setConnectionInput('');
      setConnectionFailed(false);
      setTroubleshootSent(false);
      setDetectedType(null);
    }
  };

  const handleCancelAddPlatform = () => {
    setIsAddingPlatform(false);
    setConnectionInput('');
    setConnectionFailed(false);
    setTroubleshootSent(false);
    setSelectedMethod('api-key');
  };

  const getTimeAgo = (date: Date): string => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 min ago';
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
  };

  const handleMethodSelect = (type: ConnectionType) => {
    // Save current state before switching
    if (selectedMethod && (connectionInput.trim() || connectionFailed)) {
      const newStates = {
        ...failedStates,
        [selectedMethod]: {
          input: connectionInput,
          failed: connectionFailed,
          troubleshootSent: troubleshootSent
        }
      };
      setFailedStates(newStates);
      localStorage.setItem('failedConnectionStates', JSON.stringify(newStates));
    }

    // Load state for the selected type if it exists
    setSelectedMethod(type);
    const typeKey = type || 'api-key'; // Handle null case
    if (failedStates[typeKey]) {
      setConnectionInput(failedStates[typeKey].input);
      setConnectionFailed(failedStates[typeKey].failed);
      setTroubleshootSent(failedStates[typeKey].troubleshootSent);
      setDetectedType(type);
    } else {
      // Fresh state for this type
      setConnectionInput('');
      setConnectionFailed(false);
      setTroubleshootSent(false);
      setDetectedType(type);
    }
  };

  const connectionMethods = [
    {
      icon: <Globe className="w-5 h-5" />,
      label: 'API Key',
      desc: 'Direct integration with platform API',
      type: 'api-key' as ConnectionType
    },
    {
      icon: <CalendarIcon className="w-5 h-5" />,
      label: 'iCal/ICS Feed',
      desc: 'Calendar subscription (read-only)',
      type: 'ical' as ConnectionType
    },
    {
      icon: <CloudUpload className="w-5 h-5" />,
      label: 'CalDAV',
      desc: 'Universal Calendar Connection',
      type: 'caldav' as ConnectionType
    },
    {
      icon: <Webhook className="w-5 h-5" />,
      label: 'Webhook',
      desc: 'Real-time event notifications',
      type: 'webhook' as ConnectionType
    },
  ];

  // Helper function to get the label for a connection type
  const getConnectionLabel = (type: ConnectionType) => {
    const method = connectionMethods.find(m => m.type === type);
    return method ? method.label : 'API';
  };

  const isFirstPlatform = connectedPlatforms.length === 0;
  const showConnectionForm = connectedPlatforms.length === 0 || isAddingPlatform;

  return (
    <div className="w-full bg-white dark:bg-gray-800">
      {/* Floating back button */}
      <div
        onClick={isAddingPlatform ? handleCancelAddPlatform : onBack}
        style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
        className="flex items-center px-6 mx-4 mt-3 mb-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg"
      >
        <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-2" />
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {isAddingPlatform ? 'Cancel Adding Platform' : 'Request Sync to External Platform'}
        </span>
      </div>

      {/* Content */}
      <div className="px-4 pt-6 pb-6 space-y-4">

        {showConnectionForm ? (
          <>
            {/* Smart Input Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 px-2">
                {isAddingPlatform ? 'Add Another Platform' : 'Connect Your Platform'}
              </h3>

              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-3">
                <Label className="text-xs text-gray-600 dark:text-gray-400 block">
                  {selectedMethod
                    ? `Paste your ${getConnectionTypeLabel(selectedMethod)} details below`
                    : 'Paste your API key, calendar URL, or webhook endpoint'
                  }
                </Label>

                <textarea
                  value={connectionInput}
                  onChange={(e) => {
                    setConnectionInput(e.target.value);
                    if (e.target.value.trim()) {
                      setDetectedType(detectConnectionType(e.target.value));
                      setSelectedMethod(null);
                    } else {
                      setDetectedType(null);
                    }
                  }}
                  placeholder={
                    selectedMethod === 'api-key' ? 'sk_live_...' :
                      selectedMethod === 'ical' ? 'webcal://... or https://...calendar.ics' :
                        selectedMethod === 'caldav' ? 'https://caldav.example.com/...' :
                          selectedMethod === 'webhook' ? 'https://your-webhook-endpoint.com/...' :
                            'https://caldav.example.com/... or your API key'
                  }
                  className={`w-full px-3 py-2 text-sm rounded-md border ${connectionFailed
                    ? 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700'
                    } text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono`}
                  rows={4}
                />

                {connectionFailed ? (
                  <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-200 dark:border-red-800">
                    <AlertCircle className="w-4 h-4" />
                    <span>Failed to connect {getConnectionLabel(selectedMethod || detectedType)}</span>
                  </div>
                ) : (detectedType || selectedMethod) ? (
                  <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                    <Check className="w-4 h-4" />
                    <span>
                      {selectedMethod
                        ? `Ready to connect: ${getConnectionTypeLabel(selectedMethod)}`
                        : `Detected: ${getConnectionTypeLabel(detectedType)}`
                      }
                    </span>
                  </div>
                ) : null}

                {!connectionFailed && !troubleshootSent && (
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleConnect}
                    disabled={(!connectionInput.trim() && !selectedMethod) || isTesting}
                  >
                    {isTesting ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Testing Connection...
                      </>
                    ) : (
                      'Detect & Connect'
                    )}
                  </Button>
                )}

                {connectionFailed && !troubleshootSent && (
                  <>
                    {isTesting ? (
                      <Button
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                        disabled
                      >
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Testing Connection...
                      </Button>
                    ) : (
                      <>
                        <div className="flex gap-2">
                          <Button
                            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white"
                            onClick={handleTryAgain}
                          >
                            Try Again
                          </Button>
                          <Button
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleTroubleshoot}
                            disabled={!connectionInput.trim()}
                          >
                            <Wrench className="w-4 h-4 mr-2" />
                            Troubleshoot
                          </Button>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full mt-2"
                          onClick={() => {
                            // Clear state for this method in localStorage
                            const newStates = { ...failedStates };
                            delete newStates[selectedMethod || 'api-key'];
                            setFailedStates(newStates);
                            localStorage.setItem('failedConnectionStates', JSON.stringify(newStates));

                            // Reset component state
                            setIsAddingPlatform(false);
                            setSelectedMethod('api-key');
                            setConnectionInput('');
                            setConnectionFailed(false);
                            setTroubleshootSent(false);
                            setDetectedType(null);
                          }}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </>
                )}

                {troubleshootSent && (
                  <>
                    {isTesting ? (
                      <Button
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                        disabled
                      >
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Testing Connection...
                      </Button>
                    ) : (
                      <>
                        <div className="flex gap-2">
                          <Button
                            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white"
                            onClick={handleTryAgain}
                          >
                            Try Again
                          </Button>
                          <Button
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={handleContactUs}
                          >
                            Contact Us
                          </Button>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full mt-2"
                          onClick={() => {
                            // Clear state for this method in localStorage
                            const newStates = { ...failedStates };
                            delete newStates[selectedMethod || 'api-key'];
                            setFailedStates(newStates);
                            localStorage.setItem('failedConnectionStates', JSON.stringify(newStates));

                            // Reset component state
                            setIsAddingPlatform(false);
                            setSelectedMethod('api-key');
                            setConnectionInput('');
                            setConnectionFailed(false);
                            setTroubleshootSent(false);
                            setDetectedType(null);
                          }}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      {isFirstPlatform ? (
                        <>
                          Please allow us 5 business days to resolve. <span className="font-medium text-blue-600 dark:text-blue-400">Your subscription time is paused and will resume regular payment scheduling once we have fixed this for you.</span> In the meantime, please enjoy Aces AI's other working features.
                        </>
                      ) : (
                        <>
                          Please allow us 5 business days to resolve. In the meantime, you can use your already working platform or our other features. <span className="text-gray-500 dark:text-gray-500">(Subscription pause is not applied for second sync)</span>
                        </>
                      )}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* OR Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  OR choose connection type
                </span>
              </div>
            </div>

            {/* Connection Methods */}
            <div className="space-y-2">
              {connectionMethods.map((method) => (
                <div
                  key={method.label}
                  onClick={() => handleMethodSelect(method.type)}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${selectedMethod === method.type
                    ? 'border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                >
                  <div className="text-blue-600 dark:text-blue-400">
                    {method.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{method.label}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{method.desc}</p>
                  </div>
                  {selectedMethod === method.type && (
                    <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Connected Platforms List */}
            {connectedPlatforms.map((platform) => (
              <div key={platform.id} className="space-y-3">
                {/* iCal Warning */}
                {platform.connectionType === 'ical' && (
                  <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        iCal Connection is Read-Only
                      </p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                        We can view your existing bookings but cannot create new ones. Enable "Aces AI Booking System"
                        to accept bookings from WhatsApp and other channels.
                      </p>
                    </div>
                  </div>
                )}

                {/* Connection Status */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 px-2">
                    {platform.platform} - Connection Status
                  </h3>

                  <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-4">
                    {/* Platform */}
                    <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Platform</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {platform.platform}
                      </span>
                    </div>

                    {/* Connection Type */}
                    <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Connection Type</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {getConnectionTypeLabel(platform.connectionType)}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">Connected</span>
                      </div>
                    </div>

                    {/* Last Synced */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Last Synced</span>
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {getTimeAgo(platform.lastSynced)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleSyncNow(platform.id)}
                        disabled={isSyncing}
                      >
                        {isSyncing ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                            Syncing...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4 mr-1" />
                            Sync Now
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={handlePlatformTroubleshoot}
                      >
                        <Wrench className="w-4 h-4 mr-1" />
                        Troubleshoot
                      </Button>
                    </div>

                    {/* Disconnect Button */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full cursor-pointer border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                      onClick={() => handleDisconnect(platform.id)}
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Another Platform Button - Outside the map */}
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all border-2 border-blue-600 hover:border-blue-800"
              onClick={handleAddPlatform}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Platform
            </Button>

            {/* Save Settings Button */}
            <div className="pt-2">
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white transition-all border-2 border-green-600 hover:border-green-800"
                onClick={() => {
                  toast.success("External sync settings saved!");
                  setTimeout(() => {
                    onBack();
                  }, 1000);
                }}
              >
                Save Settings
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Troubleshoot Modal */}
      <Dialog open={showTroubleshootModal} onOpenChange={setShowTroubleshootModal}>
        <DialogContent className="bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">Send Diagnostics to Support</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              We'll send your connection diagnostics to our support team at <span className="font-mono text-blue-600 dark:text-blue-400">support@acesai.me</span> to help resolve this issue.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            <Label className="text-sm text-gray-900 dark:text-gray-100">
              Describe the issue you're experiencing
            </Label>
            <textarea
              value={troubleshootMessage}
              onChange={(e) => {
                setTroubleshootMessage(e.target.value);
                if (troubleshootError && e.target.value.trim().length >= 5) {
                  setTroubleshootError(false);
                }
              }}
              placeholder="Please describe what's happening with your connection..."
              className={`w-full px-3 py-2 text-sm rounded-md border ${troubleshootError
                ? 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                } text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ${troubleshootError ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
              rows={4}
            />
            {troubleshootError && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Minimum 5 characters required. Please provide more detail about the issue.
              </p>
            )}
          </div>

          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setShowTroubleshootModal(false);
                setTroubleshootError(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSendDiagnostics}
            >
              <Mail className="w-4 h-4 mr-2" />
              Send to Support
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Us Modal */}
      <Dialog open={showContactUsModal} onOpenChange={setShowContactUsModal}>
        <DialogContent className="bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">Contact Support</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Send us a message and we'll get back to you, or call us directly for immediate assistance.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            <Label className="text-sm text-gray-900 dark:text-gray-100">
              Message (optional)
            </Label>
            <textarea
              value={contactUsMessage}
              onChange={(e) => {
                setContactUsMessage(e.target.value);
                if (contactUsError && e.target.value.trim().length >= 5) {
                  setContactUsError(false);
                }
              }}
              placeholder="Tell us how we can help..."
              className={`w-full px-3 py-2 text-sm rounded-md border ${contactUsError
                ? 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                } text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ${contactUsError ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
              rows={4}
            />
            {contactUsError && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Minimum 5 characters required. Please provide more detail.
              </p>
            )}

            {/* Phone Number */}
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Call us directly:</p>
              <a
                href="tel:+971563729686"
                className="text-lg font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                +971 56 372 9686
              </a>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setShowContactUsModal(false);
                setContactUsError(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSendContactUs}
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}