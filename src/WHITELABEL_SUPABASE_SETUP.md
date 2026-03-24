# White Label Supabase Setup Guide

This document outlines the Supabase database schema and storage setup required for the White Label branding module.

## 📋 Table of Contents
1. [Database Schema](#database-schema)
2. [Storage Setup](#storage-setup)
3. [Policies (RLS)](#row-level-security-policies)
4. [Edge Functions](#edge-functions-optional)

---

## 🗄️ Database Schema

### Table: `white_label_settings`

Run this SQL in your Supabase SQL Editor:

```sql
-- Create white_label_settings table
CREATE TABLE IF NOT EXISTS white_label_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  logo_url TEXT,
  primary_color TEXT NOT NULL DEFAULT '#3B82F6',
  secondary_color TEXT NOT NULL DEFAULT '#10B981',
  accent_color TEXT NOT NULL DEFAULT '#8B5CF6',
  whatsapp_bg_color TEXT DEFAULT '#F3F4F6',
  footer_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on business_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_white_label_business_id 
ON white_label_settings(business_id);

-- Add comment to table
COMMENT ON TABLE white_label_settings IS 
'Stores white label branding settings for businesses, used for WhatsApp messages and booking pages';
```

### Table Schema Details

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | gen_random_uuid() | Primary key |
| `business_id` | UUID | NO | - | Unique business identifier (foreign key to users or businesses table) |
| `display_name` | TEXT | NO | - | Business display name shown in WhatsApp |
| `logo_url` | TEXT | YES | NULL | Public URL to business logo stored in Supabase Storage |
| `primary_color` | TEXT | NO | #3B82F6 | Primary brand color (hex format) |
| `secondary_color` | TEXT | NO | #10B981 | Secondary brand color (hex format) |
| `accent_color` | TEXT | NO | #8B5CF6 | Accent brand color (hex format) |
| `whatsapp_bg_color` | TEXT | YES | #F3F4F6 | Background color for WhatsApp message cards |
| `footer_text` | TEXT | YES | NULL | Optional footer text for WhatsApp messages |
| `created_at` | TIMESTAMPTZ | NO | NOW() | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | NO | NOW() | Last update timestamp |

---

## 🗂️ Storage Setup

### Automatic Storage Bucket Creation

**✅ The `white-label-logos` storage bucket is automatically created** by the server edge function on startup (`/supabase/functions/server/index.tsx`). No manual setup required!

The server automatically:
- Creates the `white-label-logos` bucket if it doesn't exist
- Sets it to PUBLIC (so logos can be displayed in WhatsApp and booking pages)
- Sets a 2MB file size limit

### Storage Structure

```
white-label-logos/
└── business/
    └── {business_id}/
        └── logo-{timestamp}.png (or .jpg)
```

Example path: `business/123e4567-e89b-12d3-a456-426614174000/logo-1234567890.png`

### Manual Storage SQL Setup (Optional)

If you need to manually create the bucket:

```sql
-- Create storage bucket (if not using automatic creation)
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('white-label-logos', 'white-label-logos', true, 2097152)
ON CONFLICT (id) DO NOTHING;
```

### Server-Side Upload Endpoint

White label logos are uploaded via a secure server-side endpoint:
- **Endpoint**: `/make-server-3f7de5a4/auth/upload-whitelabel-logo`
- **Method**: POST (multipart/form-data)
- **Authentication**: Bearer token required
- **Max file size**: 2MB
- **Allowed formats**: PNG, JPG, JPEG

The server handles:
- File validation (type, size)
- Deletion of old logos
- Secure upload using service role key
- Public URL generation

---

## 🔒 Row Level Security Policies

### Enable RLS on white_label_settings table

```sql
-- Enable Row Level Security
ALTER TABLE white_label_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own business settings
CREATE POLICY "Users can view own business settings"
ON white_label_settings
FOR SELECT
USING (
  business_id = auth.uid()
  -- OR adjust to match your business_id logic
  -- Example: business_id IN (SELECT business_id FROM user_businesses WHERE user_id = auth.uid())
);

-- Policy: Users can insert their own business settings
CREATE POLICY "Users can insert own business settings"
ON white_label_settings
FOR INSERT
WITH CHECK (
  business_id = auth.uid()
);

-- Policy: Users can update their own business settings
CREATE POLICY "Users can update own business settings"
ON white_label_settings
FOR UPDATE
USING (
  business_id = auth.uid()
)
WITH CHECK (
  business_id = auth.uid()
);

-- Policy: Users can delete their own business settings
CREATE POLICY "Users can delete own business settings"
ON white_label_settings
FOR DELETE
USING (
  business_id = auth.uid()
);
```

### Storage Policies for white-label-logos bucket

**Note**: Logo uploads are handled server-side using the service role key, which bypasses RLS. However, you can still add policies for additional security:

```sql
-- Policy: Anyone can read logos (public bucket)
CREATE POLICY "Public logo access"
ON storage.objects
FOR SELECT
USING (bucket_id = 'white-label-logos');

-- Optional: Users can view their own logos (redundant since bucket is public)
-- CREATE POLICY "Users can view own logos"
-- ON storage.objects
-- FOR SELECT
-- USING (
--   bucket_id = 'white-label-logos'
--   AND auth.uid()::text = (storage.foldername(name))[2]
-- );
```

Since uploads/updates/deletes are handled by the server edge function with service role permissions, client-side storage policies for INSERT/UPDATE/DELETE are not required.

---

## ⚡ Edge Functions (Optional)

### Publish WhatsApp Branding Edge Function

Create an edge function to apply branding to WhatsApp templates when published.

**Function path:** `supabase/functions/publish-whatsapp-branding/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    // Get business_id from request
    const { businessId } = await req.json()

    if (!businessId) {
      return new Response(
        JSON.stringify({ success: false, message: 'Business ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch white label settings
    const { data: settings, error } = await supabase
      .from('white_label_settings')
      .select('*')
      .eq('business_id', businessId)
      .single()

    if (error) throw error

    // TODO: Apply branding to WhatsApp templates
    // This would integrate with your WhatsApp Business API
    // Example:
    // - Update message templates with new colors
    // - Apply logo to booking pages
    // - Update footer text

    console.log('Publishing branding for business:', businessId)
    console.log('Settings:', settings)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'WhatsApp branding published successfully!'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error publishing branding:', error)
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to publish WhatsApp branding'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

### Deploy the edge function:

```bash
supabase functions deploy publish-whatsapp-branding
```

---

## 🧪 Testing the Setup

### 1. Test Database Connection

```typescript
import { supabase } from './utils/supabase/client';

// Fetch settings
const { data, error } = await supabase
  .from('white_label_settings')
  .select('*')
  .eq('business_id', 'YOUR_BUSINESS_ID')
  .single();

console.log('Settings:', data);
```

### 2. Test Logo Upload

Logo uploads are handled via the WhiteLabel component, which uses the server-side upload endpoint:

```typescript
import { uploadWhiteLabelLogo } from './utils/whitelabel-service';

const file = new File(['...'], 'logo.png', { type: 'image/png' });
const businessId = 'YOUR_BUSINESS_ID';

try {
  const logoUrl = await uploadWhiteLabelLogo(businessId, file);
  console.log('Logo uploaded successfully:', logoUrl);
} catch (error) {
  console.error('Upload failed:', error);
}
```

Alternatively, test the server endpoint directly:

```typescript
const formData = new FormData();
formData.append('image', file);
formData.append('businessId', businessId);

const response = await fetch(
  `https://YOUR_PROJECT.supabase.co/functions/v1/make-server-3f7de5a4/auth/upload-whitelabel-logo`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer YOUR_ACCESS_TOKEN`,
    },
    body: formData,
  }
);

const data = await response.json();
console.log('Upload result:', data);
```

### 3. Verify Public Access

After uploading, get the public URL:

```typescript
const { data } = supabase.storage
  .from('white-label-logos')
  .getPublicUrl('business/YOUR_BUSINESS_ID/logo.png');

console.log('Public URL:', data.publicUrl);
```

---

## 📝 Notes

1. **Business ID Logic**: The current implementation uses `auth.uid()` as the business ID. Adjust the RLS policies if you have a separate `businesses` table.

2. **File Size Limits**: Both frontend and backend enforce a 2MB limit for logos. Adjust in:
   - Server: `/supabase/functions/server/index.tsx` (line ~240)
   - Service: `/utils/whitelabel-service.ts`

3. **Image Formats**: Only PNG, JPG, and JPEG are supported. Add more formats in both the server endpoint and `uploadWhiteLabelLogo()` function if needed.

4. **Server-Side Upload**: Logos are uploaded via a secure server-side edge function that uses the service role key. This is more secure than client-side uploads and ensures consistent file handling.

4. **Color Validation**: Colors are stored as hex strings. Consider adding validation in the database:

```sql
ALTER TABLE white_label_settings
ADD CONSTRAINT valid_primary_color CHECK (primary_color ~ '^#[0-9A-Fa-f]{6}$');
```

5. **Webhook Integration**: The `publishWhatsAppBranding` function is currently a placeholder. Implement actual WhatsApp Business API integration based on your requirements.

---

## ✅ Verification Checklist

- [ ] `white_label_settings` table created
- [ ] RLS enabled on `white_label_settings`
- [ ] RLS policies created for table
- [ ] `white-label-logos` storage bucket created
- [ ] Bucket set to PUBLIC
- [ ] Storage policies created
- [ ] Edge function deployed (optional)
- [ ] Test insert/update/delete operations
- [ ] Test logo upload and public access
- [ ] Verify UI loads settings correctly

---

## 🔗 Related Files

- **Service Layer**: `/utils/whitelabel-service.ts`
- **Main Component**: `/components/WhiteLabel.tsx`
- **Sub-components**: `/components/whitelabel/`
- **App Integration**: `/App.tsx` (imports and routing)

---

## 🆘 Troubleshooting

### Issue: "Row Level Security policy violation"
**Solution**: Check that your RLS policies match your authentication setup. If using a separate businesses table, adjust the `business_id` check.

### Issue: "Storage upload fails"
**Solution**: 
1. Verify bucket is PUBLIC
2. Check storage policies are correctly set
3. Ensure file path format is correct: `business/{business_id}/logo.png`

### Issue: "Settings not loading"
**Solution**: Check browser console for errors. Verify Supabase URL and anon key are correct in `/utils/supabase/info.tsx`.

---

**Last Updated**: February 3, 2026
