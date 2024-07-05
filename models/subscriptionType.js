module.exports = (sequelize, DataTypes) => {
    const SubscriptionType = sequelize.define('subscriptiontypes', {
      SubscriptionTypeID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      Name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Description: {
        type: DataTypes.TEXT
      },
      Price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      Duration: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      CreatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      UpdatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      timestamps: false
    });
    return SubscriptionType;
  };
  