import { postApi } from '../api';

/**
 * Post Service
 * Handles post-related operations
 */
export const postService = {
  /**
   * Get all posts with pagination
   */
  async getAll(page = 1, limit = 10) {
    try {
      const response = await postApi.getAll(page, limit);
      return {
        data: response.data || [],
        pagination: response.pagination || {}
      };
    } catch (error) {
      console.error('Get posts error:', error);
      throw error;
    }
  },

  /**
   * Get post by ID
   */
  async getById(id) {
    try {
      const response = await postApi.getById(id);
      return response.data;
    } catch (error) {
      console.error('Get post error:', error);
      throw error;
    }
  },

  /**
   * Create new post
   */
  async create(caption, imageFile) {
    try {
      const formData = new FormData();
      formData.append('caption', caption);
      formData.append('image', imageFile);
      
      // Get userId from stored user
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user._id) {
        formData.append('user', user._id);
      }

      const response = await postApi.create(formData);
      return response.data;
    } catch (error) {
      console.error('Create post error:', error);
      throw error;
    }
  },

  /**
   * Delete post
   */
  async delete(id) {
    try {
      const response = await postApi.delete(id);
      return response;
    } catch (error) {
      console.error('Delete post error:', error);
      throw error;
    }
  },

  /**
   * Fetch more posts (pagination)
   */
  async loadMore(page, limit) {
    return this.getAll(page, limit);
  }
};
