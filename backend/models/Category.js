// Sequelize se DataTypes import karte hain (data ka type define karne ke liye)
const { DataTypes } = require('sequelize');

// Humara database connection import karte hain
const { sequelize } = require('../config/db');

// Category model define karte hain
const Category = sequelize.define('Category', {
  CategoryID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  tableName: 'categories',   // MySQL mein table ka actual naam (lowercase)
  timestamps: false,          // hum khud CreatedAt manage kar rahe hain, Sequelize ke automatic timestamps nahi chahiye
});

module.exports = Category;