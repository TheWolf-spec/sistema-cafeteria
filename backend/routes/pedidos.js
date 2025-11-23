// routes/pedidos.js (VERSIÓN COMPLETA Y CORREGIDA)
const express = require('express');
const pool = require('../db');

const router = express.Router();

// GET /pedidos - Obtener todos los pedidos que no estén entregados
router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM pedidos WHERE estado = 'Recibido' ORDER BY fecha_hora ASC");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /pedidos - Crear un nuevo pedido
router.post('/', async (req, res) => {
    const { total, items, cliente_id, metodo_pago } = req.body;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Insertar la cabecera del pedido
        const pedidoResult = await client.query(
            'INSERT INTO pedidos (total, cliente_id, metodo_pago) VALUES ($1, $2, $3) RETURNING id',
            [total, cliente_id, metodo_pago]
        );
        const pedidoId = pedidoResult.rows[0].id;

        // 2. Insertar cada item del pedido (ESTA ERA LA PARTE QUE FALTABA)
        for (const item of items) {
            await client.query(
                'INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)',
                [pedidoId, item.producto_id, item.cantidad, item.precio_unitario]
            );
        }

        // 3. Actualizar visitas del cliente si existe
        if (cliente_id) {
            await client.query(
                'UPDATE clientes SET visitas = visitas + 1 WHERE id = $1',
                [cliente_id]
            );
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'Pedido creado exitosamente', pedidoId });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error en transacción de pedido:', error); // Añadimos un log en el servidor para ver el error exacto
        res.status(500).json({ error: 'Error al crear el pedido: ' + error.message });
    } finally {
        client.release();
    }
});

// PUT /pedidos/:id/entregar - Marcar un pedido como entregado
router.put('/:id/entregar', async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query(
            "UPDATE pedidos SET estado = 'Entregado' WHERE id = $1 RETURNING *",
            [id]
        );
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;