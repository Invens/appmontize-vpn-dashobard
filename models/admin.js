// models/admin.js

module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define('admin', {
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
      tableName: 'admin',
      timestamps: true,
    });
  
    return Admin;
  };
  