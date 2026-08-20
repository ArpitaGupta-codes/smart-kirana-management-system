const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Customer = require('./Customer');

const Sale = sequelize.define('Sale', {
  SaleID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  CustomerID: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  SaleDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  TotalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  PaymentMethod: {
    type: DataTypes.ENUM('Cash', 'UPI', 'Credit'),
    allowNull: false,
    defaultValue: 'Cash',
  },
}, {
  tableName: 'sales',
  timestamps: false,
});

Sale.belongsTo(Customer, { foreignKey: 'CustomerID' });
Customer.hasMany(Sale, { foreignKey: 'CustomerID' });

module.exports = Sale;