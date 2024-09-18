const paypal = require('paypal-rest-sdk');
const { User, SubscriptionType } = require('../models');
const moment = require('moment');

// PayPal environment setup
const environment = new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
const client = new paypal.core.PayPalHttpClient(environment);

// Create PayPal order
const createPaypalOrder = async (req, res) => {
  const {amount, description, userID, SubscriptionTypeID, currency } = req.body;

  try {
    const subscription = await SubscriptionType.findByPk(SubscriptionTypeID);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Ensure subscription.Price is a number before using .toFixed
    const price = parseFloat(subscription.Price);
    if (isNaN(price)) {
      return res.status(400).json({ message: 'Invalid price format for subscription' });
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: price.toFixed(2), // Convert price to string format
          },
          description: `Subscription for ${subscription.Name}`,
        },
      ],
      application_context: {
        brand_name: 'Loki VPN',
        user_action: 'PAY_NOW',
        return_url: 'https://api.lokivpn.com/api/paypal/return',  // Replace with your return URL
        cancel_url: 'https://api.lokivpn.com/api/paypal/cancel',  // Replace with your cancel URL
      },
    });

    const order = await client.execute(request);
    res.json({ orderId: order.result.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


// PayPal payment callback (webhook)
const paymentCallback = async (req, res) => {
  const body = req.body;

  try {
    const { event_type, resource } = body;

    if (event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const orderId = resource.id;

      // Find user and subscription based on metadata
      const user = await User.findByPk(resource.purchase_units[0].custom_id);
      const subscription = await SubscriptionType.findByPk(resource.purchase_units[0].reference_id);

      if (!user || !subscription) {
        return res.status(404).json({ error: 'User or subscription not found' });
      }

      const startDate = new Date();
      const duration = subscription.Duration;
      const endDate = moment(startDate).add(duration, 'days').toDate();

      // Update user subscription details
      await user.update({
        SubscriptionTypeID: subscription.ID,
        SubscriptionStartDate: startDate,
        SubscriptionEndDate: endDate,
      });

      console.log(`User ${user.id} subscription updated to ${subscription.ID} from ${startDate} to ${endDate}`);
      res.json({ message: 'Subscription updated successfully' });
    } else {
      res.status(400).json({ message: 'Unhandled event type' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Get a PayPal order
const getOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const request = new paypal.orders.OrdersGetRequest(orderId);
    const order = await client.execute(request);
    res.json(order.result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// List PayPal orders (Optional - PayPal API doesn't directly support list all)
const listOrders = async (req, res) => {
  try {
    // PayPal does not have an API method for listing all orders
    res.status(200).json({ message: "PayPal does not support listing all orders directly." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get PayPal order status by order ID
const orderStatus = async (req, res) => {
  const { orderId } = req.params;

  try {
    const request = new paypal.orders.OrdersGetRequest(orderId);
    const order = await client.execute(request);
    res.json({ status: order.result.status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Retrieve transactions for an order by order ID
const getOrderTransactions = async (req, res) => {
  const { orderId } = req.params;

  try {
    const request = new paypal.orders.OrdersGetRequest(orderId);
    const transactions = await client.execute(request);
    res.json(transactions.result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get PayPal publishable key (client ID)
const getPublishableKey = (req, res) => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secretId = process.env.PAYPAL_CLIENT_SECRET;
  const sandbox = process.env.PAYPAL_SANDBOX === 'true';

  res.json({
    clientId,
    secretId,
    sandbox,
  });
};


const returnURL = (req, res) => {

  const { token } = req.query;

  if (!token) {
    return res.status(400).send('Missing payment token');
  }

  try {
    const captureRequest = new paypal.orders.OrdersCaptureRequest(token);
    const  captureResponse =  client.execute(captureRequest);

    if (captureResponse.result.status === 'COMPLETED') {
      res.send('Payment successful! Thank you for your purchase.');
    } else {
      res.status(500).send('Payment capture failed');
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).send('Error processing payment');
  }
}

const cancelURL = (req, res) => {
  res.send('Payment canceled. Please try again or contact support.');

}

module.exports = {
  createPaypalOrder,
  paymentCallback,
  getOrder,
  listOrders,
  orderStatus,
  getOrderTransactions,
  getPublishableKey,
  returnURL,
  cancelURL
};
