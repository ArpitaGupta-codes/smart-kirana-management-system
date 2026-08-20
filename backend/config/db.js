// dotenv se .env file ki values load karte hain
require('dotenv').config();

// Sequelize import karte hain
const { Sequelize } = require('sequelize');

// Sequelize instance banate hain - ye humara database connection object hai
const sequelize = new Sequelize(
  process.env.DB_NAME,       // database ka naam
  process.env.DB_USER,       // username (root)
  process.env.DB_PASSWORD,   // password
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',        // hum MySQL use kar rahe hain
    logging: false,          // Sequelize ke technical logs terminal mein nahi dikhenge (clean rahega)
  }
);

// Ye function database connection test karega
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully!');
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
};

// Dusri files mein use karne ke liye export karte hain
module.exports = { sequelize, testConnection };