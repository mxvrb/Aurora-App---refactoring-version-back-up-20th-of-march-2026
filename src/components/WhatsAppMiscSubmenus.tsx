import React, { useContext } from 'react';
import { ChevronLeft, ChevronRight, Plus, Edit, Trash2, Info } from 'lucide-react';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { toast } from 'sonner';
import LucideUserRoundCog from '../imports/LucideUserRoundCog';
import Vector from '../imports/Vector';
import { OfflineStorageManager } from '../utils/offlineStorage';
import { FilterContext } from '../contexts/FilterContext';

interface StaffMember {
  id: string;
  firstName: string;
  role: string;
  [key: string]: any;
}

interface WhatsAppMiscSubmenusProps {
  activeSubmenu: string | null;
  setActiveSubmenu: (submenu: string | null) => void;
  handleNavigationAttempt: (target: string | null) => void;
  setIsLearnModalOpen: (open: boolean) => void;

  // Edit Profile
  companyName: string;
  tempBusinessName: string;
  setTempBusinessName: (v: string) => void;
  setBusinessName: (v: string) => void;
  tempBio: string;
  setTempBio: (v: string) => void;
  setBio: (v: string) => void;
  tempWebsite: string;
  setTempWebsite: (v: string) => void;
  setWebsite: (v: string) => void;
  tempBusinessEmail: string;
  setTempBusinessEmail: (v: string) => void;
  setBusinessEmail: (v: string) => void;
  tempBusinessLocation: string;
  setTempBusinessLocation: (v: string) => void;
  setBusinessLocation: (v: string) => void;

  // Manage Staff
  staffMembers: StaffMember[];
  setStaffMembers: (v: StaffMember[]) => void;
  setEditingStaffMember: (v: StaffMember | null) => void;
  setIsAddStaffModalOpen: (v: boolean) => void;

  // Custom Keywords
  tempCustomKeywords: string;
  setTempCustomKeywords: (v: string) => void;
  setCustomKeywords: (v: string) => void;

  // Auto Translation
  tempAutoTranslationDetection: boolean;
  setTempAutoTranslationDetection: (v: boolean) => void;
  setAutoTranslationDetection: (v: boolean) => void;

  // Auto Signature
  tempAutoSignature: string;
  setTempAutoSignature: (v: string) => void;
  setAutoSignature: (v: string) => void;

  // Handoff
  tempHandoff: boolean;
  setTempHandoff: (v: boolean) => void;
  setHandoff: (v: boolean) => void;

  // API Credentials
  selectedModel: string;
  tempApiCredentials: Record<string, { apiKey: string; apiSecret: string }>;
  setTempApiCredentials: (v: any) => void;
  setApiCredentials: (v: any) => void;
  setApiProvider: (v: string) => void;

  // Reset Account
  resetConfirmation: string;
  setResetConfirmation: (v: string) => void;
  whatsappPhone: string;
  setTimezone: (v: string) => void;
  setSavedBusinessHours: (v: any) => void;
  setHolidayDays: (v: any[]) => void;
  setBusinessHours: (v: any) => void;
  setTempTimezone: (v: string) => void;
  setSelectedModel: (v: string) => void;
}

const HANDLED_SUBMENUS = [
  'edit-whatsapp-profile', 'edit-staff', 'custom-keywords',
  'auto-translation', 'auto-signature', 'handoff',
  'api-credentials', 'reset-account'
];

