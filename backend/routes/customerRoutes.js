const express = require('express');
const router = express.Router();
const {
  getAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require('../controllers/customerController');

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Saare customers laao
 *     responses:
 *       200:
 *         description: Customers ki list
 */
router.get('/', getAllCustomers);

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Naya customer banao
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *                 example: Ramesh Kumar
 *               Phone:
 *                 type: string
 *                 example: 9123456780
 *               Address:
 *                 type: string
 *                 example: Kankarbagh, Patna
 *     responses:
 *       201:
 *         description: Customer successfully bana
 */
router.post('/', createCustomer);

/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Customer update karo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *               Phone:
 *                 type: string
 *               Address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer update ho gaya
 */
router.put('/:id', updateCustomer);

/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     summary: Customer delete karo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Customer delete ho gaya
 */
router.delete('/:id', deleteCustomer);

module.exports = router;