
const API_URL = 'http://localhost:3000/productos';
const form = document.getElementById('product-form');
const productList = document.getElementById('product-list');

document.addEventListener('DOMContentLoaded', fetchProductos);
form.addEventListener('submit', handleFormSubmit);
document.getElementById('clear-btn').addEventListener('click', () => {
    form.reset();
    document.getElementById('product-id').value = '';
});

// 1. Obtener y mostrar todos los productos (GET)
async function fetchProductos() {
    try {
        const response = await fetch(API_URL);
        const productos = await response.json();
        renderProductos(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
    }
}

//  Renderizar  la lista de productos en el HTML
function renderProductos(productos) {
    productList.innerHTML = ''; // clean la lista actual
    productos.forEach(producto => {
        const item = document.createElement('div');
        item.className = 'product-item';
        item.innerHTML = `
            <div class="product-info">${producto.nombre} (${producto.categoria}) - $${producto.precio} [${producto.disponible ? 'Disponible' : 'Agotado'}]</div>
            <button class="btn-edit" onclick="handleEdit(${producto.id})">Editar</button>
            <button class="btn-delete" onclick="handleDelete(${producto.id})">Eliminar</button>
        `;
        productList.appendChild(item);
    });
}

// Validacion de envio del formulario
async function handleFormSubmit(event) {
    event.preventDefault(); // eviat que la page se recargue

    const nombreInput = document.getElementById('nombre');
    const nombre = nombreInput.value;

    if (nombre.trim() === '') {
        alert('El nombre del producto no puede estar vacio o cnotener solo espacios');
        nombreInput.focus(); 
        return; 
    }

    const regex = /^[a-zA-Z0-9\s]+$/; 
    if (!regex.test(nombre)) {
        alert('El nombre del producto solo puede contener letras, numeros y espacios');
        nombreInput.focus();
        return; 
    }

    const id = document.getElementById('product-id').value;
    const productoData = {
        nombre: nombre, // Usamos la variable ya obtenida
        descripcion: document.getElementById('descripcion').value,
        precio: parseFloat(document.getElementById('precio').value),
        categoria: document.getElementById('categoria').value,
        disponible: document.getElementById('disponible').checked
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productoData)
        });
        if (response.ok) {
            form.reset();
            document.getElementById('product-id').value = '';
            fetchProductos(); // recargar la lista
        } else {
            const error = await response.json();
            alert(`Error al guardar: ${error.error}`);
        }
    } catch (error) {
        console.error('Error al guardar producto:', error);
    }
}

// formulario para editar un producto
async function handleEdit(id) {
    const response = await fetch(`${API_URL}`);
    const productos = await response.json();
    const producto = productos.find(p => p.id === id);

    if (producto) {
        document.getElementById('product-id').value = producto.id;
        document.getElementById('nombre').value = producto.nombre;
        document.getElementById('descripcion').value = producto.descripcion;
        document.getElementById('precio').value = producto.precio;
        document.getElementById('categoria').value = producto.categoria;
        document.getElementById('disponible').checked = producto.disponible;
    }
}

//Eliminar un producto (DELETE)
async function handleDelete(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (response.ok) {
                fetchProductos(); // recargar la lista
            }
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    }
}
document.getElementById('btn-logout').addEventListener('click', () => {
    sessionStorage.removeItem('user')
    window.location.href = 'login.html'
})