const express = require('express');
const { createOrder, getOrder, listOrders, orderStatus, getOrderTransactions, paymentCallback, getPublishableKey } = require('../controllers/StripeController');
const router = express.Router();

router.post('/create-order', createOrder);
router.post('/webhook', express.raw({ type: 'application/json' }), paymentCallback);  // Ensure raw body for webhook
router.get('/publishable-key', getPublishableKey);

// Route to get order details by ID
router.get('/orders/:orderId', getOrder);

// Route to list all orders
router.get('/orders', listOrders);

// Route to get order status by ID
router.get('/orders/:orderId/status', orderStatus);

// Route to get order transactions by ID
router.get('/orders/:orderId/transactions',getOrderTransactions);

module.exports = router;
