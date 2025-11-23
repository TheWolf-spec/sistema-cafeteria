# Sistema de Cafetería - Proyecto Final Completo

Este es el proyecto final para la materia Desarrollo de Sistemas II. Es una aplicación web full-stack que simula un sistema de gestión para una cafetería, incluyendo un Punto de Venta (POS) y un panel de administración.

## Características Implementadas

-   **Arquitectura en 3 Capas:** Frontend, Backend y Base de Datos desacoplados.
-   **Sistema de Autenticación:**
    -   Pantalla de login y logout.
    -   Redirección basada en roles (Administrador, Cajero).
    -   Protección de rutas del frontend.
-   **Panel de Administración (Rol: Administrador):**
    -   Gestión completa de productos (CRUD).
    -   Gestión completa de usuarios (crear, listar, habilitar/deshabilitar).
    -   Log de auditoría para acciones de usuarios.
    -   Módulo de reportes (ventas por fecha y productos más vendidos).
-   **Punto de Venta (POS) (Rol: Cajero):**
    -   Toma de pedidos interactiva con búsqueda de productos.
    -   Gestión de clientes (búsqueda y registro por CI) y programa de lealtad (conteo de visitas).
    -   Modificación del carrito de compras en tiempo real (cambiar cantidad, eliminar item).
    -   Simulación de pagos (Efectivo y Tarjeta) con cálculo de cambio.
    -   Generación de ticket para impresión.
    -   Visualización y gestión de pedidos activos.
    -   Función simplificada de Cierre de Caja.

## Tecnologías Utilizadas

-   **Frontend:** HTML5, CSS3, JavaScript (Vanilla JS)
-   **Backend:** Node.js, Express.js, bcrypt
-   **Base de Datos:** PostgreSQL
-   **Patrón de Diseño Aplicado:** Factory Method (para la creación de productos).

## Cómo Ejecutar el Proyecto

1.  **Base de Datos:**
    -   Crear una base de datos en PostgreSQL llamada `cafeteria_db`.
    -   Ejecutar el script SQL proporcionado para crear toda la estructura de tablas.
2.  **Backend:**
    -   Navegar a la carpeta `backend`, ejecutar `npm install` y luego `npm start`.
3.  **Frontend:**
    -   Usar la extensión "Live Server" de VS Code y abrir `frontend/login.html`.

## Credenciales de Prueba

-   **Administrador:** `admin@cafeteria.com` / `admin123`
-   **Administrador**  `Franz@gmail.com` / `123456`
-   **Cajero** `Juan@Juanerobananero.com` / `123456`
