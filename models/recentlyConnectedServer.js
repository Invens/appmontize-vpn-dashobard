// models/recentlyConnectedServer.js

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/config.json');

class RecentlyConnectedServer extends Model {}

RecentlyConnectedServer.init({
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
  sequelize,
  modelName: 'RecentlyConnectedServer',
});

module.exports = RecentlyConnectedServer;
