const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Authenticate a user and generate a JWT token.
 *
 * Validates user credentials by comparing the provided password
 * with the stored hashed password in the database.
 *
 * @param {string} email - User email
 * @param {string} password - Plain text password
 *
 * @returns {Promise<Object>} Authentication result including JWT token
 *
 * @throws {Error} If user is not found or password is incorrect
 */

exports.login = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw { status: 401, message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' };
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw { status: 401, message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' };
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  return {
    token,
    user: { id: user._id, email: user.email, name: user.name, role: user.role }
  };
};

/**
 * Create a new user in the system.
 *
 * Performs business logic for user creation including:
 * - Checking if email already exists
 * - Creating a new user document
 * - Password hashing handled by the user model hook
 *
 * @param {Object} data
 * @param {string} data.name - User name
 * @param {string} data.email - User email
 * @param {string} data.password - Plain password
 *
 * @returns {Promise<Object>} Newly created user document
 *
 * @throws {Error} If email is already registered
 */

exports.register = async (name, email, password) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw { status: 409, message: 'Email already in use', code: 'DUPLICATE_EMAIL' };
  }

  const user = await User.create({ name, email, password });

  return {
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role
  };
};