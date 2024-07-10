// models/notificationHistory.js
module.exports = (sequelize, DataTypes) => {
    const NotificationHistory = sequelize.define('notificationhistory', {
      NotificationHistoryID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      NotificationID: {
        type: DataTypes.INTEGER,
      },
      UserID: {
        type: DataTypes.INTEGER,
      },
      SentAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      Status: {
        type: DataTypes.STRING,
      },
    }, {
      tableName: 'notificationhistory',
      timestamps: false,
    });
  
    NotificationHistory.associate = (models) => {
      NotificationHistory.belongsTo(models.Notification, { foreignKey: 'NotificationID' });
      NotificationHistory.belongsTo(models.User, { foreignKey: 'UserID' });
    };
  
    return NotificationHistory;
  };
  