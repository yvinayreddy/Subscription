const express = require('express');
const router = express.Router();

const {
  subscribing: createSubscription,
  renewal: renewSubscription,
  unsubscribing: cancelSubscription,
} = require('../controller/subscription.controller');

router.post('/', createSubscription);
router.patch('/:subscriptionId/renew', renewSubscription);
router.delete('/:subscriptionId', cancelSubscription);

module.exports = router;
