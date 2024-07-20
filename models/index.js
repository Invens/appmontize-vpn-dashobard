// models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const admin = require('./admin');
const sequelize = new Sequelize(require('../config/config.json').development);

// Import models
const SubscriptionType = require('./subscriptionType')(sequelize, DataTypes);
const User = require('./user')(sequelize, DataTypes);
const GuestUser = require('./guestuser')(sequelize, DataTypes);
const Server = require('./server')(sequelize, DataTypes);
const Admin = require('./admin')(sequelize, DataTypes);
const Notification = require('./notification')(sequelize, DataTypes);
const NotificationHistory = require('./notificationHistory')(sequelize, DataTypes);
const recentlyConnectedServer = require('./recentlyConnectedServer') (sequelize, DataTypes);// Define associations
User.associate({ SubscriptionType });
NotificationHistory.associate({ Notification, User });

// Export models and sequelize instance
module.exports = {
  sequelize,
  Admin,
  SubscriptionType,
  User,
  GuestUser,
  Server,
  Notification,
  NotificationHistory,
  recentlyConnectedServer
};
