const postService = require('../services/post.service');
const { validateObjectId, sendValidationError } = require('../utils/validation');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Get all posts with pagination
 * @route   GET /api/posts
 * @access  Public
 */
/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts with optional pagination, user filter, and search
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of posts per page (default 10, max 100)
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: Filter by user id
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search text in captions
 *     responses:
 *       200:
 *         description: Successful response with posts list and pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *                 pagination:
 *                   type: object
 *     tags:
 *       - Posts
 */
 exports.getAllPosts = asyncHandler(async (req, res) => {
   let page = parseInt(req.query.page) || 1;
   let limit = parseInt(req.query.limit) || 10;
   const { user, q } = req.query;

  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 10;
  // enforce a reasonable maximum page size
  limit = Math.min(limit, 100);

  // If a user filter is provided, validate ObjectId
  if (user && sendValidationError(res, validateObjectId(user, 'User ID'))) return;

  const filters = {};
  if (user) filters.user = user;
  if (q) filters.q = q;

  const result = await postService.getAllPosts(page, limit, filters);

  res.status(200).json({
    ok: true,
    data: result.posts,
    pagination: result.pagination
  });
});

/**
 * @desc    Get a single post by ID
 * @route   GET /api/posts/:postId
 * @access  Public
 */
/**
 * @swagger
 * /api/posts/{postId}:
 *   get:
 *     summary: Get a single post by ID
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post
 *     responses:
 *       200:
 *         description: Post object returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 *     tags:
 *       - Posts
 */
 exports.getPostById = asyncHandler(async (req, res) => {
   const { postId } = req.params;

  if (sendValidationError(res, validateObjectId(postId, 'Post ID'))) return;

  const post = await postService.getPostById(postId);

  res.status(200).json({ ok: true, data: post });
});

/**
 * @desc    Create a new post
 * @route   POST /api/posts
 * @access  Private
 */
/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post (requires authentication)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               caption:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Validation error
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Posts
 */
 exports.createPost = asyncHandler(async (req, res) => {
   const { caption } = req.body;
  const userId = req.user._id;

  // Validate that an image file is present
  const { validateRequired, sendValidationError } = require('../utils/validation');

  if (sendValidationError(res, validateRequired({ file: req.file }, ['file']))) return;

  // Validate caption length (optional field)
  if (caption && String(caption).trim().length > 500) {
    if (sendValidationError(res, { error: true, status: 400, message: 'Caption exceeds maximum length (500)', field: 'caption', code: 'CAPTION_TOO_LONG' })) return;
  }

  const newPost = await postService.createPost(req.file, String(caption || '').trim(), userId);

  res.status(201).json({ ok: true, data: newPost });
});

/**
 * @desc    Delete a post by ID
 * @route   DELETE /api/posts/:postId
 * @access  Private (owner only)
 */
/**
 * @swagger
 * /api/posts/{postId}:
 *   delete:
 *     summary: Delete a post by ID (owner only)
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deletion success message
 *       404:
 *         description: Post not found
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Posts
 */
 exports.deletePostById = asyncHandler(async (req, res) => {
   const { postId } = req.params;

  if (sendValidationError(res, validateObjectId(postId, 'Post ID'))) return;

  await postService.deletePost(postId);

  res.status(200).json({ ok: true, message: "Post deleted successfully" });
});


