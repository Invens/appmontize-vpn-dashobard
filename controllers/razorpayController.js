// controllers/razorpayController.js
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Your Razorpay Key ID
  key_secret: process.env.RAZORPAY_KEY_SECRET // Your Razorpay Secret
});

const createOrder = async (req, res) => {
  const options = {
    amount: req.body.amount,
    currency: 'INR',
    receipt: 'receipt#1',
    payment_capture: 1
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await razorpayInstance.orders.fetch(req.params.orderId);
    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
};

const listOrders = async (req, res) => {
  try {
    const orders = await razorpayInstance.orders.all();
    res.json(orders);
  } catch (error) {
    res.status(500).send(error);
  }
};

const orderStatus = async (req, res) => {
  try {
    const order = await razorpayInstance.orders.fetch(req.params.orderId);
    res.json(order.status);
  } catch (error) {
    res.status(500).send(error);
  }
};

const paymentCallback = (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

  const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest('hex');

  if (generated_signature === razorpay_signature) {
    res.status(200).send('Payment verified');
  } else {
    res.status(400).send('Invalid signature');
  }
};

const getOrderTransactions = async (req, res) => {
  try {
    const payments = await razorpayInstance.orders.fetchPayments(req.params.orderId);
    res.json(payments);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  createOrder,
  getOrder,
  listOrders,
  orderStatus,
  paymentCallback,
  getOrderTransactions
};
