import { authApi } from './api';

/**
 * Authentication Service
 * Handles user login, registration, and token management
 */
export const authService = {
  /**
   * User Login
   */
  async login(email, password) {
    try {
      const response = await authApi.login({ email, password });
      if (response.ok && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * User Registration
   */
  async register(name, email, password) {
    try {
      const response = await authApi.register({ name, email, password });
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * User Logout
   */
  logout() {
    authApi.logout();
  },

  /**
   * Get stored user data
   */
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Get authentication token
   */
  getToken() {
    return localStorage.getItem('token');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};
