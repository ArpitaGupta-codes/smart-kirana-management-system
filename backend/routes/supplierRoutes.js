const express = require('express');
const router = express.Router();
const {
  getAllSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require('../controllers/supplierController');

/**
 * @swagger
 * /api/suppliers:
 *   get:
 *     summary: Saare suppliers laao
 *     responses:
 *       200:
 *         description: Suppliers ki list
 */
router.get('/', getAllSuppliers);

/**
 * @swagger
 * /api/suppliers:
 *   post:
 *     summary: Naya supplier banao
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *                 example: ABC Distributors
 *               Phone:
 *                 type: string
 *                 example: 9876543210
 *               Address:
 *                 type: string
 *                 example: Main Market, Patna
 *     responses:
 *       201:
 *         description: Supplier successfully bana
 */
router.post('/', createSupplier);

/**
 * @swagger
 * /api/suppliers/{id}:
 *   put:
 *     summary: Supplier update karo
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
 *         description: Supplier update ho gaya
 */
router.put('/:id', updateSupplier);

/**
 * @swagger
 * /api/suppliers/{id}:
 *   delete:
 *     summary: Supplier delete karo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Supplier delete ho gaya
 */
router.delete('/:id', deleteSupplier);

module.exports = router;