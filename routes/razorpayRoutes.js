// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/razorpayController');

router.post('/create-order', paymentController.createOrder);
router.get('/order/:orderId', paymentController.getOrder);
router.get('/orders', paymentController.listOrders);
router.get('/order-status/:orderId', paymentController.orderStatus);
router.post('/payment-callback', paymentController.paymentCallback);
router.get('/order-transactions/:orderId', paymentController.getOrderTransactions);

module.exports = router;
