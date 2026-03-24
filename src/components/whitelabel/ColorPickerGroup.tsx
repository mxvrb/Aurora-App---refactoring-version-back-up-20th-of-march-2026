import React from 'react';
import { RefreshCw, Info } from 'lucide-react';
import { Label } from '../ui/label';
import CustomButton from '../Button';

interface ColorPickerGroupProps {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  whatsappBgColor: string;
  onPrimaryChange: (color: string) => void;
  onSecondaryChange: (color: string) => void;
  onAccentChange: (color: string) => void;
  onWhatsappBgChange: (color: string) => void;
  onReset: () => void;
}

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  description?: string;
}

function ColorInput({ label, value, onChange, description }: ColorInputProps) {
  return (
    <div className="space-y-2">
      <Label className="text-gray-900 dark:text-gray-100 font-medium">
        {label}
      </Label>
      <div className="flex items-center gap-3">
        {/* Color Picker */}
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-16 h-16 rounded-lg cursor-pointer border-2 border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: value }}
          />
        </div>
        
        {/* Color Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <input
              type="text"
              value={value.toUpperCase()}
              onChange={(e) => {
                const newValue = e.target.value;
                if (/^#[0-9A-F]{0,6}$/i.test(newValue)) {
                  onChange(newValue);
                }
              }}
              className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 font-mono text-sm w-28 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              placeholder="#000000"
              maxLength={7}
            />
            <div
              className="w-10 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 flex-shrink-0"
              style={{ backgroundColor: value }}
              title="Color preview"
            />
          </div>
          {description && (
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function ColorPickerGroup({
  primaryColor,
  secondaryColor,
  accentColor,
  whatsappBgColor,
  onPrimaryChange,
  onSecondaryChange,
  onAccentChange,
  onWhatsappBgChange,
  onReset,
}: ColorPickerGroupProps) {
  const defaultColors = {
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#8B5CF6',
    whatsappBg: '#F3F4F6',
  };

  const isDefaultColors =
    primaryColor === defaultColors.primary &&
    secondaryColor === defaultColors.secondary &&
    accentColor === defaultColors.accent &&
    whatsappBgColor === defaultColors.whatsappBg;

  return (
    <div className="space-y-6">
      {/* Header with Reset Button */}
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-gray-900 dark:text-gray-100 font-medium text-base">
            Brand Colors
          </Label>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Customize colors for your WhatsApp branding
          </p>
        </div>
        <CustomButton
          onClick={onReset}
          disabled={isDefaultColors}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Reset to Default
        </CustomButton>
      </div>

      {/* Color Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ColorInput
          label="Primary Color"
          value={primaryColor}
          onChange={onPrimaryChange}
          description="Main brand color for buttons and links"
        />
        <ColorInput
          label="Secondary Color"
          value={secondaryColor}
          onChange={onSecondaryChange}
          description="Supporting color for highlights"
        />
        <ColorInput
          label="Accent Color"
          value={accentColor}
          onChange={onAccentChange}
          description="Accent color for CTAs and emphasis"
        />
        <ColorInput
          label="WhatsApp Background"
          value={whatsappBgColor}
          onChange={onWhatsappBgChange}
          description="Background color for message cards"
        />
      </div>

      {/* Color Palette Preview */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              Color Palette Preview
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              How your colors work together
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <div
            className="flex-1 h-20 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center text-white font-medium text-sm shadow-sm"
            style={{ backgroundColor: primaryColor }}
          >
            Primary
          </div>
          <div
            className="flex-1 h-20 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center text-white font-medium text-sm shadow-sm"
            style={{ backgroundColor: secondaryColor }}
          >
            Secondary
          </div>
          <div
            className="flex-1 h-20 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center text-white font-medium text-sm shadow-sm"
            style={{ backgroundColor: accentColor }}
          >
            Accent
          </div>
          <div
            className="flex-1 h-20 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 font-medium text-sm"
            style={{ backgroundColor: whatsappBgColor }}
          >
            Background
          </div>
        </div>
      </div>

      {/* Accessibility Hint */}
      <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-amber-900 dark:text-amber-100">
          <strong>Accessibility Tip:</strong> Ensure sufficient contrast between text and background colors for readability. Aim for a contrast ratio of at least 4.5:1 for normal text.
        </div>
      </div>
    </div>
  );
}
