const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Customer = require('./Customer');

const Payment = sequelize.define('Payment', {
  PaymentID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  CustomerID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  PaymentDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  PaymentMethod: {
    type: DataTypes.ENUM('Cash', 'UPI'),
    defaultValue: 'Cash',
  },
}, {
  tableName: 'payments',
  timestamps: false,
});

Payment.belongsTo(Customer, { foreignKey: 'CustomerID' });
Customer.hasMany(Payment, { foreignKey: 'CustomerID' });

module.exports = Payment;