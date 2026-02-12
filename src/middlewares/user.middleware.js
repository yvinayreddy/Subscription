const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

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
