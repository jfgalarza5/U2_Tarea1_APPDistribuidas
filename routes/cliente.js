const express = require('express');
const router = express.Router();
const db = require('../database/database');

// GET para obtener todos los clientes
router.get('/', async (req, res) => {
  try {
    const rows = await db.query('SELECT * FROM cliente');
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: 'Error al obtener clientes' });
  }
});

// GET obtener un cliente por su id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await db.query('SELECT * FROM cliente WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: 'Error al obtener cliente' });
  }
});

// POST crear un cliente
router.post('/', async (req, res) => {
  try {
    const { nombre, cedula } = req.body;
    const result = await db.pool.execute(
      'INSERT INTO cliente (nombre, cedula) VALUES (?, ?)',
      [nombre, cedula]
    );
    const insertId = result[0].insertId;
    const rows = await db.query('SELECT id, nombre, cedula FROM cliente WHERE id = ?', [insertId]);
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: 'Error al crear cliente' });
  }
});

// PUT actualizar cliente a partir de un id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, cedula } = req.body;
    await db.pool.execute(
      'UPDATE cliente SET nombre = ?, cedula = ? WHERE id = ?',
      [nombre, cedula, id]
    );
    const rows = await db.query('SELECT id, nombre, cedula FROM cliente WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: 'Error al actualizar cliente' });
  }
});

// DELETE eliminar un cliente a partir de su id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.pool.execute('DELETE FROM cliente WHERE id = ?', [id]);
    res.json({ mensaje: 'Cliente eliminado' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: 'Error al eliminar cliente' });
  }
});

module.exports = router;
