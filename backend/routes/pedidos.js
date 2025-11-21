// routes/pedidos.js
const express = require('express')
const pool = require('../db')

const router = express.Router()

// GET /pedidos - Obtener todos los pedidos que no esten entregados
router.get('/', async (req, res) => {
    try {
        // Pedimos solo los pedidos que aun estan en estado 'Recibido'
        const { rows } = await pool.query("SELECT * FROM pedidos WHERE estado = 'Recibido' ORDER BY fecha_hora ASC")
        res.json(rows)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// POST /pedidos - Crear un nuevo pedido (¡CON TRANSACCION!)
router.post('/', async (req, res) => {
    const { total, items } = req.body // El frontend nos enviara el total y un array de items
    const client = await pool.connect() // Obtenemos un cliente del pool para la transaccion

    try {
        // Iniciamos la transaccion
        await client.query('BEGIN')

        // 1 Insertamos la cabecera del pedido en la tabla 'pedidos'
        const pedidoResult = await client.query(
            'INSERT INTO pedidos (total) VALUES ($1) RETURNING id',
            [total]
        )
        const pedidoId = pedidoResult.rows[0].id

        // 2 Recorremos cada item del pedido y lo insertamos en 'pedido_items'
        for (const item of items) {
            await client.query(
                'INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)',
                [pedidoId, item.producto_id, item.cantidad, item.precio_unitario]
            )
        }

        // Si todo salio bien, confirmamos la transaccion
        await client.query('COMMIT')
        res.status(201).json({ message: 'Pedido creado exitosamente', pedidoId })
    } catch (error) {
        // Si algo fallo, revertimos todos los cambios de la transaccion
        await client.query('ROLLBACK')
        res.status(500).json({ error: 'Error al crear el pedido: ' + error.message })
    } finally {
        // En cualquier caso (exito o error), liberamos el cliente de vuelta al pool
        client.release()
    }
})

// PUT /pedidos/:id/entregar - Marcar un pedido como entregado
router.put('/:id/entregar', async (req, res) => {
    try {
        const { id } = req.params
        const { rows } = await pool.query(
            "UPDATE pedidos SET estado = 'Entregado' WHERE id = $1 RETURNING *",
            [id]
        )
        res.json(rows[0])
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router