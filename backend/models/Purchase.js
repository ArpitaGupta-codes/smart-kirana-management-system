const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Supplier = require('./Supplier');

const Purchase = sequelize.define('Purchase', {
  PurchaseID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  SupplierID: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  PurchaseDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  TotalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'purchases',
  timestamps: false,
});

Purchase.belongsTo(Supplier, { foreignKey: 'SupplierID' });
Supplier.hasMany(Purchase, { foreignKey: 'SupplierID' });

module.exports = Purchase;