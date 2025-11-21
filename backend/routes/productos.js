const express = require('express');
const pool = require('../db');
const ProductoFactory = require('../models/ProductoFactory');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM productos ORDER BY id ASC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const productoObj = ProductoFactory.createProducto(req.body);
        const { nombre, descripcion, precio, categoria } = productoObj;
        const { rows } = await pool.query(
            'INSERT INTO productos (nombre, descripcion, precio, categoria) VALUES ($1, $2, $3, $4) RETURNING *',
            [nombre, descripcion, precio, categoria]
        );
        res.status(201).json(rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message }); // 400 para datos invlaidos
    }
});
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, categoria, disponible } = req.body;
        const { rows } = await pool.query(
            'UPDATE productos SET nombre = $1, descripcion = $2, precio = $3, categoria = $4, disponible = $5 WHERE id = $6 RETURNING *',
            [nombre, descripcion, precio, categoria, disponible, id]
        );
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM productos WHERE id = $1', [id]);
        res.status(204).send(); // 204 significa "Sin Contenido" 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;