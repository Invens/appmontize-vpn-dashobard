// models/notification.js
module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define('Notification', {
      NotificationID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      Title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Banner: {
        type: DataTypes.STRING,
      },
      Message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      TargetAudience: {
        type: DataTypes.ENUM('All', 'Subscribed', 'Non-Subscribed', 'Custom'),
        allowNull: false,
      },
    }, {
      tableName: 'Notification',
      timestamps: true,
    });
  
    return Notification;
  };
  