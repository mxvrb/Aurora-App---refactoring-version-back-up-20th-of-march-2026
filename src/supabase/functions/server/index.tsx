import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from 
        param($match)
        $match -replace '@\d+\.\d+\.\d+', ''
    ;
import { parseHTML } from "npm:linkedom";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create Supabase client for server operations
const createSupabaseClient = () => createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

// Profile images bucket name
const PROFILE_IMAGES_BUCKET = 'make-3f7de5a4-profile-images';
// White label logos bucket name
const WHITELABEL_LOGOS_BUCKET = 'white-label-logos';

// Initialize storage bucket on startup
const initializeStorage = async () => {
  try {
    const supabase = createSupabaseClient();
    const { data: buckets } = await supabase.storage.listBuckets();
    
    // Check and create profile images bucket
    const profileBucketExists = buckets?.some(bucket => bucket.name === PROFILE_IMAGES_BUCKET);
    if (!profileBucketExists) {
      await supabase.storage.createBucket(PROFILE_IMAGES_BUCKET, {
        public: false,
        fileSizeLimit: 1024 * 1024 * 5 // 5MB limit
      });
      console.log(`Created storage bucket: ${PROFILE_IMAGES_BUCKET}`);
    } else {
      console.log(`Storage bucket already exists: ${PROFILE_IMAGES_BUCKET}`);
    }
    
    // Check and create white label logos bucket
    const whitelabelBucketExists = buckets?.some(bucket => bucket.name === WHITELABEL_LOGOS_BUCKET);
    if (!whitelabelBucketExists) {
      await supabase.storage.createBucket(WHITELABEL_LOGOS_BUCKET, {
        public: true, // Make public for easy access in WhatsApp templates
        fileSizeLimit: 1024 * 1024 * 2 // 2MB limit
      });
      console.log(`Created storage bucket: ${WHITELABEL_LOGOS_BUCKET}`);
    } else {
      console.log(`Storage bucket already exists: ${WHITELABEL_LOGOS_BUCKET}`);
    }
  } catch (error) {
    console.log('Storage initialization error:', error);
  }
};

// Initialize storage on startup
initializeStorage();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-3f7de5a4/health", (c) => {
  return c.json({ status: "ok" });
});

// User signup endpoint
app.post("/make-server-3f7de5a4/auth/signup", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    const supabase = createSupabaseClient();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Signup error for ${email}: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    console.log(`User created successfully: ${email}`);
    return c.json({ 
      success: true, 
      userId: data.user.id,
      message: "User created successfully" 
    });

  } catch (error) {
    console.log(`Signup error: ${error}`);
    return c.json({ error: "Internal server error during signup" }, 500);
  }
});

// Check if user is first time (has no name stored)
app.get("/make-server-3f7de5a4/auth/check-first-time", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const supabase = createSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      console.log(`Authentication error during first-time check: ${error?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Check if user has a name and company info stored
    const userName = await kv.get(`user_name_${user.id}`);
    const companyInfo = await kv.get(`user_company_${user.id}`);
    
    return c.json({ 
      isFirstTime: !userName,
      hasCompanyInfo: !!companyInfo,
      userName: userName || null,
      companyInfo: companyInfo || null,
      userId: user.id
    });

  } catch (error) {
    console.log(`First-time check error: ${error}`);
    return c.json({ error: "Internal server error during first-time check" }, 500);
  }
});

// Save user name
app.post("/make-server-3f7de5a4/auth/save-name", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const { name } = await c.req.json();
    if (!name || !name.trim()) {
      return c.json({ error: "Name is required" }, 400);
    }

    const supabase = createSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      console.log(`Authentication error during name save: ${error?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Store the user's name in KV store
    await kv.set(`user_name_${user.id}`, name.trim());
    
    console.log(`Name saved for user ${user.id}: ${name}`);
    return c.json({ 
      success: true, 
      message: "Name saved successfully" 
    });

  } catch (error) {
    console.log(`Name save error: ${error}`);
    return c.json({ error: "Internal server error during name save" }, 500);
  }
});

// Upload profile image
app.post("/make-server-3f7de5a4/auth/upload-profile-image", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const supabase = createSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      console.log(`Authentication error during image upload: ${error?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const formData = await c.req.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return c.json({ error: "No image file provided" }, 400);
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return c.json({ error: "File must be an image" }, 400);
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return c.json({ error: "Image file too large (max 5MB)" }, 400);
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    
    // Convert file to arrayBuffer for upload
    const fileBuffer = await file.arrayBuffer();
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(PROFILE_IMAGES_BUCKET)
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: true
      });

    if (uploadError) {
      console.log(`Image upload error for user ${user.id}:`, uploadError);
      return c.json({ error: "Failed to upload image" }, 500);
    }

    // Delete old profile image if exists
    try {
      const existingProfile = await kv.get(`user_profile_${user.id}`) || {};
      if (existingProfile.profileImagePath) {
        await supabase.storage
          .from(PROFILE_IMAGES_BUCKET)
          .remove([existingProfile.profileImagePath]);
      }
    } catch (deleteError) {
      console.log(`Warning: Could not delete old profile image:`, deleteError);
    }

    // Update profile data with image path
    const existingProfile = await kv.get(`user_profile_${user.id}`) || {};
    await kv.set(`user_profile_${user.id}`, {
      ...existingProfile,
      profileImagePath: fileName
    });

    // Generate signed URL for immediate use
    const { data: signedUrlData } = await supabase.storage
      .from(PROFILE_IMAGES_BUCKET)
      .createSignedUrl(fileName, 60 * 60 * 24 * 365); // 1 year expiry

    console.log(`Profile image uploaded for user ${user.id}: ${fileName}`);
    return c.json({ 
      success: true, 
      message: "Profile image uploaded successfully",
      imageUrl: signedUrlData?.signedUrl
    });

  } catch (error) {
    console.log(`Profile image upload error: ${error}`);
    return c.json({ error: "Internal server error during image upload" }, 500);
  }
});

// Upload white label logo
app.post("/make-server-3f7de5a4/auth/upload-whitelabel-logo", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const supabase = createSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      console.log(`Authentication error during white label logo upload: ${error?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const formData = await c.req.formData();
    const file = formData.get('image') as File;
    const businessId = formData.get('businessId') as string || user.id;
    
    if (!file) {
      return c.json({ error: "No image file provided" }, 400);
    }

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      return c.json({ error: "File must be PNG or JPG" }, 400);
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      return c.json({ error: "Image file too large (max 2MB)" }, 400);
    }

    // Generate filename
    const fileExt = file.name.split('.').pop();
    const fileName = `business/${businessId}/logo-${Date.now()}.${fileExt}`;
    
    // Convert file to arrayBuffer for upload
    const fileBuffer = await file.arrayBuffer();
    
    // Delete old logo if exists
    try {
      const { data: files } = await supabase.storage
        .from(WHITELABEL_LOGOS_BUCKET)
        .list(`business/${businessId}`);
      
      if (files && files.length > 0) {
        const oldFiles = files.map(f => `business/${businessId}/${f.name}`);
        await supabase.storage
          .from(WHITELABEL_LOGOS_BUCKET)
          .remove(oldFiles);
      }
    } catch (deleteError) {
      console.log(`Warning: Could not delete old white label logo:`, deleteError);
    }
    
    // Upload new logo
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(WHITELABEL_LOGOS_BUCKET)
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: true,
        cacheControl: '3600'
      });

    if (uploadError) {
      console.log(`White label logo upload error for business ${businessId}:`, uploadError);
      return c.json({ error: "Failed to upload logo" }, 500);
    }

    // Get public URL (bucket is public)
    const { data: urlData } = supabase.storage
      .from(WHITELABEL_LOGOS_BUCKET)
      .getPublicUrl(fileName);

    console.log(`White label logo uploaded for business ${businessId}: ${fileName}`);
    return c.json({ 
      success: true, 
      message: "White label logo uploaded successfully",
      logoUrl: urlData.publicUrl
    });

  } catch (error) {
    console.log(`White label logo upload error: ${error}`);
    return c.json({ error: "Internal server error during logo upload" }, 500);
  }
});

