const swaggerJsdoc = require('swagger-jsdoc');

// Swagger ki basic settings
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart Kirana Management System API',
      version: '1.0.0',
      description: 'API documentation for Smart Kirana Management System',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  // Ye batata hai ki Swagger kaunsi files mein documentation comments dhoonde
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;