// authGuard.js
(function() {
    const user = sessionStorage.getItem('user')
    
    // Si no hay usuario en sessionStorage, redirigir al login
    if (!user) {
        window.location.href = 'login.html'
    }
})();