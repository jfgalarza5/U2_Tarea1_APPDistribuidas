const express = require('express');
const router = express.Router();
const db = require('../database/database');

// GET todos los productos
router.get('/', async (req, res) => {
  try {
    const rows = await db.query(`
      SELECT * FROM producto
    `);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: 'Error al obtener productos' });
  }
});

// GET producto a partir de su id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await db.query('SELECT * FROM producto WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: 'Error al obtener producto' });
  }
});

// POST crear un producto
router.post('/', async (req, res) => {
  try {
    const { nombre, precio, stock } = req.body;
    const result = await db.pool.execute(
      'INSERT INTO producto (nombre, precio, stock) VALUES (?, ?, ?)',
      [nombre, precio, stock]
    );
    const insertId = result[0].insertId;
    const rows = await db.query('SELECT * FROM producto WHERE id = ?', [insertId]);
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: 'Error al crear producto' });
  }
});

// PUT actualizar un producto por su id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, stock } = req.body;
    await db.pool.execute(
      'UPDATE producto SET nombre = ?,  precio = ?, stock = ? WHERE id = ?',
      [nombre, precio, stock, id]
    );
    const rows = await db.query('SELECT * FROM producto WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: 'Error al actualizar producto' });
  }
});

// DELETE eliminar un producto
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.pool.execute('DELETE FROM producto WHERE id = ?', [id]);
    res.json({ mensaje: 'Producto eliminado' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: 'Error al eliminar producto' });
  }
});

module.exports = router;
