const API_URL = 'http://localhost:3000/usuarios'
const form = document.getElementById('user-form')
const userList = document.getElementById('user-list')

document.addEventListener('DOMContentLoaded', fetchUsuarios)
form.addEventListener('submit', handleFormSubmit)

async function fetchUsuarios() {
    try {
        const response = await fetch(API_URL)
        const usuarios = await response.json()
        renderUsuarios(usuarios)
    } catch (error) {
        console.error('Error al obtener usuarios:', error)
    }
}

function renderUsuarios(usuarios) {
    userList.innerHTML = ''
    usuarios.forEach(usuario => {
        const item = document.createElement('div')
        item.className = 'user-item'
        const statusClass = usuario.activo ? 'activo' : 'inactivo'
        const statusText = usuario.activo ? 'Activoo' : 'Inactivo'
        const buttonText = usuario.activo ? 'Deshabilitar' : 'Habilitar'
        
        item.innerHTML = `
            <div class="user-info">${usuario.nombre_completo} (${usuario.rol})</div>
            <div class="user-status ${statusClass}">${statusText}</div>
            <button class="btn-toggle" onclick="handleToggleStatus(${usuario.id})">${buttonText}</button>
        `
        userList.appendChild(item)
    })
}

async function handleFormSubmit(event) {
    event.preventDefault()

    const nombreCompletoInput = document.getElementById('nombre_completo')
    const nombreCompleto = nombreCompletoInput.value

    if (nombreCompleto.trim() === '') {
        alert('El nombre completo no puede estar vacoi o contener solo espacios')
        nombreCompletoInput.focus() 
        return 
    }

    // validacio: verificar que solo contenga letras y espacios
    const regex = /^[a-zA-Z\s]+$/ // Expresion regular
    if (!regex.test(nombreCompleto)) {
        alert('El nombre completo solo puede contener letras y espacios')
        nombreCompletoInput.focus()
        return 
    }

    const password = document.getElementById('password').value
    if (password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres')
        return
    }

    const usuarioData = {
        nombre_completo: nombreCompleto, 
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
            fetchUsuarios() 
        } else {
            const error = await response.json()
            alert(`Error al crear usuario: ${error.error}`)
        }
    } catch (error) {
        console.error('Error al crear usuario:', error)
    }
}

async function handleToggleStatus(id) {
    if (confirm('Estas seguro de que quieres cambiar el estado de este usuario?')) {
        try {
            const response = await fetch(`${API_URL}/${id}/toggle-status`, { method: 'PUT' })
            if (response.ok) {
                fetchUsuarios() 
            }
        } catch (error) {
            console.error('Error al cambiar estado del usuario:', error)
        }
    }
}
document.getElementById('btn-logout').addEventListener('click', () => {
    sessionStorage.removeItem('user')
    window.location.href = 'login.html'
})