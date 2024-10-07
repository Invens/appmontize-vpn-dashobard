const paypal = require('paypal-rest-sdk');
const { User, SubscriptionType } = require('../models');
const moment = require('moment');

// Configure PayPal with your credentials
paypal.configure({
  mode: 'sandbox', // Change to 'live' for production
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET
});

// Create PayPal payment
const createPaypalPayment = async (req, res) => {
  const { amount, description, userID, SubscriptionTypeID, currency } = req.body;

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

    const create_payment_json = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal'
      },
      redirect_urls: {
        return_url: 'https://api.lokivpn.com/api/paypal/return',
        cancel_url: 'https://api.lokivpn.com/api/paypal/cancel'
      },
      transactions: [{
        item_list: {
          items: [{
            name: `Subscription for ${subscription.Name}`,
            sku: subscription.ID,
            price: price.toFixed(2),
            currency: currency || 'USD',
            quantity: 1
          }]
        },
        amount: {
          currency: currency || 'USD',
          total: price.toFixed(2)
        },
        description: description || `Subscription for ${subscription.Name}`
      }]
    };

    paypal.payment.create(create_payment_json, (error, payment) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
      } else {
        // Find the approval URL
        const approval_url = payment.links.find(link => link.rel === 'approval_url').href;
        res.json({ approval_url });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// PayPal payment callback (webhook)
const paymentCallback = async (req, res) => {
  const { subscriptionID, userId, description, amount, paymentId } = req.body;

  try {
    // Call PayPal API to verify the payment
    paypal.payment.get(paymentId, async (error, payment) => {
      if (error) {
        console.error('Error verifying payment with PayPal:', error.response);
        return res.status(500).json({ error: 'Error verifying payment with PayPal' });
      } else {
        // Check if the payment was approved
        if (payment.state === 'approved') {
          // Retrieve user and subscription information
          const user = await User.findByPk(userId);
          const subscription = await SubscriptionType.findByPk(subscriptionID);

          if (!user || !subscription) {
            return res.status(404).json({ error: 'User or subscription not found' });
          }

          // Calculate subscription start and end dates
          const startDate = new Date();
          const duration = subscription.Duration; // Assuming duration is in days
          const endDate = moment(startDate).add(duration, 'days').toDate();

          // Update user subscription details
          await user.update({
            SubscriptionTypeID: subscription.ID,
            SubscriptionStartDate: startDate,
            SubscriptionEndDate: endDate,
          });

          console.log(`User ${user.id} subscription updated to ${subscription.ID} from ${startDate} to ${endDate}`);

          // Respond with success
          return res.status(200).json({ message: 'Payment successful! Subscription updated.' });
        } else {
          // Payment was not approved
          return res.status(400).json({ message: 'Payment not approved' });
        }
      }
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    return res.status(500).json({ error: 'Error processing payment' });
  }
};


// Get PayPal payment details
const getPayment = async (req, res) => {
  const { paymentId } = req.params;

  try {
    paypal.payment.get(paymentId, (error, payment) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
      } else {
        res.json(payment);
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Retrieve transactions for a payment
const getPaymentTransactions = async (req, res) => {
  const { paymentId } = req.params;

  try {
    paypal.payment.get(paymentId, (error, payment) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
      } else {
        res.json(payment.transactions);
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get PayPal publishable key
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

// Handle return URL
const returnURL = (req, res) => {
  const { paymentId, PayerID } = req.query;

  if (!paymentId || !PayerID) {
    return res.status(400).send('Missing payment information');
  }

  res.redirect(`/payment-success?paymentId=${paymentId}&PayerID=${PayerID}`);
};

// Handle cancel URL
const cancelURL = (req, res) => {
  res.send('Payment canceled. Please try again or contact support.');
};

module.exports = {
  createPaypalPayment,
  paymentCallback,
  getPayment,
  getPaymentTransactions,
  getPublishableKey,
  returnURL,
  cancelURL
};
