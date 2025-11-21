// index.js
const express = require('express')
const cors = require('cors')

// Importar los routers
const productosRouter = require('./routes/productos')
const usuariosRouter = require('./routes/usuarios')
const authRouter = require('./routes/auth')
const pedidosRouter = require('./routes/pedidos') // Nuevo router

const app = express()
app.use(cors())
app.use(express.json())

const PORT = 3000

// Usar los routers para las rutas correspondientes
app.use('/productos', productosRouter)
app.use('/usuarios', usuariosRouter)
app.use('/auth', authRouter)
app.use('/pedidos', pedidosRouter) // Nueva linea

app.get('/', (req, res) => {
    res.send('¡El servidor de la cafeteria esta funcionando!')
})

app.listen(PORT, () => {
    console.log(`Servidor corriendo exitosamente en http://localhost:${PORT}`)
})