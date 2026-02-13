const uploadFile = require('../services/post.service');
const Post = require('../models/post.model');
const { validateObjectId, sendValidationError, sendError } = require('../utils/validation');

/**
 * @desc    Get all posts with pagination
 * @route   GET /api/posts
 * @access  Public
 */

exports.getAllPosts = async (req, res) => {
  try {
    // finding no of page(page) ,posts for page(limit) and how many are cobpleted(skip)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // taking exact no of non reapeted posts sorted latest first
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    //no of total pages and posts
    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);

    // sending th info in response
    res.status(200).json({
      ok: true,
      data: posts,
      pagination: {
        currentPage: page,
        totalPages,
        limit,
        totalPosts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

/**
 * @desc    Get a single post by ID
 * @route   GET /api/posts/:postId
 * @access  Public
 */
exports.getPostById = async (req, res) => {
  try {
    const { postId } = req.params;

    if (sendValidationError(res, validateObjectId(postId, 'Post ID'))) return;

    const post = await Post.findById(postId);

    if (!post) {
      return sendError(res, 404, "Post not found", 'POST_NOT_FOUND');
    }

    return res.status(200).json({
      ok: true,
      data: post
    });

  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

/**
 * @desc    Create a new post
 * @route   POST /api/posts
 * @access  Private
 */

exports.createPost = async (req, res) => {
  try {
    const { caption, user } = req.body;

    if (!req.file || !user) {
      return sendError(res, 400, 'Image and user are required', 'MISSING_REQUIRED_FIELDS');
    }

    //req.file is handled mu multer
    const uploadResult = await uploadFile(
        req.file.buffer, 
        req.file.originalname);

    //new post is saved in db and gave referense for res
    const newPost = await Post.create({
      image: uploadResult.url,
      caption,
      user,
    });

    res.status(201).json({
      ok: true,
      data: newPost,
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};


/**
 * @desc    Delete a post by ID
 * @route   DELETE /api/posts/:postId
 * @access  Private (owner only)
 */
exports.deletePostById = async (req, res) => {
  try {
    const { postId } = req.params;

    if (sendValidationError(res, validateObjectId(postId, 'Post ID'))) return;

    const post = await Post.findByIdAndDelete(postId);

    if (!post) {
      return sendError(res, 404, "Post not found", 'POST_NOT_FOUND');
    }

    return res.status(200).json({
      ok: true,
      message: "Post deleted successfully"
    });

  } catch (error) {
    return sendError(res, 500, error.message);
  }
};


