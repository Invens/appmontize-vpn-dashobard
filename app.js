const express = require('express');
const cors = require('cors');  // Importing the cors package
const { sequelize, Admin } = require('./models');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const guestUserRoutes = require('./routes/guestUserRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const serverRoutes = require('./routes/serverRoutes');
const AdminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const { authenticateToken } = require('./middleware/authMiddleware');
const razorpayRoutes = require('./routes/razorpayRoutes');
require('dotenv').config();

const app = express();

// Use CORS middleware
app.use(cors());  // This will enable CORS for all routes and origins

app.use(express.json());

app.use('/api/payment', razorpayRoutes);
app.use('/api/admin', AdminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/guests', guestUserRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/servers', serverRoutes);
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 3002;

sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
