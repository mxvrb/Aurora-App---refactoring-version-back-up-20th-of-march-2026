import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { RefreshCw, Check } from 'lucide-react';
const NotionSvg = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M5.716 29.2178L2.27664 24.9331C1.44913 23.9023 1 22.6346 1 21.3299V5.81499C1 3.86064 2.56359 2.23897 4.58071 2.10125L20.5321 1.01218C21.691 0.933062 22.8428 1.24109 23.7948 1.8847L29.3992 5.67391C30.4025 6.35219 31 7.46099 31 8.64426V26.2832C31 28.1958 29.4626 29.7793 27.4876 29.9009L9.78333 30.9907C8.20733 31.0877 6.68399 30.4237 5.716 29.2178Z" className="fill-white dark:fill-gray-900" />
    <path d="M11.2481 13.5787V13.3756C11.2481 12.8607 11.6605 12.4337 12.192 12.3982L16.0633 12.1397L21.417 20.0235V13.1041L20.039 12.9204V12.824C20.039 12.303 20.4608 11.8732 20.9991 11.8456L24.5216 11.6652V12.1721C24.5216 12.41 24.3446 12.6136 24.1021 12.6546L23.2544 12.798V24.0037L22.1906 24.3695C21.3018 24.6752 20.3124 24.348 19.8036 23.5803L14.6061 15.7372V23.223L16.2058 23.5291L16.1836 23.6775C16.1137 24.1423 15.7124 24.4939 15.227 24.5155L11.2481 24.6926C11.1955 24.1927 11.5701 23.7456 12.0869 23.6913L12.6103 23.6363V13.6552L11.2481 13.5787Z" className="fill-gray-900 dark:fill-white" />
    <path fillRule="evenodd" clipRule="evenodd" d="M20.6749 2.96678L4.72347 4.05585C3.76799 4.12109 3.02734 4.88925 3.02734 5.81499V21.3299C3.02734 22.1997 3.32676 23.0448 3.87843 23.7321L7.3178 28.0167C7.87388 28.7094 8.74899 29.0909 9.65435 29.0352L27.3586 27.9454C28.266 27.8895 28.9724 27.1619 28.9724 26.2832V8.64426C28.9724 8.10059 28.6979 7.59115 28.2369 7.27951L22.6325 3.49029C22.0613 3.10413 21.3702 2.91931 20.6749 2.96678ZM5.51447 6.057C5.29261 5.89274 5.3982 5.55055 5.6769 5.53056L20.7822 4.44711C21.2635 4.41259 21.7417 4.54512 22.1309 4.82088L25.1617 6.96813C25.2767 7.04965 25.2228 7.22563 25.0803 7.23338L9.08387 8.10336C8.59977 8.12969 8.12193 7.98747 7.73701 7.7025L5.51447 6.057ZM8.33357 10.8307C8.33357 10.311 8.75341 9.88177 9.29027 9.85253L26.203 8.93145C26.7263 8.90296 27.1667 9.30534 27.1667 9.81182V25.0853C27.1667 25.604 26.7484 26.0328 26.2126 26.0633L9.40688 27.0195C8.8246 27.0527 8.33357 26.6052 8.33357 26.0415V10.8307Z" className="fill-gray-900 dark:fill-white" />
  </svg>
);

const DropboxSvg = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={className}>
    <rect width="512" height="512" rx="15%" fill="#0061ff"/>
    <path fill="#fff" d="M158 372l98 63 98-63-98-62zm0-271l-99 63 295 188 99-63-197-125 98-63 99 63-295 188-99-63 197-125"/>
  </svg>
);

const googleDriveIcon = "https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg";

interface CloudSyncManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (services: string[]) => void;
  initialServices?: string[];
}

export const CloudSyncManagementModal: React.FC<CloudSyncManagementModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialServices = []
}) => {
  const [connectedServices, setConnectedServices] = useState<string[]>(initialServices);

  const toggleConnection = (service: string) => {
    setConnectedServices(prev => 
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handleSave = () => {
    onSave(connectedServices);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-200 dark:border-gray-800 p-0 overflow-hidden rounded-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                <RefreshCw className="w-5 h-5" />
              </div>
              <DialogTitle className="text-xl font-bold">Cloud Sync</DialogTitle>
            </div>
            <p className="text-gray-500 text-sm">
              Connect with Notion, Google Drive, or Dropbox, and the Files area mirrors your business documentation for continuous AI reference.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Notion */}
            <div 
              onClick={() => toggleConnection('Notion')}
              className={`group border rounded-xl p-6 text-center transition-all cursor-pointer ${
                connectedServices.includes('Notion') 
                  ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-900/10 dark:border-blue-400' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-gray-900'
              }`}
            >
              <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3 relative">
                <NotionSvg className="w-12 h-12 rounded-lg group-hover:scale-110 transition-transform duration-200" />
                {connectedServices.includes('Notion') && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Notion</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Sync your Notion workspace</p>
              <button className={`text-sm font-medium ${connectedServices.includes('Notion') ? 'text-blue-600 dark:text-blue-400' : 'text-blue-600 dark:text-blue-400 hover:underline'}`}>
                {connectedServices.includes('Notion') ? 'Connected' : 'Connect'}
              </button>
            </div>

            {/* Google Drive */}
            <div 
              onClick={() => toggleConnection('Google Drive')}
              className={`group border rounded-xl p-6 text-center transition-all cursor-pointer ${
                connectedServices.includes('Google Drive') 
                  ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-900/10 dark:border-blue-400' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-gray-900'
              }`}
            >
              <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3 relative">
                <img src={googleDriveIcon} alt="Google Drive" className="w-12 h-12 group-hover:scale-110 transition-transform duration-200" />
                {connectedServices.includes('Google Drive') && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Google Drive</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Sync your Drive folders</p>
              <button className={`text-sm font-medium ${connectedServices.includes('Google Drive') ? 'text-blue-600 dark:text-blue-400' : 'text-blue-600 dark:text-blue-400 hover:underline'}`}>
                {connectedServices.includes('Google Drive') ? 'Connected' : 'Connect'}
              </button>
            </div>

            {/* Dropbox */}
            <div 
              onClick={() => toggleConnection('Dropbox')}
              className={`group border rounded-xl p-6 text-center transition-all cursor-pointer ${
                connectedServices.includes('Dropbox') 
                  ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-900/10 dark:border-blue-400' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-gray-900'
              }`}
            >
              <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3 relative">
                <DropboxSvg className="w-12 h-12 rounded-lg group-hover:scale-110 transition-transform duration-200" />
                {connectedServices.includes('Dropbox') && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Dropbox</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Sync your Dropbox files</p>
              <button className={`text-sm font-medium ${connectedServices.includes('Dropbox') ? 'text-blue-600 dark:text-blue-400' : 'text-blue-600 dark:text-blue-400 hover:underline'}`}>
                {connectedServices.includes('Dropbox') ? 'Connected' : 'Connect'}
              </button>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Tip:</strong> Once connected, your documentation will automatically sync, keeping your AI up to date with the latest information.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="rounded-xl">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save Connections
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};