const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Supplier = sequelize.define('Supplier', {
  SupplierID: {
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
  tableName: 'suppliers',
  timestamps: false,
});

module.exports = Supplier;