import { subscriptionApi } from '../api';

/**
 * Subscription Service
 * Handles subscription-related operations
 */
export const subscriptionService = {
  /**
   * Create new subscription
   */
  async create(userId, planId) {
    try {
      const response = await subscriptionApi.create({
        userId,
        planId
      });
      return response.subscription;
    } catch (error) {
      console.error('Create subscription error:', error);
      throw error;
    }
  },

  /**
   * Get all subscriptions with optional filters
   */
  async getAll(filters = {}) {
    try {
      const response = await subscriptionApi.getAll(filters);
      return response.subscriptions || [];
    } catch (error) {
      console.error('Get subscriptions error:', error);
      throw error;
    }
  },

  /**
   * Get subscription by ID
   */
  async getById(id) {
    try {
      const response = await subscriptionApi.getById(id);
      return response.subscription;
    } catch (error) {
      console.error('Get subscription error:', error);
      throw error;
    }
  },

  /**
   * Get user subscriptions
   */
  async getUserSubscriptions(userId) {
    try {
      const response = await subscriptionApi.getAll({ userId });
      return response.subscriptions || [];
    } catch (error) {
      console.error('Get user subscriptions error:', error);
      throw error;
    }
  },

  /**
   * Cancel subscription
   */
  async cancel(id) {
    try {
      const response = await subscriptionApi.cancel(id);
      return response.subscription;
    } catch (error) {
      console.error('Cancel subscription error:', error);
      throw error;
    }
  },

  /**
   * Get active subscriptions only
   */
  async getActive(userId = null) {
    try {
      const filters = { status: 'active' };
      if (userId) filters.userId = userId;
      return await this.getAll(filters);
    } catch (error) {
      console.error('Get active subscriptions error:', error);
      throw error;
    }
  }
};
