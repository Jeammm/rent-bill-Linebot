const db = require("../models/db");

const handleCalculateMonthlyRent = async (houseId, month, year) => {
  const now = new Date();
  month = month ? parseInt(month) : now.getMonth() + 1;
  year = year ? parseInt(year) : now.getFullYear();

  if (month < 1 || month > 12 || year < 1000 || year > 9999) {
    throw new Error(
      "Invalid month or year. Use month=1-12 and full 4-digit year."
    );
  }

  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;

  const houseResult = await db.query("SELECT * FROM house WHERE id = $1", [
    houseId,
  ]);
  if (houseResult.rows.length === 0) {
    throw new Error("House not found");
  }
  const house = houseResult.rows[0];

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

  const calculateUsage = (type) => {
    const filtered = meterRecords.filter((r) => r.type === type);
    const prev = filtered.findLast(
      (r) => r.month === prevMonth && r.year === prevYear
    );
    const curr = filtered.findLast((r) => r.month === month && r.year === year);

    if (!prev || !curr) return null;
    return curr.value - prev.value;
  };

  const waterUsage = calculateUsage("WATER");
  const elecUsage = calculateUsage("ELECTRICITY");

  if (waterUsage === null) {
    throw new Error(
      `Not enough water meter records for calculation (need both ${prevMonth}/${prevYear} and ${month}/${year})`
    );
  }

  if (elecUsage === null) {
    throw new Error(
      `Not enough electricity meter records for calculation (need both ${prevMonth}/${prevYear} and ${month}/${year})`
    );
  }

  const waterCost = waterUsage * 17;
  const elecCost = elecUsage * 8;
  const total = waterCost + elecCost + house.rent_price;

  return {
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
  };
};

exports.calculateMonthlyRent = async (req, res) => {
  try {
    const resObj = await handleCalculateMonthlyRent(
      req.params.houseId,
      req.query.month,
      req.query.year
    );
    res.json(resObj);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
