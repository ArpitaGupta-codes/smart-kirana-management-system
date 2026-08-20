const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Sale = require('./Sale');
const Product = require('./Product');

const SaleItem = sequelize.define('SaleItem', {
  SaleItemID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  SaleID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ProductID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  tableName: 'saleitems',
  timestamps: false,
});

Sale.hasMany(SaleItem, { foreignKey: 'SaleID' });
SaleItem.belongsTo(Sale, { foreignKey: 'SaleID' });

SaleItem.belongsTo(Product, { foreignKey: 'ProductID' });
Product.hasMany(SaleItem, { foreignKey: 'ProductID' });

module.exports = SaleItem;