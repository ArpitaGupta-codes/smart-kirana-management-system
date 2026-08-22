const express = require('express');
const cors = require('cors');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const { testConnection } = require('./config/db');
const { protect } = require('./middleware/authMiddleware');

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const customerRoutes = require('./routes/customerRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const saleRoutes = require('./routes/saleRoutes');
const creditRoutes = require('./routes/creditRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Smart Kirana Management System - Backend is running!');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Auth routes - login/register ke liye login ki zaroorat nahi (obviously)
app.use('/api/auth', authRoutes);

// In sab routes ke liye ab login zaroori hai - "protect" middleware pehle chalega
app.use('/api/categories', protect, categoryRoutes);
app.use('/api/products', protect, productRoutes);
app.use('/api/suppliers', protect, supplierRoutes);
app.use('/api/customers', protect, customerRoutes);
app.use('/api/dashboard', protect, dashboardRoutes);
app.use('/api/purchases', protect, purchaseRoutes);
app.use('/api/sales', protect, saleRoutes);
app.use('/api/credits', protect, creditRoutes);
app.use('/api/expenses', protect, expenseRoutes);

app.listen(PORT, async () => {
  console.log(`Server chal raha hai: http://localhost:${PORT}`);
  console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
  await testConnection();
});