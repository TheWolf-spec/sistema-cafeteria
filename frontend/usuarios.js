// usuarios.js

// --- CONFIGURACION INICIAL ---
const API_URL = 'http://localhost:3000/usuarios'
const form = document.getElementById('user-form')
const userList = document.getElementById('user-list')

// --- EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', fetchUsuarios)
form.addEventListener('submit', handleFormSubmit)

// --- FUNCIONES PRINCIPALES ---

// 1 Obtener y mostrar todos los usuarios
async function fetchUsuarios() {
    try {
        const response = await fetch(API_URL)
        const usuarios = await response.json()
        renderUsuarios(usuarios)
    } catch (error) {
        console.error('Error al obtener usuarios:', error)
    }
}

// 2 Renderizar la lista de usuarios en el HTML
function renderUsuarios(usuarios) {
    userList.innerHTML = ''
    usuarios.forEach(usuario => {
        const item = document.createElement('div')
        item.className = 'user-item'
        const statusClass = usuario.activo ? 'activo' : 'inactivo'
        const statusText = usuario.activo ? 'Activo' : 'Inactivo'
        const buttonText = usuario.activo ? 'Deshabilitar' : 'Habilitar'
        
        item.innerHTML = `
            <div class="user-info">${usuario.nombre_completo} (${usuario.rol})</div>
            <div class="user-status ${statusClass}">${statusText}</div>
            <button class="btn-toggle" onclick="handleToggleStatus(${usuario.id})">${buttonText}</button>
        `
        userList.appendChild(item)
    })
}

// 3 Manejar el envio del formulario para crear un nuevo usuario (VERSION ACTUALIZADA)
async function handleFormSubmit(event) {
    event.preventDefault()

    // --- BLOQUE DE VALIDACION DE NOMBRE ---
    const nombreCompletoInput = document.getElementById('nombre_completo')
    const nombreCompleto = nombreCompletoInput.value

    // Validacion 1: Verificar que no sea solo espacios en blanco
    if (nombreCompleto.trim() === '') {
        alert('El nombre completo no puede estar vacio o contener solo espacios')
        nombreCompletoInput.focus() // Pone el cursor de vuelta en el campo de nombre
        return // Detiene la ejecucion de la funcion
    }

    // Validacion 2: Verificar que solo contenga letras y espacios
    const regex = /^[a-zA-Z\s]+$/ // Expresion regular para nombres
    if (!regex.test(nombreCompleto)) {
        alert('El nombre completo solo puede contener letras y espacios')
        nombreCompletoInput.focus()
        return // Detiene la ejecucion
    }
    // --- FIN DEL BLOQUE DE VALIDACION ---

    const password = document.getElementById('password').value
    if (password.length < 6) {
        alert('La contrasena debe tener al menos 6 caracteres')
        return
    }

    const usuarioData = {
        nombre_completo: nombreCompleto, // Usamos la variable ya validada
        email: document.getElementById('email').value,
        rol: document.getElementById('rol').value,
        password: password
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuarioData)
        })
        if (response.ok) {
            form.reset()
            fetchUsuarios() // Recargar la lista
        } else {
            const error = await response.json()
            alert(`Error al crear usuario: ${error.error}`)
        }
    } catch (error) {
        console.error('Error al crear usuario:', error)
    }
}

// 4 Habilitar o deshabilitar una cuenta de usuario
async function handleToggleStatus(id) {
    if (confirm('Estas seguro de que quieres cambiar el estado de este usuario?')) {
        try {
            const response = await fetch(`${API_URL}/${id}/toggle-status`, { method: 'PUT' })
            if (response.ok) {
                fetchUsuarios() // Recargar la lista para mostrar el nuevo estado
            }
        } catch (error) {
            console.error('Error al cambiar estado del usuario:', error)
        }
    }
}