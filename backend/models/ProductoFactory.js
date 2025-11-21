const { Bebida, Comida, Postre } = require('./TiposDeProducto');

class ProductoFactory {
    static createProducto({ nombre, descripcion, precio, categoria }) {
        switch (categoria) {
            case 'Bebida':
                return new Bebida(nombre, descripcion, precio);
            case 'Comida':
                return new Comida(nombre, descripcion, precio);
            case 'Postre':
                return new Postre(nombre, descripcion, precio);
            default:
                throw new Error(`La categoría "${categoria}" no es válida.`);
        }
    }
}

module.exports = ProductoFactory;