// Save user profile (name, phone, website)
app.post("/make-server-3f7de5a4/auth/save-profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const { name, phone, website } = await c.req.json();
    if (!name || !name.trim()) {
      return c.json({ error: "Name is required" }, 400);
    }

    const supabase = createSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      console.log(`Authentication error during profile save: ${error?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Store the user's name in KV store
    await kv.set(`user_name_${user.id}`, name.trim());
    
    // Store the user's profile data (phone and website) in KV store
    // Preserve existing profile image if it exists
    const existingProfile = await kv.get(`user_profile_${user.id}`) || {};
    await kv.set(`user_profile_${user.id}`, {
      ...existingProfile,
      phone: phone ? phone.trim() : '',
      website: website ? website.trim() : ''
    });
    
    console.log(`Profile saved for user ${user.id}: ${name}, ${phone || 'no phone'}, ${website || 'no website'}`);
    return c.json({ 
      success: true, 
      message: "Profile saved successfully" 
    });

  } catch (error) {
    console.log(`Profile save error: ${error}`);
    return c.json({ error: "Internal server error during profile save" }, 500);
  }
});

// Save company information
app.post("/make-server-3f7de5a4/auth/save-company", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const { companyName, lineOfBusiness } = await c.req.json();
    if (!companyName || !companyName.trim()) {
      return c.json({ error: "Company name is required" }, 400);
    }
    if (!lineOfBusiness || !lineOfBusiness.trim()) {
      return c.json({ error: "Line of business is required" }, 400);
    }

    const supabase = createSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      console.log(`Authentication error during company save: ${error?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Store the company information in KV store
    await kv.set(`user_company_${user.id}`, {
      companyName: companyName.trim(),
      lineOfBusiness: lineOfBusiness.trim()
    });
    
    console.log(`Company info saved for user ${user.id}: ${companyName} - ${lineOfBusiness}`);
    return c.json({ 
      success: true, 
      message: "Company information saved successfully" 
    });

  } catch (error) {
    console.log(`Company save error: ${error}`);
    return c.json({ error: "Internal server error during company save" }, 500);
  }
});

// Get user profile
app.get("/make-server-3f7de5a4/auth/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const supabase = createSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      console.log(`Authentication error during profile fetch: ${error?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get the user's name from KV store
    const userName = await kv.get(`user_name_${user.id}`);
    
    // Get the user's profile data (phone, website, and image) from KV store
    const profileData = await kv.get(`user_profile_${user.id}`) || {};
    
    // Generate signed URL for profile image if it exists
    let profileImageUrl = null;
    if (profileData.profileImagePath) {
      try {
        const { data: signedUrlData } = await supabase.storage
          .from(PROFILE_IMAGES_BUCKET)
          .createSignedUrl(profileData.profileImagePath, 60 * 60 * 24 * 365); // 1 year expiry
        
        profileImageUrl = signedUrlData?.signedUrl || null;
      } catch (imageError) {
        console.log(`Error generating signed URL for profile image: ${imageError}`);
      }
    }
    
    return c.json({ 
      userId: user.id,
      email: user.email,
      userName: userName || null,
      phone: profileData.phone || '',
      website: profileData.website || '',
      profileImageUrl: profileImageUrl
    });

  } catch (error) {
    console.log(`Profile fetch error: ${error}`);
    return c.json({ error: "Internal server error during profile fetch" }, 500);
  }
});

// Save user preferences (dark mode, etc.)
app.post("/make-server-3f7de5a4/auth/save-preferences", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const { isDarkMode } = await c.req.json();

    const supabase = createSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      console.log(`Authentication error during preferences save: ${error?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get existing preferences or create new ones
    const existingPreferences = await kv.get(`user_preferences_${user.id}`) || {};
    
    // Update preferences
    const updatedPreferences = {
      ...existingPreferences,
      isDarkMode: isDarkMode
    };

    // Store the updated preferences in KV store
    await kv.set(`user_preferences_${user.id}`, updatedPreferences);
    
    console.log(`Preferences saved for user ${user.id}: isDarkMode=${isDarkMode}`);
    return c.json({ 
      success: true, 
      message: "Preferences saved successfully" 
    });

  } catch (error) {
    console.log(`Preferences save error: ${error}`);
    return c.json({ error: "Internal server error during preferences save" }, 500);
  }
});

// Get user preferences
app.get("/make-server-3f7de5a4/auth/preferences", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const supabase = createSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      console.log(`Authentication error during preferences fetch: ${error?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get the user's preferences from KV store
    const preferences = await kv.get(`user_preferences_${user.id}`) || {};
    
    return c.json({ 
      preferences: {
        isDarkMode: preferences.isDarkMode || false,
        ...preferences
      }
    });

  } catch (error) {
    console.log(`Preferences fetch error: ${error}`);
    return c.json({ error: "Internal server error during preferences fetch" }, 500);
  }
});

// Mark that user has seen welcome screen (for skip functionality)
app.post("/make-server-3f7de5a4/auth/mark-welcome-seen", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const supabase = createSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      console.log(`Authentication error during welcome seen marking: ${error?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Mark that user has seen the welcome screen
    await kv.set(`user_welcome_seen_${user.id}`, true);
    
    console.log(`Welcome screen marked as seen for user ${user.id}`);
    return c.json({ 
      success: true, 
      message: "Welcome screen marked as seen" 
    });

  } catch (error) {
    console.log(`Welcome seen marking error: ${error}`);
    return c.json({ error: "Internal server error during welcome seen marking" }, 500);
  }
});

// Check if user has seen welcome screen before
app.get("/make-server-3f7de5a4/auth/check-welcome-seen", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const supabase = createSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      console.log(`Authentication error during welcome seen check: ${error?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Check if user has seen the welcome screen before
    const hasSeenWelcome = await kv.get(`user_welcome_seen_${user.id}`) || false;
    
    return c.json({ 
      hasSeenWelcome: !!hasSeenWelcome
    });

  } catch (error) {
    console.log(`Welcome seen check error: ${error}`);
    return c.json({ error: "Internal server error during welcome seen check" }, 500);
  }
});

