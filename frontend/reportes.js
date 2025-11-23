// reportes.js
document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3000/reportes'
    const fechaInicioInput = document.getElementById('fecha-inicio')
    const fechaFinInput = document.getElementById('fecha-fin')
    const resultadoVentasDiv = document.getElementById('resultado-ventas')
    const resultadoTopProductosDiv = document.getElementById('resultado-top-productos')

    // Poner fechas por defecto (inicio del mes y hoy)
    const hoy = new Date()
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
    fechaInicioInput.value = primerDiaMes.toISOString().split('T')[0]
    fechaFinInput.value = hoy.toISOString().split('T')[0]

    // Event Listeners
    document.getElementById('btn-generar-ventas').addEventListener('click', generarReporteVentas)
    document.getElementById('btn-generar-top-productos').addEventListener('click', generarReporteTopProductos)
    document.getElementById('btn-logout').addEventListener('click', () => {
        sessionStorage.removeItem('user')
        window.location.href = 'login.html'
    })

    async function generarReporteVentas() {
        const { inicio, fin } = getFechas()
        if (!inicio || !fin) return alert('Por favor, seleccione ambas fechas')

        const response = await fetch(`${API_URL}/ventas-por-fecha?inicio=${inicio}&fin=${fin}`)
        const data = await response.json()
        
        resultadoVentasDiv.innerHTML = `
            <h3>Resumen de Ventas (${inicio} al ${fin})</h3>
            <p><strong>Total de Ventas:</strong> $${parseFloat(data.total_ventas || 0).toFixed(2)}</p>
            <p><strong>Numero de Pedidos:</strong> ${data.numero_pedidos || 0}</p>
        `
        resultadoTopProductosDiv.innerHTML = ''
    }

    async function generarReporteTopProductos() {
        const { inicio, fin } = getFechas()
        if (!inicio || !fin) return alert('Por favor, seleccione ambas fechas')

        const response = await fetch(`${API_URL}/productos-mas-vendidos?inicio=${inicio}&fin=${fin}`)
        const data = await response.json()
        
        let tableHtml = `
            <h3>Top 10 Productos Mas Vendidos (${inicio} al ${fin})</h3>
            <table>
                <tr><th>Producto</th><th>Cantidad Vendida</th></tr>
        `
        data.forEach(item => {
            tableHtml += `<tr><td>${item.nombre}</td><td>${item.total_vendido}</td></tr>`
        })
        tableHtml += '</table>'
        
        resultadoTopProductosDiv.innerHTML = tableHtml
        resultadoVentasDiv.innerHTML = ''
    }

    function getFechas() {
        return {
            inicio: fechaInicioInput.value,
            fin: fechaFinInput.value
        }
    }
})