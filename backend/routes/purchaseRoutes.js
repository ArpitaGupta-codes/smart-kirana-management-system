const express = require('express');
const router = express.Router();
const { getAllPurchases, createPurchase } = require('../controllers/purchaseController');

/**
 * @swagger
 * /api/purchases:
 *   get:
 *     summary: Saari purchases laao
 *     responses:
 *       200:
 *         description: Purchases ki list
 */
router.get('/', getAllPurchases);

/**
 * @swagger
 * /api/purchases:
 *   post:
 *     summary: Nayi purchase banao (stock automatically badhega)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               SupplierID:
 *                 type: integer
 *                 example: 1
 *               PurchaseDate:
 *                 type: string
 *                 example: "2026-08-20"
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
 *                       example: 50
 *                     Price:
 *                       type: number
 *                       example: 8
 *     responses:
 *       201:
 *         description: Purchase successfully bani
 */
router.post('/', createPurchase);

module.exports = router;