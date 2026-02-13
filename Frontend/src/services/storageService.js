/**
 * Storage Service
 * Handles localStorage operations
 */
export const storageService = {
  /**
   * Set item in localStorage
   */
  setItem(key, value) {
    try {
      const data = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, data);
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },

  /**
   * Get item from localStorage
   */
  getItem(key, parse = false) {
    try {
      const data = localStorage.getItem(key);
      return parse && data ? JSON.parse(data) : data;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },

  /**
   * Remove item from localStorage
   */
  removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  },

  /**
   * Clear all localStorage
   */
  clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  },

  /**
   * Check if key exists
   */
  hasItem(key) {
    return localStorage.getItem(key) !== null;
  }
};
