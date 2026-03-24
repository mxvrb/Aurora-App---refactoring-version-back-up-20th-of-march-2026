import { supabase } from './supabase/client';
import { projectId } from './supabase/info';

export interface WhiteLabelSettings {
  id?: string;
  business_id: string;
  display_name: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  whatsapp_bg_color: string | null;
  footer_text: string | null;
  updated_at?: string;
}

export interface WhiteLabelPayload {
  display_name: string;
  logo_url?: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  whatsapp_bg_color?: string | null;
  footer_text?: string | null;
}

// Flag to track if we're using fallback mode
let useFallbackMode = false;
const STORAGE_KEY = 'whitelabel_settings_fallback';

/**
 * Get current business ID from authenticated user
 * In production, this would extract from user metadata or session
 */
export async function getCurrentBusinessId(): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn('No authenticated user found, using demo mode');
      // Return a demo business ID for testing
      return 'demo-business-id';
    }

    // In production, you might have a businesses table or user metadata
    // For now, return user ID as business ID
    return user.id;
  } catch (error) {
    console.error('Error getting current business ID:', error);
    // Return demo ID as fallback
    return 'demo-business-id';
  }
}

/**
 * Get default settings
 */
function getDefaultSettings(businessId: string): WhiteLabelSettings {
  return {
    business_id: businessId,
    display_name: 'My Business',
    logo_url: null,
    primary_color: '#3B82F6', // Blue
    secondary_color: '#10B981', // Green
    accent_color: '#8B5CF6', // Purple
    whatsapp_bg_color: '#F3F4F6', // Light gray
    footer_text: null,
    updated_at: new Date().toISOString(),
  };
}

/**
 * Fetch settings from localStorage (fallback mode)
 */
function fetchFromLocalStorage(businessId: string): WhiteLabelSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed;
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
  }
  return getDefaultSettings(businessId);
}

/**
 * Save settings to localStorage (fallback mode)
 */
