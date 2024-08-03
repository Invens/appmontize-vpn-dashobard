const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(require('../config/config.json').development);

// Import models
const SubscriptionType = require('./subscriptionType')(sequelize, DataTypes);
const User = require('./user')(sequelize, DataTypes);
const GuestUser = require('./guestuser')(sequelize, DataTypes);
const Server = require('./server')(sequelize, DataTypes);
const Admin = require('./admin')(sequelize, DataTypes);
const Notification = require('./notification')(sequelize, DataTypes);
const NotificationHistory = require('./notificationHistory')(sequelize, DataTypes);
const RecentlyConnectedServer = require('./recentlyConnectedServer')(sequelize, DataTypes);
const AccountDeletionRequest = require('./AccountDeletionRequest')(sequelize, DataTypes);

// Define associations
User.associate = (models) => {
  User.hasMany(models.RecentlyConnectedServer, { foreignKey: 'userId' });
};

NotificationHistory.associate = (models) => {
  NotificationHistory.belongsTo(models.Notification, { foreignKey: 'notificationId' });
  NotificationHistory.belongsTo(models.User, { foreignKey: 'userId' });
};

RecentlyConnectedServer.associate = (models) => {
  RecentlyConnectedServer.belongsTo(models.User, { foreignKey: 'userId' });
};


User.hasMany(AccountDeletionRequest, { foreignKey: 'UserID' });
AccountDeletionRequest.belongsTo(User, { foreignKey: 'UserID' });

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
  RecentlyConnectedServer,
  AccountDeletionRequest
};
