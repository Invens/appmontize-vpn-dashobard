module.exports = (sequelize, DataTypes) => {
    const GuestUser = sequelize.define('guestuser', {
      GuestUserID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      DeviceID: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      Username: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Token: {
        type: DataTypes.STRING,
        unique: true
      },
      BandwidthUsed: {
        type: DataTypes.BIGINT,
        defaultValue: 0
      },
      CreatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      timestamps: false
    });
    return GuestUser;
  };
  