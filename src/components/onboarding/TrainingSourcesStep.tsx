import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link as LinkIcon, HelpCircle, ArrowRight, Check, ArrowLeft, Plus, Edit, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { AcesLogo } from '../AcesLogo';
import LucideFile from '../../imports/LucideFile';
import LucideType from '../../imports/LucideType';
import { LinkManagementModal } from './LinkManagementModal';
import { FileManagementModal } from './FileManagementModal';
import { TextEntryModal } from './TextEntryModal';
import { QnaManagementModal } from './QnaManagementModal';
import { CloudSyncManagementModal } from './CloudSyncManagementModal';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface TrainingSourcesStepProps {
  onContinue: (sources: string[], extractedColor?: string | null) => void;
  onBack?: () => void;
  websiteData?: { url: string; useCase: string; crawledData?: any };
}

export const TrainingSourcesStep: React.FC<TrainingSourcesStepProps> = ({ 
  onContinue, 
  onBack,
  websiteData 
}) => {
  // Initialize selected sources.
  const [selectedSources, setSelectedSources] = useState<string[]>(websiteData?.url ? ['website'] : []);
  const [isCreating, setIsCreating] = useState(false);
  
  // Data State
  const [crawledLinks, setCrawledLinks] = useState<string[]>(() => {
    const mainUrl = websiteData?.url;
    const subLinks = websiteData?.crawledData?.links || [];
    const linksSet = new Set<string>();
    if (mainUrl) linksSet.add(mainUrl);
    subLinks.forEach((link: string) => linksSet.add(link));
    return Array.from(linksSet);
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [textData, setTextData] = useState<{ title: string; text: string }[]>([]);
  const [qnaData, setQnaData] = useState<{ title: string; question: string; answer: string }[]>([]);
  const [cloudSyncSources, setCloudSyncSources] = useState<string[]>([]);

  // Modal States
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Function to extract dominant color from image (Reused logic for pre-fetching)
  const extractDominantColor = async (imageUrl: string) => {
    try {
      let imageSrc = imageUrl;
      let shouldUseProxy = imageUrl.startsWith('http') || imageUrl.startsWith('//');
      
      if (imageUrl.startsWith('blob:')) shouldUseProxy = false;
      if (shouldUseProxy && imageUrl.startsWith('//')) imageUrl = 'https:' + imageUrl;
      
      if (shouldUseProxy) {
         const proxyUrl = `https://${projectId}.supabase.co/functions/v1/make-server-3f7de5a4/util/proxy-image?url=${encodeURIComponent(imageUrl)}`;
         try {
             const response = await fetch(proxyUrl, {
                headers: { 'Authorization': `Bearer ${publicAnonKey}` }
             });
             if (!response.ok) return null;
             const blob = await response.blob();
             imageSrc = URL.createObjectURL(blob);
         } catch (e) { return null; }
      }

      const img = new Image();
      if (!shouldUseProxy && !imageUrl.startsWith('data:') && !imageUrl.startsWith('blob:')) {
          img.crossOrigin = "Anonymous";
      }
      img.src = imageSrc;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error("Image load failed"));
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      if (imageSrc !== imageUrl && imageSrc.startsWith('blob:')) URL.revokeObjectURL(imageSrc);

      const width = img.width;
      const height = img.height;
      const x = width > 10 ? width * 0.1 : 0;
      const y = height > 10 ? height * 0.1 : 0;
      const w = width > 10 ? width * 0.8 : width;
      const h = height > 10 ? height * 0.8 : height;

      const imageData = ctx.getImageData(x, y, w, h).data;
      const colorCounts: Record<string, { count: number, r: number, g: number, b: number }> = {};
      let maxCount = 0;
      let dominantColor = null;
      const QUANTIZE = 15;

      for (let i = 0; i < imageData.length; i += 4) {
        const a = imageData[i + 3];
        if (a < 200) continue;
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        if ((r > 230 && g > 230 && b > 230) || (r < 30 && g < 30 && b < 30)) continue;

        const rQ = Math.round(r / QUANTIZE) * QUANTIZE;
        const gQ = Math.round(g / QUANTIZE) * QUANTIZE;
        const bQ = Math.round(b / QUANTIZE) * QUANTIZE;
        const key = `${rQ},${gQ},${bQ}`;
        
        if (!colorCounts[key]) colorCounts[key] = { count: 0, r: rQ, g: gQ, b: bQ };
        colorCounts[key].count++;
        if (colorCounts[key].count > maxCount) {
            maxCount = colorCounts[key].count;
            dominantColor = colorCounts[key];
        }
      }

      if (dominantColor) {
        const toHex = (n: number) => {
            const hex = Math.min(255, Math.max(0, n)).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(dominantColor.r)}${toHex(dominantColor.g)}${toHex(dominantColor.b)}`;
      }
      return null;
    } catch (e) { return null; }
  };

  const handleContinue = async () => {
    setIsCreating(true);
    let extractedColor = null;

    // Try to extract color from logo if available
    if (websiteData?.crawledData?.logo) {
       // Add a minimum delay to show the "Creating AI" state for better UX
       // Concurrent with the extraction
       const [color] = await Promise.all([
          extractDominantColor(websiteData.crawledData.logo),
          new Promise(resolve => setTimeout(resolve, 1500)) 
       ]);
       extractedColor = color;
    } else {
       // Just wait a bit if no logo
       await new Promise(resolve => setTimeout(resolve, 1500));
    }

    onContinue(selectedSources, extractedColor);
  };

  const sources = [
    {
      id: 'file',
      // Logic: If 0 files, "File". If 1 file, "1 File". If >1, "N Files".
      label: uploadedFiles.length > 0 ? `${uploadedFiles.length} File${uploadedFiles.length === 1 ? '' : 's'}` : 'File',
      icon: (
        <div className="w-6 h-6" style={{ '--stroke-0': 'currentColor' } as React.CSSProperties}>
          <LucideFile />
        </div>
      ),
      description: 'Upload pdf, doc, txt'
    },
    {
      id: 'text',
      label: textData.length > 0 ? `${textData.length} Snippet${textData.length === 1 ? '' : 's'}` : 'Text',
      icon: (
        <div className="w-6 h-6" style={{ '--stroke-0': 'currentColor' } as React.CSSProperties}>
          <LucideType />
        </div>
      ),
      description: 'Paste your text'
    },
    {
      id: 'website',
      label: crawledLinks.length > 0 ? `${crawledLinks.length} Link${crawledLinks.length === 1 ? '' : 's'}` : 'Website',
      icon: <LinkIcon className="w-6 h-6" />,
      description: crawledLinks.length > 0 ? 'From your site' : 'Crawl website'
    },
    {
      id: 'qna',
      label: qnaData.length > 0 ? `${qnaData.length} Q&A` : 'Q&A',
      icon: <HelpCircle className="w-6 h-6" />,
      description: 'Add FAQ pairs'
    },
    {
      id: 'cloudSync',
      label: cloudSyncSources.length > 0 ? `${cloudSyncSources.length} Connected` : 'Cloud Sync',
      icon: <RefreshCw className="w-6 h-6" />,
      description: 'Notion, Drive, Dropbox'
    }
  ];

  const handleSourceClick = (id: string) => {
    setActiveModal(id);
  };

  const updateSelection = (id: string, hasData: boolean) => {
    if (hasData) {
      if (!selectedSources.includes(id)) {
        setSelectedSources(prev => [...prev, id]);
      }
    } else {
       // If no data is left (e.g. all files deleted), unselect the source
       setSelectedSources(prev => prev.filter(s => s !== id));
    }
  };

  const handleLinksSaved = (links: string[]) => {
    setCrawledLinks(links);
    updateSelection('website', links.length > 0);
    setActiveModal(null);
  };

  const handleFilesSaved = (files: File[]) => {
    setUploadedFiles(files);
    updateSelection('file', files.length > 0);
    setActiveModal(null);
  };

  const handleTextSaved = (data: { title: string; text: string }[]) => {
    setTextData(data);
    updateSelection('text', data.length > 0);
    setActiveModal(null);
  };

  const handleQnaSaved = (data: { title: string; question: string; answer: string }[]) => {
    setQnaData(data);
    updateSelection('qna', data.length > 0);
    setActiveModal(null);
  };

  const handleCloudSyncSaved = (services: string[]) => {
    setCloudSyncSources(services);
    updateSelection('cloudSync', services.length > 0);
    setActiveModal(null);
  };

  return (
    <div className="flex w-full min-h-screen bg-white dark:bg-gray-950 items-center justify-center p-4 relative">
      {/* Back Button */}
      {onBack && (
        <button 
          onClick={onBack}
          className="absolute top-8 left-8 p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      )}

      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <AcesLogo className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            You can add multiple sources to train your Agent
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400">
            Let's start with a file or a link to your site.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {sources.map((source) => {
            const isSelected = selectedSources.includes(source.id);
            const hasData = source.id === 'website' ? crawledLinks.length > 0 
                : source.id === 'file' ? uploadedFiles.length > 0
                : source.id === 'text' ? textData.length > 0
                : source.id === 'qna' ? qnaData.length > 0 
                : source.id === 'notion' ? notionPages.length > 0 : false;

            return (
              <motion.div
                key={source.id}
                whileHover="hover"
                initial="initial"
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSourceClick(source.id)}
                className={`
                  group relative cursor-pointer rounded-xl border-2 p-6 flex flex-col items-center justify-center text-center gap-4 transition-colors duration-200 h-40
                  ${isSelected 
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500' 
                    : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-blue-300 dark:hover:border-blue-700'}
                `}
              >
                {/* Top Right Indicator */}
                <div className="absolute top-3 right-3 w-5 h-5 flex items-center justify-center">
                   {/* Base State: Checkmark or Hidden */}
                   <motion.div
                     className="absolute inset-0 bg-blue-600 rounded-full flex items-center justify-center"
                     initial={{ opacity: isSelected ? 1 : 0, scale: isSelected ? 1 : 0 }}
                     animate={{ opacity: isSelected ? 1 : 0, scale: isSelected ? 1 : 0 }}
                     variants={{
                       hover: { 
                         opacity: isSelected ? 1 : 0,
                         scale: isSelected ? 1 : 0
                       }
                     }}
                   >
                     <Check className="w-3 h-3 text-white" />
                   </motion.div>

                   {/* Hover State: Edit (if has data) or Plus (if no data) */}
                   <motion.div
                     className={`absolute inset-0 rounded-full flex items-center justify-center ${
                       hasData ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                     }`}
                     initial={{ opacity: 0, scale: 0 }}
                     variants={{
                       hover: { opacity: 1, scale: 1 }
                     }}
                   >
                     {hasData ? (
                       <Edit className="w-3 h-3" />
                     ) : (
                       <Plus className="w-3 h-3" />
                     )}
                   </motion.div>
                </div>
                
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  ${isSelected ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}
                `}>
                  {source.icon}
                </div>
                
                <div>
                  <h3 className={`font-semibold ${isSelected ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'}`}>
                    {source.label}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Action */}
        <div className="flex justify-center">
          <Button
            onClick={handleContinue}
            disabled={selectedSources.length === 0 || isCreating}
            className={`h-14 px-8 text-lg rounded-full shadow-lg transition-all w-full max-w-sm cursor-pointer ${
              selectedSources.length === 0 
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed shadow-none' 
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl'
            }`}
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                Creating AI...
              </>
            ) : (
              <>
                Finish & continue <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Modals */}
      <LinkManagementModal 
        isOpen={activeModal === 'website'}
        onClose={() => setActiveModal(null)}
        links={crawledLinks}
        onSave={handleLinksSaved}
        websiteUrl={websiteData?.url}
        mainPageContent={websiteData?.crawledData?.contentSnippet}
      />
      
      <FileManagementModal
        isOpen={activeModal === 'file'}
        onClose={() => setActiveModal(null)}
        onSave={handleFilesSaved}
      />

      <TextEntryModal
        isOpen={activeModal === 'text'}
        onClose={() => setActiveModal(null)}
        onSave={handleTextSaved}
        initialSnippets={textData}
      />

      <QnaManagementModal
        isOpen={activeModal === 'qna'}
        onClose={() => setActiveModal(null)}
        onSave={handleQnaSaved}
        initialPairs={qnaData}
      />

      <CloudSyncManagementModal
        isOpen={activeModal === 'cloudSync'}
        onClose={() => setActiveModal(null)}
        onSave={handleCloudSyncSaved}
        initialServices={cloudSyncSources}
      />
    </div>
  );
};
