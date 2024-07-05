// models/admin.js

module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define('Admin', {
      AdminID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      Name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      Password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      tableName: 'Admin',
      timestamps: true,
    });
  
    return Admin;
  };
  