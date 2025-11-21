class Producto {
    constructor(nombre, descripcion, precio, categoria) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.categoria = categoria;
    }

    getInfo() {
        return `${this.nombre} (${this.categoria}) - $${this.precio}`;
    }
}

module.exports = Producto;