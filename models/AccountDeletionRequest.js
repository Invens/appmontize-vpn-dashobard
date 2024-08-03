module.exports = (sequelize, DataTypes) => {
    const AccountDeletionRequest = sequelize.define('AccountDeletionRequest', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      UserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Reason: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      RequestedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  
    AccountDeletionRequest.associate = (models) => {
      AccountDeletionRequest.belongsTo(models.User, { foreignKey: 'UserID' });
    };
  
    return AccountDeletionRequest;
  };
  