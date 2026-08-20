const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Customer = require('./Customer');
const Sale = require('./Sale');

const CustomerCredit = sequelize.define('CustomerCredit', {
  CreditID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  CustomerID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  SaleID: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  Amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  Status: {
    type: DataTypes.ENUM('Pending', 'Paid', 'Partial'),
    defaultValue: 'Pending',
  },
}, {
  tableName: 'customercredits',
  timestamps: false,
});

CustomerCredit.belongsTo(Customer, { foreignKey: 'CustomerID' });
Customer.hasMany(CustomerCredit, { foreignKey: 'CustomerID' });

CustomerCredit.belongsTo(Sale, { foreignKey: 'SaleID' });

module.exports = CustomerCredit;