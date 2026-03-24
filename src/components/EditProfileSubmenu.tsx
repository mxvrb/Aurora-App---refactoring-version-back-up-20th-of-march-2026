import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from "sonner";

interface EditProfileSubmenuProps {
  initialBusinessName: string;
  initialBio: string;
  initialWebsite: string;
  initialBusinessEmail: string;
  initialBusinessLocation: string;
  companyName: string | null;
  onBack: () => void;
  onSave: (
    businessName: string,
    bio: string,
    website: string,
    businessEmail: string,
    businessLocation: string
  ) => void;
}

export function EditProfileSubmenu({
  initialBusinessName,
  initialBio,
  initialWebsite,
  initialBusinessEmail,
  initialBusinessLocation,
  companyName,
  onBack,
  onSave
}: EditProfileSubmenuProps) {
  const [tempBusinessName, setTempBusinessName] = useState(initialBusinessName);
  const [tempBio, setTempBio] = useState(initialBio);
  const [tempWebsite, setTempWebsite] = useState(initialWebsite);
  const [tempBusinessEmail, setTempBusinessEmail] = useState(initialBusinessEmail);
  const [tempBusinessLocation, setTempBusinessLocation] = useState(initialBusinessLocation);

  const handleSave = () => {
    onSave(tempBusinessName, tempBio, tempWebsite, tempBusinessEmail, tempBusinessLocation);
    toast.success('Profile updated successfully');
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800">
      {/* Header with Back Button */}
      <div 
        onClick={onBack}
        style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
        className="flex items-center px-6 mx-4 mt-3 mb-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all cursor-pointer shadow-lg"
      >
        <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-gray-100 mr-2" />
        <span className="font-medium text-gray-900 dark:text-gray-100">Edit Profile</span>
      </div>
      
      <div className="px-6 pt-4 pb-6 space-y-6">
        {/* AI Name */}
        <div className="space-y-2">
          <Label htmlFor="ai-name" className="text-gray-900 dark:text-gray-100">Profile Name</Label>
          <Input
            id="ai-name"
            type="text"
            placeholder={companyName || ""}
            value={tempBusinessName}
            onChange={(e) => setTempBusinessName(e.target.value)}
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
          />
        </div>

        {/* About */}
        <div className="space-y-2">
          <Label htmlFor="ai-bio" className="text-gray-900 dark:text-gray-100">About</Label>
          <textarea
            id="ai-bio"
            rows={3}
            placeholder="Enter information about your business"
            value={tempBio}
            onChange={(e) => {
              setTempBio(e.target.value);
              // Auto-resize: calculate rows based on line breaks and text length
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

        {/* Website */}
        <div className="space-y-2">
          <Label htmlFor="website" className="text-gray-900 dark:text-gray-100">Website URL</Label>
          <Input
            id="website"
            type="url"
            placeholder="https://example.com"
            value={tempWebsite}
            onChange={(e) => setTempWebsite(e.target.value)}
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-900 dark:text-gray-100">Business Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="contact@example.com"
            value={tempBusinessEmail}
            onChange={(e) => setTempBusinessEmail(e.target.value)}
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your business email for WhatsApp profile display
          </p>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location" className="text-gray-900 dark:text-gray-100">Business Location</Label>
          <Input
            id="location"
            type="text"
            placeholder="City, Country or Full Address"
            value={tempBusinessLocation}
            onChange={(e) => setTempBusinessLocation(e.target.value)}
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This location will be visible in your WhatsApp Business Profile
          </p>
        </div>
        
        {/* Save Changes Button */}
        <Button 
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
