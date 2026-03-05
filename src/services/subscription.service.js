const Subscription = require('../models/subscription.model');
const User = require('../models/user.model');
const Plan = require('../models/plan.model');

/**
 * Create a subscription entry.
 *
 * Validates user and plan existence and calculates
 * the subscription expiration date based on plan duration.
 *
 * @param {string} userId - User ID
 * @param {string} planId - Plan ID
 *
 * @returns {Promise<Object>} Created subscription document
 */

exports.createSubscription = async (userId, planId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw { status: 404, message: 'User not found', code: 'USER_NOT_FOUND' };
  }

  const plan = await Plan.findById(planId);
  if (!plan) {
    throw { status: 404, message: 'Plan not found', code: 'PLAN_NOT_FOUND' };
  }
  if (!plan.isActive) {
    throw { status: 400, message: 'This plan is not available', code: 'PLAN_UNAVAILABLE' };
  }

  const existingSubscription = await Subscription.findOne({
    user: userId,
    plan: planId,
    status: 'active'
  });

  if (existingSubscription) {
    throw { status: 409, message: 'User already has an active subscription for this plan', code: 'DUPLICATE_SUBSCRIPTION' };
  }

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + plan.duration);

  const subscription = await Subscription.create({
    user: userId,
    plan: planId,
    startDate,
    endDate,
    status: 'active'
  });

  const populatedSubscription = await subscription.populate([
    { path: 'user', select: 'name email' },
    { path: 'plan', select: 'name price duration' }
  ]);

  return populatedSubscription;
};

/**
 * Get all subscriptions with optional filters.
 *
 * Retrieves subscriptions from the database, optionally filtered.
 *
 * @param {Object} filter - Filter criteria
 * @param {string} filter.status - Subscription status
 * @param {string} filter.user - User ID
 *
 * @returns {Promise<Object[]>} Array of subscription documents
 */
exports.getAllSubscriptions = async (filter = {}) => {
  const subscriptions = await Subscription.find(filter)
    .populate('user', 'name email')
    .populate('plan', 'name price duration')
    .sort({ createdAt: -1 });

  return subscriptions;
};

/**
 * Get a single subscription by ID.
 *
 * Retrieves a subscription document by its ID with populated user and plan.
 *
 * @param {string} subscriptionId - Subscription ID
 *
 * @returns {Promise<Object>} Subscription document
 *
 * @throws {Error} If subscription not found
 */
exports.getSubscriptionById = async (subscriptionId) => {
  const subscription = await Subscription.findById(subscriptionId)
    .populate('user', 'name email')
    .populate('plan', 'name price duration');

  if (!subscription) {
    throw { status: 404, message: 'Subscription not found', code: 'SUBSCRIPTION_NOT_FOUND' };
  }

  return subscription;
};

/**
 * Cancel an existing subscription.
 *
 * Changes the subscription status from active
 * to cancelled without deleting the record.
 *
 * @param {string} subscriptionId - Subscription ID
 *
 * @returns {Promise<Object>} Updated subscription document
 */

exports.cancelSubscription = async (subscriptionId) => {
  const subscription = await Subscription.findById(subscriptionId);

  if (!subscription) {
    throw { status: 404, message: 'Subscription not found', code: 'SUBSCRIPTION_NOT_FOUND' };
  }
  if (subscription.status === 'cancelled') {
    throw { status: 400, message: 'Subscription is already cancelled', code: 'ALREADY_CANCELLED' };
  }

  subscription.status = 'cancelled';
  await subscription.save();

  return subscription;
};

/**
 * Renew an active subscription.
 *
 * Extends the end date of an active subscription by adding the plan's duration.
 *
 * @param {string} subscriptionId - Subscription ID
 *
 * @returns {Promise<Object>} Updated subscription document
 *
 * @throws {Error} If subscription not found or not active
 */
exports.renewSubscription = async (subscriptionId) => {
  const subscription = await Subscription.findById(subscriptionId);

  if (!subscription) {
    throw { status: 404, message: 'Subscription not found', code: 'SUBSCRIPTION_NOT_FOUND' };
  }
  if (subscription.status !== 'active') {
    throw { status: 400, message: 'Only active subscriptions can be renewed', code: ' INVALID_STATUS' };
  }

  const plan = await Plan.findById(subscription.plan);

  subscription.endDate.setDate(subscription.endDate.getDate() + plan.duration);
  await subscription.save();

  return subscription;
};