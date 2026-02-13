const express = require('express');
const router = express.Router();
const { protect, bindUserId } = require('../middlewares/user.middleware');
const { authorize } = require('../middlewares/role.middleware');

const {
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  cancelSubscription
} = require('../controller/subscription.controller');

// Create new subscription
router.post('/', protect, createSubscription);

// Get all subscriptions (admin only)
router.get('/', protect, authorize('admin'), getAllSubscriptions);

// Get subscription by ID
router.get('/:subscriptionId', protect, getSubscriptionById);

// Cancel subscription
router.put('/:subscriptionId/cancel', protect, cancelSubscription);

module.exports = router;
