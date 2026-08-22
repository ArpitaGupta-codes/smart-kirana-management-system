const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Naya user register karo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Username:
 *                 type: string
 *                 example: admin
 *               Password:
 *                 type: string
 *                 example: admin123
 *               Role:
 *                 type: string
 *                 example: Admin
 *     responses:
 *       201:
 *         description: User register hua
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login karo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Username:
 *                 type: string
 *                 example: admin
 *               Password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login successful, token milega
 */
router.post('/login', login);

module.exports = router;