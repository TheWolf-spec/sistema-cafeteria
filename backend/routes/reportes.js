// routes/reportes.js
const express = require('express')
const pool = require('../db')

const router = express.Router()

// GET /reportes/ventas-por-fecha - Reporte de ventas en un rango de fechas
router.get('/ventas-por-fecha', async (req, res) => {
    // Recibimos las fechas desde los parametros de la URL (ej /?inicio=2025-11-01&fin=2025-11-23)
    const { inicio, fin } = req.query
    try {
        const { rows } = await pool.query(
            `SELECT 
                SUM(total) as total_ventas, 
                COUNT(id) as numero_pedidos 
            FROM pedidos 
            WHERE fecha_hora BETWEEN $1 AND $2`,
            [inicio, fin]
        )
        res.json(rows[0])
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// GET /reportes/productos-mas-vendidos - Reporte de productos mas vendidos
router.get('/productos-mas-vendidos', async (req, res) => {
    const { inicio, fin } = req.query
    try {
        const { rows } = await pool.query(
            `SELECT 
                p.nombre, 
                SUM(pi.cantidad) as total_vendido 
            FROM pedido_items pi
            JOIN productos p ON pi.producto_id = p.id
            JOIN pedidos ped ON pi.pedido_id = ped.id
            WHERE ped.fecha_hora BETWEEN $1 AND $2
            GROUP BY p.nombre
            ORDER BY total_vendido DESC
             LIMIT 10`, // Limitamos a los 10 mas vendidos
            [inicio, fin]
        )
        res.json(rows)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})
// GET /reportes/cierre-caja - Reporte para el total de ventas en efectivo del dia actual
router.get('/cierre-caja', async (req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT SUM(total) as total_efectivo 
            FROM pedidos 
            WHERE metodo_pago = 'Efectivo' 
             AND fecha_hora >= CURRENT_DATE` // CURRENT_DATE selecciona desde las 00:00 de hoy
        )
        res.json(rows[0])
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})
module.exports = router