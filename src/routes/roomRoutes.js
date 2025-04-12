
/**
 * @swagger
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       required:
 *         - name
 *         - rent_price
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the room
 *         name:
 *           type: string
 *           description: The name of the room
 *         rent_price:
 *           type: number
 *           description: Monthly rent of the room
 *       example:
 *         id: 1
 *         name: A101
 *         rent_price: 5000
 */

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: Room management API
 */

/**
 * @swagger
 * /rooms:
 *   get:
 *     summary: Get all rooms
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: List of rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 */
const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoomById);
router.post('/', roomController.createRoom);
router.put('/:id', roomController.updateRoom);
router.delete('/:id', roomController.deleteRoom);

module.exports = router;