// Save user tier preference
app.post("/make-server-3f7de5a4/auth/save-tier", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const { tier } = await c.req.json();
    if (!tier || !['free', 'basic', 'pro', 'premium', 'enterprise'].includes(tier)) {
      return c.json({ error: "Valid tier is required (free, basic, pro, premium, enterprise)" }, 400);
    }

    const supabase = createSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      console.log(`Authentication error during tier save: ${error?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get existing preferences or create new ones
    const existingPreferences = await kv.get(`user_preferences_${user.id}`) || {};
    
    // Update preferences with tier
    const updatedPreferences = {
      ...existingPreferences,
      tier: tier
    };

    // Store the updated preferences in KV store
    await kv.set(`user_preferences_${user.id}`, updatedPreferences);
    
    console.log(`Tier saved for user ${user.id}: ${tier}`);
    return c.json({ 
      success: true, 
      message: "Tier saved successfully",
      tier: tier
    });

  } catch (error) {
    console.log(`Tier save error: ${error}`);
    return c.json({ error: "Internal server error during tier save" }, 500);
  }
});

// Generate Handoff Message
app.post("/make-server-35e72f4d/handoff-message/generate", async (c) => {
  try {
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.log('OpenAI API key not configured');
      return c.json({ error: "AI service not configured" }, 500);
    }

    const systemMessage = "You are an expert copywriter. Generate a concise, professional, and slightly urgent notification message (1-2 sentences) that an AI agent will send to human staff when it needs to hand off a conversation. Do not include quotes. Vary the tone and wording slightly each time. For example: 'A customer requires human assistance. Please take over the chat immediately.' or 'The AI encountered an issue it cannot resolve. Log into the dashboard to assist the user.'";

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: "Generate a new staff notification message." }
        ],
        temperature: 0.8,
        max_tokens: 100
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.log(`OpenAI API error: ${response.status} - ${errorData}`);
      let parsedError = "Failed to generate message with AI";
      try {
        const parsed = JSON.parse(errorData);
        if (parsed.error && parsed.error.message) {
          parsedError = parsed.error.message;
        }
      } catch (e) {}
      return c.json({ error: parsedError }, 500);
    }

    const data = await response.json();
    const generatedMessage = data.choices[0]?.message?.content?.trim();

    if (!generatedMessage) {
      console.log('No message generated from OpenAI');
      return c.json({ error: "Failed to generate message" }, 500);
    }

    return c.json({ 
      success: true,
      message: generatedMessage
    });

  } catch (error) {
    console.log(`Handoff message generation error: ${error}`);
    return c.json({ error: "Internal server error during generation" }, 500);
  }
});

// Generate AI template
app.post("/make-server-3f7de5a4/templates/generate", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const supabase = createSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      console.log(`Authentication error during template generation: ${error?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { prompt, templateType, companyName, lineOfBusiness } = await c.req.json();
    
    if (!prompt || !prompt.trim()) {
      return c.json({ error: "Prompt is required" }, 400);
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.log('OpenAI API key not configured');
      return c.json({ error: "AI service not configured" }, 500);
    }

    // Create system message with WhatsApp-style context
    const systemMessage = `You are a WhatsApp messaging assistant helping create customer communication templates for ${companyName}, a ${lineOfBusiness} business.

Generate a SHORT, CONVERSATIONAL WhatsApp message template based on the user's request. The message should:
- Be BRIEF and to the point (WhatsApp style, not email style)
- Sound natural and friendly, like a real person texting
- Use appropriate personalization placeholders like {name}, {company}, {business}, {date}, {yourname}
- IMPORTANT: Always use {yourname} for the sender's name, never use [Your Name] or other placeholders
- Include emojis where appropriate to keep it casual and friendly
- Match the purpose: ${templateType}
- ${templateType === 'reminder' ? 'IMPORTANT: Use the word "appointment" instead of "meeting" when referring to scheduled events' : ''}
- Never use formal email greetings like "Dear" or email signatures
- Keep it under 3-4 sentences maximum
- Sound genuine and not like automated spam

Return ONLY the message template text, with no explanations or additional formatting.`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 200
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.log(`OpenAI API error: ${response.status} - ${errorData}`);
      return c.json({ error: "Failed to generate template with AI" }, 500);
    }

    const data = await response.json();
    const generatedTemplate = data.choices[0]?.message?.content?.trim();

    if (!generatedTemplate) {
      console.log('No template generated from OpenAI');
      return c.json({ error: "Failed to generate template" }, 500);
    }

    console.log(`Template generated for user ${user.id}: ${templateType}`);
    return c.json({ 
      success: true,
      template: generatedTemplate
    });

  } catch (error) {
    console.log(`Template generation error: ${error}`);
    return c.json({ error: "Internal server error during template generation" }, 500);
  }
});

// Generate AI message for bulk messaging
app.post("/make-server-3f7de5a4/messages/generate", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const supabase = createSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      console.log(`Authentication error during message generation: ${error?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { prompt, messageType, companyName, lineOfBusiness, customerCount } = await c.req.json();
    
    if (!prompt || !prompt.trim()) {
      return c.json({ error: "Prompt is required" }, 400);
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.log('OpenAI API key not configured');
      return c.json({ error: "AI service not configured" }, 500);
    }

    // Create system message with WhatsApp context
    const systemMessage = `You are a WhatsApp messaging assistant helping create customer messages for ${companyName}, a ${lineOfBusiness} business.

Generate a SHORT, CONVERSATIONAL WhatsApp message based on the user's request. The message should:
- Be BRIEF and to the point (WhatsApp style, not email style)
- Sound natural and friendly, like a real person texting
- Use appropriate personalization placeholders like {name}, {company}, {business}, {date}, {yourname}
- IMPORTANT: Always use {yourname} for the sender's name, never use [Your Name] or other placeholders
- Include emojis where appropriate to keep it casual and friendly
- Be suitable for sending to ${customerCount || 'multiple'} customer${customerCount > 1 ? 's' : ''}
- Match the purpose: ${messageType || 'general outreach'}
- Never use formal email greetings like "Dear" or email signatures
- Keep it under 3-4 sentences maximum

Return ONLY the message text, with no explanations or additional formatting.`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 200
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.log(`OpenAI API error: ${response.status} - ${errorData}`);
      return c.json({ error: "Failed to generate message with AI" }, 500);
    }

    const data = await response.json();
    const generatedMessage = data.choices[0]?.message?.content?.trim();

    if (!generatedMessage) {
      console.log('No message generated from OpenAI');
      return c.json({ error: "Failed to generate message" }, 500);
    }

    console.log(`WhatsApp message generated for user ${user.id}: ${messageType || 'general'}`);
    return c.json({ 
      success: true,
      message: generatedMessage
    });

  } catch (error) {
    console.log(`Message generation error: ${error}`);
    return c.json({ error: "Internal server error during message generation" }, 500);
  }
});

// Generate AI response guidelines
app.post("/make-server-35e72f4d/guidelines/generate", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const supabase = createSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      console.log(`Authentication error during guidelines generation: ${error?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { companyName, lineOfBusiness } = await c.req.json();

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.log('OpenAI API key not configured');
      return c.json({ error: "AI service not configured" }, 500);
    }

    // Create system message for response guidelines
    const systemMessage = `You are an AI assistant helping create response guidelines for a customer service AI chatbot.

Generate clear, concise response guidelines for ${companyName || 'a business'}${lineOfBusiness ? `, which operates in the ${lineOfBusiness} industry` : ''}.

IMPORTANT FORMATTING RULES:
- Write as a short PARAGRAPH (no bullet points, no numbered lists, no line breaks)
- Keep it BRIEF - typically 1-3 sentences depending on what's necessary
- Be CONSERVATIVE and CONCISE - less is more
- Must fit in approximately 3 lines of text when displayed
- Be plain and straight to the point - these are direct instructions, not detailed explanations
- Focus on the core behavior: tone, accuracy, and professionalism
- No fluff or unnecessary elaboration

Return ONLY the short paragraph, with no title or additional text.`;

    const userPrompt = `Generate response guidelines for ${companyName || 'this business'}${lineOfBusiness ? ` in the ${lineOfBusiness} industry` : ''}.`;

    // Call OpenAI API (using gpt-3.5-turbo for speed and cost efficiency)
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.log(`OpenAI API error: ${response.status} - ${errorData}`);
      return c.json({ error: "Failed to generate guidelines with AI" }, 500);
    }

    const data = await response.json();
    const generatedGuidelines = data.choices[0]?.message?.content?.trim();

    if (!generatedGuidelines) {
      console.log('No guidelines generated from OpenAI');
      return c.json({ error: "Failed to generate guidelines" }, 500);
    }

    console.log(`Response guidelines generated for user ${user.id}`);
    return c.json({ 
      success: true,
      guidelines: generatedGuidelines
    });

  } catch (error) {
    console.log(`Guidelines generation error: ${error}`);
    return c.json({ error: "Internal server error during guidelines generation" }, 500);
  }
});

