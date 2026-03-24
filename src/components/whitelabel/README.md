# White Label Components

This directory contains reusable components for the White Label branding settings module.

## Components

### LogoUploader.tsx
Handles business logo upload with drag-and-drop support, file validation, and preview functionality.

**Props:**
- `currentLogoUrl: string | null` - URL of the current logo
- `onLogoChange: (file: File) => void` - Callback when a new logo is selected
- `onLogoRemove: () => void` - Callback when logo is removed
- `isUploading?: boolean` - Loading state for upload operation
- `error?: string | null` - Error message to display

**Features:**
- Drag-and-drop file upload
- Click to browse
- Image preview
- File type validation (PNG/JPG only)
- File size validation (max 2MB)
- Hover actions (Replace/Remove)
- Error display

### ColorPickerGroup.tsx
Provides color pickers for brand colors with preview and validation.

**Props:**
- `primaryColor: string` - Primary brand color (hex)
- `secondaryColor: string` - Secondary brand color (hex)
- `accentColor: string` - Accent brand color (hex)
- `whatsappBgColor: string` - WhatsApp background color (hex)
- `onPrimaryChange: (color: string) => void` - Primary color change callback
- `onSecondaryChange: (color: string) => void` - Secondary color change callback
- `onAccentChange: (color: string) => void` - Accent color change callback
- `onWhatsappBgChange: (color: string) => void` - Background color change callback
- `onReset: () => void` - Reset to default colors callback

**Features:**
- Visual color pickers
- Hex code input fields
- Color palette preview
- Reset to default button
- Accessibility hints

### WhatsAppPreview.tsx
Displays a realistic WhatsApp phone mockup with live branding preview.

**Props:**
- `businessName: string` - Business display name
- `logoUrl: string | null` - Business logo URL
- `primaryColor: string` - Primary brand color
- `accentColor: string` - Accent brand color
- `backgroundColor: string` - Message card background color
- `footerText?: string | null` - Optional footer text
- `selectedTemplate: string` - Currently selected message template
- `onTemplateChange: (template: string) => void` - Template change callback

**Features:**
- Realistic WhatsApp UI mockup
- 4 message templates (booking confirmation, reminder, review request, follow-up)
- Template switcher dropdown
- Live updates as colors/logo change
- Interactive buttons with brand colors
- Message timestamps and read receipts

### SavePublishBar.tsx
Fixed bottom action bar for saving and publishing branding changes.

**Props:**
- `hasUnsavedChanges: boolean` - Whether there are unsaved changes
- `isSaving: boolean` - Loading state for save operation
- `isPublishing: boolean` - Loading state for publish operation
- `onSave: () => void` - Save changes callback
- `onPublish: () => void` - Publish to WhatsApp callback
- `onCancel: () => void` - Cancel/go back callback

**Features:**
- Fixed bottom positioning
- Unsaved changes indicator
- Save button (disabled when no changes)
- Publish button with confirmation modal
- Cancel button
- Loading states with spinners
- Publish confirmation dialog

## Usage Example

```tsx
import { WhiteLabel } from './components/WhiteLabel';

function App() {
  return (
    <WhiteLabel onBack={() => navigateBack()} />
  );
}
```

## Styling

All components use:
- Tailwind CSS for styling
- Full dark mode support
- Consistent spacing and colors with the rest of the app
- Smooth transitions and hover effects

## Dependencies

- lucide-react - Icons
- Custom Button and Input components
- Shadcn UI components (Label, Select, Dialog, Switch)
- Toast notifications (sonner)
