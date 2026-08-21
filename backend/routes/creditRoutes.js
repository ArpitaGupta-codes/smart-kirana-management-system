const express = require('express');
const router = express.Router();
const { getAllCredits, getCustomerCreditSummary, recordPayment } = require('../controllers/creditController');

/**
 * @swagger
 * /api/credits:
 *   get:
 *     summary: Saare credit records laao
 *     responses:
 *       200:
 *         description: Credits ki list
 */
router.get('/', getAllCredits);

/**
 * @swagger
 * /api/credits/summary:
 *   get:
 *     summary: Customer-wise pending udhaar summary
 *     responses:
 *       200:
 *         description: Summary list
 */
router.get('/summary', getCustomerCreditSummary);

/**
 * @swagger
 * /api/credits/payment:
 *   post:
 *     summary: Payment record karo (udhaar chukana)
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
 *               Amount:
 *                 type: number
 *                 example: 100
 *               PaymentMethod:
 *                 type: string
 *                 example: Cash
 *     responses:
 *       201:
 *         description: Payment successfully record hui
 */
router.post('/payment', recordPayment);

module.exports = router;