// Generate AI personality
app.post("/make-server-35e72f4d/personality/generate", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const supabase = createSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      console.log(`Authentication error during personality generation: ${error?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { companyName, lineOfBusiness } = await c.req.json();

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.log('OpenAI API key not configured');
      return c.json({ error: "AI service not configured" }, 500);
    }

    // Create system message for AI personality
    const systemMessage = `You are an AI assistant helping create an AI personality description for a customer service chatbot.

Generate a clear, concise personality description for an AI assistant serving ${companyName || 'a business'}${lineOfBusiness ? ` in the ${lineOfBusiness} industry` : ''}.

IMPORTANT FORMATTING RULES:
- Write as a short PARAGRAPH (no bullet points, no numbered lists, no line breaks)
- Keep it BRIEF - typically 1-3 sentences depending on what's necessary
- Be CONSERVATIVE and CONCISE - less is more
- Must fit in approximately 3 lines of text when displayed
- Be plain and straight to the point - these are direct instructions about tone and personality
- Focus on the core traits: tone, demeanor, and communication style
- No fluff or unnecessary elaboration

Return ONLY the short paragraph describing the AI's personality, with no title or additional text.`;

    const userPrompt = `Generate an AI personality description for ${companyName || 'this business'}${lineOfBusiness ? ` in the ${lineOfBusiness} industry` : ''}.`;

    // Call OpenAI API (using gpt-3.5-turbo for speed and cost efficiency)
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.log(`OpenAI API error: ${response.status} - ${errorData}`);
      return c.json({ error: "Failed to generate personality with AI" }, 500);
    }

    const data = await response.json();
    const generatedPersonality = data.choices[0]?.message?.content?.trim();

    if (!generatedPersonality) {
      console.log('No personality generated from OpenAI');
      return c.json({ error: "Failed to generate personality" }, 500);
    }

    console.log(`AI personality generated for user ${user.id}`);
    return c.json({ 
      success: true,
      personality: generatedPersonality
    });

  } catch (error) {
    console.log(`Personality generation error: ${error}`);
    return c.json({ error: "Internal server error during personality generation" }, 500);
  }
});

// Generate AI initial greeting
app.post("/make-server-35e72f4d/greeting/generate", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const supabase = createSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      console.log(`Authentication error during greeting generation: ${error?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { companyName, lineOfBusiness } = await c.req.json();

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.log('OpenAI API key not configured');
      return c.json({ error: "AI service not configured" }, 500);
    }

    const systemMessage = `You are an AI assistant helping create an initial greeting for a customer service chatbot.

Generate a welcoming initial greeting for ${companyName || 'a business'}${lineOfBusiness ? ` in the ${lineOfBusiness} industry` : ''}.

IMPORTANT FORMATTING RULES:
- Write as a short PARAGRAPH (no bullet points, no numbered lists, no line breaks)
- Keep it BRIEF - typically 1-3 sentences depending on what's necessary
- Be CONSERVATIVE and CONCISE - less is more
- Must fit in approximately 3 lines of text when displayed
- Be warm, welcoming, and professional
- Should introduce the AI and offer help
- No fluff or unnecessary elaboration

Return ONLY the greeting text, with no title or additional text.`;

    const userPrompt = `Generate an initial greeting for ${companyName || 'this business'}${lineOfBusiness ? ` in the ${lineOfBusiness} industry` : ''}.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.log(`OpenAI API error: ${response.status} - ${errorData}`);
      return c.json({ error: "Failed to generate greeting with AI" }, 500);
    }

    const data = await response.json();
    const generatedGreeting = data.choices[0]?.message?.content?.trim();

    if (!generatedGreeting) {
      console.log('No greeting generated from OpenAI');
      return c.json({ error: "Failed to generate greeting" }, 500);
    }

    console.log(`Initial greeting generated for user ${user.id}`);
    return c.json({ 
      success: true,
      greeting: generatedGreeting
    });

  } catch (error) {
    console.log(`Greeting generation error: ${error}`);
    return c.json({ error: "Internal server error during greeting generation" }, 500);
  }
});

