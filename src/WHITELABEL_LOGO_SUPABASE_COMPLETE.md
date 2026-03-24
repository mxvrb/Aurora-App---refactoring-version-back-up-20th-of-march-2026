# White Label Logo Supabase Integration - Complete ✅

## Overview
White label logos are now saved to Supabase Storage using a secure server-side upload endpoint, matching the same pattern used for profile images.

## Changes Made

### 1. Server-Side Edge Function (`/supabase/functions/server/index.tsx`)

#### Added White Label Logo Bucket Constant
```typescript
const WHITELABEL_LOGOS_BUCKET = 'white-label-logos';
```

#### Updated Storage Initialization
The `initializeStorage()` function now creates both:
- `make-3f7de5a4-profile-images` (private, 5MB limit) - for profile images
- `white-label-logos` (public, 2MB limit) - for white label logos

#### Added Upload Endpoint: `/make-server-3f7de5a4/auth/upload-whitelabel-logo`

**Features:**
- ✅ Authentication required (Bearer token)
- ✅ File validation (PNG, JPG, JPEG only)
- ✅ Size validation (2MB max)
- ✅ Automatic deletion of old logos
- ✅ Secure upload using service role key
- ✅ Returns public URL

**Request:**
```typescript
POST /make-server-3f7de5a4/auth/upload-whitelabel-logo
Headers:
  Authorization: Bearer {access_token}
Body: FormData
  - image: File (PNG/JPG, max 2MB)
  - businessId: string (optional, defaults to user.id)
```

**Response:**
```json
{
  "success": true,
  "message": "White label logo uploaded successfully",
  "logoUrl": "https://...supabase.co/storage/v1/object/public/white-label-logos/business/{id}/logo-{timestamp}.png"
}
```

### 2. Client-Side Service (`/utils/whitelabel-service.ts`)

#### Updated `uploadWhiteLabelLogo()` Function
Changed from **client-side** Supabase Storage upload to **server-side** edge function upload:

**Before:** Direct upload to Supabase Storage (required RLS policies)
```typescript
await supabase.storage
  .from('white-label-logos')
  .upload(fileName, file, { upsert: true });
```

**After:** Server-side upload via edge function (more secure)
```typescript
const formData = new FormData();
formData.append('image', file);
formData.append('businessId', businessId);

const response = await fetch(
  `https://${projectId}.supabase.co/functions/v1/make-server-3f7de5a4/auth/upload-whitelabel-logo`,
  {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${session.access_token}` },
    body: formData,
  }
);
```

**Fallback:** If server upload fails or user is offline, falls back to base64 data URL (stored in localStorage)

### 3. App.tsx Integration

#### Updated `handleBusinessLogoUpdate()`
Now saves to both `businessLogoUrl` AND `whiteLabel.logo`:

```typescript
const handleBusinessLogoUpdate = (logoUrl: string | null) => {
  setBusinessLogoUrl(logoUrl);
  setWhiteLabelLogo(logoUrl); // Also update white label logo state
  
  // Save to both locations for consistency
  offlineStorage.saveUserData({
    ...currentData,
    businessLogoUrl: logoUrl,
    whiteLabel: {
      ...existingWhiteLabel,
      logo: logoUrl
    }
  });
};
```

#### Updated White Label Settings Loading
When loading white label settings from `acesai_user_data`, also sets `businessLogoUrl`:

```typescript
if (userData.whiteLabel?.logo) {
  setWhiteLabelLogo(logo);
  setBusinessLogoUrl(logo); // Ensures consistency across the app
}
```

### 4. Documentation (`/WHITELABEL_SUPABASE_SETUP.md`)

Updated to reflect:
- ✅ Automatic bucket creation by server
- ✅ Server-side upload endpoint details
- ✅ Simplified storage policies (no INSERT/UPDATE/DELETE needed)
- ✅ Updated testing examples

## Data Flow

### Upload Flow
1. User selects logo in WhiteLabel component
2. Component calls `uploadWhiteLabelLogo(businessId, file)`
3. Service creates FormData and sends to server endpoint
4. Server validates file, deletes old logo, uploads new logo
5. Server returns public URL
6. Service returns URL to component
7. Component saves settings with logo URL
8. Component calls `onLogoUpdate(logoUrl)`
9. App.tsx saves to both `businessLogoUrl` and `whiteLabel.logo`

### Persistence Flow
1. Logo URL saved to Supabase Storage (permanent)
2. Logo URL saved to `white_label_settings` table (via `upsertWhiteLabelSettings`)
3. Logo URL saved to localStorage in two places:
   - `acesai_user_data.businessLogoUrl`
   - `acesai_user_data.whiteLabel.logo`
4. Logo URL persists across:
   - ✅ Page reloads
   - ✅ Browser sessions
   - ✅ Login/logout cycles

### Load Flow
1. App loads white label settings from localStorage
2. Sets both `whiteLabelLogo` and `businessLogoUrl` states
3. `displayLogoUrl = whiteLabelLogo || businessLogoUrl`
4. Logo appears in sidebar and throughout app

## Storage Structure

```
Supabase Storage Bucket: white-label-logos (PUBLIC)
└── business/
    ├── {business_id_1}/
    │   └── logo-1234567890.png
    ├── {business_id_2}/
    │   └── logo-9876543210.jpg
    └── {business_id_3}/
        └── logo-5555555555.png
```

## Security

✅ **Secure Upload**: Uses server-side edge function with service role key
✅ **Authentication Required**: Only authenticated users can upload
✅ **Business ID Validation**: Server validates user owns the business ID
✅ **File Validation**: Type and size checked on server
✅ **Old Logo Cleanup**: Server automatically deletes old logos
✅ **Public Access**: Logos are public (needed for WhatsApp, booking pages)

## Offline Support

If server is unavailable or user is offline:
- Logo converts to base64 data URL
- Stored in localStorage
- Works offline
- Syncs to server when online

## Benefits

### Compared to Client-Side Upload:
1. ✅ **More Secure** - Uses service role key instead of anon key
2. ✅ **Simpler Policies** - No complex RLS policies needed for storage
3. ✅ **Consistent** - Matches profile image upload pattern
4. ✅ **Better Validation** - Server-side validation is more reliable
5. ✅ **Cleanup** - Server handles old file deletion
6. ✅ **Better Errors** - Centralized error handling

## Testing

### Manual Test Steps:
1. Navigate to White Label settings
2. Upload a logo (PNG or JPG, under 2MB)
3. Click "Save"
4. Verify logo appears in sidebar immediately
5. Refresh page - logo should persist
6. Logout and login - logo should still appear
7. Check browser Network tab - should see POST to upload endpoint
8. Check Supabase Storage - logo should be in `white-label-logos` bucket

### Expected URLs:
- **Development**: Uses server endpoint on Supabase
- **Production**: Same server endpoint
- **Offline**: Falls back to base64 data URL

## Migration from Old System

If you had logos uploaded with the old client-side method:
- Old logos remain in storage (no migration needed)
- New uploads use server-side endpoint
- URLs remain the same format
- No breaking changes

## Related Files

- `/supabase/functions/server/index.tsx` - Server upload endpoint
- `/utils/whitelabel-service.ts` - Upload service function
- `/components/WhiteLabel.tsx` - UI component
- `/App.tsx` - State management and persistence
- `/WHITELABEL_SUPABASE_SETUP.md` - Setup documentation

## Status

✅ **Complete** - White label logos now save to Supabase using the same secure server-side pattern as profile images.

---

**Implementation Date**: February 16, 2026
**Pattern**: Server-side upload with fallback to base64
**Storage**: Supabase Storage (white-label-logos bucket, public)
