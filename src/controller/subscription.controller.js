const Subscription = require('../models/Subscription.model');
const User = require('../models/user.model');
const Plan = require('../models/Plan.model');
const { validateRequired, validateObjectId, handleValidationError, sendValidationError, sendError } = require('../utils/validation');

/**
 * @desc    Create a new subscription for a user
 * @route   POST /api/subscriptions
 * @access  Private
 */
exports.createSubscription = async (req, res) => {
  try {
    const { userId, planId } = req.body;

    // Validate required fields
    if (sendValidationError(res, validateRequired({ userId, planId }, ['userId', 'planId']))) return;
    
    // Validate ObjectId formats
    if (sendValidationError(res, validateObjectId(userId, 'User ID'))) return;
    if (sendValidationError(res, validateObjectId(planId, 'Plan ID'))) return;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) return sendError(res, 404, "User not found");

    // Check if plan exists and is active
    const plan = await Plan.findById(planId);
    if (!plan) return sendError(res, 404, "Plan not found");
    if (!plan.isActive) return sendError(res, 400, "This plan is not available");

    // Check existing active subscription
    const existingSubscription = await Subscription.findOne({
      user: userId,
      plan: planId,
      status: "active"
    });

    if (existingSubscription) {
      return sendError(res, 409, "User already has an active subscription for this plan");
    }

    // Calculate end date
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    // Create subscription
    const subscription = await Subscription.create({
      user: userId,
      plan: planId,
      startDate,
      endDate,
      status: "active"
    });

    const populatedSubscription = await subscription.populate([
      { path: 'user', select: 'name email' },
      { path: 'plan', select: 'name price duration' }
    ]);

    return res.status(201).json({
      ok: true,
      message: "Subscription created successfully",
      subscription: populatedSubscription
    });

  } catch (err) {
    const error = handleValidationError(err);
    if (error) return sendError(res, error.status, error.message);
    return sendError(res, 500, err.message);
  }
};

/**
 * @desc    Get all subscriptions with filters
 * @route   GET /api/subscriptions
 * @access  Private (Admin)
 */
exports.getAllSubscriptions = async (req, res) => {
  try {
    const { status, userId } = req.query;
    const filter = {};

    if (status) filter.status = status;
    
    if (userId) {
      if (sendValidationError(res, validateObjectId(userId, 'User ID'))) return;
      filter.user = userId;
    }

    const subscriptions = await Subscription.find(filter)
      .populate('user', 'name email')
      .populate('plan', 'name price duration')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      ok: true,
      count: subscriptions.length,
      subscriptions
    });

  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

/**
 * @desc    Get subscription by ID
 * @route   GET /api/subscriptions/:subscriptionId
 * @access  Private
 */
exports.getSubscriptionById = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    if (sendValidationError(res, validateObjectId(subscriptionId, 'Subscription ID'))) return;

    const subscription = await Subscription.findById(subscriptionId)
      .populate('user', 'name email')
      .populate('plan', 'name price duration');

    if (!subscription) return sendError(res, 404, "Subscription not found");

    return res.status(200).json({ ok: true, subscription });

  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

/**
 * @desc    Cancel a subscription
 * @route   PUT /api/subscriptions/:subscriptionId/cancel
 * @access  Private
 */
exports.cancelSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    if (sendValidationError(res, validateObjectId(subscriptionId, 'Subscription ID'))) return;

    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) return sendError(res, 404, "Subscription not found");
    if (subscription.status === "cancel") return sendError(res, 400, "Subscription is already cancelled");

    subscription.status = "cancel";
    await subscription.save();

    return res.status(200).json({
      ok: true,
      message: "Subscription cancelled successfully",
      subscription
    });

  } catch (err) {
    const error = handleValidationError(err);
    if (error) return sendError(res, error.status, error.message);
    return sendError(res, 500, err.message);
  }
};
