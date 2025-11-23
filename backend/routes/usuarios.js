// routes/usuarios.js (VERSIÓN CORREGIDA CON LOG DE AUDITORÍA COMPLETO)
const express = require('express');
const pool = require('../db');
const bcrypt = require('bcrypt');

const router = express.Router();

// GET /usuarios (sin cambios)
router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT id, nombre_completo, email, rol, activo FROM usuarios ORDER BY id ASC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /usuarios - Crear un nuevo usuario
router.post('/', async (req, res) => {
    try {
        const { nombre_completo, email, rol, password } = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const { rows } = await pool.query(
            'INSERT INTO usuarios (nombre_completo, email, rol, password) VALUES ($1, $2, $3, $4) RETURNING id, nombre_completo, email, rol, activo',
            [nombre_completo, email, rol, hashedPassword]
        );
        const nuevoUsuario = rows[0];

        // --- CORRECCIÓN: REGISTRAR EN EL LOG DE AUDITORÍA CON USUARIO_ID ---
        // Asumimos que el admin (ID 1) es quien realiza la acción
        await pool.query(
            'INSERT INTO auditoria_logs (usuario_id, accion, detalle) VALUES ($1, $2, $3)',
            [1, 'CREACION DE USUARIO', `Se creó el usuario: ${nuevoUsuario.email} con el rol: ${nuevoUsuario.rol}`]
        );
        
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT /usuarios/:id/toggle-status - Habilitar o deshabilitar un usuario
router.put('/:id/toggle-status', async (req, res) => {
    try {
        const { id } = req.params;
        
        const { rows: userRows } = await pool.query('SELECT activo, email FROM usuarios WHERE id = $1', [id]);
        const usuarioActual = userRows[0];
        const nuevoEstado = !usuarioActual.activo;

        const { rows } = await pool.query(
            'UPDATE usuarios SET activo = $1 WHERE id = $2 RETURNING id, nombre_completo, email, rol, activo',
            [nuevoEstado, id]
        );
        const usuarioActualizado = rows[0];

        // --- CORRECCIÓN: REGISTRAR EN EL LOG DE AUDITORÍA CON USUARIO_ID ---
        const accionLog = nuevoEstado ? 'HABILITACION DE USUARIO' : 'DESHABILITACION DE USUARIO';
        await pool.query(
            'INSERT INTO auditoria_logs (usuario_id, accion, detalle) VALUES ($1, $2, $3)',
            [1, accionLog, `Se cambió el estado del usuario: ${usuarioActualizado.email}`]
        );

        res.json(usuarioActualizado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;