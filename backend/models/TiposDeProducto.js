const Producto = require('./Producto');

class Bebida extends Producto {
    constructor(nombre, descripcion, precio) {
        super(nombre, descripcion, precio, 'Bebida');
        this.tipo = 'Líquido'; 
    }
}

class Comida extends Producto {
    constructor(nombre, descripcion, precio) {
        super(nombre, descripcion, precio, 'Comida');
        this.alergenos = []; // Atributo specific de Comida
    }
}

class Postre extends Producto {
    constructor(nombre, descripcion, precio) {
        super(nombre, descripcion, precio, 'Postre');
        this.contieneAzucar = true; // Atributo specificc de Postre
    }
}

module.exports = { Bebida, Comida, Postre };