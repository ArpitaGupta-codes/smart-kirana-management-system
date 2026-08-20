const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Saari categories laao
 *     responses:
 *       200:
 *         description: Categories ki list
 */
router.get('/', getAllCategories);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Nayi category banao
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *                 example: Biscuits
 *     responses:
 *       201:
 *         description: Category successfully ban gayi
 */
router.post('/', createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Category update karo
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
 *     responses:
 *       200:
 *         description: Category update ho gayi
 */
router.put('/:id', updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Category delete karo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category delete ho gayi
 */
router.delete('/:id', deleteCategory);

module.exports = router;