const express = require('express');
const router = express.Router();
const { protect, bindUserId } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

const {
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  cancelSubscription,
  renewSubscription
} = require('../controllers/subscription.controller');

// Create new subscription
router.post('/', protect, createSubscription);

// Get all subscriptions (ADMIN only)
router.get('/', protect, authorize('ADMIN'), getAllSubscriptions);

// Get subscription by ID
router.get('/:subscriptionId', protect, getSubscriptionById);

// Cancel subscription
router.put('/:subscriptionId/cancel', protect, cancelSubscription);

router.put('/:subscriptionId/renew', protect, renewSubscription);

module.exports = router;
