const express = require('express');
const bodyParser = require('body-parser');
const { createOrder, getOrder, listOrders, orderStatus, getOrderTransactions, paymentCallback, getPublishableKey } = require('../controllers/StripeController');

const router = express.Router();

router.post('/create-order', createOrder);
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), paymentCallback);  // Ensure raw body for webhook
router.get('/publishable-key', getPublishableKey);

// Other routes
router.get('/orders/:orderId', getOrder);
router.get('/orders', listOrders);
router.get('/orders/:orderId/status', orderStatus);
router.get('/orders/:orderId/transactions', getOrderTransactions);

module.exports = router;
