// models/server.js
module.exports = (sequelize, DataTypes) => {
    const Server = sequelize.define('Server', {
      ServerID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      CountryName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      CountryFlag: {
        type: DataTypes.STRING,
      },
      IPAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ProtocolType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Port: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Username: {
        type: DataTypes.STRING,
      },
      Password: {
        type: DataTypes.STRING,
      },
      OVPNFile: {
        type: DataTypes.BLOB,
      },
      ServerType: {
        type: DataTypes.ENUM('Free', 'Paid'),
        allowNull: false,
      },
      Status: {
        type: DataTypes.STRING,
      },
    }, {
      tableName: 'server',
      timestamps: true,
    });
  
    return Server;
  };
  