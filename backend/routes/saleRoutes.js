const express = require('express');
const router = express.Router();
const { getAllSales, createSale } = require('../controllers/saleController');

/**
 * @swagger
 * /api/sales:
 *   get:
 *     summary: Saari sales laao
 *     responses:
 *       200:
 *         description: Sales ki list
 */
router.get('/', getAllSales);

/**
 * @swagger
 * /api/sales:
 *   post:
 *     summary: Nayi sale banao (stock ghategga, agar Credit hai toh udhaar bhi banega)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CustomerID:
 *                 type: integer
 *                 example: 1
 *               PaymentMethod:
 *                 type: string
 *                 example: Cash
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     ProductID:
 *                       type: integer
 *                       example: 1
 *                     Quantity:
 *                       type: integer
 *                       example: 5
 *                     Price:
 *                       type: number
 *                       example: 10
 *     responses:
 *       201:
 *         description: Sale successfully bani
 */
router.post('/', createSale);

module.exports = router;