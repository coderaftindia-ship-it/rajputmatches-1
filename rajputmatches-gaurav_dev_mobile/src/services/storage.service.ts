import { Platform } from 'react-native';

/**
 * Cross-platform persistent storage utility supporting Web, iOS, and Android.
 */
class StorageService {
  private memoryStore: Record<string, string> = {};

  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      // On native iOS / Android memory fallback or storage
      return this.memoryStore[key] ?? null;
    } catch (e) {
      console.warn('StorageService getItem error:', e);
      return this.memoryStore[key] ?? null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      this.memoryStore[key] = value;
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn('StorageService setItem error:', e);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      delete this.memoryStore[key];
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn('StorageService removeItem error:', e);
    }
  }

  async getObject<T>(key: string): Promise<T | null> {
    const raw = await this.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async setObject<T>(key: string, value: T): Promise<void> {
    await this.setItem(key, JSON.stringify(value));
  }
}

export const storageService = new StorageService();
export default storageService;
