const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Category = require('./Category');

const Product = sequelize.define('Product', {
  ProductID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  CategoryID: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  Name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  Unit: {
    type: DataTypes.STRING(20),
    defaultValue: 'pcs',
  },
  PurchasePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  SellingPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  CurrentStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  MinStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5,
  },
  ExpiryDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  IsActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'products',
  timestamps: false,
});

// Relationship define karte hain: Ek Product ek Category se belong karta hai
Product.belongsTo(Category, { foreignKey: 'CategoryID' });

// Reverse relationship: Ek Category ke multiple Products ho sakte hain
Category.hasMany(Product, { foreignKey: 'CategoryID' });

module.exports = Product;