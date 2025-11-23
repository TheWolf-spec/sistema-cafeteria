// login.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form')
    const errorMessage = document.getElementById('error-message')
    const API_LOGIN = 'http://localhost:3000/auth/login'

    form.addEventListener('submit', async (event) => {
        event.preventDefault()
        errorMessage.textContent = ''

        const email = document.getElementById('email').value
        const password = document.getElementById('password').value

        try {
            const response = await fetch(API_LOGIN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al iniciar sesion')
            }

            // Guardar informacion del usuario en sessionStorage
            // sessionStorage se borra cuando se cierra la pestaña del navegador
            sessionStorage.setItem('user', JSON.stringify(data.user))

            // Redirigir segun el rol del usuario
            if (data.user.rol === 'administrador') {
                window.location.href = 'index.html'
            } else if (data.user.rol === 'cajero') {
                window.location.href = 'pos.html'
            } else {
                errorMessage.textContent = 'Rol no reconocido'
            }

        } catch (error) {
            errorMessage.textContent = error.message
        }
    })
})