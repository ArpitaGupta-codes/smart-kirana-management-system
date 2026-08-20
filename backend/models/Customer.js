const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Customer = sequelize.define('Customer', {
  CustomerID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  Phone: {
    type: DataTypes.STRING(15),
  },
  Address: {
    type: DataTypes.STRING(255),
  },
}, {
  tableName: 'customers',
  timestamps: false,
});

module.exports = Customer;