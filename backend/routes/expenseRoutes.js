const express = require('express');
const router = express.Router();
const { getAllExpenses, createExpense, deleteExpense } = require('../controllers/expenseController');

/**
 * @swagger
 * /api/expenses:
 *   get:
 *     summary: Saare expenses laao
 *     responses:
 *       200:
 *         description: Expenses ki list
 */
router.get('/', getAllExpenses);

/**
 * @swagger
 * /api/expenses:
 *   post:
 *     summary: Naya expense banao
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Category:
 *                 type: string
 *                 example: Electricity
 *               Amount:
 *                 type: number
 *                 example: 1500
 *               ExpenseDate:
 *                 type: string
 *                 example: "2026-08-21"
 *               Description:
 *                 type: string
 *                 example: Monthly electricity bill
 *     responses:
 *       201:
 *         description: Expense successfully bana
 */
router.post('/', createExpense);

/**
 * @swagger
 * /api/expenses/{id}:
 *   delete:
 *     summary: Expense delete karo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Expense delete ho gaya
 */
router.delete('/:id', deleteExpense);

module.exports = router;