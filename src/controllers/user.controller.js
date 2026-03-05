const userService = require('../services/user.service');
const { validateRequired, sendValidationError } = require('../utils/validation');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Authenticate a user and generate JWT token.
 *
 * Handles login requests by validating credentials
 * and delegating authentication logic to the service layer.
 *
 * @route POST /api/auth/login
 * @access Public
 *
 * @param {Object} req.body
 * @param {string} req.body.email - Registered email
 * @param {string} req.body.password - Plain text password
 *
 * @returns {Object} JSON response containing authentication token
 *
 * @throws {401} If credentials are invalid
 */

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  if (sendValidationError(res, validateRequired({ email, password }, ['email', 'password']))) return;
  
  const result = await userService.login(email, password);
  
  res.status(200).json({
    ok: true,
    token: result.token,
    user: result.user
  });
});

/**
 * Register a new user account.
 *
 * Handles the HTTP request for user registration. Validates request data
 * and delegates user creation logic to the user service layer.
 *
 * @route POST /api/auth/register
 * @access Public
 *
 * @param {Object} req.body
 * @param {string} req.body.name - Full name of the user
 * @param {string} req.body.email - Unique email address
 * @param {string} req.body.password - Plain text password
 *
 * @returns {Object} JSON response containing created user data
 *
 * @throws {400} If required fields are missing
 * @throws {409} If email already exists
 */

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await userService.register(name, email, password);

  res.status(201).json({
    ok: true,
    user
  });
});
