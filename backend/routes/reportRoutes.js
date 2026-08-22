const express = require('express');
const router = express.Router();
const {
  getSalesReport,
  getPurchaseReport,
  getExpenseReport,
  getStockReport,
} = require('../controllers/reportController');

/**
 * @swagger
 * /api/reports/sales:
 *   get:
 *     summary: Sales report (date range ke saath)
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sales report data
 */
router.get('/sales', getSalesReport);

/**
 * @swagger
 * /api/reports/purchases:
 *   get:
 *     summary: Purchase report (date range ke saath)
 *     responses:
 *       200:
 *         description: Purchase report data
 */
router.get('/purchases', getPurchaseReport);

/**
 * @swagger
 * /api/reports/expenses:
 *   get:
 *     summary: Expense report (date range ke saath)
 *     responses:
 *       200:
 *         description: Expense report data
 */
router.get('/expenses', getExpenseReport);

/**
 * @swagger
 * /api/reports/stock:
 *   get:
 *     summary: Current stock report
 *     responses:
 *       200:
 *         description: Stock report data
 */
router.get('/stock', getStockReport);

module.exports = router;