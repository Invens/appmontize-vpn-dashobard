const stripe = require('../config/stripe');
const { User, SubscriptionType } = require('../models');



const createOrder = async (req, res) => {
  const { amount, currency, description, userID, SubscriptionTypeID } = req.body;

  console.log(`Creating order with SubscriptionTypeID ${SubscriptionTypeID}...`);
  try {
    const subscription = await SubscriptionType.findByPk(SubscriptionTypeID);
    if (!subscription) {
      console.log(`Subscription not found for ID ${SubscriptionTypeID}`);
      return res.stdatus(404).json({ message: 'Subscription not found' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: subscription.Price * 100, // Amount should be in cents
      currency: 'usd',
      description: `Subscription for ${subscription.Name}`,
      metadata: { SubscriptionTypeID, userID },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
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

// Handle Stripe webhooks to confirm payment events
const paymentCallback = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Log the raw body for debugging
    console.log('Raw body received:', req.body.toString('utf8'));

    // Verify the webhook signature and extract the event
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

    // Log the event for debugging
    console.log('Verified event:', event);
  } catch (err) {
    // Log the error for debugging
    console.error(`⚠️ Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Process the event
  try {
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const userID = paymentIntent.metadata.userID;
      const subscriptionTypeID = paymentIntent.metadata.SubscriptionTypeID;

      console.log(`Processing payment for user ID ${userID} with subscription type ${subscriptionTypeID}`);

      const user = await User.findByPk(userID);
      if (!user) {
        console.error(`User not found with ID ${userID}`);
        return res.status(404).json({ error: 'User not found' });
      }

      await user.update({ SubscriptionTypeID: subscriptionTypeID });
      console.log(`User ${userID} subscription updated to ${subscriptionTypeID}`);
      return res.json({ message: 'Subscription updated successfully' });
    } else {
      console.log(`Unhandled event type ${event.type}`);
      return res.json({ received: true });
    }
  } catch (error) {
    console.error('Error processing event:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
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
