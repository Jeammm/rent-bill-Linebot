const db = require("../models/db");

exports.getAllHouses = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM house");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getHouseById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("SELECT * FROM house WHERE id = $1", [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "House not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createHouse = async (req, res) => {
  try {
    const { name, rent_price, is_rented = false } = req.body;
    const result = await db.query(
      "INSERT INTO house (name, rent_price, is_rented) VALUES ($1, $2, $3) RETURNING *",
      [name, rent_price, is_rented]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateHouse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rent_price } = req.body;
    const result = await db.query(
      "UPDATE house SET name = $1, rent_price = $2 WHERE id = $3 RETURNING *",
      [name, rent_price, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "House not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteHouse = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "DELETE FROM house WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "House not found" });
    res.json({ message: "House deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
