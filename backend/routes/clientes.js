// routes/clientes.js
const express = require('express')
const pool = require('../db')

const router = express.Router()

// POST /clientes - Registrar un nuevo cliente
router.post('/', async (req, res) => {
    const { nombre_completo, ci } = req.body
    try {
        const { rows } = await pool.query(
            'INSERT INTO clientes (nombre_completo, ci) VALUES ($1, $2) RETURNING *',
            [nombre_completo, ci]
        )
        res.status(201).json(rows[0])
    } catch (error) {
        // Manejar error si el CI ya existe
        if (error.code === '23505') {
            return res.status(400).json({ error: 'El CI ya esta registrado' })
        }
        res.status(500).json({ error: error.message })
    }
})

// GET /clientes/buscar/:ci - Buscar un cliente por su CI
router.get('/buscar/:ci', async (req, res) => {
    const { ci } = req.params
    try {
        const { rows } = await pool.query('SELECT * FROM clientes WHERE ci = $1', [ci])
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' })
        }
        res.json(rows[0])
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router