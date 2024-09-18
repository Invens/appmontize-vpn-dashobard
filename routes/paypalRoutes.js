const express = require('express');
const bodyParser = require('body-parser');
const {
  createPaypalPayment,
  paymentCallback,
  getPayment,
  getPaymentTransactions,
  getPublishableKey,
  returnURL,
  cancelURL
} = require('../controllers/PayPalController');

const router = express.Router();

// Handle PayPal webhooks
router.post('/paypal-webhook', bodyParser.json(), paymentCallback);

// PayPal order routes
router.post('/create-paypal-order', createPaypalPayment);
router.get('/paypal/orders/:orderId', getPayment);
router.get('/paypal/orders', getPaymentTransactions);
// router.get('/paypal/orders/:orderId/status', orderStatus);
// router.get('/paypal/orders/:orderId/transactions', getOrderTransactions);
router.get('/publishable-key', getPublishableKey);
router.get('/return', returnURL);
router.get('/cancel',cancelURL);

module.exports = router;
