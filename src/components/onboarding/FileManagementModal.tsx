import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Upload, X, AlertCircle, FileText } from 'lucide-react';

interface FileManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (files: File[]) => void;
}

export const FileManagementModal: React.FC<FileManagementModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-200 dark:border-gray-800 p-0 overflow-hidden rounded-2xl">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <DialogTitle className="text-xl font-bold mb-1">Files</DialogTitle>
          <p className="text-gray-500 text-sm">
            Upload documents to train your AI. Extract text from PDFs, DOCX, and TXT files.
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Add files</h3>
            
            <div className="bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 p-3 rounded-lg flex items-start gap-2 text-sm border border-orange-100 dark:border-orange-800/50">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>If you are uploading a PDF, make sure you can select/highlight the text.</p>
            </div>

            <div 
              className={`
                border-2 border-dashed rounded-xl p-8 text-center transition-colors
                ${dragActive 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' 
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'}
              `}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                className="hidden"
                id="file-upload"
                onChange={handleChange}
                accept=".pdf,.doc,.docx,.txt"
              />
              <label 
                htmlFor="file-upload" 
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                   <Upload className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </div>
                <p className="text-gray-900 dark:text-gray-100 font-medium mb-1">
                  Drag & drop files here, or click to select files
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Supported file types: pdf, doc, docx, txt
                </p>
              </label>
            </div>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Uploaded Files</h4>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{file.name}</span>
                        <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFile(index)}
                      className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} className="text-gray-500 cursor-pointer">
            Cancel
          </Button>
          <Button onClick={() => { onSave(files); onClose(); }} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[100px] cursor-pointer">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
