import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Upload, Search, MessageCircle, FolderOpen, Globe, Link2,
  FileText, Database, Users, Send, RefreshCw, BookOpen, Settings,
  ChevronRight, Plus, Trash2, ExternalLink, Play, Pause, CheckCircle2,
  AlertCircle, Clock
} from 'lucide-react';

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

interface FilesManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  isClosing?: boolean;
  svgPaths: { p29699900: string; p3f33ac00: string };
  notionIcon: string;
  googleDriveIcon: string;
  dropboxIcon: string;
  initialTab?: string;
  btnRect?: { x: number; y: number; w: number; h: number };
  modalRect?: { x: number; y: number; w: number; h: number };
}

type SidebarSection = 'web-crawl' | 'knowledge' | 'training' | 'reference' | 'internal' | 'sync' | 'customer-docs' | 'send-docs';

const sidebarItems: { id: SidebarSection; label: string; icon: React.ReactNode; color: string; description: string }[] = [
  { id: 'web-crawl', label: 'Web Crawling', icon: <Globe className="w-4 h-4" />, color: 'text-cyan-600 dark:text-cyan-400', description: 'Crawl & index websites' },
  { id: 'knowledge', label: 'Knowledge Base', icon: <BookOpen className="w-4 h-4" />, color: 'text-blue-600 dark:text-blue-400', description: 'Company files & FAQs' },
  { id: 'training', label: 'Training Data', icon: <MessageCircle className="w-4 h-4" />, color: 'text-green-600 dark:text-green-400', description: 'Chat logs & transcripts' },
  { id: 'reference', label: 'Reference Files', icon: <FileText className="w-4 h-4" />, color: 'text-purple-600 dark:text-purple-400', description: 'Menus, brochures, catalogs' },
  { id: 'internal', label: 'Internal Files', icon: <Database className="w-4 h-4" />, color: 'text-orange-600 dark:text-orange-400', description: 'CSV lists, SKUs, templates' },
  { id: 'sync', label: 'Cloud Sync', icon: <RefreshCw className="w-4 h-4" />, color: 'text-indigo-600 dark:text-indigo-400', description: 'Notion, Drive, Dropbox' },
  { id: 'customer-docs', label: 'Customer Docs', icon: <Users className="w-4 h-4" />, color: 'text-teal-600 dark:text-teal-400', description: 'Files from customers' },
  { id: 'send-docs', label: 'Send Documents', icon: <Send className="w-4 h-4" />, color: 'text-pink-600 dark:text-pink-400', description: 'Share files via chat' },
];

// Mock crawl data
const mockCrawlJobs = [
  { id: '1', url: 'https://acesai.me', status: 'completed' as const, pages: 24, lastCrawled: '2 hours ago' },
  { id: '2', url: 'https://acesai.me/blog', status: 'crawling' as const, pages: 8, lastCrawled: 'In progress...' },
];

