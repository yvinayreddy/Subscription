const uploadFile = require('../services/post.service');
const Post = require('../models/post.model');

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
      success: true,
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
    console.error('Get all posts error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
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

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: post
    });

  } catch (error) {
    console.error("Get post by ID error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching post"
    });
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
      return res.status(400).json({
        success: false,
        message: 'image and user are required',
      });
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
      success: true,
      data: newPost,
    });
  } catch (error) {
    console.error('Post API error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
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

    const post = await Post.findByIdAndDelete(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully"
    });

  } catch (error) {
    console.error("Delete post by ID error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting post"
    });
  }
};


