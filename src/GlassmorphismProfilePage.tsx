import React, { useState, useEffect, useRef } from "react";
import { Toaster } from "./ui/sonner";
import { LoginScreen } from "./LoginScreen";
import { WelcomeScreen } from "./WelcomeScreen";
import { OnboardingScreens } from "./OnboardingScreens";
import { supabase } from "../utils/supabase/client";
import { copyToClipboard } from "./utils/clipboard";
import {
  projectId,
  publicAnonKey,
} from "../utils/supabase/info";
import { AcesLogo } from "./AcesLogo";
import { EditProfileModal } from "./EditProfileModal";
import { TierIndicator } from "./TierIndicator";
import { EnterpriseBadge } from "./EnterpriseBadge";
import {
  Sun,
  Moon,
  Home,
  Settings,
  Settings2,
  User,
  LogOut,
  Palette,
  Edit3,
  ExternalLink,
  Phone,
  MailIcon,
  Check,
  ChevronsUpDown,
  X,
  Globe,
  Book,
  Languages,
  Info,
  MessageCircleHeart,
  Plus,
  Mail,
  Link2,
  Copy,
  CheckCircle,
  Users,
  Share2,
} from "lucide-react";
import { PhonePreview } from "./components/PhonePreview";
import { Switch } from "./components/ui/switch";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/ui/popover";
import { motion } from "motion/react";
import { SettingsBottomDrawer } from "./components/SettingsBottomDrawer";
import { EditAIPreviewOverlay } from "./components/EditAIPreviewOverlay";
import { RequestServiceModal } from "./components/RequestServiceModal";
import { FeedbackModal } from "./components/FeedbackModal";

interface GlassmorphismProfilePageProps {
  // Theme
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;

  // User data
  userName: string;
  email: string;
  profilePhone?: string;
  profileWebsite?: string;
  profileImage: string | null;
  defaultProfileIcon: string;
  companyName: string;
  lineOfBusiness: string;
  userTier: "basic" | "pro" | "premium" | "enterprise" | "free";

  // Profile editing
  showProfileEdit: boolean;
  setShowProfileEdit: (value: boolean) => void;
  isLoading: boolean;

  // Company editing
  isEditingCompanyName: boolean;
  editCompanyName: string;
  setEditCompanyName: (value: string) => void;
  handleCompanyNameEdit: () => void;
  handleCompanyNameSave: () => void;
  handleCompanyNameCancel: () => void;

  // Business editing
  isEditingBusiness: boolean;
  editLineOfBusiness: string;
  setEditLineOfBusiness: (value: string) => void;
  showEditCustomBusiness: boolean;
  setShowEditCustomBusiness: (value: boolean) => void;
  editCustomBusiness: string;
  setEditCustomBusiness: (value: string) => void;
  editBusinessSelectOpen: boolean;
  setEditBusinessSelectOpen: (value: boolean) => void;
  editSearchValue: string;
  setEditSearchValue: (value: string) => void;
  editFilteredBusinesses: string[];
  handleBusinessEdit: () => void;
  handleBusinessSave: () => void;
  handleBusinessCancel: () => void;
  highlightMatch: (
    text: string,
    query: string,
  ) => React.ReactNode;

  // Tier management
  handleTierChange: (tier: string) => void;
  upgradeHighlight: boolean;

  // Actions
  handleLogout: () => void;
  setShowImageViewer: (value: boolean) => void;
  setShowLanguageModal: (value: boolean) => void;
  selectedLanguage: { code: string; name: string };

  // Error handling
  error: string | null;
  getDisplayableError: (error: string | null) => string | null;
  isOnline: boolean;
  serverAvailable: boolean;
  syncQueue: any[];

  // Profile editing trigger
  onEditProfile: () => void;

  // White Label navigation
  onWhiteLabelClick?: () => void;

  // AI Customization for Preview
  aiThemeColor: string;
  aiLogoUrl: string | null;
  aiGreeting: string | null;
  onAiSettingsChange?: (settings: { color?: string; logo?: string | null; greeting?: string }) => void;

  // White Label Settings Handlers
  onWhiteLabelLogoUpdate?: (logoUrl: string | null) => void;
  onWhiteLabelFaviconUpdate?: (faviconUrl: string | null) => void;
  onWhiteLabelLoadingIconUpdate?: (loadingIconUrl: string | null) => void;
  onWhiteLabelColorSchemeUpdate?: (color: string) => void;
  onWhiteLabelColorSchemeReset?: () => void;
}

export const GlassmorphismProfilePage: React.FC<
  GlassmorphismProfilePageProps
