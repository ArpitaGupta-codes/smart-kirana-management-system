const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  UserID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  PasswordHash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Role: {
    type: DataTypes.ENUM('Admin', 'Staff'),
    defaultValue: 'Staff',
  },
}, {
  tableName: 'users',
  timestamps: false,
});

module.exports = User;