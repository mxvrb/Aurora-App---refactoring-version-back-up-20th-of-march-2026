import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Upload, User, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  setUserName: (name: string) => void;
  profilePhone: string;
  setProfilePhone: (phone: string) => void;
  profileWebsite: string;
  setProfileWebsite: (website: string) => void;
  profileImage: string | null;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveProfilePicture: () => void;
  onSave: () => void;
  isLoading: boolean;
  defaultProfileIcon?: string;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  userName,
  setUserName,
  profilePhone,
  setProfilePhone,
  profileWebsite,
  setProfileWebsite,
  profileImage,
  onImageUpload,
  onRemoveProfilePicture,
  onSave,
  isLoading,
  defaultProfileIcon
}) => {
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Reset image states when modal opens/closes or image changes
  useEffect(() => {
    if (isOpen && profileImage) {
      setImageLoading(true);
      setImageError(false);
    } else {
      setImageLoading(false);
      setImageError(false);
    }
  }, [isOpen, profileImage]);
  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal Container */}
      <div 
        className="relative bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Edit Profile
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Update your profile information
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden relative border border-gray-200 dark:border-gray-600">
              {profileImage && profileImage !== defaultProfileIcon ? (
                <>
                  {/* Loading indicator */}
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
                    </div>
                  )}
                  
                  {/* Actual image */}
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      imageLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                    }`}
                    onLoad={() => {
                      setImageLoading(false);
                      setImageError(false);
                    }}
                    onError={() => {
                      console.log('Profile image failed to load');
                      setImageLoading(false);
                      setImageError(true);
                    }}
                    loading="eager"
                  />
                  
                  {/* Error state - show user icon if image fails */}
                  {imageError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <User className="w-8 h-8 text-gray-400 dark:text-gray-300" />
                    </div>
                  )}
                </>
              ) : (
                <User className="w-8 h-8 text-gray-400 dark:text-gray-300" />
              )}
            </div>
            
            <input
              id="profileImageUploadModal"
              type="file"
              accept="image/*"
              onChange={(e) => {
                onImageUpload(e);
                // Reset the input so the same file can be selected again
                e.target.value = '';
              }}
              className="hidden"
            />
            
            {profileImage && profileImage !== defaultProfileIcon ? (
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('profileImageUploadModal')?.click()}
                  className="flex items-center space-x-1 text-sm cursor-pointer"
                >
                  <Upload className="w-3 h-3" />
                  <span>Change</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    console.log('Remove button clicked');
                    // Reset image states immediately
                    setImageLoading(false);
                    setImageError(false);
                    onRemoveProfilePicture();
                  }}
                  className="flex items-center space-x-1 text-sm cursor-pointer"
                >
                  <X className="w-3 h-3" />
                  <span>Remove</span>
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('profileImageUploadModal')?.click()}
                className="flex items-center space-x-1 text-sm cursor-pointer"
              >
                <Upload className="w-3 h-3" />
                <span>Upload</span>
              </Button>
            )}
          </div>
          
          {/* Form Fields */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="profileName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </Label>
              <Input
                id="profileName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="mt-1 h-9 text-sm"
                placeholder="Enter name"
              />
            </div>
            
            <div>
              <Label htmlFor="profilePhone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone
              </Label>
              <Input
                id="profilePhone"
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                className="mt-1 h-9 text-sm"
                placeholder="971XX..."
              />
            </div>
            
            <div>
              <Label htmlFor="profileWebsite" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Website
              </Label>
              <Input
                id="profileWebsite"
                value={profileWebsite}
                onChange={(e) => setProfileWebsite(e.target.value)}
                className="mt-1 h-9 text-sm"
                placeholder="website.com"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex space-x-3">
          <Button 
            variant="outline"
            onClick={onClose}
            className="flex-1 h-9 text-sm cursor-pointer"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={onSave}
            disabled={isLoading || !userName.trim()}
            className="flex-1 h-9 text-sm bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          >
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};