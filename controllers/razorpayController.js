// controllers/razorpController.js
const crypto = require('crypto');
const Razorpay = require('razorpay');

const razorpayInstance = new Razorpay({
    key_id: 'rzp_test_VSc9ysK0y3XsIN', // Your Razorpay Key ID
    key_secret: 'ubhLXIzR45RUE9lOVEOPvhZP' // Your Razorpay Secret
  });
  

const createOrder = async (req, res) => {
    const { amount, currency } = req.body;

    const options = {
      amount: amount * 100, // Razorpay accepts amount in smallest currency unit (e.g., paise for INR)
      currency: currency || 'INR',
      receipt: 'order_receipt_' + Date.now()
    };
  
    try {
      const order = await razorpayInstance.orders.create(options);
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
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
    console.log('Received Webhook:', req.body);
    console.log('Request Headers:', req.headers);
  
    const secret = "dsklfjhdskfhjlakjdfhaskldfhhkjdfhaadfhjsakjlfhkjdfhsa";
  
    const razorpaySignature = req.headers['x-razorpay-signature'];
    if (!razorpaySignature) {
      console.error('Missing Razorpay signature');
      return res.status(400).json({ message: 'Missing Razorpay signature' });
    }
  
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');
  
    console.log('Generated Digest:', digest);
    console.log('Razorpay Signature:', razorpaySignature);
  
    if (digest === razorpaySignature) {
      // Signature matched, process the payment
      const { razorpay_payment_id, razorpay_order_id } = req.body;
  
      // Fetch the payment details from Razorpay to get the payment entity
      razorpayInstance.payments.fetch(razorpay_payment_id).then(payment => {
        const amount = payment.amount / 100; // Amount is in paise, convert to rupees or your currency
  
        // Verify payment amount and status
        if (payment.status === 'captured') {
          // Payment successful, update your database or perform actions here
          console.log(`Payment for order ${razorpay_order_id} of ${amount} successful.`);
          res.status(200).json({ message: 'Payment verified' });
        } else {
          // Payment failed or pending, handle accordingly
          console.log(`Payment for order ${razorpay_order_id} failed.`);
          res.status(400).json({ message: 'Payment failed' });
        }
      }).catch(error => {
        console.error('Error fetching payment details:', error);
        res.status(500).json({ message: 'Error fetching payment details' });
      });
    } else {
      // Invalid signature
      console.error('Invalid Razorpay webhook signature');
      res.status(400).json({ message: 'Invalid signature' });
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
