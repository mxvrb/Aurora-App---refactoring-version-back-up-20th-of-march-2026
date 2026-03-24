// Offline Storage Manager
export class OfflineStorageManager {
  private static instance: OfflineStorageManager;
  private syncQueue: Array<{ id: string; operation: string; data: any; timestamp: number }> = [];
  private static readonly PROFILE_REMOVED_KEY = 'acesai_profile_image_explicitly_removed';
  private userEmail: string | null = null;
  
  static getInstance(): OfflineStorageManager {
    if (!OfflineStorageManager.instance) {
      OfflineStorageManager.instance = new OfflineStorageManager();
    }
    return OfflineStorageManager.instance;
  }

  // Set the current user scope for data isolation
  setScope(email: string | null) {
    this.userEmail = email;
    if (email) {
      console.log(`[OfflineStorage] Scope set to: ${email}`);
    } else {
      console.log(`[OfflineStorage] Scope cleared (unscoped mode)`);
    }
  }

  // Helper to get a scoped key identifying the user
  private getScopedKey(key: string): string {
    if (!this.userEmail) return key;
    return `${this.userEmail}:${key}`;
  }

  // Generic getItem with scoping
  getItem(key: string): any {
    try {
      const value = localStorage.getItem(this.getScopedKey(key));
      if (!value) return null;
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (e) {
      return null;
    }
  }

  // Generic setItem with scoping
  setItem(key: string, value: any): void {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(this.getScopedKey(key), stringValue);
    } catch (e) {
      console.error(`[OfflineStorage] Failed to set item for key: ${key}`, e);
    }
  }

  // Generic removeItem with scoping
  removeItem(key: string): void {
    try {
      localStorage.removeItem(this.getScopedKey(key));
    } catch (e) {
      console.error(`[OfflineStorage] Failed to remove item for key: ${key}`, e);
    }
  }

  // Save user data locally
  saveUserData(data: any) {
    try {
      // Get existing data to preserve important fields like whiteLabel
      const existingData = this.getUserData() || {};
      
      // Merge new data with existing data, preserving whiteLabel if not explicitly provided
      const mergedData = {
        ...existingData,
        ...data,
        whiteLabel: data.whiteLabel !== undefined ? data.whiteLabel : existingData.whiteLabel,
        lastUpdated: Date.now()
      };
      
      this.setItem('acesai_user_data', mergedData);
    } catch (error) {
      console.log('Failed to save user data locally:', error);
    }
  }

  // Get user data from local storage
  getUserData(): any {
    return this.getItem('acesai_user_data');
  }

  // Add operation to sync queue
  addToSyncQueue(operation: string, data: any) {
    const queueItem = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      operation,
      data,
      timestamp: Date.now()
    };
    
    this.syncQueue.push(queueItem);
    this.saveSyncQueue();
    
    console.log(`Added to sync queue: ${operation}`, data);
  }

  // Save sync queue to localStorage
  private saveSyncQueue() {
    try {
      this.setItem('acesai_sync_queue', this.syncQueue);
    } catch (error) {
      console.log('Failed to save sync queue:', error);
    }
  }

  // Load sync queue from localStorage
  loadSyncQueue() {
    try {
      const queue = this.getItem('acesai_sync_queue');
      if (queue) {
        this.syncQueue = queue;
      }
    } catch (error) {
      console.log('Failed to load sync queue:', error);
    }
  }

  // Get sync queue
  getSyncQueue() {
    return [...this.syncQueue];
  }

  // Clear sync queue
  clearSyncQueue() {
    this.syncQueue = [];
    this.removeItem('acesai_sync_queue');
  }

  // Remove specific item from sync queue
  removeFromSyncQueue(id: string) {
    this.syncQueue = this.syncQueue.filter(item => item.id !== id);
    this.saveSyncQueue();
  }

  // CRITICAL FIX: Explicit tracking of profile image removal
  markProfileImageAsRemoved() {
    try {
      this.setItem(OfflineStorageManager.PROFILE_REMOVED_KEY, 'true');
      console.log('✓ Profile image marked as explicitly removed in localStorage');
    } catch (error) {
      console.log('Failed to mark profile image as removed:', error);
    }
  }

  // Check if profile image was explicitly removed
  isProfileImageRemoved(): boolean {
    const removed = this.getItem(OfflineStorageManager.PROFILE_REMOVED_KEY);
    return removed === 'true';
  }

  // Clear profile image removal flag (when user adds new image)
  clearProfileImageRemovedFlag() {
    this.removeItem(OfflineStorageManager.PROFILE_REMOVED_KEY);
    console.log('🔄 Cleared profile image removal flag');
  }

  // Save preferences locally with enhanced error handling and validation
  savePreferences(preferences: any) {
    try {
      if (!preferences || typeof preferences !== 'object') {
        console.error('Invalid preferences object provided to savePreferences:', preferences);
        return;
      }

      const dataToSave = {
        ...preferences,
        lastUpdated: Date.now()
      };
      
      this.setItem('acesai_preferences', dataToSave);
      
      console.log('Preferences successfully saved to localStorage:', {
        isDarkMode: dataToSave.isDarkMode,
        tier: dataToSave.tier,
        businessHours: !!dataToSave.businessHours ? 'present' : 'missing',
        holidayDays: Array.isArray(dataToSave.holidayDays) ? `array(${dataToSave.holidayDays.length})` : 'not array',
        lastUpdated: new Date(dataToSave.lastUpdated).toLocaleString()
      });
      
    } catch (error) {
      console.error('Failed to save preferences locally:', error);
      
      // Try to clear corrupted data and save again
      try {
        this.removeItem('acesai_preferences');
        const retryData = { ...preferences, lastUpdated: Date.now() };
        this.setItem('acesai_preferences', retryData);
        console.log('Retry save after clearing corrupted data: SUCCESS');
      } catch (retryError) {
        console.error('Retry save also failed:', retryError);
      }
    }
  }

  // Get preferences from local storage with enhanced validation
  getPreferences(): any {
    try {
      const parsed = this.getItem('acesai_preferences');
      if (!parsed) {
        console.log('No preferences found in localStorage');
        return null;
      }
      
      if (typeof parsed !== 'object') {
        console.error('Invalid preferences data structure in localStorage');
        this.removeItem('acesai_preferences'); // Clear corrupted data
        return null;
      }
      
      console.log('Preferences loaded from localStorage:', {
        isDarkMode: parsed.isDarkMode,
        tier: parsed.tier,
        businessHours: !!parsed.businessHours ? 'present' : 'missing',
        businessHoursType: typeof parsed.businessHours,
        holidayDays: Array.isArray(parsed.holidayDays) ? `array(${parsed.holidayDays.length})` : `not array: ${typeof parsed.holidayDays}`,
        lastUpdated: parsed.lastUpdated ? new Date(parsed.lastUpdated).toLocaleString() : 'unknown'
      });
      
      return parsed;
    } catch (error) {
      console.error('Failed to get preferences from local storage:', error);
      
      // Clear potentially corrupted data
      try {
        this.removeItem('acesai_preferences');
        console.log('Cleared corrupted preferences data from localStorage');
      } catch (clearError) {
        console.error('Failed to clear corrupted preferences:', clearError);
      }
      
      return null;
    }
  }
}

