const express = require('express');
const router = express.Router();
const db = require('../database/database');

// POST Crear un carrito
router.post('/', async (req, res) => {
  try {
    const { cliente_id } = req.body;
    const result = await db.pool.execute('INSERT INTO carrito (cliente_id) VALUES (?)', [cliente_id]);
    const insertId = result[0].insertId;
    const rows = await db.query('SELECT * FROM carrito WHERE id = ?', [insertId]);
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: 'Error al crear carrito' });
  }
});

// POST agregar un item a carrito
router.post('/:carritoId/items', async (req, res) => {
  try {
    const { carritoId } = req.params;
    const { producto_id, cantidad } = req.body;
    const productoRows = await db.query('SELECT id FROM producto WHERE id = ?', [producto_id]);
    if (!productoRows[0]) return res.status(404).json({ mensaje: 'producto no encontrado' });
    const result = await db.pool.execute(
      'INSERT INTO carrito_item (carrito_id, producto_id, cantidad) VALUES (?, ?, ?)',
      [carritoId, producto_id, cantidad]
    );
    const insertId = result[0].insertId;
    const rows = await db.query('SELECT ci.*, p.nombre, p.precio FROM carrito_item ci JOIN producto p ON ci.producto_id = p.id WHERE ci.id = ?', [insertId]);
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: 'Error al agregar item al carrito' });
  }
});

// GET obtener los items del carrito
router.get('/:carritoId', async (req, res) => {
  try {
    const { carritoId } = req.params;
    const carritoRows = await db.query('SELECT * FROM carrito WHERE id = ?', [carritoId]);
    if (!carritoRows[0]) return res.status(404).json({ mensaje: 'Carrito no encontrado' });
    const items = await db.query('SELECT ci.*, p.nombre, p.precio FROM carrito_item ci JOIN producto p ON ci.producto_id = p.id WHERE ci.carrito_id = ?', [carritoId]);
    res.json({ carrito: carritoRows[0], items });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: 'Error al obtener carrito' });
  }
});

// DELETE eliminar el carrito
router.delete('/:carritoId', async (req, res) => {
  try {
    const { carritoId } = req.params;
    await db.pool.execute('DELETE FROM carrito_item WHERE carrito_id = ?', [carritoId]);
    await db.pool.execute('DELETE FROM carrito WHERE id = ?', [carritoId]);
    res.json({ mensaje: 'Carrito eliminado' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: 'Error al eliminar carrito' });
  }
});

module.exports = router;
