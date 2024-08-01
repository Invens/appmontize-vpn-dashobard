require('dotenv').config();
const express = require('express');
const cors = require('cors');

const cron = require('node-cron');
const { checkSubscriptions } = require('./subscriptionCheck');


const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const guestUserRoutes = require('./routes/guestUserRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const serverRoutes = require('./routes/serverRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const stripeRoutes = require('./routes/stripeRoutes');
const razorpayRoutes = require('./routes/razorpayRoutes');
const recentlyConnectedServerRoutes = require('./routes/recentlyConnectedServerRoutes');


const app = express();
app.use(cors());  // This will enable CORS for all routes and origins

app.use(bodyParser.urlencoded({extended: false}))

app.use(
  bodyParser.json({
      verify: function(req, res, buf) {
          req.rawBody = buf;
      }
  })
);

// Route to handle Stripe webhooks with raw body
app.use('/api/stripe', stripeRoutes);

app.use(express.json());  // General JSON parsing middleware

// Other routes
app.use('/api/razorpay', razorpayRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/guests', guestUserRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/servers', serverRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/recent-servers', recentlyConnectedServerRoutes);

const PORT = process.env.PORT || 3003;

sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


  // Set up the cron job to check subscriptions daily at midnight
cron.schedule('0 0 * * *', () => {
  console.log('Running subscription check...');
  checkSubscriptions();
});