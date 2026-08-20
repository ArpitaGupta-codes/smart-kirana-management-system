const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Saare products laao (category details ke saath)
 *     responses:
 *       200:
 *         description: Products ki list
 */
router.get('/', getAllProducts);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Naya product banao
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CategoryID:
 *                 type: integer
 *                 example: 1
 *               Name:
 *                 type: string
 *                 example: Parle-G Biscuit
 *               Unit:
 *                 type: string
 *                 example: pcs
 *               PurchasePrice:
 *                 type: number
 *                 example: 8
 *               SellingPrice:
 *                 type: number
 *                 example: 10
 *               CurrentStock:
 *                 type: integer
 *                 example: 100
 *               MinStock:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Product successfully bana
 */
router.post('/', createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Product update karo
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
 *               SellingPrice:
 *                 type: number
 *               CurrentStock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product update ho gaya
 */
router.put('/:id', updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Product delete karo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product delete ho gaya
 */
router.delete('/:id', deleteProduct);

module.exports = router;