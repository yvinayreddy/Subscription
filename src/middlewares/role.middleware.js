/**
 * @desc    Authorize routes based on user role
 * @param   {...string} roles - Allowed roles for this route
 * @access  Private
 *
 * What it does:
 * - Checks if user has one of the specified roles
 * - Requires protect middleware to be called first
 * 
 * Usage: authorize('admin'), authorize('admin', 'moderator')
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        ok: false,
        message: 'Unauthorized'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        ok: false,
        message: `User role '${req.user.role}' is not authorized to access this resource`
      });
    }

    next();
  };
};
