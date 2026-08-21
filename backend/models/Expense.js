const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Expense = sequelize.define('Expense', {
  ExpenseID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Category: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  ExpenseDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  Description: {
    type: DataTypes.STRING(255),
  },
}, {
  tableName: 'expenses',
  timestamps: false,
});

module.exports = Expense;