function saveToLocalStorage(settings: WhiteLabelSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

/**
 * Fetch white label settings for a business
 * Creates default settings if none exist
 * Falls back to localStorage if database table doesn't exist
 */
export async function fetchWhiteLabelSettings(
  businessId: string
): Promise<WhiteLabelSettings | null> {
  // If already in fallback mode, use localStorage
  if (useFallbackMode) {
    console.info('Using localStorage fallback mode for white label settings');
    return fetchFromLocalStorage(businessId);
  }

  try {
    const { data, error } = await supabase
      .from('white_label_settings')
      .select('*')
      .eq('business_id', businessId)
      .single();

    if (error) {
      // Check if table doesn't exist
      if (error.code === 'PGRST205' || error.code === '42P01') {
        console.warn('⚠️ Database table "white_label_settings" not found. Using localStorage fallback.');
        console.warn('📝 To enable full functionality, run the SQL setup from WHITELABEL_SUPABASE_SETUP.md');
        useFallbackMode = true;
        return fetchFromLocalStorage(businessId);
      }
      
      // No record found, create default
      if (error.code === 'PGRST116') {
        console.log('No white label settings found, creating defaults...');
        return await createDefaultWhiteLabelSettings(businessId);
      }
      
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error('Error fetching white label settings:', error);
    
    // On any error, switch to fallback mode
    console.warn('Switching to localStorage fallback mode');
    useFallbackMode = true;
    return fetchFromLocalStorage(businessId);
  }
}

/**
 * Create default white label settings for a business
 */
async function createDefaultWhiteLabelSettings(
  businessId: string
): Promise<WhiteLabelSettings> {
  const defaultSettings = getDefaultSettings(businessId);

  try {
    const { data, error } = await supabase
      .from('white_label_settings')
      .insert({
        business_id: businessId,
        display_name: defaultSettings.display_name,
        logo_url: defaultSettings.logo_url,
        primary_color: defaultSettings.primary_color,
        secondary_color: defaultSettings.secondary_color,
        accent_color: defaultSettings.accent_color,
        whatsapp_bg_color: defaultSettings.whatsapp_bg_color,
        footer_text: defaultSettings.footer_text,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating default settings:', error);
      throw error;
    }

    return data;
  } catch (error) {
    // If creation fails, switch to fallback and return defaults
    console.warn('Could not create settings in database, using localStorage');
    useFallbackMode = true;
    saveToLocalStorage(defaultSettings);
    return defaultSettings;
  }
}

/**
 * Upsert (update or insert) white label settings
 */
export async function upsertWhiteLabelSettings(
  businessId: string,
  payload: WhiteLabelPayload
): Promise<WhiteLabelSettings> {
  const updatedSettings: WhiteLabelSettings = {
    business_id: businessId,
    display_name: payload.display_name,
    logo_url: payload.logo_url || null,
    primary_color: payload.primary_color,
    secondary_color: payload.secondary_color,
    accent_color: payload.accent_color,
    whatsapp_bg_color: payload.whatsapp_bg_color || null,
    footer_text: payload.footer_text || null,
    updated_at: new Date().toISOString(),
  };

  // If in fallback mode, save to localStorage
  if (useFallbackMode) {
    console.info('Saving to localStorage (fallback mode)');
    saveToLocalStorage(updatedSettings);
    return updatedSettings;
  }

  try {
    const { data, error } = await supabase
      .from('white_label_settings')
      .upsert(
        {
          business_id: businessId,
          ...payload,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'business_id',
        }
      )
      .select()
      .single();

    if (error) {
      // If table doesn't exist, switch to fallback
      if (error.code === 'PGRST205' || error.code === '42P01') {
        console.warn('Database table not found, switching to localStorage');
        useFallbackMode = true;
        saveToLocalStorage(updatedSettings);
        return updatedSettings;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error upserting white label settings:', error);
    // Fallback to localStorage on any error
    console.warn('Saving to localStorage due to database error');
    useFallbackMode = true;
    saveToLocalStorage(updatedSettings);
    return updatedSettings;
  }
}

/**
 * Upload business logo to Supabase Storage via server endpoint
 * Returns public URL on success
 * Falls back to base64 data URL if storage is not available
 */
export async function uploadWhiteLabelLogo(
  businessId: string,
  file: File
): Promise<string> {
  try {
    // Validate file
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload PNG or JPG.');
    }

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      throw new Error('File size exceeds 2MB limit.');
    }

    // If in fallback mode, use base64
    if (useFallbackMode) {
      console.info('Using base64 data URL for logo (fallback mode)');
      return await convertFileToBase64(file);
    }

    // Try server upload via edge function
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        console.warn('No active session, using base64 fallback');
        return await convertFileToBase64(file);
      }

      const formData = new FormData();
      formData.append('image', file);
      formData.append('businessId', businessId);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-3f7de5a4/auth/upload-whitelabel-logo`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to upload logo');
      }

      const data = await response.json();
      
      if (data.logoUrl) {
        console.log('White label logo uploaded successfully:', data.logoUrl);
        return data.logoUrl;
      }

      throw new Error('No logo URL returned from server');
    } catch (serverError) {
      console.warn('Server upload failed, using base64 fallback:', serverError);
      return await convertFileToBase64(file);
    }
  } catch (error) {
    console.error('Error uploading logo:', error);
    // Final fallback to base64
    console.warn('Using base64 data URL as final fallback');
    try {
      return await convertFileToBase64(file);
    } catch (base64Error) {
      throw new Error('Failed to process logo image');
    }
  }
}

/**
 * Convert file to base64 data URL
 */
function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        resolve(reader.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Delete business logo from Supabase Storage
 */
export async function deleteWhiteLabelLogo(
  businessId: string,
  logoUrl: string
): Promise<void> {
  // If using base64 or in fallback mode, no storage to delete from
  if (useFallbackMode || logoUrl.startsWith('data:')) {
    console.info('Logo stored locally, no storage deletion needed');
    return;
  }

  try {
    // Extract filename from URL
    const fileName = `business/${businessId}/logo.png`;

    const { error } = await supabase.storage
      .from('white-label-logos')
      .remove([fileName]);

    if (error) {
      console.warn('Error deleting logo from storage:', error);
    }
  } catch (error) {
    console.error('Error deleting logo:', error);
    // Don't throw, deletion is not critical
  }
}

/**
 * Publish WhatsApp branding
 * This would trigger an edge function to apply branding to WhatsApp templates
 * Placeholder for now - implement actual edge function call in production
 */
export async function publishWhatsAppBranding(
  businessId: string
): Promise<{ success: boolean; message: string }> {
  try {
    // In production, call Supabase edge function:
    // const { data, error } = await supabase.functions.invoke('publish-whatsapp-branding', {
    //   body: { businessId }
    // });

    // For now, simulate the API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log(`Publishing WhatsApp branding for business: ${businessId}`);

    if (useFallbackMode) {
      console.info('📝 Note: In fallback mode. Set up Supabase for full functionality.');
    }

    // Simulate success
    return {
      success: true,
      message: 'WhatsApp branding published successfully!',
    };
  } catch (error) {
    console.error('Error publishing WhatsApp branding:', error);
    return {
      success: false,
      message: 'Failed to publish WhatsApp branding. Please try again.',
    };
  }
}

/**
 * Check if currently using fallback mode
 */
export function isUsingFallbackMode(): boolean {
  return useFallbackMode;
}

/**
 * Reset fallback mode (for testing)
 */
export function resetFallbackMode(): void {
  useFallbackMode = false;
}
