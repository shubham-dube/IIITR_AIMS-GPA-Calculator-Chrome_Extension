import { STORAGE_KEYS } from '@shared/constants/messages';

export class StorageService {
  
  static async initializeSettings() {
    const defaults = {
      showDecimalPlaces: 2,
      includeBacklogs: true,
      defaultView: 'calculator',
      theme: 'light',
    };

    await chrome.storage.local.set({
      [STORAGE_KEYS.USER_SETTINGS]: defaults,
    });
  }

  static async saveData(data) {
    try {
      await chrome.storage.local.set(data);
      return { success: true };
    } catch (error) {
      console.error('Storage error:', error);
      return { success: false, error: error.message };
    }
  }

  static async getData(keys) {
    try {
      const result = await chrome.storage.local.get(keys);
      return result;
    } catch (error) {
      console.error('Storage retrieval error:', error);
      return null;
    }
  }

  static async clearData(keys) {
    try {
      await chrome.storage.local.remove(keys);
      return { success: true };
    } catch (error) {
      console.error('Storage clear error:', error);
      return { success: false, error: error.message };
    }
  }

  static async getAllData() {
    try {
      const result = await chrome.storage.local.get(null);
      return result;
    } catch (error) {
      console.error('Storage get all error:', error);
      return null;
    }
  }
}