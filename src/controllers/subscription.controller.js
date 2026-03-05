const subscriptionService = require('../services/subscription.service');
const { validateObjectId, sendValidationError } = require('../utils/validation');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Delete a post from the database.
 *
 * Verifies the existence of the post before deletion.
 *
 * @param {string} postId - Post ID
 * @param {string} userId - ID of the requesting user
 *
 * @returns {Promise<void>}
 *
 * @throws {Error} If post does not exist or user is not authorized
 */

exports.createSubscription = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { planId } = req.body;

  if (sendValidationError(res, validateObjectId(userId, 'User ID'))) return;
  if (sendValidationError(res, validateObjectId(planId, 'Plan ID'))) return;

  const subscription = await subscriptionService.createSubscription(userId, planId);

  res.status(201).json({ ok: true, message: "Subscription created successfully", subscription });
});

/**
 * Get all subscriptions with optional filters.
 *
 * Retrieves a list of subscriptions, optionally filtered by status or user.
 * Private access.
 *
 * @route GET /api/subscriptions
 * @access Private
 *
 * @param {string} req.query.status - Filter by subscription status
 * @param {string} req.query.userId - Filter by user ID
 *
 * @returns {Object} JSON response containing array of subscriptions
 *
 * @throws {400} If userId is invalid
 */
exports.getAllSubscriptions = asyncHandler(async (req, res) => {
  const { status, userId } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (userId) {
    if (sendValidationError(res, validateObjectId(userId, 'User ID'))) return;
    filter.user = userId;
  }

  const subscriptions = await subscriptionService.getAllSubscriptions(filter);

  res.status(200).json({ ok: true, count: subscriptions.length, subscriptions });
});

/**
 * Get a single subscription by ID.
 *
 * Retrieves details of a specific subscription.
 * Private access.
 *
 * @route GET /api/subscriptions/:subscriptionId
 * @access Private
 *
 * @param {string} req.params.subscriptionId - Subscription ID
 *
 * @returns {Object} JSON response containing subscription details
 *
 * @throws {400} If subscription ID is invalid
 * @throws {404} If subscription not found
 */
exports.getSubscriptionById = asyncHandler(async (req, res) => {
  const { subscriptionId } = req.params;

  if (sendValidationError(res, validateObjectId(subscriptionId, 'Subscription ID'))) return;

  const subscription = await subscriptionService.getSubscriptionById(subscriptionId);

  res.status(200).json({ ok: true, subscription });
});

/**
 * Cancel an active subscription.
 *
 * Updates the subscription status to cancelled.
 *
 * @route PUT /api/subscriptions/:subscriptionId/cancel
 * @access Private
 *
 * @param {string} req.params.subscriptionId - Subscription ID
 *
 * @returns {Object} Updated subscription document
 */

exports.cancelSubscription = asyncHandler(async (req, res) => {
  const { subscriptionId } = req.params;

  if (sendValidationError(res, validateObjectId(subscriptionId, 'Subscription ID'))) return;

  const subscription = await subscriptionService.cancelSubscription(subscriptionId);

  res.status(200).json({ ok: true, message: "Subscription cancelled successfully", subscription });
});

/**
 * Renew an active subscription.
 *
 * Extends the end date of an active subscription by the plan's duration.
 * Private access.
 *
 * @route PUT /api/subscriptions/:subscriptionId/renew
 * @access Private
 *
 * @param {string} req.params.subscriptionId - Subscription ID
 *
 * @returns {Object} JSON response containing updated subscription
 *
 * @throws {400} If subscription ID is invalid
 * @throws {404} If subscription not found
 */
exports.renewSubscription = asyncHandler(async (req, res) => {
  const { subscriptionId } = req.params;

  if (sendValidationError(res, validateObjectId(subscriptionId, 'Subscription ID'))) return;

  const subscription = await subscriptionService.renewSubscription(subscriptionId);

  res.status(200).json({ ok: true, subscription });
});
