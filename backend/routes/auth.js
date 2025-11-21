// routes/auth.js
const express = require('express')
const pool = require('../db')
const bcrypt = require('bcrypt')

const router = express.Router()

// POST /login - Iniciar sesion
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        // 1 Buscar al usuario por su email
        const { rows } = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email])
        const user = rows[0]

        if (!user) {
            return res.status(401).json({ error: 'Credenciales invalidas' })
        }

        // 2 Verificar si la cuenta esta activa
        if (!user.activo) {
            return res.status(403).json({ error: 'La cuenta de usuario esta deshabilitada' })
        }

        // 3 Comparar la contrasena ingresada con la hasheada en la BD
        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Credenciales invalidas' })
        }

        // Si todo es correcto, respondemos con exito
        res.json({ message: 'Inicio de sesion exitoso', user: { id: user.id, email: user.email, rol: user.rol } })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router