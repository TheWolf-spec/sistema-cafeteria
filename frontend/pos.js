// pos.js
document.addEventListener('DOMContentLoaded', () => {
    // --- URLs DE LA API ---
    const API_PRODUCTOS = 'http://localhost:3000/productos'
    const API_PEDIDOS = 'http://localhost:3000/pedidos'

    // --- ESTADO DE LA APLICACION ---
    let menuProductos = []
    let pedidoActual = []

    // --- ELEMENTOS DEL DOM ---
    const productMenu = document.getElementById('product-menu')
    const pedidoActualDiv = document.getElementById('pedido-actual')
    const totalPedidoSpan = document.getElementById('total-pedido')
    const searchInput = document.getElementById('search-product')
    const pedidosActivosDiv = document.getElementById('pedidos-activos-list')

    // --- CARGA INICIAL ---
    async function inicializarPOS() {
        await fetchProductos()
        await fetchPedidosActivos()
    }

    // --- FUNCIONES DE CARGA DE DATOS ---
    async function fetchProductos() {
        const response = await fetch(API_PRODUCTOS)
        menuProductos = await response.json()
        renderMenu(menuProductos)
    }

    async function fetchPedidosActivos() {
        const response = await fetch(API_PEDIDOS)
        const pedidos = await response.json()
        renderPedidosActivos(pedidos)
    }

    // --- FUNCIONES DE RENDERIZADO ---
    function renderMenu(productos) {
        productMenu.innerHTML = ''
        productos.forEach(producto => {
            if (!producto.disponible) return // No mostrar productos agotados
            const item = document.createElement('div')
            item.className = 'menu-item'
            item.innerHTML = `<div class="menu-item-nombre">${producto.nombre}</div><div class="menu-item-precio">$${producto.precio}</div>`
            item.addEventListener('click', () => agregarAlPedido(producto))
            productMenu.appendChild(item)
        })
    }
    
    function renderPedidoActual() {
        pedidoActualDiv.innerHTML = ''
        pedidoActual.forEach(item => {
            const div = document.createElement('div')
            div.className = 'pedido-item'
            div.innerHTML = `<span>${item.nombre} x${item.cantidad}</span><span>$${(item.precio * item.cantidad).toFixed(2)}</span>`
            pedidoActualDiv.appendChild(div)
        })
        actualizarTotal()
    }
    
    function renderPedidosActivos(pedidos) {
        pedidosActivosDiv.innerHTML = ''
        pedidos.forEach(pedido => {
            const div = document.createElement('div')
            div.className = 'pedido-activo-item'
            div.innerHTML = `<span>Pedido #${pedido.id} - $${pedido.total}</span><button onclick="marcarComoEntregado(${pedido.id})">Entregado</button>`
            pedidosActivosDiv.appendChild(div)
        })
    }

    // --- LOGICA DEL PEDIDO ---
    function agregarAlPedido(producto) {
        const itemExistente = pedidoActual.find(item => item.id === producto.id)
        if (itemExistente) {
            itemExistente.cantidad++
        } else {
            pedidoActual.push({ ...producto, cantidad: 1 })
        }
        renderPedidoActual()
    }

    function actualizarTotal() {
        const total = pedidoActual.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
        totalPedidoSpan.textContent = total.toFixed(2)
    }
    
    async function finalizarPedido() {
        if (pedidoActual.length === 0) return alert('El pedido esta vacio')
        
        const pedidoData = {
            total: parseFloat(totalPedidoSpan.textContent),
            items: pedidoActual.map(item => ({
                producto_id: item.id,
                cantidad: item.cantidad,
                precio_unitario: item.precio
            }))
        }
        
        const response = await fetch(API_PEDIDOS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pedidoData)
        })
        
        if (response.ok) {
            alert('Pedido finalizado exitosamente')
            cancelarPedido()
            fetchPedidosActivos()
        } else {
            alert('Error al finalizar el pedido')
        }
    }

    function cancelarPedido() {
        pedidoActual = []
        renderPedidoActual()
    }
    
    window.marcarComoEntregado = async function(id) {
        await fetch(`${API_PEDIDOS}/${id}/entregar`, { method: 'PUT' })
        fetchPedidosActivos()
    }

    // --- EVENT LISTENERS ---
    searchInput.addEventListener('input', e => {
        const searchTerm = e.target.value.toLowerCase()
        const productosFiltrados = menuProductos.filter(p => p.nombre.toLowerCase().includes(searchTerm))
        renderMenu(productosFiltrados)
    })
    
    document.getElementById('btn-finalizar-pedido').addEventListener('click', finalizarPedido)
    document.getElementById('btn-cancelar-pedido').addEventListener('click', cancelarPedido)

    // --- INICIALIZAR ---
    inicializarPOS()
})