require('dotenv').config();
const express = require('express');
const cors = require('cors');
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
app.use(express.json());
app.use(express.static('public')); // To serve the HTML file

// Route to handle Stripe webhooks with raw body
app.use('/api/stripe', stripeRoutes);

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
