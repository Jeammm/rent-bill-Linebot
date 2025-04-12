const express = require("express");
const router = express.Router();
const rentingController = require("../controllers/rentingController");

/**
 * @swagger
 * /rentings/{houseId}:
 *   get:
 *     summary: Calculate total rent for a house for a specific month and year
 *     parameters:
 *       - in: path
 *         name: houseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: House ID
 *       - in: query
 *         name: month
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           example: 4
 *         description: Month number (1-12). Defaults to current month.
 *       - in: query
 *         name: year
 *         required: false
 *         schema:
 *           type: integer
 *         description: Full year (e.g., 2024). Defaults to current year.
 *     responses:
 *       200:
 *         description: Total rent info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 house:
 *                   type: string
 *                 rent_price:
 *                   type: number
 *                 month:
 *                   type: integer
 *                 year:
 *                   type: integer
 *                 usage:
 *                   type: object
 *                   properties:
 *                     water:
 *                       type: number
 *                     electricity:
 *                       type: number
 *                 cost:
 *                   type: object
 *                   properties:
 *                     water:
 *                       type: number
 *                     electricity:
 *                       type: number
 *                 total:
 *                   type: number
 */
router.get("/:houseId", rentingController.calculateMonthlyRent);

module.exports = router;
