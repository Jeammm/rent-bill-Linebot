const express = require("express");
const router = express.Router();
const meterController = require("../controllers/meterRecordController");

/**
 * @swagger
 * components:
 *   schemas:
 *     MeterRecord:
 *       type: object
 *       required:
 *         - value
 *         - type
 *         - house_id
 *         - month
 *         - year
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID of the meter record
 *         value:
 *           type: integer
 *           description: Meter reading value
 *         type:
 *           type: string
 *           enum: [WATER, ELECTRICITY]
 *           description: Type of meter
 *         house_id:
 *           type: integer
 *           description: ID of the related house
 *         month:
 *           type: integer
 *           description: Month of the meter reading (1-12)
 *         year:
 *           type: integer
 *           description: Year of the meter reading
 *       example:
 *         id: 1
 *         value: 320
 *         type: WATER
 *         house_id: 1
 *         month: 4
 *         year: 2025
 */

/**
 * @swagger
 * tags:
 *   name: Meter Records
 *   description: API for managing water and electricity meter readings
 */

/**
 * @swagger
 * /meter-records:
 *   get:
 *     summary: Get all meter records
 *     tags: [Meter Records]
 *     responses:
 *       200:
 *         description: List of meter records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MeterRecord'
 */
router.get("/", meterController.getAllMeterRecords);

/**
 * @swagger
 * /meter-records/{id}:
 *   get:
 *     summary: Get a meter record by ID
 *     tags: [Meter Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Meter record ID
 *     responses:
 *       200:
 *         description: Meter record found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MeterRecord'
 *       404:
 *         description: Meter record not found
 */
router.get("/:id", meterController.getMeterRecordById);

/**
 * @swagger
 * /meter-records/house/{id}:
 *   get:
 *     summary: Get meter records by house ID
 *     tags: [Meter Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: House ID
 *       - in: query
 *         name: month
 *         required: false
 *         schema:
 *           type: integer
 *         description: Month of the meter record (1-12)
 *       - in: query
 *         name: year
 *         required: false
 *         schema:
 *           type: integer
 *         description: Year of the meter record
 *     responses:
 *       200:
 *         description: Meter record(s) for the house
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MeterRecord'
 *       404:
 *         description: Meter record not found
 */
router.get("/house/:id", meterController.getMeterRecordByHouseId);

/**
 * @swagger
 * /meter-records:
 *   post:
 *     summary: Create a new meter record
 *     tags: [Meter Records]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MeterRecord'
 *     responses:
 *       201:
 *         description: Meter record created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MeterRecord'
 *       404:
 *         description: House not found
 */
router.post("/", meterController.createMeterRecord);

/**
 * @swagger
 * /meter-records/{id}:
 *   put:
 *     summary: Update a meter record
 *     tags: [Meter Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Meter record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MeterRecord'
 *     responses:
 *       200:
 *         description: Meter record updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MeterRecord'
 *       404:
 *         description: House or meter record not found
 */
router.put("/:id", meterController.updateMeterRecord);

/**
 * @swagger
 * /meter-records/{id}:
 *   delete:
 *     summary: Delete a meter record
 *     tags: [Meter Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Meter record ID
 *     responses:
 *       200:
 *         description: Meter record deleted successfully
 *       404:
 *         description: Meter record not found
 */
router.delete("/:id", meterController.deleteMeterRecord);

module.exports = router;
