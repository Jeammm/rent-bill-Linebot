const express = require('express');
const router = express.Router();
const houseController = require('../controllers/houseController');

/**
 * @swagger
 * components:
 *   schemas:
 *     House:
 *       type: object
 *       required:
 *         - name
 *         - rent_price
 *         - is_rented
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID of the house
 *         name:
 *           type: string
 *           description: Name of the house
 *         rent_price:
 *           type: integer
 *           description: Monthly rent price
 *         is_rented:
 *           type: boolean
 *           description: Whether the house is currently rented
 *       example:
 *         id: 1
 *         name: B202
 *         rent_price: 8500
 *         is_rented: false
 */

/**
 * @swagger
 * tags:
 *   name: Houses
 *   description: API for managing houses
 */

/**
 * @swagger
 * /houses:
 *   get:
 *     summary: Get all houses
 *     tags: [Houses]
 *     responses:
 *       200:
 *         description: List of houses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/House'
 */
router.get('/', houseController.getAllHouses);

/**
 * @swagger
 * /houses/{id}:
 *   get:
 *     summary: Get a house by ID
 *     tags: [Houses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: House ID
 *     responses:
 *       200:
 *         description: House found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/House'
 *       404:
 *         description: House not found
 */
router.get('/:id', houseController.getHouseById);

/**
 * @swagger
 * /houses:
 *   post:
 *     summary: Create a new house
 *     tags: [Houses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/House'
 *     responses:
 *       201:
 *         description: House created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/House'
 */
router.post('/', houseController.createHouse);

/**
 * @swagger
 * /houses/{id}:
 *   put:
 *     summary: Update an existing house
 *     tags: [Houses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: House ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/House'
 *     responses:
 *       200:
 *         description: House updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/House'
 *       404:
 *         description: House not found
 */
router.put('/:id', houseController.updateHouse);

/**
 * @swagger
 * /houses/{id}:
 *   delete:
 *     summary: Delete a house
 *     tags: [Houses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: House ID
 *     responses:
 *       200:
 *         description: House deleted successfully
 *       404:
 *         description: House not found
 */
router.delete('/:id', houseController.deleteHouse);

module.exports = router;