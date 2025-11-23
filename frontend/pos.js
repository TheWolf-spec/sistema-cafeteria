// pos.js (VERSION FINAL CON GENERACION DE TICKET)
document.addEventListener('DOMContentLoaded', () => {
    // --- URLs, ESTADO, ELEMENTOS DEL DOM (sin cambios) ---
    const API_PRODUCTOS = 'http://localhost:3000/productos'
    const API_PEDIDOS = 'http://localhost:3000/pedidos'
    const API_CLIENTES = 'http://localhost:3000/clientes'
    const API_REPORTES = 'http://localhost:3000/reportes';
    let menuProductos = []
    let pedidoActual = []
    let clienteSeleccionado = null
    const productMenu = document.getElementById('product-menu')
    const pedidoActualDiv = document.getElementById('pedido-actual')
    const totalPedidoSpan = document.getElementById('total-pedido')
    const searchInput = document.getElementById('search-product')
    const pedidosActivosDiv = document.getElementById('pedidos-activos-list')
    const searchCiInput = document.getElementById('search-ci')
    const clienteInfoDiv = document.getElementById('cliente-info')

    // --- CARGA INICIAL Y FUNCIONES DE RENDER (sin cambios) ---
    // ... (todas las funciones desde inicializarPOS hasta renderPedidosActivos se mantienen igual) ...

    // --- FUNCIONES PARA CLIENTES (sin cambios) ---
    // ... (todas las funciones de clientes se mantienen igual) ...
    
    // --- LÓGICA DEL PEDIDO Y PAGOS ---

    function agregarAlPedido(producto) {
        const itemExistente = pedidoActual.find(item => item.id === producto.id);
        if (itemExistente) {
            itemExistente.cantidad++;
        } else {
            pedidoActual.push({ ...producto, cantidad: 1 });
        }
        renderPedidoActual();
    }

    window.incrementarCantidad = function (id) {
        const item = pedidoActual.find(p => p.id === id);
        if (item) {
            item.cantidad++;
            renderPedidoActual();
        }
    };

    window.decrementarCantidad = function (id) {
        const item = pedidoActual.find(p => p.id === id);
        if (item) {
            item.cantidad--;
            if (item.cantidad === 0) {
                removerItem(id);
            } else {
                renderPedidoActual();
            }
        }
    };

    window.removerItem = function (id) {
        pedidoActual = pedidoActual.filter(p => p.id !== id);
        renderPedidoActual();
    };

    function actualizarTotal() {
        const total = pedidoActual.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
        totalPedidoSpan.textContent = total.toFixed(2);
    }

    function handlePagoEfectivo() {
        if (pedidoActual.length === 0) return alert('El pedido está vacío');
        const total = parseFloat(totalPedidoSpan.textContent);
        const montoRecibidoStr = prompt(`Total a pagar: $${total.toFixed(2)}\nIngrese el monto recibido:`);
        if (montoRecibidoStr === null) return;
        const regexNumeroValido = /^[0-9]*\.?[0-9]+$/;
        if (!regexNumeroValido.test(montoRecibidoStr.trim())) return alert('Monto inválido.');
        const montoRecibido = parseFloat(montoRecibidoStr);
        if (isNaN(montoRecibido) || montoRecibido < total) return alert('Monto inválido o insuficiente.');
        const cambio = montoRecibido - total;
        alert(`Cambio a devolver: $${cambio.toFixed(2)}`);
        enviarPedidoAlBackend('Efectivo');
    }

    function handlePagoTarjeta() {
        if (pedidoActual.length === 0) return alert('El pedido está vacío');
        alert('Por favor, inserte o acerque la tarjeta a la terminal...');
        setTimeout(() => {
            alert('¡Pago con tarjeta APROBADO!');
            enviarPedidoAlBackend('Tarjeta');
        }, 1000);
    }
    // MODIFICADO: Ahora recibe el ID del pedido creado
    async function finalizarPedido(metodoDePago, pedidoId) {
        // Generamos el ticket
        generarTicket(pedidoId)

        alert('Pedido registrado exitosamente en el sistema')
        cancelarPedido()
        fetchPedidosActivos()
        if (clienteSeleccionado) buscarCliente()
    }

    // NUEVO: Funcion para generar e imprimir el ticket
    function generarTicket(pedidoId) {
        const fecha = new Date().toLocaleString();
        let itemsHtml = '';
        pedidoActual.forEach(item => {
            itemsHtml += `<tr><td class="col-cantidad">${item.cantidad}x</td><td>${item.nombre}</td><td class="col-precio">$${(item.precio * item.cantidad).toFixed(2)}</td></tr>`;
        });
        const clienteHtml = clienteSeleccionado ? `<p>Cliente: ${clienteSeleccionado.nombre_completo}</p>` : '';
        const ticketHtml = `
        <html><head><title>Ticket Pedido #${pedidoId}</title><link rel="stylesheet" href="style.css"></head>
        <body class="ticket-body"><div class="ticket-header"><h2>Cafeteria "Cafe Con Ideas"</h2><p>Fecha: ${fecha}</p><h3>Pedido #${pedidoId}</h3></div><hr>
        <table class="ticket-table">${itemsHtml}</table><hr>
        <div class="ticket-footer"><h3>Total: $${totalPedidoSpan.textContent}</h3>${clienteHtml}<p>¡Gracias por su compra!</p></div></body></html>
    `;
        const newWindow = window.open('', 'Print-Window');
        newWindow.document.open();
        newWindow.document.write(ticketHtml);
        newWindow.document.close();
        setTimeout(() => { newWindow.print(); newWindow.close(); }, 500);
    }

    // MODIFICADO: La peticion al backend ahora se hace dentro de los manejadores de pago
    function handlePagoEfectivo() {
        if (pedidoActual.length === 0) return alert('El pedido esta vacio')
        const total = parseFloat(totalPedidoSpan.textContent)
        const montoRecibidoStr = prompt(`Total a pagar: $${total.toFixed(2)}\nIngrese el monto recibido:`)
        if (montoRecibidoStr === null) return
        const regexNumeroValido = /^[0-9]*\.?[0-9]+$/
        if (!regexNumeroValido.test(montoRecibidoStr.trim())) return alert('Monto invalido')
        const montoRecibido = parseFloat(montoRecibidoStr)
        if (isNaN(montoRecibido) || montoRecibido < total) return alert('Monto invalido o insuficiente')
        const cambio = montoRecibido - total
        alert(`Cambio a devolver: $${cambio.toFixed(2)}`)
        
        // Enviar al backend y luego generar ticket
        enviarPedidoAlBackend('Efectivo')
    }

    function handlePagoTarjeta() {
        if (pedidoActual.length === 0) return alert('El pedido esta vacio')
        alert('Por favor, inserte o acerque la tarjeta a la terminal...')
        setTimeout(() => {
            alert('¡Pago con tarjeta APROBADO!')
            enviarPedidoAlBackend('Tarjeta')
        }, 1000)
    }

    // NUEVO: Funcion centralizada para enviar el pedido al backend
    async function enviarPedidoAlBackend(metodoDePago) {
        const pedidoData = {
            total: parseFloat(totalPedidoSpan.textContent),
            items: pedidoActual.map(item => ({
                producto_id: item.id,
                cantidad: item.cantidad,
                precio_unitario: item.precio
            })),
            cliente_id: clienteSeleccionado ? clienteSeleccionado.id : null,
            metodo_pago: metodoDePago // NUEVA LINEA
        }

        try {
            const response = await fetch(API_PEDIDOS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pedidoData)
            });

            if (!response.ok) throw new Error('Error en el servidor al guardar el pedido.');

            const result = await response.json();
            generarTicket(result.pedidoId); // Llamar a generar ticket

            alert('Pedido registrado exitosamente en el sistema.');
            cancelarPedido();
            fetchPedidosActivos();
            if (clienteSeleccionado) buscarCliente();

        } catch (error) {
            console.error('Error al enviar pedido:', error);
            alert('Error al registrar el pedido en el sistema.');
        }
    }

    function cancelarPedido() {
        pedidoActual = [];
        renderPedidoActual();
        removerCliente();
    }

    window.marcarComoEntregado = async function (id) {
        await fetch(`${API_PEDIDOS}/${id}/entregar`, { method: 'PUT' });
        fetchPedidosActivos();
    };

    // --- EVENT LISTENERS (sin cambios) ---
    
    // --- INICIALIZAR ---
    // Dentro de pos.js, despues de la linea "// --- INICIALIZAR ---"
    document.getElementById('btn-logout').addEventListener('click', () => {
        sessionStorage.removeItem('user')
        window.location.href = 'login.html'
    })

    async function handleCierreCaja() {
        const confirmacion = confirm('Estas seguro de que quieres realizar el cierre de caja para las ventas en efectivo de hoy?')
        if (!confirmacion) return

        try {
            const response = await fetch(`${API_REPORTES}/cierre-caja`)
            const data = await response.json()
            const totalEsperado = parseFloat(data.total_efectivo || 0)

            const montoContadoStr = prompt(`Total esperado en caja (efectivo): $${totalEsperado.toFixed(2)}\nIngrese el monto total contado:`)
            if (montoContadoStr === null) return

            // Reutilizamos la validacion de numeros
            const regexNumeroValido = /^[0-9]*\.?[0-9]+$/
            if (!regexNumeroValido.test(montoContadoStr.trim())) return alert('Monto invalido')

            const montoContado = parseFloat(montoContadoStr)
            const diferencia = montoContado - totalEsperado

            if (diferencia === 0) {
                alert('¡Caja cuadrada! El monto contado coincide con el total esperado')
            } else if (diferencia > 0) {
                alert(`Sobrante en caja: $${diferencia.toFixed(2)}`)
            } else {
                alert(`Faltante en caja: $${Math.abs(diferencia).toFixed(2)}`)
            }

        } catch (error) {
            console.error('Error al realizar cierre de caja:', error)
            alert('No se pudo obtener el reporte de cierre de caja')
        }
    }
    inicializarPOS()
    
    // --- FUNCIONES DE INICIALIZACIÓN Y CARGA DE DATOS ---

    async function inicializarPOS() {
        await fetchProductos();
        await fetchPedidosActivos();
    }

    async function fetchProductos() {
        try {
            const response = await fetch(API_PRODUCTOS);
            menuProductos = await response.json();
            renderMenu(menuProductos);
        } catch (error) {
            console.error('Error fetching products: // Error obtener Productos', error);
        }
    }

    async function fetchPedidosActivos() {
        const response = await fetch(API_PEDIDOS);
        const pedidos = await response.json();
        renderPedidosActivos(pedidos);
    }


    // --- FUNCIONES DE RENDERIZADO (UI) ---

    function renderMenu(productos) {
        productMenu.innerHTML = '';
        productos.forEach(producto => {
            if (!producto.disponible) return;
            const item = document.createElement('div');
            item.className = 'menu-item';
            item.innerHTML = `
            <div class="menu-item-nombre">${producto.nombre}</div>
            <div class="menu-item-precio">$${producto.precio}</div>
        `;
            item.addEventListener('click', () => agregarAlPedido(producto));
            productMenu.appendChild(item);
        });
    }

    function renderPedidoActual() {
        pedidoActualDiv.innerHTML = '';
        pedidoActual.forEach(item => {
            const div = document.createElement('div');
            div.className = 'pedido-item';
            div.innerHTML = `
            <span class="pedido-item-nombre">${item.nombre}</span>
            <div class="item-controles">
                <button class="btn-cantidad" onclick="decrementarCantidad(${item.id})">-</button>
                <span>${item.cantidad}</span>
                <button class="btn-cantidad" onclick="incrementarCantidad(${item.id})">+</button>
            </div>
            <span>$${(item.precio * item.cantidad).toFixed(2)}</span>
            <button class="btn-remover-item" onclick="removerItem(${item.id})">×</button>
        `;
            pedidoActualDiv.appendChild(div);
        });
        actualizarTotal();
    }

    function renderPedidosActivos(pedidos) {
        pedidosActivosDiv.innerHTML = '';
        pedidos.forEach(pedido => {
            const div = document.createElement('div');
            div.className = 'pedido-activo-item';
            div.innerHTML = `
            <span>Pedido #${pedido.id} - $${pedido.total}</span>
            <button onclick="marcarComoEntregado(${pedido.id})">Entregado</button>
        `;
            pedidosActivosDiv.appendChild(div);
        });
    }

    function renderClienteInfo(noEncontrado = false, ci = '') {
        if (clienteSeleccionado) {
            clienteInfoDiv.innerHTML = `
            <div>
                <span class="cliente-info-nombre">${clienteSeleccionado.nombre_completo}</span>
                <button class="btn-remover-cliente" onclick="removerCliente()">Remover</button>
            </div>
            <div class="cliente-info-visitas">Visitas: ${clienteSeleccionado.visitas}</div>
        `;
        } else if (noEncontrado) {
            clienteInfoDiv.innerHTML = `Cliente no encontrado <button class="btn-registrar-cliente" onclick="registrarNuevoCliente('${ci}')">Registrar</button>`;
        } else {
            clienteInfoDiv.innerHTML = '';
        }
    }


    // --- LÓGICA DE CLIENTE ---

    async function buscarCliente() {
        const ci = searchCiInput.value.trim();
        if (!ci) return;
        try {
            const response = await fetch(`${API_CLIENTES}/buscar/${ci}`);
            if (response.ok) {
                clienteSeleccionado = await response.json();
                renderClienteInfo();
            } else {
                clienteSeleccionado = null;
                renderClienteInfo(true, ci);
            }
        } catch (error) {
            console.error('Error finding client: // Error al encontrar cliiente', error);
        }
    }

    window.registrarNuevoCliente = async function (ci) {
        const nombre = prompt('Ingrese el nombre completo del nuevo cliente:');
        if (!nombre || nombre.trim() === '') return;

        const response = await fetch(API_CLIENTES, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre_completo: nombre,
                ci: ci
            })
        });

        if (response.ok) {
            clienteSeleccionado = await response.json();
            renderClienteInfo();
        } else {
            alert('Error registering client.');
        }
    }

    window.removerCliente = function () {
        clienteSeleccionado = null;
        searchCiInput.value = '';
        renderClienteInfo();
    }


    // --- LÓGICA DE PEDIDO ---

    function agregarAlPedido(producto) {
        const itemExistente = pedidoActual.find(item => item.id === producto.id);
        if (itemExistente) {
            itemExistente.cantidad++;
        } else {
            pedidoActual.push({ ...producto, cantidad: 1 });
        }
        renderPedidoActual();
    }

    window.incrementarCantidad = function (id) {
        const item = pedidoActual.find(p => p.id === id);
        if (item) {
            item.cantidad++;
            renderPedidoActual();
        }
    }

    window.decrementarCantidad = function (id) {
        const item = pedidoActual.find(p => p.id === id);
        if (item) {
            item.cantidad--;
            if (item.cantidad === 0) {
                removerItem(id);
            } else {
                renderPedidoActual();
            }
        }
    }

    window.removerItem = function (id) {
        pedidoActual = pedidoActual.filter(p => p.id !== id);
        renderPedidoActual();
    }

    function actualizarTotal() {
        const total = pedidoActual.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
        totalPedidoSpan.textContent = total.toFixed(2);
    }

    function cancelarPedido() {
        pedidoActual = [];
        renderPedidoActual();
        removerCliente();
    }

    window.marcarComoEntregado = async function (id) {
        await fetch(`${API_PEDIDOS}/${id}/entregar`, {
            method: 'PUT'
        });
        fetchPedidosActivos();
    }


    // --- EVENT LISTENERS ---

    document.getElementById('btn-pagar-efectivo').addEventListener('click', handlePagoEfectivo);
    document.getElementById('btn-pagar-tarjeta').addEventListener('click', handlePagoTarjeta);
    document.getElementById('btn-cancelar-pedido').addEventListener('click', cancelarPedido);
    document.getElementById('btn-buscar-cliente').addEventListener('click', buscarCliente);
    document.getElementById('btn-cierre-caja').addEventListener('click', handleCierreCaja);

    searchInput.addEventListener('input', e => {
        const searchTerm = e.target.value.toLowerCase();
        const productosFiltrados = menuProductos.filter(p => p.nombre.toLowerCase().includes(searchTerm));
        renderMenu(productosFiltrados);
    });
})