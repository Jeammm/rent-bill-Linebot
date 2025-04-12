const db = require("../models/db");

exports.calculateMonthlyRent = async (req, res) => {
  try {
    const { houseId } = req.params;
    let { month, year } = req.query;

    const now = new Date();
    month = month ? parseInt(month) : now.getMonth() + 1;
    year = year ? parseInt(year) : now.getFullYear();

    if (month < 1 || month > 12 || year < 1000 || year > 9999) {
      return res.status(400).json({
        error: "Invalid month or year. Use month=1-12 and full 4-digit year.",
      });
    }

    // Calculate previous month and year
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;

    // Get house info
    const houseResult = await db.query("SELECT * FROM house WHERE id = $1", [
      houseId,
    ]);
    if (houseResult.rows.length === 0) {
      return res.status(404).json({ error: "House not found" });
    }
    const house = houseResult.rows[0];

    // Get meter records from previous and current month
    const result = await db.query(
      `SELECT * FROM meter_record 
       WHERE house_id = $1 
       AND (
         (month = $2 AND year = $3) OR
         (month = $4 AND year = $5)
       )
       ORDER BY year, month, id`,
      [houseId, month, year, prevMonth, prevYear]
    );

    const meterRecords = result.rows;

    // Helper to get usage from last reading of prev month and last reading of current month
    const calculateUsage = (type) => {
      const filtered = meterRecords.filter((r) => r.type === type);
      const prev = filtered.findLast(
        (r) => r.month === prevMonth && r.year === prevYear
      );
      const curr = filtered.findLast(
        (r) => r.month === month && r.year === year
      );

      if (!prev || !curr) return null;
      return curr.value - prev.value;
    };

    const waterUsage = calculateUsage("WATER");
    const elecUsage = calculateUsage("ELECTRICITY");

    if (waterUsage === null) {
      return res.status(400).json({
        error: `Not enough water meter records for calculation (need both ${prevMonth}/${prevYear} and ${month}/${year})`,
      });
    }

    if (elecUsage === null) {
      return res.status(400).json({
        error: `Not enough electricity meter records for calculation (need both ${prevMonth}/${prevYear} and ${month}/${year})`,
      });
    }

    const waterCost = waterUsage * 17;
    const elecCost = elecUsage * 8;
    const total = waterCost + elecCost + house.rent_price;

    res.json({
      house: house.name,
      rent_price: house.rent_price,
      month,
      year,
      usage: {
        water: waterUsage,
        electricity: elecUsage,
      },
      cost: {
        water: waterCost,
        electricity: elecCost,
      },
      total,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