> = ({
  isDarkMode,
  setIsDarkMode,
  userName,
  email,
  profilePhone,
  profileWebsite,
  profileImage,
  defaultProfileIcon,
  companyName,
  lineOfBusiness,
  userTier,
  showProfileEdit,
  setShowProfileEdit,
  isLoading,
  isEditingCompanyName,
  editCompanyName,
  setEditCompanyName,
  handleCompanyNameEdit,
  handleCompanyNameSave,
  handleCompanyNameCancel,
  isEditingBusiness,
  editLineOfBusiness,
  setEditLineOfBusiness,
  showEditCustomBusiness,
  setShowEditCustomBusiness,
  editCustomBusiness,
  setEditCustomBusiness,
  editBusinessSelectOpen,
  setEditBusinessSelectOpen,
  editSearchValue,
  setEditSearchValue,
  editFilteredBusinesses,
  handleBusinessEdit,
  handleBusinessSave,
  handleBusinessCancel,
  highlightMatch,
  handleTierChange,
  upgradeHighlight,
  handleLogout,
  setShowImageViewer,
  setShowLanguageModal,
  selectedLanguage,
  error,
  getDisplayableError,
  isOnline,
  serverAvailable,
  syncQueue,
  onEditProfile,
  onWhiteLabelClick,
  aiThemeColor,
  aiLogoUrl,
  aiGreeting,
  onAiSettingsChange,
  onWhiteLabelLogoUpdate,
  onWhiteLabelFaviconUpdate,
  onWhiteLabelLoadingIconUpdate,
  onWhiteLabelColorSchemeUpdate,
  onWhiteLabelColorSchemeReset,
}) => {
    const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] = useState(false);
    const [isEditAIPreviewOpen, setIsEditAIPreviewOpen] = useState(false);
    const [isRequestServiceOpen, setIsRequestServiceOpen] = useState(false);
    const [isAutoTopUpEnabled, setIsAutoTopUpEnabled] = useState(true);
    const [showTopUpInfoModal, setShowTopUpInfoModal] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    // Member management state
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const [memberEmail, setMemberEmail] = useState("");
    const [inviteLinkCopied, setInviteLinkCopied] = useState(false);
    const [teamMembers, setTeamMembers] = useState<Array<{
      id: string;
      email: string;
      name: string;
      profileImage?: string;
      status: 'active' | 'pending';
      isOnline?: boolean;
      lastActive?: number;
    }>>([]);
    const addMemberRef = useRef<HTMLDivElement>(null);
    const [hoveredProfile, setHoveredProfile] = useState<'user' | 'member' | null>(null);

    // Load team members from localStorage on mount
    useEffect(() => {
      const savedMembers = localStorage.getItem('acesai_team_members');
      if (savedMembers) {
        try {
          setTeamMembers(JSON.parse(savedMembers));
        } catch (error) {
          console.error('Error loading team members:', error);
        }
      }
    }, []);

    // Save team members to localStorage whenever they change
    useEffect(() => {
      if (teamMembers.length > 0) {
        localStorage.setItem('acesai_team_members', JSON.stringify(teamMembers));
      } else {
        localStorage.removeItem('acesai_team_members');
      }
    }, [teamMembers]);

    // Click outside to close dropdown
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (addMemberRef.current && !addMemberRef.current.contains(event.target as Node)) {
          setIsAddMemberOpen(false);
        }
      };

      if (isAddMemberOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isAddMemberOpen]);

    // Track user activity to update online status
    useEffect(() => {
      const updateActivity = () => {
        localStorage.setItem('acesai_user_active', Date.now().toString());
      };

      // Update activity on mount and periodically
      updateActivity();
      const activityInterval = setInterval(updateActivity, 5000); // Update every 5 seconds

      // Check team members' online status
      const checkOnlineStatus = () => {
        setTeamMembers(prevMembers =>
          prevMembers.map(member => {
            const memberActivity = localStorage.getItem(`acesai_member_${member.id}_active`);
            const lastActive = memberActivity ? parseInt(memberActivity) : 0;
            const isOnline = Date.now() - lastActive < 15000; // Online if active within 15 seconds
            return { ...member, isOnline, lastActive };
          })
        );
      };

      const onlineCheckInterval = setInterval(checkOnlineStatus, 3000); // Check every 3 seconds

      return () => {
        clearInterval(activityInterval);
        clearInterval(onlineCheckInterval);
      };
    }, []);

    const handleAddMember = () => {
      if (memberEmail && memberEmail.includes('@')) {
        const newMember = {
          id: Date.now().toString(),
          email: memberEmail,
          name: memberEmail.split('@')[0],
          status: 'pending' as const,
          isOnline: false,
          lastActive: Date.now(),
        };
        setTeamMembers([...teamMembers, newMember]);
        setMemberEmail("");
        // Simulate member activity (in real app, this would be handled by backend)
        localStorage.setItem(`acesai_member_${newMember.id}_active`, Date.now().toString());
        // Here you would typically send an invitation email
      }
    };

    const handleRemoveMember = (id: string) => {
      setTeamMembers(teamMembers.filter(m => m.id !== id));
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-gray-950 dark:via-blue-950/30 dark:to-gray-950 transition-colors duration-300">
        {/* Header */}
        <div className="fixed top-0 left-20 right-0 z-40 px-8 py-4 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between w-full">
            {/* Logo/Brand */}
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>

            <div className="flex items-center space-x-4">
              {/* Team Members */}
              <div className="relative" ref={addMemberRef}>
                <div className="flex items-center">
                  {/* Current User Profile Picture */}
                  <div
                    className="relative group cursor-pointer"
                    onMouseEnter={() => setHoveredProfile('user')}
                    onMouseLeave={() => setHoveredProfile(null)}
                  >
                    <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold border-2 border-white dark:border-gray-800 shadow-lg z-30">
                      {profileImage ? (
                        <img src={profileImage} alt={userName} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-sm">{userName.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    {hoveredProfile === 'user' && (
                      <div className="absolute top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-white dark:bg-gray-700 text-gray-600 dark:text-white text-xs rounded-md whitespace-nowrap z-50 shadow-lg border border-gray-200 dark:border-transparent">
                        You
                      </div>
                    )}
                  </div>

                  {/* Middle Circle - Empty or Team Member */}
                  {teamMembers.filter(m => m.isOnline).length > 0 ? (
                    <div
                      className="relative group cursor-pointer"
                      style={{ marginLeft: '-12px' }}
                      onMouseEnter={() => setHoveredProfile('member')}
                      onMouseLeave={() => setHoveredProfile(null)}
                    >
                      <div className="relative w-10 h-10 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-lg transition-all z-20">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                          {teamMembers.filter(m => m.isOnline)[0].profileImage ? (
                            <img src={teamMembers.filter(m => m.isOnline)[0].profileImage} alt={teamMembers.filter(m => m.isOnline)[0].name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <span className="text-sm">{teamMembers.filter(m => m.isOnline)[0].name.charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        {teamMembers.filter(m => m.isOnline)[0].status === 'pending' && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-white dark:border-gray-800" title="Pending invitation" />
                        )}
                      </div>
                      {hoveredProfile === 'member' && (
                        <div className="absolute top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-white dark:bg-gray-700 text-gray-600 dark:text-white text-xs rounded-md whitespace-nowrap z-50 shadow-lg border border-gray-200 dark:border-transparent">
                          {teamMembers.filter(m => m.isOnline)[0].name}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      className="relative w-10 h-10 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-lg transition-all z-20"
                      style={{ marginLeft: '-12px' }}
                    >
                      <div className="w-full h-full rounded-full bg-gray-200/50 dark:bg-gray-700/50 backdrop-blur-sm border-2 border-dashed border-gray-300 dark:border-gray-600" />
                    </div>
                  )}

                  {/* Add Member Button */}
                  <button
                    onClick={() => setIsAddMemberOpen(!isAddMemberOpen)}
                    className="relative w-10 h-10 rounded-full bg-white dark:bg-gray-800 backdrop-blur-sm border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-lg cursor-pointer z-10"
                    style={{ marginLeft: '-12px' }}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Add Member Dropdown */}
                {isAddMemberOpen && (
                  <div
                    className="absolute top-14 left-1/2 -translate-x-1/2 w-[360px] z-50"
                    style={{ position: 'absolute' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* LED Glow Background */}
                    <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-cyan-400/30 via-blue-500/25 to-teal-400/30 dark:from-cyan-400/20 dark:via-blue-500/20 dark:to-teal-400/20 blur-xl animate-pulse pointer-events-none" style={{ zIndex: 0 }} />
                    <div className="absolute -inset-1.5 rounded-[20px] bg-gradient-to-br from-cyan-400/20 via-blue-500/15 to-teal-400/20 dark:from-cyan-400/15 dark:via-blue-500/12 dark:to-teal-400/15 blur-md pointer-events-none" style={{ zIndex: 0 }} />

                    {/* Main Card */}
                    <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-[0_0_30px_rgba(56,189,248,0.25),0_0_60px_rgba(59,130,246,0.15)] dark:shadow-[0_0_30px_rgba(56,189,248,0.15),0_0_60px_rgba(59,130,246,0.1)] border border-cyan-200/50 dark:border-cyan-500/20 overflow-hidden" style={{ position: 'relative', zIndex: 10 }}>
                      {/* Header with Gradient */}
                      <div className="bg-gradient-to-br from-teal-500 via-blue-500 to-cyan-600 dark:from-teal-600 dark:via-blue-600 dark:to-cyan-700 px-5 py-3.5">
                        <h3 className="text-sm font-semibold text-white">
                          Add Team Member
                        </h3>
                      </div>

                      {/* White Content Section */}
                      <div className="bg-white dark:bg-gray-900 p-5 space-y-4">
                        {/* Description */}
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                          Invite a team member to collaborate on your AI assistant. They'll be able to customize settings, edit responses, and manage conversations alongside you.
                        </p>

                        {/* Invite Link */}
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
                          <Link2 className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-0.5" />
                          <span className="flex-1 text-[11px] text-gray-500 dark:text-gray-400 truncate">
                            https://app.acesai.me/invite/team-x7k9m2p4q
                          </span>
                          <button
                            onClick={async () => {
                              await copyToClipboard('https://app.acesai.me/invite/team-x7k9m2p4q');
                              setInviteLinkCopied(true);
                              setTimeout(() => setInviteLinkCopied(false), 2000);
                            }}
                            className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${inviteLinkCopied
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                              : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-sm'
                              }`}
                          >
                            {inviteLinkCopied ? (
                              <>
                                <CheckCircle className="w-3 h-3" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                Copy Link
                              </>
                            )}
                          </button>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                          <span className="text-[10px] text-gray-400 dark:text-gray-500">or send an invite</span>
                          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                        </div>

                        {/* Email Input */}
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <div className="flex-1 relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                              <input
                                type="email"
                                value={memberEmail}
                                onChange={(e) => setMemberEmail(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddMember()}
                                placeholder="Enter team member email..."
                                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all placeholder:text-gray-400"
                              />
                            </div>
                            <button
                              onClick={handleAddMember}
                              disabled={!memberEmail || !memberEmail.includes('@')}
                              className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-600 to-blue-600 text-white hover:from-teal-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all text-xs font-semibold shadow-md hover:shadow-lg hover:scale-105 disabled:shadow-none disabled:scale-100 cursor-pointer"
                            >
                              Invite
                            </button>
                          </div>
                        </div>

                        {/* Team Members List */}
                        {teamMembers.length > 0 && (
                          <div className="pt-4 space-y-3 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex items-center justify-between">
                              <h4 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Team Members</h4>
                              <span className="px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 text-[10px] font-bold">
                                {teamMembers.length}
                              </span>
                            </div>
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                              {teamMembers.map((member, index) => (
                                <div
                                  key={member.id}
                                  className="group relative p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="relative">
                                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                                        {member.profileImage ? (
                                          <img src={member.profileImage} alt={member.name} className="w-full h-full rounded-lg object-cover" />
                                        ) : (
                                          <span>{member.name.charAt(0).toUpperCase()}</span>
                                        )}
                                      </div>
                                      {member.status === 'pending' && (
                                        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-yellow-400 rounded-full border-[1.5px] border-white dark:border-gray-900 shadow-sm" title="Pending invitation" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-semibold text-gray-600 dark:text-white truncate">{member.name}</p>
                                      <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{member.email}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      {member.status === 'pending' && (
                                        <span className="text-[10px] px-2 py-1 rounded-md bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 font-semibold">
                                          Pending
                                        </span>
                                      )}
                                      {member.status === 'active' && (
                                        <span className="text-[10px] px-2 py-1 rounded-md bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 font-semibold">
                                          Active
                                        </span>
                                      )}
                                      <button
                                        onClick={() => handleRemoveMember(member.id)}
                                        className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                                        title="Remove member"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Home Button */}
              <a
                href="https://acesai.me"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </a>

              {/* Theme Toggle */}
              <div className="flex items-center space-x-3 px-4 py-2 rounded-full bg-gray-100/100 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                <Sun className="w-4 h-4 text-gray-600 dark:text-gray-400" />

                <Switch
                  checked={isDarkMode}
                  onCheckedChange={setIsDarkMode}
                  className="cursor-pointer"
                />

                <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="ml-20 pt-24 px-8 2xl:px-12 pb-8 min-h-screen flex flex-col">
          <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto space-y-8 w-full flex-1 flex flex-col justify-center py-4 2xl:py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 2xl:gap-8">
              {/* Left Column - Profile & Account Details (2/3 width) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Profile Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative overflow-hidden rounded-3xl border border-white/20 dark:border-gray-700/50 backdrop-blur-xl bg-gradient-to-br from-white/90 via-white/70 to-white/50 dark:from-gray-800/90 dark:via-gray-800/70 dark:to-gray-800/50 shadow-2xl"
                >
                  {/* Decorative gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 dark:from-blue-400/10 dark:to-purple-400/10 pointer-events-none" />

                  <div className="relative p-8">
                    {/* Error Display */}
                    {getDisplayableError(error) && (
                      <div className="mb-6 p-4 bg-red-50/90 dark:bg-red-900/30 border border-red-200/50 dark:border-red-800/50 rounded-xl backdrop-blur-sm">
                        <p className="text-red-600 dark:text-red-400 text-sm">
                          {getDisplayableError(error)}
                        </p>
                      </div>
                    )}

                    {/* Offline Mode Info */}
                    {(!isOnline || !serverAvailable) && (
                      <div className="mb-6 p-4 bg-blue-50/90 dark:bg-blue-900/30 border border-blue-200/50 dark:border-blue-800/50 rounded-xl backdrop-blur-sm">
                        <p className="text-blue-700 dark:text-blue-300 text-sm">
                          <strong>Offline Mode:</strong> Your
                          changes are being saved locally and will
                          sync when connection is restored.
                          {syncQueue.length > 0 &&
                            ` (${syncQueue.length} pending)`}
                        </p>
                      </div>
                    )}

                    {/* Profile Header */}
                    <div className="flex items-center space-x-6 mb-8 relative">
                      {/* Settings Button - Top Right */}
                      <button
                        onClick={() => setIsSettingsDrawerOpen(true)}
                        className={`absolute top-0 -right-3 w-8 h-8 flex items-center justify-center transition-all cursor-pointer hover:scale-110 rounded-lg border bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm text-blue-500 dark:text-blue-400 ${isSettingsDrawerOpen ? 'scale-110 shadow-[0_0_15px_rgba(59,130,246,0.4)] border-blue-500/50 dark:border-blue-400/50' : 'border-gray-200/30 dark:border-gray-700/30 hover:border-blue-500/40 dark:hover:border-blue-500/40 hover:bg-blue-500/10 dark:hover:bg-blue-500/10 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]'}`}
                        title="Theme"
                      >
                        <Settings2 className={`w-5 h-5 transition-all ${isSettingsDrawerOpen ? 'drop-shadow-[0_0_6px_rgba(59,130,246,0.6)]' : ''}`} />
                      </button>

                      {/* Avatar */}
                      <div className="relative">
                        <div
                          className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 ring-4 ring-white/50 dark:ring-gray-700/50 shadow-xl group cursor-pointer"
                          onClick={() =>
                            profileImage &&
                            profileImage !== defaultProfileIcon &&
                            setShowImageViewer(true)
                          }
                        >
                          {profileImage &&
                            profileImage !== defaultProfileIcon ? (
                            <>
                              <img
                                src={profileImage}
                                alt="Profile"
                                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110 group-hover:brightness-75"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="text-white text-xs font-medium">
                                  View Image
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="w-12 h-12 text-gray-500 dark:text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Edit Button */}
                        <button
                          onClick={onEditProfile}
                          className="absolute -bottom-1 -right-1 w-8 h-8 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-xl cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                        </button>
                      </div>

                      {/* Name & Email */}
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                          {userName}
                        </h2>
                        <div className="flex flex-wrap items-center gap-3 mt-3">
                          {email && (
                            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200/60 dark:border-blue-700/30 bg-blue-50/50 dark:bg-blue-900/20 backdrop-blur-md shadow-sm transition-all hover:bg-blue-100/60 dark:hover:bg-blue-900/30 hover:border-blue-300/60 dark:hover:border-blue-600/30 group/item cursor-default">
                              <MailIcon className="w-4 h-4 text-blue-500 dark:text-blue-400/80 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-300 transition-colors" />
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover/item:text-gray-900 dark:group-hover/item:text-gray-100 transition-colors">{email}</span>
                            </div>
                          )}
                          {profilePhone && (
                            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200/60 dark:border-blue-700/30 bg-blue-50/50 dark:bg-blue-900/20 backdrop-blur-md shadow-sm transition-all hover:bg-blue-100/60 dark:hover:bg-blue-900/30 hover:border-blue-300/60 dark:hover:border-blue-600/30 group/item cursor-default">
                              <Phone className="w-4 h-4 text-blue-500 dark:text-blue-400/80 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-300 transition-colors" />
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover/item:text-gray-900 dark:group-hover/item:text-gray-100 transition-colors">{profilePhone}</span>
                            </div>
                          )}
                          {profileWebsite && (
                            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200/60 dark:border-blue-700/30 bg-blue-50/50 dark:bg-blue-900/20 backdrop-blur-md shadow-sm transition-all hover:bg-blue-100/60 dark:hover:bg-blue-900/30 hover:border-blue-300/60 dark:hover:border-blue-600/30 group/item cursor-default">
                              <Globe className="w-4 h-4 text-blue-500 dark:text-blue-400/80 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-300 transition-colors" />
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover/item:text-gray-900 dark:group-hover/item:text-gray-100 truncate max-w-[200px] transition-colors">{profileWebsite}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Contact Details Section */}
                    <div className="space-y-4 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                        Contact Details
                      </h3>

                      {/* Company Name */}
                      <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-gray-50/50 dark:bg-gray-700/30 border border-gray-200/30 dark:border-gray-600/30">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Company Name
                        </span>
                        <div className="flex items-center space-x-3">
                          {isEditingCompanyName ? (
                            <>
                              <Input
                                value={editCompanyName}
                                onChange={(e) =>
                                  setEditCompanyName(
                                    e.target.value,
                                  )
                                }
                                className="h-8 w-48 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === "Enter")
                                    handleCompanyNameSave();
                                  else if (e.key === "Escape")
                                    handleCompanyNameCancel();
                                }}
                              />
                              <Button
                                size="sm"
                                onClick={handleCompanyNameSave}
                                disabled={
                                  isLoading ||
                                  !editCompanyName.trim()
                                }
                                className="h-7 w-7 p-0 bg-blue-600 hover:bg-blue-700"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCompanyNameCancel}
                                className="h-7 w-7 p-0"
                              >
                                <X className="w-3.5 h-3.5" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <span className="text-gray-900 dark:text-white font-medium">
                                {companyName}
                              </span>
                              <button
                                onClick={handleCompanyNameEdit}
                                className="w-6 h-6 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Category */}
                      <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-gray-50/50 dark:bg-gray-700/30 border border-gray-200/30 dark:border-gray-600/30">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Category
                        </span>
                        <div className="flex items-center space-x-3">
                          {isEditingBusiness ? (
                            <>
                              <div className="relative">
                                <Popover
                                  open={editBusinessSelectOpen}
                                  onOpenChange={
                                    setEditBusinessSelectOpen
                                  }
                                >
                                  <PopoverTrigger asChild>
                                    <div
                                      role="combobox"
                                      onClick={() => {
                                        setEditBusinessSelectOpen(
                                          !editBusinessSelectOpen,
                                        );
                                        if (
                                          !editBusinessSelectOpen
                                        )
                                          setEditSearchValue("");
                                      }}
                                      className="w-48 h-8 px-3 flex items-center justify-between cursor-pointer bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                                    >
                                      <span
                                        className={
                                          editLineOfBusiness ||
                                            showEditCustomBusiness
                                            ? "text-gray-900 dark:text-white"
                                            : "text-gray-500"
                                        }
                                      >
                                        {showEditCustomBusiness
                                          ? editCustomBusiness ||
                                          "Other..."
                                          : editLineOfBusiness ||
                                          "Select category"}
                                      </span>
                                      <ChevronsUpDown className="w-3.5 h-3.5 opacity-50" />
                                    </div>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-full p-0"
                                    style={{
                                      width:
                                        "var(--radix-popover-trigger-width)",
                                    }}
                                  >
                                    <div className="flex flex-col">
                                      <div className="p-2 border-b">
                                        <input
                                          type="text"
                                          placeholder="Search..."
                                          value={editSearchValue}
                                          onChange={(e) =>
                                            setEditSearchValue(
                                              e.target.value,
                                            )
                                          }
                                          className="w-full h-8 px-2 text-sm border rounded-md"
                                          autoFocus
                                        />
                                      </div>
                                      <div className="max-h-48 overflow-y-auto">
                                        {editFilteredBusinesses.length >
                                          0 ? (
                                          <div className="py-1">
                                            {editFilteredBusinesses.map(
                                              (category) => (
                                                <div
                                                  key={category}
                                                  onClick={() => {
                                                    if (
                                                      category ===
                                                      "Other..."
                                                    ) {
                                                      setShowEditCustomBusiness(
                                                        true,
                                                      );
                                                      setEditLineOfBusiness(
                                                        "",
                                                      );
                                                      setEditBusinessSelectOpen(
                                                        false,
                                                      );
                                                      setEditSearchValue(
                                                        "",
                                                      );
                                                    } else {
                                                      setEditLineOfBusiness(
                                                        category,
                                                      );
                                                      setShowEditCustomBusiness(
                                                        false,
                                                      );
                                                      setEditCustomBusiness(
                                                        "",
                                                      );
                                                      setEditBusinessSelectOpen(
                                                        false,
                                                      );
                                                      setEditSearchValue(
                                                        "",
                                                      );
                                                    }
                                                  }}
                                                  className="flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                                >
                                                  <Check
                                                    className={`mr-2 h-3 w-3 ${(category ===
                                                      "Other..." &&
                                                      showEditCustomBusiness) ||
                                                      (editLineOfBusiness ===
                                                        category &&
                                                        !showEditCustomBusiness)
                                                      ? "opacity-100"
                                                      : "opacity-0"
                                                      }`}
                                                  />
                                                  <span>
                                                    {highlightMatch(
                                                      category,
                                                      editSearchValue,
                                                    )}
                                                  </span>
                                                </div>
                                              ),
                                            )}
                                          </div>
                                        ) : (
                                          <div className="py-4 text-center text-sm text-gray-500">
                                            No category found.
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>

                                {showEditCustomBusiness && (
                                  <Input
                                    type="text"
                                    placeholder="Enter category"
                                    value={editCustomBusiness}
                                    onChange={(e) =>
                                      setEditCustomBusiness(
                                        e.target.value,
                                      )
                                    }
                                    className="mt-2 w-full h-8 text-sm"
                                    autoFocus
                                  />
                                )}
                              </div>

                              <Button
                                size="sm"
                                onClick={handleBusinessSave}
                                disabled={
                                  isLoading ||
                                  (!editLineOfBusiness &&
                                    !showEditCustomBusiness) ||
                                  (showEditCustomBusiness &&
                                    !editCustomBusiness.trim())
                                }
                                className="h-7 w-7 p-0 bg-blue-600 hover:bg-blue-700"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleBusinessCancel}
                                className="h-7 w-7 p-0"
                              >
                                <X className="w-3.5 h-3.5" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <span className="text-gray-900 dark:text-white font-medium">
                                {lineOfBusiness}
                              </span>
                              <button
                                onClick={handleBusinessEdit}
                                className="w-6 h-6 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Email (Read-only) - REMOVED as per user request since it's displayed in header */}
                    </div>
                  </div>
                </motion.div>

                {/* Tier Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="relative overflow-hidden rounded-3xl border border-white/20 dark:border-gray-700/50 backdrop-blur-xl bg-gradient-to-br from-white/90 via-white/70 to-white/50 dark:from-gray-800/90 dark:via-gray-800/70 dark:to-gray-800/50 shadow-2xl p-6"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 dark:from-purple-400/10 dark:to-blue-400/10 pointer-events-none" />

                  <div className="relative flex flex-col items-center justify-center">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 text-center">
                      Your Tier
                    </h3>

                    <div className="flex justify-center mb-4">
                      <button
                        onClick={() =>
                          window.open(
                            "https://acesai.me/#pricing",
                            "_blank",
                          )
                        }
                        className={`inline-flex items-center space-x-2 cursor-pointer transition-all duration-300 ${upgradeHighlight
                          ? "decoration-blue-300"
                          : "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
                          }`}
                      >
                        <span
                          className={
                            upgradeHighlight
                              ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 font-bold"
                              : ""
                          }
                        >
                          Upgrade your plan
                        </span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 w-full">
                      {(() => {
                        const tierOrder = ['basic', 'pro', 'premium', 'enterprise'] as const;
                        const currentIdx = tierOrder.indexOf(userTier as typeof tierOrder[number]);
                        const tiers = [
                          { key: 'basic' as const, label: 'Basic', ringColor: 'ring-[#AF0C0C]', from: 'from-red-500/50', via: 'via-red-400/40', to: 'to-red-600/50', fillBg: 'bg-[#AF0C0C]', activeShadow: 'shadow-lg shadow-[#AF0C0C]/30', aboveBg: 'bg-red-100 dark:bg-red-500/20', aboveTxt: 'text-[#AF0C0C] dark:text-red-300', aboveHover: 'hover:bg-red-200 dark:hover:bg-red-500/30', belowBg: 'bg-red-50/60 dark:bg-red-500/10', belowTxt: 'text-[#AF0C0C]/40 dark:text-red-400/35', freeLightGlow: '0 0 18px 4px rgba(175,12,12,0.18), 0 0 6px 2px rgba(175,12,12,0.10)', freeDarkGlow: '0 0 20px 6px rgba(239,68,68,0.35), 0 0 8px 3px rgba(239,68,68,0.2)', freeBorder: 'border border-red-200 dark:border-red-500/30', freeShadowClass: 'shadow-sm' },
                          { key: 'pro' as const, label: 'Pro', ringColor: 'ring-purple-500', from: 'from-purple-500/50', via: 'via-purple-400/40', to: 'to-purple-600/50', fillBg: 'bg-purple-500', activeShadow: 'shadow-lg shadow-purple-500/30', aboveBg: 'bg-purple-100 dark:bg-purple-500/20', aboveTxt: 'text-purple-700 dark:text-purple-300', aboveHover: 'hover:bg-purple-200 dark:hover:bg-purple-500/30', belowBg: 'bg-purple-50/60 dark:bg-purple-500/10', belowTxt: 'text-purple-600/40 dark:text-purple-400/35', freeLightGlow: '0 0 18px 4px rgba(147,51,234,0.18), 0 0 6px 2px rgba(147,51,234,0.10)', freeDarkGlow: '0 0 20px 6px rgba(168,85,247,0.35), 0 0 8px 3px rgba(168,85,247,0.2)', freeBorder: 'border border-purple-200 dark:border-purple-500/30', freeShadowClass: 'shadow-sm' },
                          { key: 'premium' as const, label: 'Premium', ringColor: 'ring-[#D4A24C]', from: 'from-yellow-600/50', via: 'via-amber-500/40', to: 'to-yellow-700/50', fillBg: '', activeShadow: 'shadow-lg shadow-[#D4A24C]/30', aboveBg: 'bg-amber-100 dark:bg-amber-500/20', aboveTxt: 'text-amber-700 dark:text-amber-300', aboveHover: 'hover:bg-amber-200 dark:hover:bg-amber-500/30', belowBg: 'bg-amber-50/60 dark:bg-amber-500/10', belowTxt: 'text-amber-600/40 dark:text-amber-400/35', freeLightGlow: '0 0 18px 4px rgba(212,162,76,0.22), 0 0 6px 2px rgba(212,162,76,0.12)', freeDarkGlow: '0 0 20px 6px rgba(245,158,11,0.35), 0 0 8px 3px rgba(245,158,11,0.2)', freeBorder: 'border border-amber-200 dark:border-amber-500/30', freeShadowClass: 'shadow-sm' },
                          { key: 'enterprise' as const, label: 'Enterprise', ringColor: 'ring-blue-600', from: 'from-blue-500/50', via: 'via-blue-400/40', to: 'to-blue-600/50', fillBg: 'bg-blue-600', activeShadow: 'shadow-lg shadow-blue-500/30', aboveBg: 'bg-blue-100 dark:bg-blue-500/20', aboveTxt: 'text-blue-700 dark:text-blue-300', aboveHover: 'hover:bg-blue-200 dark:hover:bg-blue-500/30', belowBg: 'bg-blue-50/60 dark:bg-blue-500/10', belowTxt: 'text-blue-600/40 dark:text-blue-400/35', freeLightGlow: '0 0 18px 4px rgba(37,99,235,0.18), 0 0 6px 2px rgba(37,99,235,0.10)', freeDarkGlow: '0 0 20px 6px rgba(59,130,246,0.35), 0 0 8px 3px rgba(59,130,246,0.2)', freeBorder: 'border border-blue-200 dark:border-blue-500/30', freeShadowClass: 'shadow-sm' },
                        ];
                        return tiers.map((t, idx) => {
                          const isCurrent = t.key === userTier;
                          const isAbove = currentIdx >= 0 && idx > currentIdx;
                          const isBelow = currentIdx >= 0 && idx < currentIdx;
                          const isFreeMode = userTier === 'free';
                          return (
                            <div key={t.key} className="relative">
                              {/* LED glow */}
                              {!isFreeMode && (
                                <div
                                  className={`absolute -inset-1 rounded-full pointer-events-none bg-gradient-to-r ${t.from} ${t.via} ${t.to} ${isCurrent ? 'blur-md opacity-80' : isAbove ? 'blur-lg animate-pulse opacity-50' : 'blur-sm opacity-15'
                                    }`}
                                  style={{ zIndex: 0 }}
                                />
                              )}
                              <button
                                onClick={() => handleTierChange(t.key)}
                                disabled={isLoading}
                                className={`relative px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${isCurrent
                                  ? `${t.key === 'premium' ? '' : t.fillBg} text-white ${t.activeShadow} ring-2 ${t.ringColor} ring-offset-2 ring-offset-white dark:ring-offset-gray-800`
                                  : isFreeMode
                                    ? `${t.aboveBg} ${t.aboveTxt} ${t.aboveHover} ${t.freeBorder} ${t.freeShadowClass} backdrop-blur-sm`
                                    : isAbove
                                      ? `${t.aboveBg} ${t.aboveTxt} ${t.aboveHover}`
                                      : `${t.belowBg} ${t.belowTxt}`
                                  }`}
                                style={
                                  isCurrent && t.key === 'premium'
                                    ? { zIndex: 10, background: 'linear-gradient(135deg, #D4A24C, #B8860B, #DAA520)', textShadow: '0 1px 3px rgba(0,0,0,0.4)' }
                                    : isCurrent
                                      ? { zIndex: 10, textShadow: '0 1px 3px rgba(0,0,0,0.4)' }
                                      : isFreeMode
                                        ? { zIndex: 10, boxShadow: isDarkMode ? t.freeDarkGlow : t.freeLightGlow, animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }
                                        : { zIndex: 10 }
                                }
                              >
                                {t.label}
                              </button>
                            </div>
                          );
                        });
                      })()}
                    </div>

                    {/* Automatic Top-Up - Only for paid tiers */}
                    {userTier !== 'free' && (
                      <div className="mt-6 pt-5 border-t border-gray-200/40 dark:border-gray-700/40 w-full flex justify-center">
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Automatic Top-Up
                          </span>
                          <button
                            onClick={() => setShowTopUpInfoModal(true)}
                            className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer"
                            title="Learn more about Automatic Top-Up"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                          <Switch
                            checked={isAutoTopUpEnabled}
                            onCheckedChange={setIsAutoTopUpEnabled}
                            className="cursor-pointer"
                          />
                        </div>
                      </div>
                    )}

                  </div>
                </motion.div>

                {/* Documentation & Contact Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative overflow-hidden rounded-3xl border border-white/20 dark:border-gray-700/50 backdrop-blur-xl bg-gradient-to-br from-white/90 via-white/70 to-white/50 dark:from-gray-800/90 dark:via-gray-800/70 dark:to-gray-800/50 shadow-2xl p-8"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-blue-500/5 dark:from-green-400/10 dark:to-blue-400/10 pointer-events-none" />

                  <div className="relative space-y-6">
                    {/* Instructions & Documentation + Give Feedback */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                          Instructions & Documentation
                        </h3>
                        <button
                          onClick={() =>
                            window.open(
                              "https://acesai.me/instructions-documentation",
                              "_blank",
                            )
                          }
                          className="flex items-center space-x-3 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors cursor-pointer w-full group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                            <Book className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <span className="text-sm font-medium group-hover:underline inline-flex items-center gap-1">
                            Read Me
                            <ExternalLink className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                          </span>
                        </button>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                          Give Feedback
                        </h3>
                        <button
                          onClick={() => setIsFeedbackOpen(true)}
                          className="flex items-center space-x-3 text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors cursor-pointer w-full group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center shrink-0">
                            <MessageCircleHeart className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                          </div>
                          <span className="text-sm font-medium group-hover:underline">
                            Send Feedback
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Contact Us */}
                        <div>
                          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                            Contact Us
                          </h3>
                          <div className="space-y-3">
                            <button
                              onClick={() =>
                                window.open(
                                  "mailto:support@acesai.me",
                                  "_blank",
                                )
                              }
                              className="flex items-center space-x-3 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer w-full group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                                <MailIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <span className="text-sm font-medium group-hover:underline">
                                support@acesai.me
                              </span>
                            </button>

                            <button
                              onClick={() =>
                                window.open(
                                  "tel:+971563729686",
                                  "_blank",
                                )
                              }
                              className="flex items-center space-x-3 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors cursor-pointer w-full group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                                <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                              </div>
                              <span className="text-sm font-medium group-hover:underline">
                                +971563729686
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* App Language */}
                        <div>
                          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                            App Language
                          </h3>
                          <button
                            onClick={() =>
                              setShowLanguageModal(true)
                            }
                            className="flex items-center space-x-3 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors cursor-pointer w-full group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                              <Languages className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                            </div>
                            <span className="text-sm font-medium group-hover:underline">
                              {selectedLanguage.code === "EN" ||
                                selectedLanguage.code === "en"
                                ? "EN - English"
                                : "AR - عربي"}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Phone Preview (1/3 width) */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="sticky top-24 flex flex-col items-center gap-4"
                >
                  <PhonePreview
                    isDarkMode={isDarkMode}
                    headerColor={aiThemeColor || "#2563EB"}
                    logoUrl={
                      aiLogoUrl ||
                      (profileImage &&
                        profileImage !== defaultProfileIcon
                        ? profileImage
                        : null)
                    }
                    messages={
                      aiGreeting
                        ? [
                          {
                            role: "assistant",
                            text: aiGreeting,
                          },
                        ]
                        : [
                          {
                            role: "assistant",
                            text: "Hello! I'm your AI assistant. How can I help you today?",
                          },
                        ]
                    }
                    isTyping={false}
                    isGreetingLoading={false}
                    className="scale-[0.85] origin-top"
                  />

                  {/* Edit AI Preview Button — Glass + Blue LED */}
                  <div className="relative w-[300px] -mt-28">
                    {/* Blue LED glow behind */}
                    <div className="absolute -inset-1 rounded-[28px] pointer-events-none" style={{ zIndex: 0 }}>
                      <div className="absolute inset-0 rounded-[28px] bg-gradient-to-r from-blue-500/50 via-cyan-400/40 to-blue-600/50 blur-lg animate-pulse" />
                    </div>
                    <button
                      onClick={() => setIsEditAIPreviewOpen(true)}
                      className="relative w-full rounded-3xl p-4 flex items-center justify-between transition-all group cursor-pointer border border-blue-300/30 dark:border-blue-500/20 backdrop-blur-md overflow-hidden bg-white/80 dark:bg-gray-900/80 shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:shadow-[0_0_25px_rgba(59,130,246,0.25)]"
                      style={{ zIndex: 10 }}
                    >
                      {/* Subtle blue gradient overlay */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
                      <div className="absolute inset-0 rounded-3xl dark:bg-gradient-to-br dark:from-blue-950/30 dark:via-gray-900/20 dark:to-cyan-950/20 pointer-events-none" />
                      <div className="relative flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform border border-blue-400/20 dark:border-blue-500/30">
                          <Edit3 className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Edit AI Preview</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Customize appearance</p>
                        </div>
                      </div>
                      <div className="relative w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700/60 flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors border border-gray-200/50 dark:border-gray-600/50">
                        <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 9L5 5L1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                    </button>
                  </div>

                  {/* Request Service Button — Glass + Green LED */}
                  <div className="relative w-[300px]">
                    {/* Green LED glow behind */}
                    <div className="absolute -inset-1 rounded-[28px] pointer-events-none" style={{ zIndex: 0 }}>
                      <div className="absolute inset-0 rounded-[28px] bg-gradient-to-r from-green-500/50 via-emerald-400/40 to-teal-500/50 blur-lg animate-pulse" />
                    </div>
                    <button
                      onClick={() => setIsRequestServiceOpen(true)}
                      className="relative w-full rounded-3xl p-4 flex items-center justify-between transition-all group cursor-pointer border border-green-300/30 dark:border-green-500/20 backdrop-blur-md overflow-hidden bg-white/80 dark:bg-gray-900/80 shadow-[0_0_15px_rgba(34,197,94,0.15)] hover:shadow-[0_0_25px_rgba(34,197,94,0.25)]"
                      style={{ zIndex: 10 }}
                    >
                      {/* Subtle green gradient overlay */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-green-500/5 via-transparent to-emerald-500/5 pointer-events-none" />
                      <div className="absolute inset-0 rounded-3xl dark:bg-gradient-to-br dark:from-green-950/30 dark:via-gray-900/20 dark:to-emerald-950/20 pointer-events-none" />
                      <div className="relative flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform border border-green-400/20 dark:border-green-500/30">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
                        </div>
                        <div className="text-left">
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Request Service</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Integrate new platforms</p>
                        </div>
                      </div>
                      <div className="relative w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700/60 flex items-center justify-center text-gray-400 group-hover:text-green-500 transition-colors border border-gray-200/50 dark:border-gray-600/50">
                        <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 9L5 5L1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Logout Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center pb-8"
            >
              <button
                onClick={(e) => { console.log('Logout button clicked', handleLogout); e.preventDefault(); e.stopPropagation(); if (typeof handleLogout === 'function') handleLogout(); else console.error('handleLogout is not a function'); }}
                className="px-8 py-3 bg-white/20 dark:bg-gray-800/20 hover:bg-red-500/10 dark:hover:bg-red-500/10 border border-gray-200/30 dark:border-gray-700/30 hover:border-red-500/40 dark:hover:border-red-500/40 rounded-xl shadow-lg hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all backdrop-blur-sm cursor-pointer font-medium text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-500"
              >
                Log Out
              </button>
            </motion.div>
          </div>
        </div>

        {/* Settings Bottom Drawer */}
        <SettingsBottomDrawer
          isOpen={isSettingsDrawerOpen}
          onClose={() => setIsSettingsDrawerOpen(false)}
          isDarkMode={isDarkMode}
          onLogoUpdate={onWhiteLabelLogoUpdate}
          onFaviconUpdate={onWhiteLabelFaviconUpdate}
          onLoadingIconUpdate={onWhiteLabelLoadingIconUpdate}
          onColorSchemeUpdate={onWhiteLabelColorSchemeUpdate}
          onColorSchemeReset={onWhiteLabelColorSchemeReset}
        />

        {/* Edit AI Preview Overlay */}
        <EditAIPreviewOverlay
          isOpen={isEditAIPreviewOpen}
          onClose={() => setIsEditAIPreviewOpen(false)}
          initialData={{
            color: aiThemeColor,
            logo: aiLogoUrl,
            greeting: aiGreeting || undefined
          }}
          onSave={(data) => {
            if (onAiSettingsChange) {
              onAiSettingsChange(data);
            }
          }}
        // We might need websiteData if we want the "Extract from Website" features to work fully
        // But for editing existing setup, it might not be strictly necessary if we rely on manual inputs
        />

        {/* Request Service Modal */}
        <RequestServiceModal
          isOpen={isRequestServiceOpen}
          onClose={() => setIsRequestServiceOpen(false)}
          userEmail={email}
        />

        {/* Feedback Modal */}
        <FeedbackModal
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
          userEmail={email}
        />

        {/* Automatic Top-Up Info Modal */}
        {showTopUpInfoModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowTopUpInfoModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="relative w-full max-w-lg 2xl:max-w-2xl min-[1920px]:max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl border border-white/20 dark:border-gray-700/50 backdrop-blur-xl bg-white/95 dark:bg-gray-800/95 shadow-2xl"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="sticky top-0 z-10 flex items-center justify-between px-6 2xl:px-8 py-4 2xl:py-5 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 2xl:w-10 2xl:h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Info className="w-4 h-4 2xl:w-5 2xl:h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-lg 2xl:text-xl font-semibold text-gray-900 dark:text-white">Automatic Top-Up</h2>
                  <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-700/40">Recommended: On</span>
                </div>
                <button
                  onClick={() => setShowTopUpInfoModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="px-6 2xl:px-8 py-5 2xl:py-7 space-y-5 2xl:space-y-7">
                <div>
                  <h3 className="text-sm 2xl:text-base font-semibold text-gray-900 dark:text-white mb-2">How It Works</h3>
                  <p className="text-sm 2xl:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    Each plan includes a daily customer chat limit. When Automatic Top-Up is <span className="font-semibold text-green-600 dark:text-green-400">enabled</span>, the AI continues assisting customers beyond your daily limit. The extra chats are counted as top-up credits and included in your next monthly invoice.
                  </p>
                </div>

                <div>
                  <h3 className="text-sm 2xl:text-base font-semibold text-gray-900 dark:text-white mb-3">Daily Limits Per Tier</h3>
                  <div className="grid grid-cols-2 2xl:grid-cols-4 gap-2 2xl:gap-3">
                    <div className={`px-4 py-3 rounded-xl border ${userTier === 'basic' ? 'border-[#AF0C0C]/30 bg-red-50/50 dark:bg-red-900/10' : 'border-gray-200/50 dark:border-gray-700/30 bg-gray-50/50 dark:bg-gray-700/20'}`}>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#AF0C0C] dark:text-red-400">Basic</span>
                      <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">1,000</p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">customers/day</span>
                    </div>
                    <div className={`px-4 py-3 rounded-xl border ${userTier === 'pro' ? 'border-purple-400/30 bg-purple-50/50 dark:bg-purple-900/10' : 'border-gray-200/50 dark:border-gray-700/30 bg-gray-50/50 dark:bg-gray-700/20'}`}>
                      <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">Pro</span>
                      <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">2,500</p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">customers/day</span>
                    </div>
                    <div className={`px-4 py-3 rounded-xl border ${userTier === 'premium' ? 'border-[#C68C33]/30 bg-amber-50/50 dark:bg-amber-900/10' : 'border-gray-200/50 dark:border-gray-700/30 bg-gray-50/50 dark:bg-gray-700/20'}`}>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#C68C33] dark:text-amber-400">Premium</span>
                      <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">5,000</p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">customers/day</span>
                    </div>
                    <div className={`px-4 py-3 rounded-xl border ${userTier === 'enterprise' ? 'border-blue-400/30 bg-blue-50/50 dark:bg-blue-900/10' : 'border-gray-200/50 dark:border-gray-700/30 bg-gray-50/50 dark:bg-gray-700/20'}`}>
                      <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">Enterprise</span>
                      <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">Custom</p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">agreed threshold</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 2xl:p-5 rounded-xl bg-green-50/60 dark:bg-green-900/10 border border-green-200/40 dark:border-green-700/30">
                  <h3 className="text-sm 2xl:text-base font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    When Enabled
                  </h3>
                  <p className="text-sm 2xl:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    If your AI exceeds your daily limit ({userTier === 'basic' ? '1,000' : userTier === 'pro' ? '2,500' : userTier === 'premium' ? '5,000' : 'your agreed threshold of'} customer chats), the AI keeps running. Each additional customer beyond the limit is added as a top-up credit and charged on your next monthly invoice.
                  </p>
                </div>

                <div className="p-4 2xl:p-5 rounded-xl bg-red-50/60 dark:bg-red-900/10 border border-red-200/40 dark:border-red-700/30">
                  <h3 className="text-sm 2xl:text-base font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    When Disabled
                  </h3>
                  <p className="text-sm 2xl:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    The AI will <span className="font-semibold">stop responding</span> to new customers once it reaches your daily limit of <span className="font-semibold">{userTier === 'basic' ? '1,000' : userTier === 'pro' ? '2,500' : userTier === 'premium' ? '5,000' : 'your agreed threshold'}</span>. No additional customers will be served until the next day.
                  </p>
                </div>

                <div className="p-4 2xl:p-5 rounded-xl bg-amber-50/60 dark:bg-amber-900/10 border border-amber-200/40 dark:border-amber-700/30">
                  <h3 className="text-sm 2xl:text-base font-semibold text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                    What Happens If Top-Up Payment Is Declined
                  </h3>
                  <p className="text-sm 2xl:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    If the top-up invoice is not paid, the extra customers served will be <span className="font-semibold">deducted from your next month's allocation</span>.
                  </p>
                  <div className="mt-3 p-3 rounded-lg bg-white/60 dark:bg-gray-800/40 border border-gray-200/30 dark:border-gray-600/30">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Example:</p>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1.5 list-none p-0 m-0">
                      <li className="flex items-start gap-2">
                        <span className="text-gray-400 mt-0.5 shrink-0">1.</span>
                        <span>Your Basic plan includes <span className="font-semibold text-gray-700 dark:text-gray-300">1,000</span> customer chats per month.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gray-400 mt-0.5 shrink-0">2.</span>
                        <span>With Auto Top-Up enabled, the AI serves <span className="font-semibold text-gray-700 dark:text-gray-300">1,300</span> customers that month — <span className="font-semibold text-gray-700 dark:text-gray-300">300 extra</span>.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gray-400 mt-0.5 shrink-0">3.</span>
                        <span>If you <span className="font-semibold text-red-600 dark:text-red-400">don't pay</span> the top-up invoice, those 300 are deducted from next month.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gray-400 mt-0.5 shrink-0">4.</span>
                        <span>Next month you only get <span className="font-semibold text-gray-700 dark:text-gray-300">700</span> customer chats (1,000 − 300).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gray-400 mt-0.5 shrink-0">5.</span>
                        <span>Once those 700 are used up, Auto Top-Up is <span className="font-semibold text-red-600 dark:text-red-400">automatically disabled</span> and the AI stops at 700 for that month.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gray-400 mt-0.5 shrink-0">6.</span>
                        <span>Your plan resets to the full <span className="font-semibold text-gray-700 dark:text-gray-300">1,000</span> the following month, but Auto Top-Up remains off until you re-enable it.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {userTier === 'enterprise' && (
                  <div className="p-4 2xl:p-5 rounded-xl bg-blue-50/60 dark:bg-blue-900/10 border border-blue-200/40 dark:border-blue-700/30">
                    <h3 className="text-sm 2xl:text-base font-semibold text-blue-700 dark:text-blue-400 mb-2">Enterprise Plan</h3>
                    <p className="text-sm 2xl:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                      Your daily customer threshold is set based on the expected volume you've communicated to us. If your actual usage consistently exceeds this threshold, please contact our team to adjust your allocation.
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between p-4 2xl:p-5 rounded-xl bg-gray-50/50 dark:bg-gray-700/20 border border-gray-200/30 dark:border-gray-600/30">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Status</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {userTier.charAt(0).toUpperCase() + userTier.slice(1)} Plan — {userTier === 'basic' ? '1,000' : userTier === 'pro' ? '2,500' : userTier === 'premium' ? '5,000' : 'Custom'} daily limit
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${isAutoTopUpEnabled ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-700/40'}`}>
                    {isAutoTopUpEnabled ? 'Enabled' : 'Disabled'}
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 px-6 2xl:px-8 py-4 2xl:py-5 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-b-2xl">
                <button
                  onClick={() => setShowTopUpInfoModal(false)}
                  className="w-full py-2.5 2xl:py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm 2xl:text-base font-medium transition-colors cursor-pointer"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  };