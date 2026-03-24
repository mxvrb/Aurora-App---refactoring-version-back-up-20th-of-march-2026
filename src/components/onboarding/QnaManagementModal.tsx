import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus, Trash2, HelpCircle, Bold, Italic, Strikethrough, List, Link as LinkIcon, Smile, Type, Check, X, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import EmojiPicker from 'emoji-picker-react';

interface QnaPair {
  id: string;
  question: string;
  answer: string; // HTML content
}

interface QnaManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pairs: { title: string; question: string; answer: string }[]) => void;
  initialPairs?: { title: string; question: string; answer: string }[];
}

export const QnaManagementModal: React.FC<QnaManagementModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialPairs = []
}) => {
  const [pairs, setPairs] = useState<QnaPair[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState('');
  
  // Editor State
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<string[]>([]);
  
  // Link State
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);
  const [isStylePopoverOpen, setIsStylePopoverOpen] = useState(false);
  const [isEmojiPopoverOpen, setIsEmojiPopoverOpen] = useState(false);
  
  const savedSelection = useRef<Range | null>(null);

  useEffect(() => {
    if (isOpen) {
      const formatted = initialPairs.map((p, i) => ({
        id: `qna-${i}-${Date.now()}`,
        question: p.question,
        answer: p.answer
      }));
      setPairs(formatted);
      if (formatted.length > 0) {
        selectPair(formatted[0]);
      } else {
        createNewPair();
      }
    }
  }, [isOpen, initialPairs]);

  const selectPair = (pair: QnaPair) => {
    setSelectedId(pair.id);
    setCurrentQuestion(pair.question);
    // Use a small timeout to allow DOM to render if switching views
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = pair.answer;
      }
    }, 0);
  };

  const createNewPair = () => {
    const newPair = {
      id: `new-${Date.now()}`,
      question: '',
      answer: ''
    };
    setPairs(prev => [...prev, newPair]);
    setTimeout(() => selectPair(newPair), 0);
  };

  const updateCurrentPair = (updates: Partial<QnaPair>) => {
    if (!selectedId) return;
    
    setPairs(prev => prev.map(p => 
      p.id === selectedId ? { ...p, ...updates } : p
    ));
    
    if (updates.question !== undefined) setCurrentQuestion(updates.question);
  };

  const deletePair = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newPairs = pairs.filter(p => p.id !== id);
    setPairs(newPairs);
    if (selectedId === id) {
      if (newPairs.length > 0) {
        selectPair(newPairs[0]);
      } else {
        createNewPair();
      }
    }
  };

  const handleSave = () => {
    const validPairs = pairs
      .filter(p => p.question.trim() || p.answer.trim())
      .map(({ question, answer }) => ({ 
        title: question, 
        question, 
        answer 
      }));
    
    onSave(validPairs);
    onClose();
  };

  // --- Rich Text Logic ---

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current && editorRef.current.contains(sel.anchorNode)) {
      savedSelection.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (sel && savedSelection.current) {
      sel.removeAllRanges();
      sel.addRange(savedSelection.current);
    } else if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const execCommand = (command: string, value: string | undefined = undefined) => {
    if (document.activeElement !== editorRef.current) {
      restoreSelection();
    }
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    checkFormats();
    if (editorRef.current) {
       updateCurrentPair({ answer: editorRef.current.innerHTML });
    }
  };

  const checkFormats = () => {
    const formats = [];
    if (document.queryCommandState('bold')) formats.push('bold');
    if (document.queryCommandState('italic')) formats.push('italic');
    if (document.queryCommandState('strikethrough')) formats.push('strikethrough');
    if (document.queryCommandState('insertUnorderedList')) formats.push('list');
    setActiveFormats(formats);
  };

  const handlePointerDown = () => {
    // Capture selection before the button click potentially moves focus
    saveSelection();
  };

  const handleEditorClick = (e: React.MouseEvent) => {
    // Focus the editor
    editorRef.current?.focus();
    
    // Check if a link was clicked
    const target = e.target as HTMLElement;
    if (target.tagName === 'A' && target.hasAttribute('href')) {
       // Open link in new tab
       window.open(target.getAttribute('href')!, '_blank');
    }
  };

  // --- Link Handlers ---

  const onLinkPopoverOpenChange = (open: boolean) => {
    setIsLinkPopoverOpen(open);
    if (open) {
      const sel = window.getSelection();
      if (sel && sel.toString().length > 0 && editorRef.current?.contains(sel.anchorNode)) {
        setLinkText(sel.toString());
      } else {
        setLinkText('');
      }
      setLinkUrl('');
    }
  };

  const handleInsertLink = () => {
    restoreSelection();
    setIsLinkPopoverOpen(false);
    
    if (!linkUrl) return;
    
    const finalUrl = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
    
    const linkHtml = `<a href="${finalUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline cursor-pointer" style="cursor: pointer;">${linkText || finalUrl}</a>`;

    execCommand('insertHTML', linkHtml);
  };

  const onEmojiClick = (emojiData: any) => {
     // Don't close popover - keep it open
     // Insert Apple Emoji Image
     // Use inline-block and text-bottom for best alignment with text
     const unified = emojiData.unified;
     const imageUrl = `https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${unified}.png`;
     const imgHtml = `<img src="${imageUrl}" alt="${emojiData.emoji}" class="inline-block" style="width: 1.25em; height: 1.25em; vertical-align: text-bottom; margin: 0 1px;" />`;
     
     execCommand('insertHTML', imgHtml);
     
     // Re-save selection so subsequent emojis are inserted at the new caret position
     saveSelection();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-5xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-200 dark:border-gray-800 h-[800px] max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl transition-[max-width] duration-500 ease-in-out">
        <div className="flex h-full overflow-hidden">
          {/* Sidebar List */}
          <div className="w-[300px] flex-shrink-0 border-r border-gray-100 dark:border-gray-800 flex flex-col bg-gray-50/50 dark:bg-gray-900/50">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
              <DialogTitle className="text-xl font-bold mb-1">Q&A</DialogTitle>
              <DialogDescription className="text-gray-500 text-sm">
                Add frequent questions to train your AI.
              </DialogDescription>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <Button 
                onClick={createNewPair}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-4 cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2" /> Add New Q&A
              </Button>

              {pairs.map((pair) => (
                <div
                  key={pair.id}
                  onClick={() => selectPair(pair)}
                  className={`
                    group flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all
                    ${selectedId === pair.id 
                      ? 'bg-white border-blue-500 shadow-sm dark:bg-gray-800 dark:border-blue-500 ring-1 ring-blue-500/20' 
                      : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:border-blue-300'}
                  `}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`
                       w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                       ${selectedId === pair.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}
                    `}>
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium truncate">
                        {pair.question || 'New Question'}
                      </span>
                      <span className="text-xs text-gray-400 truncate">
                        {pair.answer.replace(/<[^>]+>/g, '').substring(0, 30) || 'No answer'}
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => deletePair(pair.id, e)}
                    className="opacity-0 group-hover:opacity-100 h-7 w-7 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex justify-between gap-3 sticky bottom-0 z-10">
              <Button variant="ghost" onClick={onClose} className="text-gray-500 cursor-pointer">
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[100px] cursor-pointer">
                Save All
              </Button>
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 relative">
             {selectedId ? (
                <>
                  <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 block">
                      Question
                    </label>
                    <Input
                      value={currentQuestion}
                      onChange={(e) => updateCurrentPair({ question: e.target.value })}
                      placeholder="Ex: How do I reset my password?"
                      className="text-lg font-medium border-gray-200 dark:border-gray-700 h-12"
                    />
                  </div>
                  
                  {/* Toolbar */}
                  <div className="flex items-center gap-1 p-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
                     {/* Text Styles Dropdown */}
                     <Popover open={isStylePopoverOpen} onOpenChange={setIsStylePopoverOpen}>
                       <PopoverTrigger asChild>
                         <button 
                           onPointerDown={handlePointerDown}
                           className="flex items-center gap-1 px-3 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 text-sm font-medium cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                         >
                           <Type className="w-4 h-4 mr-1" />
                           <ChevronDown className="w-3 h-3 opacity-50" />
                         </button>
                       </PopoverTrigger>
                       {/* z-[10000000] to ensure popover is above the Dialog */}
                       <PopoverContent className="w-56 p-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl z-[10000000]" align="start" side="bottom">
                          <div className="flex flex-col gap-0.5">
                             <TextStyleButton 
                               onClick={() => { execCommand('formatBlock', 'P'); setIsStylePopoverOpen(false); }} 
                               label="Normal text" 
                               preview={<span className="text-sm font-normal">Normal text</span>}
                               icon={<span className="text-xs font-bold">T</span>}
                               iconColor="text-black dark:text-black"
                             />
                             <TextStyleButton 
                               onClick={() => { execCommand('formatBlock', 'H1'); setIsStylePopoverOpen(false); }} 
                               label="Heading 1" 
                               preview={<span className="text-xl font-bold">Heading 1</span>}
                               icon={<span className="text-xs font-bold">H1</span>}
                               iconColor="text-black dark:text-black"
                             />
                             <TextStyleButton 
                               onClick={() => { execCommand('formatBlock', 'H2'); setIsStylePopoverOpen(false); }} 
                               label="Heading 2" 
                               preview={<span className="text-lg font-bold">Heading 2</span>}
                               icon={<span className="text-xs font-bold">H2</span>}
                               iconColor="text-black dark:text-black"
                             />
                             <TextStyleButton 
                               onClick={() => { execCommand('formatBlock', 'H3'); setIsStylePopoverOpen(false); }} 
                               label="Heading 3" 
                               preview={<span className="text-base font-bold">Heading 3</span>}
                               icon={<span className="text-xs font-bold">H3</span>}
                               iconColor="text-black dark:text-black"
                             />
                          </div>
                       </PopoverContent>
                     </Popover>

                     <div className="w-px h-5 bg-gray-300 dark:bg-gray-700 mx-2" />
                     
                     <ToolbarButton 
                        active={activeFormats.includes('bold')} 
                        onClick={() => execCommand('bold')} 
                        icon={<Bold className="w-4 h-4" />} 
                     />
                     <ToolbarButton 
                        active={activeFormats.includes('italic')} 
                        onClick={() => execCommand('italic')} 
                        icon={<Italic className="w-4 h-4" />} 
                     />
                     <ToolbarButton 
                        active={activeFormats.includes('strikethrough')} 
                        onClick={() => execCommand('strikethrough')} 
                        icon={<Strikethrough className="w-4 h-4" />} 
                     />
                     
                     <div className="w-px h-5 bg-gray-300 dark:bg-gray-700 mx-2" />
                     
                     <ToolbarButton 
                        active={activeFormats.includes('unorderedList') || activeFormats.includes('list')} 
                        onClick={() => execCommand('insertUnorderedList')} 
                        icon={<List className="w-4 h-4" />} 
                     />

                     <div className="w-px h-5 bg-gray-300 dark:bg-gray-700 mx-2" />

                     {/* Link Popover */}
                     <Popover open={isLinkPopoverOpen} onOpenChange={onLinkPopoverOpenChange}>
                        <PopoverTrigger asChild>
                           <button 
                             onPointerDown={handlePointerDown}
                             className={`p-1.5 rounded transition-colors cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${isLinkPopoverOpen ? 'bg-gray-200 dark:bg-gray-700 text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}
                           >
                             <LinkIcon className="w-4 h-4" />
                           </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl rounded-xl z-[10000000]" align="start" side="bottom" sideOffset={5}>
                           <div className="flex flex-col gap-4">
                             <h4 className="font-semibold text-sm">Add Link</h4>
                             <div className="flex flex-col gap-3">
                               <div className="space-y-1">
                                 <label className="text-xs font-medium text-gray-500">Text to display</label>
                                 <Input 
                                   value={linkText} 
                                   onChange={(e) => setLinkText(e.target.value)} 
                                   placeholder="Link text"
                                   className="h-9"
                                 />
                               </div>
                               <div className="space-y-1">
                                 <label className="text-xs font-medium text-gray-500">URL</label>
                                 <Input 
                                   value={linkUrl} 
                                   onChange={(e) => setLinkUrl(e.target.value)} 
                                   placeholder="https://example.com"
                                   className="h-9"
                                   autoFocus
                                   onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleInsertLink();
                                   }}
                                 />
                               </div>
                             </div>
                             <div className="flex justify-end gap-2">
                               <Button variant="ghost" size="sm" onClick={() => setIsLinkPopoverOpen(false)} className="h-8 cursor-pointer">
                                 Cancel
                               </Button>
                               <Button size="sm" onClick={handleInsertLink} className="bg-blue-600 hover:bg-blue-700 text-white h-8 cursor-pointer">
                                 Insert
                               </Button>
                             </div>
                           </div>
                        </PopoverContent>
                     </Popover>

                     {/* Emoji Popover */}
                     <Popover open={isEmojiPopoverOpen} onOpenChange={setIsEmojiPopoverOpen}>
                        <PopoverTrigger asChild>
                           <button 
                             onPointerDown={handlePointerDown}
                             className={`p-1.5 rounded transition-colors cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${isEmojiPopoverOpen ? 'bg-gray-200 dark:bg-gray-700 text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}
                           >
                             <Smile className="w-4 h-4" />
                           </button>
                        </PopoverTrigger>
                        <PopoverContent 
                          className="w-auto p-0 border-none shadow-none bg-transparent z-[10000000]" 
                          align="start" 
                          side="bottom"
                          // Prevent closing when focus moves to editor (e.g. after insert)
                          // But allow closing when clicking outside (e.g. on editor) which triggers pointerDownOutside
                          onFocusOutside={(e) => e.preventDefault()}
                        >
                           <div onWheel={(e) => e.stopPropagation()}>
                             <EmojiPicker 
                               onEmojiClick={onEmojiClick}
                               theme={document.documentElement.classList.contains('dark') ? 'dark' as any : 'light' as any}
                               lazyLoadEmojis={true}
                               width={320}
                               height={400}
                               previewConfig={{ showPreview: false }}
                             />
                           </div>
                        </PopoverContent>
                     </Popover>
                  </div>

                  {/* Editable Area */}
                  <div className="flex-1 p-6 overflow-y-auto cursor-text" onClick={handleEditorClick}>
                    <div
                      ref={editorRef}
                      contentEditable
                      suppressContentEditableWarning={true}
                      className="prose dark:prose-invert max-w-none outline-none min-h-[300px] 
                        [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5
                        [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4
                        [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3
                        [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mb-2
                        [&_a]:text-blue-600 [&_a]:underline hover:[&_a]:text-blue-800"
                      onInput={(e) => updateCurrentPair({ answer: e.currentTarget.innerHTML })}
                      onKeyUp={(e) => { checkFormats(); saveSelection(); }}
                      onMouseUp={(e) => { checkFormats(); saveSelection(); }}
                      onBlur={saveSelection}
                    />
                  </div>
                </>
             ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                   <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <HelpCircle className="w-8 h-8" />
                   </div>
                   <p>Select a Q&A pair to edit or create a new one.</p>
                </div>
             )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ToolbarButton = ({ active, onClick, icon }: { active: boolean, onClick: () => void, icon: React.ReactNode }) => (
  <button 
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    className={`
      p-1.5 rounded transition-colors cursor-pointer
      ${active 
        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' 
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}
    `}
  >
    {icon}
  </button>
);

const TextStyleButton = ({ onClick, label, preview, icon, iconColor }: { onClick: () => void, label: string, preview: React.ReactNode, icon: React.ReactNode, iconColor?: string }) => (
  <button 
    onClick={onClick}
    className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center justify-between gap-3 group transition-colors cursor-pointer"
  >
    <div className={`w-6 flex items-center justify-center ${iconColor || 'text-gray-400'} group-hover:text-gray-600 dark:group-hover:text-gray-300`}>
      {icon}
    </div>
    <span className="text-gray-900 dark:text-white">{preview}</span>
  </button>
);