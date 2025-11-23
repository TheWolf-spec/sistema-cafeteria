// index.js
const express = require('express')
const cors = require('cors')

// Importar los routers
const productosRouter = require('./routes/productos')
const usuariosRouter = require('./routes/usuarios')
const authRouter = require('./routes/auth')
const pedidosRouter = require('./routes/pedidos')
const clientesRouter = require('./routes/clientes')
const reportesRouter = require('./routes/reportes') // Nuevo router

const app = express()
app.use(cors())
app.use(express.json())

const PORT = 3000

// Usar los routers para las rutas correspondientes
app.use('/productos', productosRouter)
app.use('/usuarios', usuariosRouter)
app.use('/auth', authRouter)
app.use('/pedidos', pedidosRouter)
app.use('/clientes', clientesRouter) // Nueva linea
app.use('/reportes', reportesRouter) // Nueva linea

app.get('/', (req, res) => {
    res.send('The Server de la cafeteria esta funcionando!')
})

app.listen(PORT, () => {
    console.log(`Servidor corriendo EXITOSAMENTE!!! en http://localhost:${PORT}`)
})