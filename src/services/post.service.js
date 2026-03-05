const Post = require('../models/post.model');
const uploadFile = require('../config/imagekit.config');

/**
 * Fetch posts from database with pagination.
 *
 * Handles pagination logic including skip and limit calculations.
 *
 * @param {Object} query
 * @param {number} query.page - Current page number
 * @param {number} query.limit - Number of records per page
 *
 * @returns {Promise<Object[]>} List of posts
 */

exports.getAllPosts = async (page = 1, limit = 10, filters = {}) => {
  const skip = (page - 1) * limit;

  const query = {};
  if (filters.user) query.user = filters.user;
  if (filters.q) query.caption = { $regex: filters.q, $options: 'i' };

  const posts = await Post.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

  const totalPosts = await Post.countDocuments(query);
  const totalPages = Math.ceil(totalPosts / limit) || 1;

  return {
    posts,
    pagination: {
      currentPage: page,
      totalPages,
      limit,
      totalPosts,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};

/**
 * Get a single post by ID.
 *
 * Retrieves a post document by its ID.
 *
 * @param {string} postId - Post ID
 *
 * @returns {Promise<Object>} Post document
 *
 * @throws {Error} If post not found
 */
exports.getPostById = async (postId) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw { status: 404, message: 'Post not found', code: 'POST_NOT_FOUND' };
  }
  return post;
};

/**
 * Create a new post record.
 *
 * Handles image upload through ImageKit and stores the resulting
 * image URL along with caption and user reference in the database.
 *
 * @param {Object} data
 * @param {string} data.caption - Post caption
 * @param {Object} data.image - Uploaded image file
 * @param {string} data.userId - ID of the authenticated user
 *
 * @returns {Promise<Object>} Created post document
 */

exports.createPost = async (file, caption, userId) => {
  if (!file) {
    throw { status: 400, message: 'Image is required', code: 'MISSING_IMAGE' };
  }

  const uploadResult = await uploadFile(file.buffer, file.originalname);

  const newPost = await Post.create({
    image: uploadResult.url,
    caption,
    user: userId
  });

  return newPost;
};

/**
 * Fetch posts from database with pagination.
 *
 * Handles pagination logic including skip and limit calculations.
 *
 * @param {Object} query
 * @param {number} query.page - Current page number
 * @param {number} query.limit - Number of records per page
 *
 * @returns {Promise<Object[]>} List of posts
 */

exports.deletePost = async (postId) => {
  const post = await Post.findByIdAndDelete(postId);
  if (!post) {
    throw { status: 404, message: 'Post not found', code: 'POST_NOT_FOUND' };
  }
  return post;
};