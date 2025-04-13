const db = require("../models/db");

exports.getAllMeterRecords = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM meter_record");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMeterRecordById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("SELECT * FROM meter_record WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Meter Record not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMeterRecordByHouseId = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "SELECT * FROM meter_record WHERE house_id = $1",
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createMeterRecord = async (req, res) => {
  try {
    const { value, type, house_id, month, year } = req.body;

    // Check if the house exists
    const houseResult = await db.query("SELECT * FROM house WHERE id = $1", [
      house_id,
    ]);
    if (houseResult.rows.length === 0)
      return res.status(404).json({ error: "House not found" });

    // Create the meter record using month and year
    const result = await db.query(
      "INSERT INTO meter_record (value, type, house_id, month, year) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [value, type, house_id, month, year]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateMeterRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { value, type, house_id, month, year } = req.body;

    // Check if the house exists
    const houseResult = await db.query("SELECT * FROM house WHERE id = $1", [
      house_id,
    ]);
    if (houseResult.rows.length === 0)
      return res.status(404).json({ error: "House not found" });

    // Update the meter record using month and year
    const result = await db.query(
      "UPDATE meter_record SET value = $1, type = $2, house_id = $3, month = $4, year = $5 WHERE id = $6 RETURNING *",
      [value, type, house_id, month, year, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Meter Record not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMeterRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "DELETE FROM meter_record WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Meter Record not found" });
    res.json({ message: "Meter Record deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.checkPreviousMeterRecord = async (values = [], month, year) => {
  try {
    const groupedResults = {};

    for (const value of values) {
      // Calculate previous month/year
      let prevMonth = month - 1;
      let prevYear = year;
      if (prevMonth === 0) {
        prevMonth = 12;
        prevYear -= 1;
      }

      // Find the closest record from the previous month with a smaller value
      const result = await db.query(
        `
        SELECT mr.*, h.name AS house_name
        FROM meter_record mr
        JOIN house h ON h.id = mr.house_id
        WHERE mr.month = $1 AND mr.year = $2 AND mr.value < $3
        ORDER BY ABS(mr.value - $3) ASC
        LIMIT 1
        `,
        [prevMonth, prevYear, value]
      );

      console.log('result: ', result.rows);

      if (result.rows.length > 0) {
        const match = result.rows[0];
        const houseId = match.house_id;
        const houseName = match.house_name;

        if (!groupedResults[houseId]) {
          groupedResults[houseId] = {
            house_id: houseId,
            house_name: houseName,
            readings: [],
          };
        }

        groupedResults[houseId].readings.push({
          current_value: value,
          previous_value: match.value,
          type: match.type,
          month: match.month,
          year: match.year,
        });
      } else {
        // If no match, you could optionally store unmatched results
      }
    }

    // Convert object to array
    return Object.values(groupedResults);
  } catch (error) {
    console.error("Error checking previous meter record:", error);
    throw error;
  }
};