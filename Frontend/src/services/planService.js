import { planApi } from '../api';

/**
 * Plan Service
 * Handles all plan-related operations
 */
export const planService = {
  /**
   * Get all plans
   */
  async getAll() {
    try {
      const response = await planApi.getAll();
      return response.plans || [];
    } catch (error) {
      console.error('Get plans error:', error);
      throw error;
    }
  },

  /**
   * Get plan by ID
   */
  async getById(id) {
    try {
      const response = await planApi.getById(id);
      return response.plan;
    } catch (error) {
      console.error('Get plan error:', error);
      throw error;
    }
  },

  /**
   * Create new plan (Admin only)
   */
  async create(name, price, duration) {
    try {
      const response = await planApi.create({
        name,
        price: parseFloat(price),
        duration: parseInt(duration)
      });
      return response.plan;
    } catch (error) {
      console.error('Create plan error:', error);
      throw error;
    }
  },

  /**
   * Update plan (Admin only)
   */
  async update(id, updates) {
    try {
      const response = await planApi.update(id, updates);
      return response.plan;
    } catch (error) {
      console.error('Update plan error:', error);
      throw error;
    }
  },

  /**
   * Delete plan (Admin only)
   */
  async delete(id) {
    try {
      const response = await planApi.delete(id);
      return response;
    } catch (error) {
      console.error('Delete plan error:', error);
      throw error;
    }
  }
};
