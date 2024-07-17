// models/user.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    UserID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    SubscriptionTypeID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'subscriptiontypes',
        key: 'SubscriptionTypeID'
      }
    },
    BandwidthUsed: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    OTP: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    OTPExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  
  {
    timestamps: true
  }


  );

  User.associate = models => {
    User.belongsTo(models.SubscriptionType, { foreignKey: 'SubscriptionTypeID' });
  };

  return User;
};
