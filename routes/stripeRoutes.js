const express = require('express');
const bodyParser = require('body-parser');
const {
  createOrder,
  getOrder,
  listOrders,
  orderStatus,
  getOrderTransactions,
  paymentCallback,
  getPublishableKey,
} = require('../controllers/StripeController');

const router = express.Router();

// Ensure raw body for webhook
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), paymentCallback);

// Other routes
router.post('/create-order', createOrder);
router.get('/publishable-key', getPublishableKey);
router.get('/orders/:orderId', getOrder);
router.get('/orders', listOrders);
router.get('/orders/:orderId/status', orderStatus);
router.get('/orders/:orderId/transactions', getOrderTransactions);

module.exports = router;
