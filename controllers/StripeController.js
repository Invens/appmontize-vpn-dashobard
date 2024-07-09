const stripe = require('../config/stripe');

const createOrder = async (req, res) => {
  const { amount, currency, description } = req.body;
  console.log(`Creating order with amount ${amount} ${currency} and description "${description}"...`);
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      description,
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await stripe.paymentIntents.retrieve(orderId);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// List all orders
const listOrders = async (req, res) => {
  try {
    const orders = await stripe.paymentIntents.list({ limit: 10 }); // Adjust limit as needed
    res.json(orders.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get order status by order ID
const orderStatus = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await stripe.paymentIntents.retrieve(orderId);
    res.json({ status: order.status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Retrieve transactions for an order by order ID
const getOrderTransactions = async (req, res) => {
  const { orderId } = req.params;

  try {
    const transactions = await stripe.paymentIntents.listCharges(orderId);
    res.json(transactions.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const paymentCallback = (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Log the event received
  console.log('Received Stripe Event:', event);

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      // Fulfill the purchase, e.g. update the database
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

const getPublishableKey = (req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
};

module.exports = {
  createOrder,
  paymentCallback,
  getOrder,
  listOrders,
  orderStatus,
  getOrderTransactions,
  getPublishableKey,
};
