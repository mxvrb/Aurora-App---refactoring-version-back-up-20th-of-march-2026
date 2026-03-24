import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Link as LinkIcon, ExternalLink, Globe, ChevronRight, Loader2, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { toast } from "sonner";

interface LinkManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  links: string[];
  onSave: (links: string[]) => void;
  websiteUrl?: string;
  mainPageContent?: string;
}

export const LinkManagementModal: React.FC<LinkManagementModalProps> = ({
  isOpen,
  onClose,
  links,
  onSave,
  websiteUrl,
  mainPageContent
}) => {
  const [currentLinks, setCurrentLinks] = useState<string[]>(links);
  const [newLink, setNewLink] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Summary State
  const [selectedLinkForSummary, setSelectedLinkForSummary] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Sync with props when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentLinks(links);
      setNewLink('');
      setError(null);
      setSelectedLinkForSummary(null);
      setSummary(null);
    }
  }, [isOpen, links]);

  const validateUrl = (url: string) => {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleAddLink = () => {
    if (!newLink.trim()) return;

    let urlToAdd = newLink.trim();
    if (!urlToAdd.startsWith('http')) {
      urlToAdd = `https://${urlToAdd}`;
    }

    if (!validateUrl(urlToAdd)) {
      setError('Please enter a valid URL');
      return;
    }

    if (currentLinks.includes(urlToAdd)) {
      setError('This link is already added');
      return;
    }

    setCurrentLinks([...currentLinks, urlToAdd]);
    setNewLink('');
    setError(null);
  };

  const handleDeleteLink = (linkToDelete: string) => {
    setCurrentLinks(currentLinks.filter(l => l !== linkToDelete));
    if (selectedLinkForSummary === linkToDelete) {
      setSelectedLinkForSummary(null);
      setSummary(null);
    }
  };

  const handleSave = () => {
    onSave(currentLinks);
    onClose();
  };

  const generateSummary = async (url: string) => {
    if (selectedLinkForSummary === url) return; // Already selected
    
    setIsSummarizing(true);
    setSummary(null);
    setSelectedLinkForSummary(url);

    try {
      // If it's the main page and we already have content, use that
      const isMainPage = websiteUrl && url.includes(new URL(websiteUrl).hostname) && url.length < (websiteUrl.length + 5); 
      const contentToUse = (url === websiteUrl && mainPageContent) ? mainPageContent : undefined;

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3f7de5a4/summary/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ 
          url: url,
          text: contentToUse 
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setSummary(data.summary);
      } else {
        setSummary("Could not generate summary. The page might be inaccessible.");
      }
    } catch (error) {
      console.error("Summary error:", error);
      setSummary("Failed to connect to summarization service.");
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* 
        Dynamic Max Width:
        - sm:max-w-2xl (default, centered, looks good for single column)
        - sm:max-w-5xl (wide, when split view is active)
        Transition class handles the smooth resizing of the modal container itself.
      */}
      <DialogContent className={`
        transition-[max-width] duration-500 ease-in-out
        ${selectedLinkForSummary ? 'sm:max-w-5xl' : 'sm:max-w-2xl'}
        bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-200 dark:border-gray-800 
        max-h-[90vh] h-[800px] flex flex-col p-0 overflow-hidden rounded-2xl
      `}>
        
        <div className="flex h-full overflow-hidden">
          {/* Left Side: Link List */}
          <div className={`
            flex flex-col border-r border-gray-100 dark:border-gray-800 transition-all duration-500 ease-in-out
            ${selectedLinkForSummary ? 'w-1/2' : 'w-full'}
          `}>
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
              <div className="flex items-center justify-between mb-2">
                <DialogTitle className="text-xl font-bold">Manage Sources</DialogTitle>
              </div>
              <p className="text-gray-500 text-sm">
                Add or remove pages to train your AI assistant.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 dark:bg-gray-900/50">
              {/* Add New Link Section */}
              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Add new page
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <LinkIcon className="w-4 h-4" />
                    </div>
                    <Input
                      value={newLink}
                      onChange={(e) => {
                        setNewLink(e.target.value);
                        if (error) setError(null);
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
                      placeholder="https://example.com/pricing"
                      className="pl-9 h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    />
                  </div>
                  <Button 
                    onClick={handleAddLink}
                    disabled={!newLink.trim()}
                    size="sm"
                    className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {error && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <X className="w-3 h-3" /> {error}
                  </p>
                )}
              </div>

              {/* Existing Links List */}
              <div className="space-y-3">
                 <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Included pages ({currentLinks.length})
                    </label>
                 </div>

                 <div className="grid grid-cols-1 gap-2">
                   {currentLinks.length === 0 ? (
                     <div className="text-center py-8 text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
                       No links added yet.
                     </div>
                   ) : (
                     <AnimatePresence initial={false}>
                       {currentLinks.map((link) => (
                         <motion.div
                           key={link}
                           initial={{ opacity: 0, height: 0 }}
                           animate={{ opacity: 1, height: 'auto' }}
                           exit={{ opacity: 0, height: 0 }}
                           onClick={() => generateSummary(link)}
                           className={`
                             group flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer
                             ${selectedLinkForSummary === link 
                               ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 ring-1 ring-blue-500/20' 
                               : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'}
                           `}
                         >
                           <div className="flex items-center gap-3 overflow-hidden">
                             <div className={`
                               w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                               ${selectedLinkForSummary === link ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}
                             `}>
                               <Globe className="w-4 h-4" />
                             </div>
                             <div className="flex flex-col min-w-0">
                               <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                 {new URL(link).pathname === '/' ? 'Home Page' : new URL(link).pathname.split('/').filter(Boolean).pop() || 'Page'}
                               </span>
                               <span className="text-xs text-gray-500 truncate max-w-[200px]">
                                 {link}
                               </span>
                             </div>
                           </div>
                           
                           <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                             <Button
                               variant="ghost"
                               size="sm"
                               onClick={(e) => {
                                 e.stopPropagation();
                                 handleDeleteLink(link);
                               }}
                               className="h-7 w-7 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full cursor-pointer"
                             >
                               <Trash2 className="w-3.5 h-3.5" />
                             </Button>
                             <ChevronRight className={`w-4 h-4 text-gray-400 ${selectedLinkForSummary === link ? 'text-blue-500' : ''}`} />
                           </div>
                         </motion.div>
                       ))}
                     </AnimatePresence>
                   )}
                 </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex justify-between items-center gap-3 sticky bottom-0 z-10">
              <Button variant="ghost" onClick={onClose} className="text-gray-500 cursor-pointer">
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[100px] cursor-pointer">
                Save Changes
              </Button>
            </div>
          </div>

          {/* Right Side: Content Summary (Collapsible) */}
          <div className={`
             bg-white dark:bg-gray-900 flex flex-col border-l border-gray-100 dark:border-gray-800
             transition-all duration-500 ease-in-out overflow-hidden
             ${selectedLinkForSummary ? 'w-1/2 opacity-100' : 'w-0 opacity-0'}
          `}>
            {selectedLinkForSummary && (
              <>
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <LinkIcon className="w-5 h-5 text-blue-600" />
                    Page Content
                  </h3>
                </div>
                
                <div className="flex-1 p-8 overflow-y-auto">
                   {isSummarizing ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-4">
                      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                      <p className="text-sm text-gray-500 animate-pulse">Analyzing page content...</p>
                    </div>
                  ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                          Summary
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                          {summary}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                          Link Details
                        </h4>
                        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl p-4 space-y-3">
                           <div>
                             <span className="text-xs text-gray-400 block mb-1">URL</span>
                             <a href={selectedLinkForSummary} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline break-all flex items-center gap-1">
                               {selectedLinkForSummary} <ExternalLink className="w-3 h-3" />
                             </a>
                           </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
