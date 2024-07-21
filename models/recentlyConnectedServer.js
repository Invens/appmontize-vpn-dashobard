module.exports = (sequelize, DataTypes) => {
    const RecentlyConnectedServer = sequelize.define('RecentlyConnectedServer', {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      serverName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      connectionTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      dataUsed: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    }, {
      tableName: 'RecentServers', // Define the table name here
    });
  
    RecentlyConnectedServer.associate = (models) => {
      RecentlyConnectedServer.belongsTo(models.User, { foreignKey: 'UserId' });
    };
  
    return RecentlyConnectedServer;
  };
  