// Generate response format
app.post("/make-server-35e72f4d/format/generate", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const supabase = createSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      console.log(`Authentication error during format generation: ${error?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { companyName, lineOfBusiness, type, existingFormats } = await c.req.json();

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.log('OpenAI API key not configured');
      return c.json({ error: "AI service not configured" }, 500);
    }

    let systemMessage = '';
    let userPrompt = '';

    if (type === 'custom') {
      // Generate a custom format description for the "custom" response structure option
      systemMessage = `You are an AI assistant helping create response format descriptions for a customer service chatbot.

Generate a clear, concise format description for how ${companyName || 'a business'}${lineOfBusiness ? ` in the ${lineOfBusiness} industry` : ''} should structure their responses.

IMPORTANT RULES:
- Return ONLY a short format description (1-2 sentences)
- Describe HOW to structure the response (e.g., "Start with a summary, then list key points, end with a question")
- Be specific about the order and structure
- Keep it brief and actionable
- No bullet points, just a plain description
- Do NOT include any of these predefined formats: Paragraphs, Bullet Points, Numbered Lists, Short Answers, Email Style

Return ONLY the format description, with no title or additional text.`;

      userPrompt = `Generate a unique response format description for ${companyName || 'this business'}${lineOfBusiness ? ` in the ${lineOfBusiness} industry` : ''}.`;
    } else if (type === 'mixed') {
      // Generate a custom format pill name for the "mixed" response structure option
      const existingList = existingFormats && existingFormats.length > 0 
        ? `\n\nDo NOT suggest any of these existing formats: ${existingFormats.join(', ')}`
        : '';

      systemMessage = `You are an AI assistant that selects response format names for WhatsApp text messaging.

Choose ONE format from this EXACT list of TEXT PRESENTATION FORMATS:${existingList}

ALLOWED FORMATS (choose ONLY from these - these are actual text structure styles):
- Checkmark Bullets
- Dash Bullets
- Arrow Bullets
- Emoji Bullets
- Star Bullets
- Dotted Lists
- Bold Lead-Ins
- Underlined Headers
- Italic Emphasis
- Mixed Caps Style
- Uppercase Headers
- Spaced Paragraphs
- Indented Format
- Boxed Text
- Quoted Replies

CRITICAL RULES:
- You MUST choose from the list above - DO NOT create new formats
- These are TEXT STRUCTURE formats (how text is visually presented with symbols/formatting)
- Return ONLY the exact format name from the list (2-4 words)
- If all formats are in the existing list, choose the least common one
- No descriptions, no explanations, just the format name
- Use the exact capitalization shown above

Return ONLY one format name from the list above, nothing else.`;

      userPrompt = `Choose one unique text presentation format from the approved list.`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: type === 'custom' ? 100 : 30
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.log(`OpenAI API error: ${response.status} - ${errorData}`);
      return c.json({ error: "Failed to generate format with AI" }, 500);
    }

    const data = await response.json();
    const generatedFormat = data.choices[0]?.message?.content?.trim();

    if (!generatedFormat) {
      console.log('No format generated from OpenAI');
      return c.json({ error: "Failed to generate format" }, 500);
    }

    console.log(`Response format generated for user ${user.id}: ${generatedFormat}`);
    return c.json({ 
      success: true,
      format: generatedFormat
    });

  } catch (error) {
    console.log(`Format generation error: ${error}`);
    return c.json({ error: "Internal server error during format generation" }, 500);
  }
});

// Generate auto signature
app.post("/make-server-35e72f4d/signature/generate", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const supabase = createSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      console.log(`Authentication error during signature generation: ${error?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { companyName } = await c.req.json();

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.log('OpenAI API key not configured');
      return c.json({ error: "AI service not configured" }, 500);
    }

    const systemMessage = `You are an AI assistant helping create an auto signature for customer service messages.

Generate a professional signature line for ${companyName || 'a business'}.

IMPORTANT FORMATTING RULES:
- Keep it to ONE LINE ONLY (no line breaks)
- Be BRIEF and PROFESSIONAL
- Should be in format like: "Kind Regards, [Company/Team Name]" or "Best, [Name]"
- No additional text or elaboration

Return ONLY the signature line, with no title or additional text.`;

    const userPrompt = `Generate a professional signature for ${companyName || 'this business'}.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 50
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.log(`OpenAI API error: ${response.status} - ${errorData}`);
      return c.json({ error: "Failed to generate signature with AI" }, 500);
    }

    const data = await response.json();
    const generatedSignature = data.choices[0]?.message?.content?.trim();

    if (!generatedSignature) {
      console.log('No signature generated from OpenAI');
      return c.json({ error: "Failed to generate signature" }, 500);
    }

    console.log(`Auto signature generated for user ${user.id}`);
    return c.json({ 
      success: true,
      signature: generatedSignature
    });

  } catch (error) {
    console.log(`Signature generation error: ${error}`);
    return c.json({ error: "Internal server error during signature generation" }, 500);
  }
});

// Generate keyword for scenario
app.post("/make-server-35e72f4d/scenario-keyword/generate", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const supabase = createSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      console.log(`Authentication error during keyword generation: ${error?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { companyName, lineOfBusiness } = await c.req.json();

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.log('OpenAI API key not configured');
      return c.json({ error: "AI service not configured" }, 500);
    }

    const systemMessage = `You are an AI assistant helping create realistic customer inquiry keywords for ${companyName || 'a business'}${lineOfBusiness ? ` in the ${lineOfBusiness} industry` : ''}.

Generate ONE realistic customer phrase/question that a real customer would type or say. These phrases trigger custom AI responses.

CRITICAL RULES:
1. Generate ACTUAL customer queries/questions, NOT business category names or descriptions
2. Think: "What would a real customer ask or say to this business?"
3. Examples of GOOD triggers:
   - "I want to speak to a manager"
   - "Is there any pork in the menu?"
   - "Can I get a refund?"
   - "Do you have vegan options?"
   - "What are your hours?"
   - "I have a complaint"
   - "Cancel my order"
   - "Do you deliver?"
   - "Price list please"
   - "I'm allergic to nuts"
   
4. Make it specific to ${lineOfBusiness || 'the business type'} when relevant
5. Keep it natural and conversational (how people actually talk)
6. Vary the phrases - generate different ones each time
7. 2-8 words maximum

BAD examples (DO NOT generate):
- Business category names like "Japanese Restaurant"
- Generic descriptions like "Food Service Provider"
- Company name variations

Return ONLY the customer phrase, with no quotes or additional text.`;

    const userPrompt = `Generate a realistic customer question or phrase for ${companyName || 'this business'}${lineOfBusiness ? ` (${lineOfBusiness} business)` : ''}.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.9,  // Higher temperature for more variety
        max_tokens: 50
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.log(`OpenAI API error: ${response.status} - ${errorData}`);
      return c.json({ error: "Failed to generate keyword with AI" }, 500);
    }

    const data = await response.json();
    const generatedKeyword = data.choices[0]?.message?.content?.trim().replace(/['"]/g, '');

    if (!generatedKeyword) {
      console.log('No keyword generated from OpenAI');
      return c.json({ error: "Failed to generate keyword" }, 500);
    }

    console.log(`Scenario keyword generated for user ${user.id}`);
    return c.json({ 
      success: true,
      keyword: generatedKeyword
    });

  } catch (error) {
    console.log(`Keyword generation error: ${error}`);
    return c.json({ error: "Internal server error during keyword generation" }, 500);
  }
});

// Generate response for scenario keyword
app.post("/make-server-35e72f4d/scenario-response/generate", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const supabase = createSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      console.log(`Authentication error during scenario response generation: ${error?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { companyName, lineOfBusiness, keyword } = await c.req.json();

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.log('OpenAI API key not configured');
      return c.json({ error: "AI service not configured" }, 500);
    }

    const systemMessage = `You are an AI assistant helping create customer service responses.

Generate an appropriate response for ${companyName || 'a business'}${lineOfBusiness ? ` in the ${lineOfBusiness} industry` : ''} when a customer says: "${keyword}"

IMPORTANT FORMATTING RULES:
- Write as a short PARAGRAPH (no bullet points, no numbered lists, no line breaks)
- Keep it EXTREMELY BRIEF - 1-2 sentences MAXIMUM
- Be PROFESSIONAL, HELPFUL, and EMPATHETIC
- Must fit in ONE line of text when displayed
- Address the customer's concern directly
- No fluff or unnecessary elaboration
- Be concise and to the point

Return ONLY the response text, with no title or additional text.`;

    const userPrompt = `Generate a response for when a customer says: "${keyword}"`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 60
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.log(`OpenAI API error: ${response.status} - ${errorData}`);
      return c.json({ error: "Failed to generate response with AI" }, 500);
    }

    const data = await response.json();
    const generatedResponse = data.choices[0]?.message?.content?.trim();

    if (!generatedResponse) {
      console.log('No response generated from OpenAI');
      return c.json({ error: "Failed to generate response" }, 500);
    }

    console.log(`Scenario response generated for user ${user.id}`);
    return c.json({ 
      success: true,
      response: generatedResponse
    });

  } catch (error) {
    console.log(`Scenario response generation error: ${error}`);
    return c.json({ error: "Internal server error during scenario response generation" }, 500);
  }
});

