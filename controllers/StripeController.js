const stripe = require('../config/stripe');
const { User, SubscriptionType } = require('../models');
const moment = require('moment'); // For date manipulation

const createOrder = async (req, res) => {
  const { amount, currency, description, userID, SubscriptionTypeID } = req.body;

  console.log(`Creating order with SubscriptionTypeID ${SubscriptionTypeID} for userID ${userID}...`);
  try {
    const subscription = await SubscriptionType.findByPk(SubscriptionTypeID);
    if (!subscription) {
      console.log(`Subscription not found for ID ${SubscriptionTypeID}`);
      return res.status(404).json({ message: 'Subscription not found' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: subscription.Price * 100, // Amount should be in cents
      currency: 'usd',
      description: `Subscription for ${subscription.Name}`,
      metadata: { SubscriptionTypeID: SubscriptionTypeID, userID: userID }, // Use `userId` as defined
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
const endpointSecret = "whsec_4KTZAR7iLhCa4SE6Ddyu88AHv4LipU6K";

const paymentCallback = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  // Access the raw body directly
  const rawBody = req.rawBody;

  try {
    // Use the raw body from the request
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    console.log('Received Stripe Event:', event);
  } catch (err) {
    console.error(`⚠️ Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const userID = paymentIntent.metadata.userID;
    const subscriptionTypeID = paymentIntent.metadata.SubscriptionTypeID;

    try {
      const user = await User.findByPk(userID);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const subscriptionType = await SubscriptionType.findByPk(subscriptionTypeID);
      if (!subscriptionType) {
        return res.status(404).json({ error: 'Subscription type not found' });
      }

      const startDate = new Date(); // Subscription starts from the payment date
      const duration = subscriptionType.Duration; // Duration is in days, fetched from SubscriptionType table
      const endDate = moment(startDate).add(duration, 'days').toDate(); // Calculate end date

      // Update user's subscription details
      await user.update({
        SubscriptionTypeID: subscriptionTypeID,
        SubscriptionStartDate: startDate,
        SubscriptionEndDate: endDate
      });
      console.log(`User ${userID} subscription updated to ${subscriptionTypeID} from ${startDate} to ${endDate}`);
      res.json({ message: 'Subscription updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating subscription' });
    }
  } else {
    console.log(`Unhandled event type ${event.type}`);
    res.json({ received: true });
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
