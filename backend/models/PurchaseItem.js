const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Purchase = require('./Purchase');
const Product = require('./Product');

const PurchaseItem = sequelize.define('PurchaseItem', {
  PurchaseItemID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  PurchaseID: {
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
  tableName: 'purchaseitems',
  timestamps: false,
});

// Ek Purchase ke multiple PurchaseItems hote hain
Purchase.hasMany(PurchaseItem, { foreignKey: 'PurchaseID' });
PurchaseItem.belongsTo(Purchase, { foreignKey: 'PurchaseID' });

// Har PurchaseItem ek Product se linked hai
PurchaseItem.belongsTo(Product, { foreignKey: 'ProductID' });
Product.hasMany(PurchaseItem, { foreignKey: 'ProductID' });

module.exports = PurchaseItem;