// Generate translation message
app.post("/make-server-35e72f4d/translation-message/generate", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const supabase = createSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      console.log(`Authentication error during translation message generation: ${error?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { companyName, lineOfBusiness } = await c.req.json();

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.log('OpenAI API key not configured');
      return c.json({ error: "AI service not configured" }, 500);
    }

    // Create system message for translation message
    const systemMessage = `You are an AI assistant helping create a polite message for when customers write in languages other than English.

Generate a short, friendly message for ${companyName || 'a business'}${lineOfBusiness ? ` in the ${lineOfBusiness} industry` : ''} to send when they receive a message in a non-English language.

IMPORTANT RULES:
- Keep it SHORT - 1-2 sentences maximum
- Be polite and apologetic
- Explain that only English is currently supported
- Use a friendly, professional tone
- Don't over-explain or be too formal

Return ONLY the message text, with no title or additional formatting.`;

    const userPrompt = `Generate a polite message explaining that only English is supported.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 100
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.log(`OpenAI API error: ${response.status} - ${errorData}`);
      return c.json({ error: "Failed to generate message with AI" }, 500);
    }

    const data = await response.json();
    const generatedMessage = data.choices[0]?.message?.content?.trim();

    if (!generatedMessage) {
      console.log('No message generated from OpenAI');
      return c.json({ error: "Failed to generate message" }, 500);
    }

    console.log(`Translation message generated for user ${user.id}`);
    return c.json({ 
      success: true,
      message: generatedMessage
    });

  } catch (error) {
    console.log(`Translation message generation error: ${error?.message || error}`);
    console.error('Full error details:', error);
    return c.json({ error: "Internal server error during translation message generation" }, 500);
  }
});

// Generate spam behavior instructions
app.post("/make-server-35e72f4d/spam-behavior/generate", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const supabase = createSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      console.log(`Authentication error during spam behavior generation: ${error?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { companyName, lineOfBusiness } = await c.req.json();

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.log('OpenAI API key not configured');
      return c.json({ error: "AI service not configured" }, 500);
    }

    // Create system message for spam behavior
    const systemMessage = `You are an AI assistant helping create behavior guidelines for handling spam or hostile users.

Generate clear instructions for how an AI chatbot should behave when encountering spam or hostile messages for ${companyName || 'a business'}${lineOfBusiness ? ` in the ${lineOfBusiness} industry` : ''}.

CRITICAL RULES:
- MAXIMUM 2 SENTENCES - This is a hard limit, no exceptions
- Be extremely concise and direct
- Describe the specific action to take (e.g., warn once then stop, ignore immediately, etc.)
- Use simple, clear language
- No bullet points, just plain text

Return ONLY the behavior instructions (max 2 sentences), with no title or additional formatting.`;

    const userPrompt = `Generate behavior instructions for handling spam or hostile users.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 80
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.log(`OpenAI API error: ${response.status} - ${errorData}`);
      return c.json({ error: "Failed to generate behavior with AI" }, 500);
    }

    const data = await response.json();
    const generatedBehavior = data.choices[0]?.message?.content?.trim();

    if (!generatedBehavior) {
      console.log('No behavior generated from OpenAI');
      return c.json({ error: "Failed to generate behavior" }, 500);
    }

    console.log(`Spam behavior generated for user ${user.id}`);
    return c.json({ 
      success: true,
      behavior: generatedBehavior
    });

  } catch (error) {
    console.log(`Spam behavior generation error: ${error}`);
    return c.json({ error: "Internal server error during spam behavior generation" }, 500);
  }
});

// Generate humanize AI text (masculine, feminine, sensitivity)
app.post("/make-server-35e72f4d/humanize/generate", async (c) => {
  try {
    const { type } = await c.req.json();
    
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      console.log("OpenAI API key not configured for humanize text generation");
      return c.json({ error: "OpenAI API key not configured" }, 500);
    }

    let prompt = '';
    if (type === 'masculine') {
      prompt = 'Generate instructions for how an AI should adjust its tone when responding to customers with masculine names. Be specific and professional. Maximum 2 sentences.';
    } else if (type === 'feminine') {
      prompt = 'Generate instructions for how an AI should adjust its tone when responding to customers with feminine names. Be specific and professional. Maximum 2 sentences.';
    } else if (type === 'sensitivity') {
      prompt = 'Generate instructions for how an AI should handle legal or cultural sensitivities when communicating with customers. Be specific and professional. Maximum 2 sentences.';
    } else {
      return c.json({ error: "Invalid type" }, 400);
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that generates professional customer service guidelines. Keep responses to maximum 2 sentences.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 100,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`OpenAI API error for humanize text generation: ${errorText}`);
      return c.json({ error: `OpenAI API error: ${response.status}` }, 500);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content.trim();

    return c.json({ text: generatedText });
  } catch (error) {
    console.log(`Humanize text generation error: ${error}`);
    return c.json({ error: "Internal server error during humanize text generation" }, 500);
  }
});

// Get MCP request status
app.get("/make-server-3f7de5a4/mcp-request/status", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const supabase = createSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      console.log(`Authentication error during mcp request check: ${error?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const requestData = await kv.get(`mcp_request_${user.id}`);
    
    return c.json({ 
      hasRequest: !!requestData,
      requestData: requestData || null
    });

  } catch (error) {
    console.log(`MCP request check error: ${error}`);
    return c.json({ error: "Internal server error during MCP request check" }, 500);
  }
});

// Submit MCP request
app.post("/make-server-3f7de5a4/mcp-request/submit", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const { requirements } = await c.req.json();

    const supabase = createSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      console.log(`Authentication error during mcp request submit: ${error?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const requestData = {
      requirements,
      date: new Date().toISOString(),
      status: 'pending'
    };

    await kv.set(`mcp_request_${user.id}`, requestData);
    
    console.log(`MCP request submitted for user ${user.id}`);
    return c.json({ 
      success: true,
      message: "MCP request submitted successfully" 
    });

  } catch (error) {
    console.log(`MCP request submit error: ${error}`);
    return c.json({ error: "Internal server error during MCP request submit" }, 500);
  }
});

