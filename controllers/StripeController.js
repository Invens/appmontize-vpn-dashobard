const stripe = require('../config/stripe');
const { SubscriptionType } = require('../models');


const createOrder = async (req, res) => {
  const { amount, currency, description, userID, SubscriptionTypeID} = req.body;


  console.log(`Creating order with amount ${amount} ${currency} and description "${description}"...`);
  try {
    const subscription = await SubscriptionType.findByPk(SubscriptionTypeID);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: subscription.Price * 100, // Amount should be in cents
      currency: 'usd',
      description: `Subscription for ${subscription.Name}`,
      metadata: { SubscriptionTypeID, userID: req.user.userID }, // Attach subscriptionId and userID to metadata
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

const paymentCallback = async (req, res) => {
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
      const userID = paymentIntent.metadata.userID;

      // Fetch user and update subscription type
      try {
        const user = await User.findByPk(userID);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        // Determine which subscription type was purchased based on amount or metadata
        let SubscriptionTypeID = 1; // Example: Default to Basic subscription
        // Logic to determine newSubscriptionTypeID based on paymentIntent.amount or other criteria

        const newSubscriptionType = await SubscriptionTypeID.findByPk(SubscriptionTypeID);
        if (!newSubscriptionType) {
          return res.status(404).json({ error: 'Subscription type not found' });
        }

        // Update user's subscription type
        await user.update({ SubscriptionTypeID: SubscriptionTypeID });

        res.json({ message: 'Subscription updated successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating subscription' });
      }
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
