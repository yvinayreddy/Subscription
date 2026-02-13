import { userApi } from '../api';

/**
 * User Service
 * Handles user profile operations
 */
export const userService = {
  /**
   * Get user profile
   */
  async getProfile(userId) {
    try {
      const response = await userApi.getProfile(userId);
      return response.user;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(userId, updates) {
    try {
      const response = await userApi.updateProfile(userId, updates);
      // Update stored user data
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      return response.user;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  /**
   * Get current logged-in user
   */
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Update user in local storage
   */
  updateLocalUser(userData) {
    localStorage.setItem('user', JSON.stringify(userData));
  }
};