// Cancel MCP request
app.post("/make-server-3f7de5a4/mcp-request/cancel", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const supabase = createSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      console.log(`Authentication error during mcp request cancel: ${error?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Delete the request from KV store
    await kv.del(`mcp_request_${user.id}`);
    
    console.log(`MCP request cancelled for user ${user.id}`);
    return c.json({ 
      success: true,
      message: "MCP request cancelled successfully" 
    });

  } catch (error) {
    console.log(`MCP request cancel error: ${error}`);
    return c.json({ error: "Internal server error during MCP request cancel" }, 500);
  }
});

// Generate summary for a URL or text
app.post("/make-server-3f7de5a4/summary/generate", async (c) => {
  try {
    const { url, text } = await c.req.json();
    
    // We need either url or text
    if (!url && !text) {
      return c.json({ error: "URL or text is required" }, 400);
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return c.json({ error: "AI service not configured" }, 500);
    }

    let contentToSummarize = text;

    // If URL is provided but no text, fetch it using Jina
    if (url && !contentToSummarize) {
      const jinaApiKey = Deno.env.get("JINA_API_KEY");
      try {
        console.log(`[Summary] Fetching content for ${url}`);
        const jinaResponse = await fetch(`https://r.jina.ai/${url}`, {
          method: 'GET',
          headers: {
            'Authorization': jinaApiKey ? `Bearer ${jinaApiKey}` : '',
            'X-Return-Format': 'markdown'
          }
        });

        if (jinaResponse.ok) {
          contentToSummarize = await jinaResponse.text();
        } else {
          // Fallback to simple fetch if Jina fails (or just error out)
          console.log(`[Summary] Jina fetch failed, trying native fetch`);
          const nativeResponse = await fetch(url, { 
             headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' } 
          });
          if (nativeResponse.ok) {
            // Very naive text extraction
             const html = await nativeResponse.text();
             contentToSummarize = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').substring(0, 5000);
          }
        }
      } catch (e) {
        console.log(`[Summary] Fetch error: ${e.message}`);
        return c.json({ error: "Failed to fetch content from URL" }, 500);
      }
    }

    if (!contentToSummarize || contentToSummarize.trim().length === 0) {
       return c.json({ error: "Could not extract content to summarize" }, 400);
    }

    // Truncate to avoid token limits
    const truncatedContent = contentToSummarize.substring(0, 6000);

    const systemMessage = `You are a helpful assistant. Summarize the following website content in 2-3 concise sentences. Focus on what the page is about and what key information it contains.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: truncatedContent }
        ],
        temperature: 0.5,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.log(`OpenAI API error: ${response.status} - ${errorData}`);
      return c.json({ error: "Failed to generate summary with AI" }, 500);
    }

    const data = await response.json();
    const summary = data.choices[0]?.message?.content?.trim();

    return c.json({ 
      success: true,
      summary: summary
    });

  } catch (error) {
    console.log(`Summary generation error: ${error}`);
    return c.json({ error: "Internal server error during summary generation" }, 500);
  }
});

// Crawler endpoint - Using Jina Reader API (Free, AI-Friendly)
app.post("/make-server-3f7de5a4/crawl", async (c) => {
  try {
    const { url } = await c.req.json();
    if (!url) return c.json({ error: "URL is required" }, 400);

    const jinaApiKey = Deno.env.get("JINA_API_KEY");
    if (!jinaApiKey) {
       console.log("JINA_API_KEY is missing!");
    }

    // Normalize URL
    let targetUrl = url.trim();
    if (!targetUrl.startsWith('http')) {
      targetUrl = `https://${targetUrl}`;
    }

    console.log(`[Jina Crawler] Starting scan for: ${targetUrl}`);

    // Parallel Execution:
    // 1. Call Jina for high-quality Content extraction (Markdown)
    // 2. Call Native Fetch for Metadata (Logo, Theme Color) which Jina might strip
    
    const [jinaResult, metadataResult] = await Promise.allSettled([
        // Task 1: Jina Reader API
        (async () => {
            const response = await fetch(`https://r.jina.ai/${targetUrl}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jinaApiKey}`,
                    'X-Return-Format': 'markdown',
                    'X-With-Generated-Alt': 'true', 
                }
            });
            
            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Jina API failed: ${response.status} ${text}`);
            }
            return await response.text();
        })(),

        // Task 2: Native Metadata Fetch (Lightweight)
        (async () => {
            const response = await fetch(targetUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html',
                },
                redirect: 'follow',
            });
            if (!response.ok) throw new Error("Metadata fetch failed");
            const html = await response.text();
            const finalUrl = response.url;
            return { html, finalUrl };
        })()
    ]);

    // Process Jina Result (Content)
    let contentSnippet = "";
    let titleFromJina = "";
    
    if (jinaResult.status === 'fulfilled') {
        const markdown = jinaResult.value;
        // Jina often puts title as the first line "# Title"
        const titleMatch = markdown.match(/^#\s+(.+)$/m);
        if (titleMatch) titleFromJina = titleMatch[1].trim();
        
        contentSnippet = markdown
            .replace(/^#+\s+/gm, "") // Remove headers
            .replace(/!\[.*?\]\(.*?\)/g, "") // Remove images
            .replace(/\[.*?\]\(.*?\)/g, "$1") // Remove links but keep text
            .substring(0, 4000); // Limit length
    } else {
        console.log(`[Jina Crawler] Jina failed: ${jinaResult.reason}`);
    }

    // Process Metadata Result (Logo, Color, Fallback Title)
    let title = titleFromJina;
    let description = "";
    let logo = null;
    let themeColor = null;
    const links = new Set();

    if (metadataResult.status === 'fulfilled') {
        const { html, finalUrl } = metadataResult.value;
        const hostname = new URL(finalUrl).hostname;
        
        // Use Linkedom for parsing (avoids undici issues)
        const { document } = parseHTML(html);

        // Helper to resolve relative URLs
        const resolveUrl = (relativeUrl: string | undefined | null) => {
            if (!relativeUrl) return null;
            if (relativeUrl.startsWith('data:')) return relativeUrl; // Allow data URIs
            if (relativeUrl.startsWith('http')) return relativeUrl;
            if (relativeUrl.startsWith('//')) return `https:${relativeUrl}`;
            try { return new URL(relativeUrl, finalUrl).toString(); } catch (e) { return null; }
        };

        // --- TITLE ---
        const metaTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || 
                          document.querySelector('title')?.textContent;
        if (metaTitle && !title) title = metaTitle.trim();

        // --- DESCRIPTION ---
        description = document.querySelector('meta[name="description"]')?.getAttribute('content') || 
                      document.querySelector('meta[property="og:description"]')?.getAttribute('content') || 
                      "";

        // --- LINKS ---
        document.querySelectorAll('a').forEach((el) => {
            const href = el.getAttribute('href');
            const resolved = resolveUrl(href);
            if (resolved) {
                 try {
                    const linkHostname = new URL(resolved).hostname.replace(/^www\./, '');
                    const targetHostname = hostname.replace(/^www\./, '');
                    if (linkHostname === targetHostname && links.size < 10) {
                        links.add(resolved);
                    }
                 } catch (e) {}
            }
        });

        // --- LOGO DETECTION ---
        let appleTouchIcon = null;
        let favicon = null;
        let shortcutIcon = null;
        let manifestUrl = null;

        // Check for icons using DOM selector
        document.querySelectorAll('link').forEach((el) => {
            const rel = el.getAttribute('rel')?.toLowerCase() || '';
            const href = el.getAttribute('href');
            if (!href) return;

            if (rel.includes('apple-touch-icon')) {
                appleTouchIcon = resolveUrl(href);
            } else if (rel === 'icon') {
                favicon = resolveUrl(href);
            } else if (rel.includes('shortcut') && rel.includes('icon')) {
                shortcutIcon = resolveUrl(href);
            } else if (rel === 'manifest') {
                manifestUrl = resolveUrl(href);
            }
        });

        const ogImage = resolveUrl(document.querySelector('meta[property="og:image"]')?.getAttribute('content'));

        // Fallback services
        const googleFavicon = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
        
        // Priority logic:
        // 1. Apple Touch Icon (Best quality usually)
        // 2. Explicit Favicon (rel="icon")
        // 3. Shortcut Icon
        // 4. Google Favicon Service (Reliable fallback)
        
        if (appleTouchIcon) {
            logo = appleTouchIcon;
        } else if (favicon) {
            logo = favicon;
        } else if (shortcutIcon) {
            logo = shortcutIcon;
        } else {
            // No explicit icon found in HTML, default to Google
            logo = googleFavicon;
        }

        // --- COLOR DETECTION ---
        themeColor = document.querySelector('meta[name="theme-color"]')?.getAttribute('content') || 
                     document.querySelector('meta[name="msapplication-TileColor"]')?.getAttribute('content');
        
        // Try mask-icon color
        if (!themeColor) {
             const maskColor = document.querySelector('link[rel="mask-icon"]')?.getAttribute('color');
             if (maskColor) themeColor = maskColor;
        }
        
        // Try manifest if needed and available (fetch it)
        if (!themeColor && manifestUrl) {
            try {
                // Quick fetch for manifest
                const manifestRes = await fetch(manifestUrl);
                if (manifestRes.ok) {
                    const manifest = await manifestRes.json();
                    if (manifest.theme_color) themeColor = manifest.theme_color;
                    else if (manifest.background_color) themeColor = manifest.background_color;
                }
            } catch (e) {
                console.log('Manifest fetch failed', e);
            }
        }
    } else {
        console.log(`[Jina Crawler] Metadata fetch failed: ${metadataResult.reason}`);
        if (!title && titleFromJina) title = titleFromJina;
        if (!title) title = new URL(targetUrl).hostname;
    }

    console.log(`[Jina Crawler] Success. Title: ${title?.substring(0, 20)}... Content Length: ${contentSnippet.length}`);

    return c.json({
        success: true,
        data: {
            title: title || "Website",
            description,
            logo,
            themeColor,
            links: Array.from(links),
            contentSnippet
        }
    });

  } catch (error) {
    console.log(`[Jina Crawler] Critical error: ${error.message}`);
    return c.json({ 
        success: true,
        data: {
            title: "Website",
            description: "",
            logo: null,
            links: [],
            contentSnippet: "" 
        }
    });
  }
});

// AI Playground Greeting Generator
app.post("/make-server-35e72f4d/ai/playground/greeting", async (c) => {
  try {
    const body = await c.req.json();
    const context = body.context || {};
    
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return c.json({ error: "AI service not configured" }, 500);
    }
    
    let systemPrompt = `You are a helpful AI customer support assistant for a business called "${context.companyName || 'the business'}".`;
    
    if (context.lineOfBusiness) {
      systemPrompt += ` The business is in the ${context.lineOfBusiness} industry.`;
    }
    
    if (context.crawledContent) {
      const content = String(context.crawledContent);
      systemPrompt += `\n\nHere is some information about the business from their website:\n${content.substring(0, 4000)}`;
    }
    
    systemPrompt += `\n\nYour task is to generate a welcoming initial message for the user who just opened the chat.
    
    The message MUST follow this EXACT structure:
    1. A warm greeting introducing yourself as the AI assistant for ${context.companyName || 'the business'}.
    2. A brief sentence offering help.
    3. A list of 3 bullet points suggesting what the user can ask about, based on the website content provided.
    
    Example structure:
    "Hello! 😄
    
    I'm here to help you with anything related to [Company Name].
    
    To get started, you can ask me about:
    • [Topic 1 relevant to business]
    • [Topic 2 relevant to business]
    • [Topic 3 relevant to business]"
    
    Keep the tone friendly and professional. Use emojis sparingly.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: "Generate the welcome message now." }
        ],
        temperature: 0.7,
        max_tokens: 250
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.log(`OpenAI API error: ${response.status} - ${errorData}`);
      return c.json({ error: "Failed to generate greeting" }, 500);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content?.trim();

    return c.json({ 
      success: true, 
      greeting: aiResponse 
    });

  } catch (error) {
    console.log(`AI Playground greeting error: ${error}`);
    return c.json({ error: `Internal server error: ${error}` }, 500);
  }
});