export function WhatsAppMiscSubmenus(props: WhatsAppMiscSubmenusProps) {
  const { activeSubmenu } = props;
  const { getFilterClasses } = useContext(FilterContext);
  const offlineStorage = OfflineStorageManager.getInstance();
  
  if (!activeSubmenu || !HANDLED_SUBMENUS.includes(activeSubmenu)) {
    return null;
  }

  // ── edit-whatsapp-profile ──
  if (activeSubmenu === 'edit-whatsapp-profile') {
    return (
      <div className="w-full bg-white dark:bg-gray-800">
        <div 
          onClick={() => props.handleNavigationAttempt(null)}
          style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
          className="flex items-center px-6 mx-4 mt-3 mb-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg"
        >
          <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-2" />
          <span className="font-medium text-gray-900 dark:text-gray-100">Edit Profile</span>
        </div>
        
        <div className="px-6 pt-4 pb-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ai-name" className="text-gray-900 dark:text-gray-100">Profile Name</Label>
            <Input
              id="ai-name"
              type="text"
              placeholder={props.companyName || ""}
              value={props.tempBusinessName}
              onChange={(e) => props.setTempBusinessName(e.target.value)}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ai-bio" className="text-gray-900 dark:text-gray-100">About</Label>
            <textarea
              id="ai-bio"
              rows={3}
              placeholder="Enter information about your business"
              value={props.tempBio}
              onChange={(e) => {
                props.setTempBio(e.target.value);
                const textarea = e.target;
                const baseHeight = 36;
                textarea.style.height = `${baseHeight}px`;
                const scrollHeight = textarea.scrollHeight;
                if (scrollHeight > baseHeight) {
                  textarea.style.height = `${scrollHeight}px`;
                }
              }}
              className="w-full min-w-0 rounded-md border px-3 py-2 text-base md:text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 resize-none bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="text-gray-900 dark:text-gray-100">Website URL</Label>
            <Input
              id="website"
              type="url"
              placeholder="https://example.com"
              value={props.tempWebsite}
              onChange={(e) => props.setTempWebsite(e.target.value)}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-900 dark:text-gray-100">Business Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="contact@example.com"
              value={props.tempBusinessEmail}
              onChange={(e) => props.setTempBusinessEmail(e.target.value)}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your business email for WhatsApp profile display
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-gray-900 dark:text-gray-100">Business Location</Label>
            <Input
              id="location"
              type="text"
              placeholder="City, Country or Full Address"
              value={props.tempBusinessLocation}
              onChange={(e) => props.setTempBusinessLocation(e.target.value)}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This location will be visible in your WhatsApp Business Profile
            </p>
          </div>
          
          <Button 
            onClick={() => {
              props.setBusinessName(props.tempBusinessName);
              props.setBio(props.tempBio);
              props.setWebsite(props.tempWebsite);
              props.setBusinessEmail(props.tempBusinessEmail);
              props.setBusinessLocation(props.tempBusinessLocation);
              props.setActiveSubmenu(null);
              toast.success('Profile updated successfully');
            }}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white ${getFilterClasses('Edit Profile')}`}
          >
            Save Changes
          </Button>
        </div>
      </div>
    );
  }

  // ── edit-staff ──
  if (activeSubmenu === 'edit-staff') {
    return (
      <div className="w-full bg-white dark:bg-gray-800">
        <div className="relative bg-white dark:bg-gray-800">
          <div className="px-6 py-4 flex items-center justify-between border-b border-transparent">
            <span className="font-medium opacity-0">Spacer</span>
          </div>
          <div className="px-6 py-4 flex items-center justify-between border-b border-transparent">
            <span className="font-medium opacity-0">Spacer</span>
          </div>
          <div className="px-6 py-4 flex items-center justify-between border-b border-transparent">
            <span className="font-medium opacity-0">Spacer</span>
          </div>
          <div className="px-6 py-4 flex items-center justify-between border-b border-transparent">
            <span className="font-medium opacity-0">Spacer</span>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="w-[68px] h-[68px] rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-4 shadow-xl">
              <LucideUserRoundCog className="w-[34px] h-[34px] text-white drop-shadow-lg" />
            </div>
            <span className="font-medium text-gray-900 dark:text-gray-100 mb-2 drop-shadow-md">Manage Staff</span>
            <p className="text-sm text-gray-900 dark:text-gray-100 text-center max-w-xl drop-shadow-md">Manage staff members and their permissions such as role assignments, access levels, and account settings.</p>
          </div>
          <button
            onClick={() => {
              console.log('Learn button clicked - Manage Staff');
              props.setIsLearnModalOpen(true);
            }}
            title="Learn how to use Aces AI"
            className="absolute top-6 right-6 flex items-center space-x-2 text-gray-500 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors cursor-pointer pointer-events-auto"
          >
            <div className="w-5 h-5">
              <Vector />
            </div>
            <span className="font-medium">Learn</span>
          </button>
        </div>

        <div className="flex flex-col gap-3 px-4 pb-3">
          {/* Add Staff Button — always full width */}
          <div
            onClick={() => {
              props.setEditingStaffMember(null);
              props.setIsAddStaffModalOpen(true);
            }}
            style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
            className={`flex items-center justify-center px-6 bg-blue-600 backdrop-blur-xl rounded-2xl shadow-lg hover:bg-blue-700 transition-all cursor-pointer text-white border border-blue-500 ${getFilterClasses('Add Staff Member')}`}
          >
            <Plus className="w-5 h-5 mr-2" />
            <span className="font-medium">Add Staff Member</span>
          </div>

          {/* Staff List with hover-reveal trash */}
          {props.staffMembers.map(staff => (
            <div
              key={staff.id}
              onClick={() => {
                props.setEditingStaffMember(staff);
                props.setActiveSubmenu('edit-staff-page');
              }}
              style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
              className="group flex items-center justify-between px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg"
            >
              <span className="font-medium text-gray-900 dark:text-gray-100">{staff.firstName}</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 dark:text-gray-400 text-sm capitalize">{staff.role}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    props.setStaffMembers(props.staffMembers.filter(s => s.id !== staff.id));
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <ChevronRight className="w-5 h-5 text-gray-900 dark:text-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── custom-keywords ──
  if (activeSubmenu === 'custom-keywords') {
    return (
      <div className="w-full bg-white dark:bg-gray-800">
        <div 
          onClick={() => props.setActiveSubmenu('edit-template')}
          className="flex items-center px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-gray-100 mr-3" />
          <span className="font-medium text-gray-900 dark:text-gray-100">Custom Keywords</span>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="custom-keywords" className="text-gray-900 dark:text-gray-100">Keywords & Triggers</Label>
            <textarea
              id="custom-keywords"
              rows={6}
              placeholder="Define keywords that trigger specific responses (e.g., 'pricing' -> send price list, 'hours' -> share business hours)"
              value={props.tempCustomKeywords}
              onChange={(e) => props.setTempCustomKeywords(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Add keywords that should trigger specific automated responses
            </p>
          </div>
          
          <Button 
            onClick={() => {
              props.setCustomKeywords(props.tempCustomKeywords);
              props.setActiveSubmenu('edit-template');
              toast.success('Custom keywords updated successfully');
            }}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white ${getFilterClasses('Customize Responses')}`}
          >
            Save Keywords
          </Button>
        </div>
      </div>
    );
  }

  // ── auto-translation ──
  if (activeSubmenu === 'auto-translation') {
    return (
      <div className="w-full bg-white dark:bg-gray-800">
        <div 
          onClick={() => props.setActiveSubmenu('edit-template')}
          className="flex items-center px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-gray-100 mr-3" />
          <span className="font-medium text-gray-900 dark:text-gray-100">Auto Translation Detection</span>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <Label className="text-gray-900 dark:text-gray-100">Auto-Detect & Translate</Label>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex-1">
                <p className="text-gray-900 dark:text-gray-100">Automatic Language Translation</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Detect customer language and respond in their language</p>
              </div>
              <Switch
                checked={props.tempAutoTranslationDetection}
                onCheckedChange={props.setTempAutoTranslationDetection}
                className="ml-4"
              />
            </div>
          </div>
          
          <Button 
            onClick={() => {
              props.setAutoTranslationDetection(props.tempAutoTranslationDetection);
              props.setActiveSubmenu('edit-template');
              toast.success('Auto translation settings updated successfully');
            }}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white ${getFilterClasses('Secondary Languages')}`}
          >
            Save Settings
          </Button>
        </div>
      </div>
    );
  }

  // ── auto-signature ──
  if (activeSubmenu === 'auto-signature') {
    return (
      <div className="w-full bg-white dark:bg-gray-800">
        <div 
          onClick={() => props.setActiveSubmenu('edit-template')}
          className="flex items-center px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-gray-100 mr-3" />
          <span className="font-medium text-gray-900 dark:text-gray-100">Auto Signature</span>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="auto-signature" className="text-gray-900 dark:text-gray-100">Message Signature</Label>
            <textarea
              id="auto-signature"
              rows={4}
              placeholder="Add a signature that will be automatically appended to AI responses (e.g., 'Best regards, Support Team')"
              value={props.tempAutoSignature}
              onChange={(e) => props.setTempAutoSignature(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              This signature will be added to the end of every AI response
            </p>
          </div>
          
          <Button 
            onClick={() => {
              props.setAutoSignature(props.tempAutoSignature);
              props.setActiveSubmenu('edit-template');
              toast.success('Auto signature updated successfully');
            }}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white ${getFilterClasses('Shape AI Persona')}`}
          >
            Save Signature
          </Button>
        </div>
      </div>
    );
  }

  // ── handoff ──
  if (activeSubmenu === 'handoff') {
    return (
      <div className="w-full bg-white dark:bg-gray-800">
        <div 
          onClick={() => props.handleNavigationAttempt(null)}
          style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
          className="flex items-center px-6 mx-4 mt-3 mb-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg"
        >
          <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-2" />
          <span className="font-medium text-gray-900 dark:text-gray-100">Handoff to Human Agent</span>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <Label className="text-gray-900 dark:text-gray-100">Human Handoff</Label>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex-1">
                <p className="text-gray-900 dark:text-gray-100">Transfer to Human Agent</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Allow AI to transfer complex conversations to a human agent</p>
              </div>
              <Switch
                checked={props.tempHandoff}
                onCheckedChange={props.setTempHandoff}
                className="ml-4"
              />
            </div>
          </div>
          
          <Button 
            onClick={() => {
              props.setHandoff(props.tempHandoff);
              props.setActiveSubmenu(null);
              toast.success('Handoff settings updated successfully');
            }}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white ${getFilterClasses('Enable Human Assistance')}`}
          >
            Save Settings
          </Button>
        </div>
      </div>
    );
  }

  // ── api-credentials ──
  if (activeSubmenu === 'api-credentials') {
    return (
      <div className="w-full bg-white dark:bg-gray-800">
        <div 
          onClick={() => props.handleNavigationAttempt(null)}
          style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
          className="flex items-center px-6 mx-4 mt-3 mb-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg"
        >
          <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-2" />
          <span className="font-medium text-gray-900 dark:text-gray-100">Enter API & Credentials</span>
        </div>
        
        <div className="px-6 pt-4 pb-6 space-y-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <div className="text-sm font-medium text-amber-900 dark:text-amber-100">Advanced Settings - Not Required</div>
                <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                  This section is <strong>only for developers</strong> who want to integrate their own AI model instead of using our pre-configured AI system. 
                  Our platform works perfectly without any API credentials.
                </p>
                <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                  <strong>Please do not modify these settings</strong> unless you fully understand how to configure and use custom AI API integrations.
                </p>
              </div>
            </div>
          </div>

          {!props.selectedModel ? (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">Please select a model in the <strong>Choose Model</strong> section first to configure its API credentials.</p>
            </div>
          ) : (
            <>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2">
                <p className="text-sm text-blue-800 dark:text-blue-200">Editing credentials for: <strong>{props.selectedModel}</strong></p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-key" className="text-gray-900 dark:text-gray-100">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter API key"
                  value={props.tempApiCredentials[props.selectedModel]?.apiKey || ''}
                  onChange={(e) => props.setTempApiCredentials((prev: any) => ({ ...prev, [props.selectedModel]: { apiKey: e.target.value, apiSecret: prev[props.selectedModel]?.apiSecret || '' } }))}
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api-secret" className="text-gray-900 dark:text-gray-100">API Secret</Label>
                <Input
                  id="api-secret"
                  type="password"
                  placeholder="Enter API secret"
                  value={props.tempApiCredentials[props.selectedModel]?.apiSecret || ''}
                  onChange={(e) => props.setTempApiCredentials((prev: any) => ({ ...prev, [props.selectedModel]: { apiKey: prev[props.selectedModel]?.apiKey || '', apiSecret: e.target.value } }))}
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
              </div>
              
              <Button 
                onClick={() => {
                  props.setApiCredentials({ ...props.tempApiCredentials });
                  const creds = props.tempApiCredentials[props.selectedModel];
                  if (creds?.apiKey && creds?.apiSecret) {
                    const isOpenAI = creds.apiKey.startsWith('sk-');
                    props.setApiProvider(isOpenAI ? 'OpenAI' : 'Custom');
                  }
                  toast.success('API credentials saved successfully');
                  props.setActiveSubmenu(null);
                }}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white ${getFilterClasses('Enter API & Credentials')}`}
              >
                Save Credentials
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── reset-account ──
  if (activeSubmenu === 'reset-account') {
    return (
      <div className="w-full bg-white dark:bg-gray-800">
        <div 
          onClick={() => props.handleNavigationAttempt(null)}
          style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
          className="flex items-center px-6 mx-4 mt-3 mb-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg"
        >
          <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-2" />
          <span className="font-medium text-red-600 dark:text-red-400">Reset Account</span>
        </div>
        
        <div className="px-6 pt-4 pb-6 space-y-6">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-medium text-red-900 dark:text-red-100">Warning: This action cannot be undone</h4>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Resetting your account will clear all WhatsApp configuration including:
                </p>
                <ul className="text-sm text-red-700 dark:text-red-300 list-disc list-inside space-y-1 ml-2">
                  <li>Business name and about</li>
                  <li>Website and email</li>
                  <li>AI model selection</li>
                  <li>Timezone settings</li>
                  <li>API credentials</li>
                  <li>Staff information</li>
                  <li>Business hours and holiday days</li>
                  <li>Review settings</li>
                  <li>All custom configurations</li>
                </ul>
                <p className="text-sm text-red-700 dark:text-red-300 mt-2">
                  Your phone number ({props.whatsappPhone}) will be preserved.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              To confirm reset, please type <span className="font-semibold">RESET</span> below:
            </p>
            <Input
              id="reset-confirmation"
              type="text"
              placeholder="Type RESET to confirm"
              value={props.resetConfirmation}
              onChange={(e) => props.setResetConfirmation(e.target.value)}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
          </div>
          
          <div className="flex space-x-3">
            <Button 
              onClick={() => {
                props.setResetConfirmation('');
                props.setActiveSubmenu(null);
              }}
              variant="outline"
              className="flex-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (props.resetConfirmation === 'RESET') {
                  props.setBusinessName('');
                  props.setBio('');
                  props.setWebsite('');
                  props.setBusinessEmail('');
                  props.setBusinessLocation('');
                  props.setSelectedModel('');
                  props.setTimezone('');
                  props.setApiCredentials({ apiKey: '', apiSecret: '' });
                  props.setApiProvider('');
                  props.setSavedBusinessHours(null);
                  props.setHolidayDays([]);
                  props.setBusinessHours({
                    monday: { enabled: true, start: '9:00 AM', end: '5:00 PM' },
                    tuesday: { enabled: true, start: '9:00 AM', end: '5:00 PM' },
                    wednesday: { enabled: true, start: '9:00 AM', end: '5:00 PM' },
                    thursday: { enabled: true, start: '9:00 AM', end: '5:00 PM' },
                    friday: { enabled: true, start: '9:00 AM', end: '5:00 PM' },
                    saturday: { enabled: false, start: '9:00 AM', end: '5:00 PM' },
                    sunday: { enabled: false, start: '9:00 AM', end: '5:00 PM' }
                  });
                  
                  props.setTempBusinessName('');
                  props.setTempBio('');
                  props.setTempWebsite('');
                  props.setTempBusinessEmail('');
                  props.setTempBusinessLocation('');
                  props.setTempTimezone('');
                  props.setResetConfirmation('');
                  
                  try {
                    const currentPrefs = offlineStorage.getPreferences();
                    if (currentPrefs) {
                      offlineStorage.savePreferences({
                        ...currentPrefs,
                        businessHours: null,
                        holidayDays: []
                      });
                    }
                  } catch (error) {
                    console.log('Error clearing preferences:', error);
                  }
                  
                  props.setActiveSubmenu(null);
                  
                  toast.success('Account reset successfully', {
                    description: `Your WhatsApp account has been reset. Phone number ${props.whatsappPhone} is preserved.`,
                    duration: 5000,
                  });
                } else {
                  toast.error('Confirmation failed', {
                    description: 'Please type RESET exactly as shown to confirm.',
                    duration: 3000,
                  });
                }
              }}
              disabled={props.resetConfirmation !== 'RESET'}
              className={`flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white ${getFilterClasses('Reset Account')}`}
            >
              Reset Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
