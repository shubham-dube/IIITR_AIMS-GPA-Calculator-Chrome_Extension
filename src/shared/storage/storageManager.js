import { STORAGE_KEYS } from '../constants/messages';

export class StorageManager {
  
  static async save(key, value) {
    try {
      await chrome.storage.local.set({ [key]: value });
      return { success: true };
    } catch (error) {
      console.error('Storage save error:', error);
      return { success: false, error: error.message };
    }
  }

  static async get(key, defaultValue = null) {
    try {
      const result = await chrome.storage.local.get(key);
      return result[key] !== undefined ? result[key] : defaultValue;
    } catch (error) {
      console.error('Storage get error:', error);
      return defaultValue;
    }
  }

  static async remove(key) {
    try {
      await chrome.storage.local.remove(key);
      return { success: true };
    } catch (error) {
      console.error('Storage remove error:', error);
      return { success: false, error: error.message };
    }
  }

  static async clear() {
    try {
      await chrome.storage.local.clear();
      return { success: true };
    } catch (error) {
      console.error('Storage clear error:', error);
      return { success: false, error: error.message };
    }
  }

  static async getMultiple(keys) {
    try {
      const result = await chrome.storage.local.get(keys);
      return result;
    } catch (error) {
      console.error('Storage get multiple error:', error);
      return {};
    }
  }

  static async saveMultiple(data) {
    try {
      await chrome.storage.local.set(data);
      return { success: true };
    } catch (error) {
      console.error('Storage save multiple error:', error);
      return { success: false, error: error.message };
    }
  }

  // Specific data operations
  static async saveCalculation(calculation) {
    const saved = await this.get(STORAGE_KEYS.SAVED_CALCULATIONS, []);
    const updated = [calculation, ...saved].slice(0, 50); // Keep last 50
    return await this.save(STORAGE_KEYS.SAVED_CALCULATIONS, updated);
  }

  static async getSavedCalculations() {
    return await this.get(STORAGE_KEYS.SAVED_CALCULATIONS, []);
  }

  static async deleteCalculation(calculationId) {
    const saved = await this.get(STORAGE_KEYS.SAVED_CALCULATIONS, []);
    const updated = saved.filter(calc => calc.id !== calculationId);
    return await this.save(STORAGE_KEYS.SAVED_CALCULATIONS, updated);
  }

  static async saveProjectedGrades(grades) {
    return await this.save(STORAGE_KEYS.PROJECTED_GRADES, grades);
  }

  static async getProjectedGrades() {
    return await this.get(STORAGE_KEYS.PROJECTED_GRADES, []);
  }

  static async getProjectedGrades() {
    const result = await chrome.storage.local.get('projected_grades');
    return result.projected_grades || [];
  }
}