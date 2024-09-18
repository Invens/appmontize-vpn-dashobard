const express = require('express');
const bodyParser = require('body-parser');
const {
  createPaypalOrder,
  paymentCallback,
  getOrder,
  listOrders,
  orderStatus,
  getOrderTransactions,
  getPublishableKey,
} = require('../controllers/PayPalController');

const router = express.Router();

// Handle PayPal webhooks
router.post('/paypal-webhook', bodyParser.json(), paymentCallback);

// PayPal order routes
router.post('/create-paypal-order', createPaypalOrder);
router.get('/paypal/orders/:orderId', getOrder);
router.get('/paypal/orders', listOrders);
router.get('/paypal/orders/:orderId/status', orderStatus);
router.get('/paypal/orders/:orderId/transactions', getOrderTransactions);
router.get('/paypal/publishable-key', getPublishableKey);

module.exports = router;