// AI Playground Chat
app.post("/make-server-35e72f4d/ai/playground/chat", async (c) => {
  try {
    const body = await c.req.json();
    const message = body.message;
    const history = body.history || [];
    const context = body.context || {};
    
    // No auth check for playground as it is part of onboarding

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.log('OpenAI API key not configured');
      return c.json({ error: "AI service not configured" }, 500);
    }
    
    // Construct context-aware system prompt
    let systemPrompt = `You are a helpful AI customer support assistant for a business called "${context.companyName || 'the business'}".`;
    
    if (context.lineOfBusiness) {
      systemPrompt += ` The business is in the ${context.lineOfBusiness} industry.`;
    }
    
    if (context.description) {
      systemPrompt += `\n\nBusiness Description: ${context.description}`;
    }
    
    if (context.websiteUrl) {
      systemPrompt += `\n\nWebsite: ${context.websiteUrl}`;
    }

    if (context.crawledContent) {
      // Safely handle substring
      const content = String(context.crawledContent);
      systemPrompt += `\n\nHere is some information about the business from their website:\n${content.substring(0, 4000)}`;
    }
    
    systemPrompt += `\n\nYour goal is to be helpful, professional, and answer the user's questions based on the information provided.
    If you don't know the answer, politely say so and offer to connect them with a human agent.
    Keep your answers concise and friendly.
    Do not mention that you are an AI model trained by OpenAI. Act as an employee/agent of the business.
    `;

    // Construct messages array
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.text || ''
      })),
      { role: 'user', content: message }
    ];

    console.log(`Sending request to OpenAI with ${messages.length} messages`);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.log(`OpenAI API error: ${response.status} - ${errorData}`);
      return c.json({ error: `OpenAI error: ${response.status}` }, 500);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content?.trim();

    return c.json({ 
      success: true, 
      response: aiResponse 
    });

  } catch (error) {
    console.log(`AI Playground chat error: ${error}`);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return c.json({ error: `Internal server error: ${errorMessage}` }, 500);
  }
});

// Image Proxy for CORS (to enable client-side color extraction)
app.get("/make-server-3f7de5a4/util/proxy-image", async (c) => {
  try {
    const url = c.req.query('url');
    if (!url) return c.json({ error: "URL is required" }, 400);

    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    });

    if (!response.ok) {
        return c.json({ error: "Failed to fetch image" }, 400);
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const blob = await response.blob();
    
    return new Response(blob, {
        headers: {
            'Content-Type': contentType,
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=86400'
        }
    });
  } catch (e) {
    console.log(`Proxy error: ${e}`);
    return c.json({ error: "Proxy failed" }, 500);
  }
});

Deno.serve(app.fetch);