export function FilesManagementModal({
  isOpen,
  onClose,
  isClosing = false,
  svgPaths,
  notionIcon,
  googleDriveIcon,
  dropboxIcon,
  initialTab,
  btnRect = { x: 0, y: 0, w: 35, h: 35 },
  modalRect = { x: 0, y: 0, w: 1150, h: 700 },
}: FilesManagementModalProps) {
  const [activeSection, setActiveSection] = useState<SidebarSection>(
    (initialTab as SidebarSection) || 'web-crawl'
  );
  const [crawlUrl, setCrawlUrl] = useState('');
  const [crawlJobs, setCrawlJobs] = useState(mockCrawlJobs);
  const [crawlDepth, setCrawlDepth] = useState(3);
  const [crawlMaxPages, setCrawlMaxPages] = useState(50);

  // Reset to initial tab when opened
  React.useEffect(() => {
    if (isOpen) {
      setActiveSection((initialTab as SidebarSection) || 'web-crawl');
    }
  }, [isOpen, initialTab]);

  const handleStartCrawl = () => {
    if (!crawlUrl.trim()) return;
    const newJob = {
      id: Date.now().toString(),
      url: crawlUrl.trim(),
      status: 'crawling' as const,
      pages: 0,
      lastCrawled: 'Starting...',
    };
    setCrawlJobs(prev => [newJob, ...prev]);
    setCrawlUrl('');
  };

  const handleDeleteCrawl = (id: string) => {
    setCrawlJobs(prev => prev.filter(j => j.id !== id));
  };

  const FileIconSvg = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" preserveAspectRatio="none" viewBox="0 0 19 19">
      <g>
        <path d={svgPaths.p29699900} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
        <path d={svgPaths.p3f33ac00} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" />
      </g>
    </svg>
  );

  const UploadZone = ({ color, icon, title, subtitle, formats }: {
    color: string; icon: React.ReactNode; title: string; subtitle: string; formats: string;
  }) => (
    <div className={`border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-10 text-center hover:border-${color}-500 dark:hover:border-${color}-400 transition-all cursor-pointer group`}>
      <div className="text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300 transition-colors mb-3 flex justify-center">
        {icon}
      </div>
      <p className="text-gray-900 dark:text-gray-100 font-medium mb-1">{title}</p>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">{subtitle}</p>
      <p className="text-gray-400 dark:text-gray-500 text-xs">{formats}</p>
    </div>
  );

  const EmptyState = ({ icon, message, sub }: { icon: React.ReactNode; message: string; sub?: string }) => (
    <div className="text-center py-10 text-gray-500 dark:text-gray-400">
      <div className="flex justify-center mb-3 opacity-50">{icon}</div>
      <p className="text-sm font-medium">{message}</p>
      {sub && <p className="text-xs mt-1 text-gray-400 dark:text-gray-500">{sub}</p>}
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'web-crawl':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                Web Crawling
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Crawl your website so the AI can learn your content, pages, products, and services automatically. No manual uploads needed.
              </p>
            </div>

            {/* Add URL Input */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">Add Website URL</label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Globe className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={crawlUrl}
                    onChange={(e) => setCrawlUrl(e.target.value)}
                    placeholder="https://your-website.com"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && handleStartCrawl()}
                  />
                </div>
                <button
                  onClick={handleStartCrawl}
                  disabled={!crawlUrl.trim()}
                  className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <Play className="w-3.5 h-3.5" />
                  Start Crawl
                </button>
              </div>

              {/* Crawl Settings */}
              <div className="flex gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-500 dark:text-gray-400">Depth:</label>
                  <select
                    value={crawlDepth}
                    onChange={(e) => setCrawlDepth(Number(e.target.value))}
                    className="text-xs border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    <option value={1}>1 level</option>
                    <option value={2}>2 levels</option>
                    <option value={3}>3 levels</option>
                    <option value={5}>5 levels</option>
                    <option value={10}>10 levels</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-500 dark:text-gray-400">Max pages:</label>
                  <select
                    value={crawlMaxPages}
                    onChange={(e) => setCrawlMaxPages(Number(e.target.value))}
                    className="text-xs border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={250}>250</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Crawl Jobs List */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Crawled Sites
              </h4>
              {crawlJobs.length > 0 ? (
                <div className="space-y-2">
                  {crawlJobs.map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between p-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {job.status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                        ) : job.status === 'crawling' ? (
                          <RefreshCw className="w-4 h-4 text-cyan-500 animate-spin shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{job.url}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {job.pages} pages indexed · {job.lastCrawled}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        {job.status === 'completed' && (
                          <button className="p-1.5 text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Re-crawl">
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="View pages">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCrawl(job.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Globe className="w-10 h-10" />}
                  message="No websites crawled yet"
                  sub="Add a URL above to start indexing your website content"
                />
              )}
            </div>

            {/* Info Box */}
            <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg p-4">
              <p className="text-sm text-cyan-900 dark:text-cyan-100">
                <strong>How it works:</strong> The crawler visits your website pages, extracts text content, and feeds it to your AI so it can answer questions about your business accurately. Re-crawl anytime to keep info up to date.
              </p>
            </div>
          </div>
        );

      case 'knowledge':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Knowledge Base Files</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Upload PDFs, docs, or spreadsheets with product info, pricing, FAQs, policies, or onboarding guides so the AI can learn from them and answer customers accurately.
              </p>
            </div>
            <UploadZone
              color="blue"
              icon={<Upload className="w-10 h-10" />}
              title="Upload your company handbook or FAQ"
              subtitle="Drag and drop files here, or click to browse"
              formats="Supported formats: PDF, DOC, DOCX, XLS, XLSX (Max 10MB)"
            />
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Uploaded Files</h4>
              <EmptyState icon={<FileIconSvg className="w-8 h-8" />} message="No files uploaded yet" />
            </div>
          </div>
        );

      case 'training':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Training Data</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Upload chat logs or email transcripts so the AI learns tone, phrasing, and real support cases. Helps the bot sound like your brand's actual voice.
              </p>
            </div>
            <UploadZone
              color="green"
              icon={<MessageCircle className="w-10 h-10" />}
              title="Upload chat logs or support conversations"
              subtitle="Drag and drop files here, or click to browse"
              formats="Supported formats: TXT, CSV, JSON, PDF (Max 10MB)"
            />
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Training Files</h4>
              <EmptyState icon={<MessageCircle className="w-8 h-8" />} message="No training files uploaded yet" />
            </div>
          </div>
        );

      case 'reference':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Customer Reference Files</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Upload files that the AI can send to customers, like menus, brochures, or invoices on request. Example: "Can I see your catalog?" → AI sends uploaded PDF automatically.
              </p>
            </div>
            <UploadZone
              color="purple"
              icon={<FileIconSvg className="w-10 h-10" />}
              title="Upload customer-facing documents"
              subtitle="Menus, brochures, catalogs, price lists, etc."
              formats="Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)"
            />
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Reference Library</h4>
              <EmptyState icon={<FileIconSvg className="w-8 h-8" />} message="No reference files uploaded yet" />
            </div>
          </div>
        );

      case 'internal':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Internal Documents</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Store setup files like CSV customer lists, product SKUs, or policy templates that the AI pulls from when automating tasks.
              </p>
            </div>
            <UploadZone
              color="orange"
              icon={<FileIconSvg className="w-10 h-10" />}
              title="Upload internal business files"
              subtitle="CSV lists, SKU databases, templates"
              formats="Supported formats: CSV, XLS, XLSX, PDF, TXT (Max 10MB)"
            />
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Internal Files</h4>
              <EmptyState icon={<FileIconSvg className="w-8 h-8" />} message="No internal files uploaded yet" />
            </div>
          </div>
        );

      case 'sync':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Cloud Documentation Sync</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Connect with Notion, Google Drive, or Dropbox, and the Files area mirrors your business documentation for continuous AI reference.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="group border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer">
                <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <NotionSvg className="w-12 h-12 rounded-lg group-hover:scale-110 transition-transform duration-200" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Notion</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Sync your Notion workspace</p>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Connect</button>
              </div>
              <div className="group border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer">
                <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" alt="Google Drive" className="w-12 h-12 group-hover:scale-110 transition-transform duration-200" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Google Drive</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Sync your Drive folders</p>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Connect</button>
              </div>
              <div className="group border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer">
                <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <DropboxSvg className="w-12 h-12 rounded-lg group-hover:scale-110 transition-transform duration-200" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Dropbox</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Sync your Dropbox files</p>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Connect</button>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Tip:</strong> Once connected, your documentation will automatically sync, keeping your AI up to date with the latest information.
              </p>
            </div>
          </div>
        );

      case 'customer-docs':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Customer Uploaded Documents</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                View all documents customers have sent to the AI. Click on a customer's name to see all their documents.
              </p>
            </div>
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search customer documents..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <EmptyState
              icon={<FileIconSvg className="w-10 h-10" />}
              message="No customer documents yet"
              sub="Documents sent by customers will appear here"
            />
          </div>
        );

      case 'send-docs':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Send Documents to Customers</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Search and upload your own documents to send from Aces AI to customers via WhatsApp chatbox.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-pink-500 dark:hover:border-pink-400 transition-colors cursor-pointer">
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-900 dark:text-gray-100 font-medium mb-1">Upload New Document</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">To send to customers</p>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                <Search className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-900 dark:text-gray-100 font-medium mb-1">Search Documents</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Find existing files</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Available to Send</h4>
              <EmptyState
                icon={<FileIconSvg className="w-8 h-8" />}
                message="No documents available to send yet"
                sub="Upload files to make them available for sending"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const activeMeta = sidebarItems.find(s => s.id === activeSection);

  // Note: no early return — AnimatePresence must always be mounted to play exit animation
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — fades in fast, fades out immediately when isClosing */}
          <motion.div
            key="fm-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ position: 'fixed', inset: 0, zIndex: 99998 }}
            className="bg-black/55 backdrop-blur-sm"
            onClick={() => { if (!isClosing) onClose(); }}
          />
          {/* Modal box — morphs from button rect to full size */}
          <motion.div
            key="fm-modal"
            initial={{
              position: 'fixed',
              left: btnRect.x,
              top: btnRect.y,
              width: btnRect.w,
              height: btnRect.h,
              borderRadius: 10,
              opacity: 1,
            }}
            animate={{
              left: modalRect.x,
              top: modalRect.y,
              width: modalRect.w,
              height: modalRect.h,
              borderRadius: 20,
              opacity: 1,
            }}
            exit={{
              left: btnRect.x,
              top: btnRect.y,
              width: btnRect.w,
              height: btnRect.h,
              borderRadius: 10,
              opacity: 1,
            }}
            transition={{
              duration: 0.45, ease: [0.23, 1, 0.32, 1],
              boxShadow: { duration: 0.4, ease: 'easeOut' },
            }}
            style={{
              position: 'fixed', zIndex: 99999, overflow: 'hidden',
              boxShadow: isClosing
                ? '0 1px 3px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)'
                : '0 25px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.06)',
            }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Liquid glass frost overlay — visible on open (frosted surface expands), dissolves to reveal content, re-appears on close */}
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 1 }}
              transition={{
                duration: 0.28,
                delay: 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="absolute inset-0 pointer-events-none z-10 bg-white/90 dark:bg-gray-800/90"
              style={{
                backdropFilter: 'blur(24px) saturate(1.8)',
                WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
              }}
            />
            {/* Morph icon — centered in the shrinking box, scales from large → button-sized icon */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 1 }}
              transition={{
                duration: 0.15,
                delay: 0,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center"
            >
              <div style={{ width: 'clamp(19px, 54%, 52px)', height: 'clamp(19px, 54%, 52px)' }}>
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 19">
                  <g>
                    <path d={svgPaths.p29699900} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" className="text-[#4b5563] dark:text-white" />
                    <path d={svgPaths.p3f33ac00} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.45833" className="text-[#4b5563] dark:text-white" />
                  </g>
                </svg>
              </div>
            </motion.div>
            {/* Content wrapper — fades in after box expands; dissolves into frosted glass on close */}
            <motion.div
              key="fm-content"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{
                duration: 0.22,
                delay: 0.14,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="relative z-30 flex w-full h-full pointer-events-auto"
            >
              {/* Sidebar */}
              <div className="w-56 shrink-0 bg-gray-50 dark:bg-gray-950 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                {/* Sidebar Header */}
                <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                      <FileIconSvg className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Files Management</span>
                  </div>
                </div>

                {/* Sidebar Nav */}
                <nav className="flex-1 overflow-y-auto py-2 px-2">
                  {sidebarItems.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all mb-0.5 group cursor-pointer ${
                          isActive
                            ? 'bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700'
                            : 'hover:bg-white/60 dark:hover:bg-gray-800/50'
                        }`}
                      >
                        <span className={`shrink-0 ${isActive ? item.color : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>
                          {item.icon}
                        </span>
                        <div className="min-w-0">
                          <p className={`text-sm truncate ${
                            isActive
                              ? 'text-gray-900 dark:text-gray-100 font-medium'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {item.label}
                          </p>
                          <p className={`text-xs truncate ${
                            isActive
                              ? 'text-gray-500 dark:text-gray-400'
                              : 'text-gray-400 dark:text-gray-500'
                          }`}>
                            {item.description}
                          </p>
                        </div>
                        {isActive && (
                          <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-auto" />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col min-w-0">
                {/* Content Header */}
                <div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shrink-0">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <FileIconSvg className="w-3.5 h-3.5" />
                    <span>Files Management</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className={`font-medium ${activeMeta?.color || 'text-gray-900 dark:text-gray-100'}`}>
                      {activeMeta?.label}
                    </span>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto p-6" data-modal-scroll="true">
                  {renderContent()}
                </div>
              </div>
            </motion.div>{/* closes content wrapper */}
          </motion.div>{/* closes modal box */}
        </>
      )}
    </AnimatePresence>
  );
}