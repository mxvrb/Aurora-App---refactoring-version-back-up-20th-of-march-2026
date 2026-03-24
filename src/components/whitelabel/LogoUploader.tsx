import React, { useRef, useState } from "react";
import {
  Upload,
  X,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import CustomButton from "../Button";
import { Label } from "../ui/label";

interface LogoUploaderProps {
  currentLogoUrl: string | null;
  onLogoChange: (file: File) => void;
  onLogoRemove: () => void;
  isUploading?: boolean;
  error?: string | null;
}

export function LogoUploader({
  currentLogoUrl,
  onLogoChange,
  onLogoRemove,
  isUploading = false,
  error = null,
}: LogoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentLogoUrl,
  );
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (file: File | null) => {
    if (!file) return;

    // Validate file type
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a PNG or JPG image");
      return;
    }

    // Validate file size (2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File size must be less than 2MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Notify parent
    onLogoChange(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    handleFileSelect(file || null);
  };

  const handleRemoveLogo = () => {
    setPreviewUrl(null);
    onLogoRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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

    const file = e.dataTransfer.files?.[0];
    handleFileSelect(file || null);
  };

  return (
    <div className="space-y-3">
      <Label className="text-gray-900 dark:text-gray-100 font-medium">
        Business Logo
      </Label>

      {/* Preview or Upload Area */}
      {previewUrl ? (
        <div className="relative group">
          <div className="w-full h-48 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden">
            <img
              src={previewUrl}
              alt="Business logo preview"
              className="max-w-full max-h-full object-contain p-4"
            />
          </div>

          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
            <CustomButton
              onClick={handleButtonClick}
              disabled={isUploading}
              className="px-4 py-2 bg-white hover:bg-gray-100 text-gray-900 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span className="text-sm font-medium">
                Replace
              </span>
            </CustomButton>
            <CustomButton
              onClick={handleRemoveLogo}
              disabled={isUploading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              <X className="w-4 h-4" />
              <span className="text-sm font-medium">
                Remove
              </span>
            </CustomButton>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer ${
            dragActive
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 hover:border-blue-400 dark:hover:border-blue-600"
          }`}
          onClick={handleButtonClick}
        >
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <ImageIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-center px-4">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              PNG or JPG (max. 2MB)
            </p>
          </div>
          <CustomButton
            onClick={(e) => {
              e.stopPropagation();
              handleButtonClick();
            }}
            disabled={isUploading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors text-sm font-medium"
          >
            <Upload className="w-4 h-4" />
            {isUploading ? "Uploading..." : "Choose File"}
          </CustomButton>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-800 dark:text-red-200">
            {error}
          </p>
        </div>
      )}

      {/* Help text */}
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Your logo will appear on pages. For best results, use a
        square image with transparent background.
      </p>
    </div>
  );
}