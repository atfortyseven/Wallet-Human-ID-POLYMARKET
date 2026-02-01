import { createHash } from 'crypto';
import type { UserSettings, PartialUserSettings } from './settings-validation';
import { validateUserSettings, validatePartialSettings } from './settings-validation';

// ============================================================================
// HUMANID.FI - SETTINGS SYNCHRONIZATION SERVICE
// ============================================================================

interface SyncResult {
  success: boolean;
  data?: any;
  error?: string;
  version?: number;
}

interface PendingChange {
  field: string;
  value: any;
  timestamp: number;
}

/**
 * Settings Synchronization Service
 * Provides robust bi-directional sync with retry logic, conflict resolution,
 * and offline support
 */
export class SettingsSyncService {
  private pendingChanges: PendingChange[] = [];
  private isSyncing = false;
  private retryCount = 0;
  private maxRetries = 3;
  private baseDelay = 1000; // 1 second

  /**
   * Calculate MD5 hash of settings for change detection
   */
  private calculateHash(settings: any): string {
    const normalized = JSON.stringify(settings, Object.keys(settings).sort());
    return createHash('md5').update(normalized).digest('hex');
  }

  /**
   * Load settings from server with fallback to localStorage
   */
  async loadSettings(): Promise<UserSettings | null> {
    try {
      // Try to load from server
      const response = await fetch('/api/user/settings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      
      if (data.settings) {
        // Validate server data
        const validation = validateUserSettings(data.settings);
        if (validation.success && validation.data) {
          // Cache to localStorage
          this.saveToLocalStorage(validation.data);
          return validation.data;
        }
      }

      // Fallback to localStorage
      return this.loadFromLocalStorage();
    } catch (error) {
      console.error('Failed to load settings from server:', error);
      // Fallback to localStorage
      return this.loadFromLocalStorage();
    }
  }

  /**
   * Save complete settings object to server
   */
  async saveSettings(settings: UserSettings): Promise<SyncResult> {
    const hash = this.calculateHash(settings);

    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...settings,
          syncHash: hash,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save settings');
      }

      const data = await response.json();
      
      // Update localStorage
      this.saveToLocalStorage(settings);
      
      return {
        success: true,
        data: data.settings,
        version: data.settings?.version,
      };
    } catch (error: any) {
      console.error('Settings save failed:', error);
      
      // Save to localStorage anyway (offline support)
      this.saveToLocalStorage(settings);
      
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Update a single field (PATCH operation)
   */
  async updateField(field: string, value: any): Promise<SyncResult> {
    // Add to pending changes
    this.pendingChanges.push({
      field,
      value,
      timestamp: Date.now(),
    });

    // Debounce: wait 2 seconds before syncing
    await this.delay(2000);

    // Sync pending changes
    return this.syncPendingChanges();
  }

  /**
   * Sync all pending changes to server
   */
  async syncPendingChanges(): Promise<SyncResult> {
    if (this.isSyncing || this.pendingChanges.length === 0) {
      return { success: true };
    }

    this.isSyncing = true;

    try {
      // Build partial update object
      const updates: any = {};
      for (const change of this.pendingChanges) {
        updates[change.field] = change.value;
      }

      // Validate partial updates
      const validation = validatePartialSettings(updates);
      if (!validation.success) {
        console.error('Validation failed:', validation.errors);
        this.isSyncing = false;
        return {
          success: false,
          error: 'Validation failed',
        };
      }

      // Send to server with retry logic
      const result = await this.retryableRequest(async () => {
        const response = await fetch('/api/user/settings', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update settings');
        }

        return response.json();
      });

      // Clear pending changes on success
      this.pendingChanges = [];
      this.retryCount = 0;
      this.isSyncing = false;

      return {
        success: true,
        data: result.settings,
        version: result.settings?.version,
      };
    } catch (error: any) {
      console.error('Sync failed after retries:', error);
      this.isSyncing = false;
      
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Retry a request with exponential backoff
   */
  private async retryableRequest<T>(
    requestFn: () => Promise<T>
  ): Promise<T> {
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        if (attempt === this.maxRetries) {
          throw error;
        }

        // Exponential backoff: 1s, 2s, 4s
        const delay = this.baseDelay * Math.pow(2, attempt);
        console.log(`Retry attempt ${attempt + 1} after ${delay}ms`);
        await this.delay(delay);
      }
    }

    throw new Error('Max retries exceeded');
  }

  /**
   * Resolve conflict between local and remote settings
   * Strategy: Last-Write-Wins based on lastSyncAt timestamp
   */
  async resolveConflict(
    local: any,
    remote: any
  ): Promise<UserSettings> {
    console.log('Conflict detected, resolving...');

    // If remote has higher version, use remote
    if (remote.version > (local.version || 0)) {
      console.log('Using remote settings (higher version)');
      return remote;
    }

    // If local has higher version, use local
    if ((local.version || 0) > remote.version) {
      console.log('Using local settings (higher version)');
      return local;
    }

    // If versions are equal, use most recently synced
    const localSync = new Date(local.lastSyncAt || 0).getTime();
    const remoteSync = new Date(remote.lastSyncAt || 0).getTime();

    if (remoteSync > localSync) {
      console.log('Using remote settings (more recent sync)');
      return remote;
    } else {
      console.log('Using local settings (more recent sync)');
      return local;
    }
  }

  /**
   * Save to localStorage
   */
  private saveToLocalStorage(settings: any): void {
    try {
      localStorage.setItem('humanid_settings_v3', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  /**
   * Load from localStorage
   */
  private loadFromLocalStorage(): UserSettings | null {
    try {
      const stored = localStorage.getItem('humanid_settings_v3');
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      const validation = validateUserSettings(parsed);
      
      return validation.success && validation.data ? validation.data : null;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return null;
    }
  }

  /**
   * Utility: Delay/sleep function
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get sync status
   */
  getSyncStatus(): {
    isSyncing: boolean;
    pendingChanges: number;
  } {
    return {
      isSyncing: this.isSyncing,
      pendingChanges: this.pendingChanges.length,
    };
  }

  /**
   * Force sync now (skip debounce)
   */
  async forceSyncNow(): Promise<SyncResult> {
    return this.syncPendingChanges();
  }

  /**
   * Clear all pending changes
   */
  clearPendingChanges(): void {
    this.pendingChanges = [];
  }
}

// Singleton instance
export const settingsSyncService = new SettingsSyncService();
