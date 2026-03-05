const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const mongoose = require('mongoose');

/**
 * @desc    Bind and validate userId from route parameter
 * @access  Private
 *
 * What it does:
 * - Validates userId is a valid MongoDB ObjectId
 * - Verifies user exists in database
 * - Attaches user to req object
 */
exports.bindUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Validate if userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        ok: false,
        message: 'Invalid user ID format'
      });
    }

    // Find user by ID
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'User not found'
      });
    }

    // Attach user to request
    req.user = user;
    req.userId = userId;
    next();

  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: err.message
    });
  }
};

/**
 * @desc    Protect routes by verifying JWT
 * @access  Private
 *
 * What it does:
 * - Extracts JWT from Authorization header
 * - Verifies token signature and expiry
 * - Fetches the user from database
 * - Attaches user to req object
 */
exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';

    // 1) Check for Bearer token
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        ok: false,
        message: 'Authorization header must start with Bearer'
      });
    }

    // 2) Extract token
    const token = authHeader.split(' ')[1];

    // 3) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4) Find user from token payload
    const user = await User
      .findById(decoded.userId)
      .select('-password');

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: 'Unauthorized'
      });
    }

    // 5) Attach user to request
    req.user = user;
    next();

  } catch (err) {
    return res.status(401).json({
      ok: false,
      message: 'Unauthorized'
    });
  }
};