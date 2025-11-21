// routes/usuarios.js
const express = require('express')
const pool = require('../db')
const bcrypt = require('bcrypt')

const router = express.Router()

// GET /usuarios - Obtener la lista de todos los usuarios
router.get('/', async (req, res) => {
    try {
        // Seleccionamos todo excepto la contrasena por seguridad
        const { rows } = await pool.query('SELECT id, nombre_completo, email, rol, activo FROM usuarios ORDER BY id ASC')
        res.json(rows)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// POST /usuarios - Crear un nuevo usuario
router.post('/', async (req, res) => {
    try {
        const { nombre_completo, email, rol, password } = req.body

        // Hasheamos la contrasena antes de guardarla
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const { rows } = await pool.query(
            'INSERT INTO usuarios (nombre_completo, email, rol, password) VALUES ($1, $2, $3, $4) RETURNING id, nombre_completo, email, rol, activo',
            [nombre_completo, email, rol, hashedPassword]
        )
        res.status(201).json(rows[0])
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

// PUT /usuarios/:id/toggle-status - Habilitar o deshabilitar un usuario
router.put('/:id/toggle-status', async (req, res) => {
    try {
        const { id } = req.params
        // Obtenemos el estado actual y lo invertimos
        const { rows: userRows } = await pool.query('SELECT activo FROM usuarios WHERE id = $1', [id])
        const nuevoEstado = !userRows[0].activo

        const { rows } = await pool.query(
            'UPDATE usuarios SET activo = $1 WHERE id = $2 RETURNING id, nombre_completo, email, rol, activo',
            [nuevoEstado, id]
        )
        res.json(rows[0])
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router