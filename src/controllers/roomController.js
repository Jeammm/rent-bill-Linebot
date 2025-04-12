const db = require('../models/db');

exports.getAllRooms = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM rooms');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM rooms WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Room not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const { name, rent_price } = req.body;
    const result = await db.query(
      'INSERT INTO rooms (name, rent_price) VALUES ($1, $2) RETURNING *',
      [name, rent_price]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rent_price } = req.body;
    const result = await db.query(
      'UPDATE rooms SET name = $1, rent_price = $2 WHERE id = $3 RETURNING *',
      [name, rent_price, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Room not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM rooms WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Room not found' });
    res.json({ message: 'Room deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
