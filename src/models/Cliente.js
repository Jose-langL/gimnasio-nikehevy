import { validarCliente } from '../validators/ClienteValidator.js';

class Cliente {
    #id;
    nombre;
    apellido;
    email;
    telefono;
    estado;
    fecha_registro;

    constructor(id, nombre, apellido, email, telefono, estado, fecha_registro) {
        
        validarCliente(nombre, email, telefono, estado, fecha_registro);

        this.#id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.telefono = telefono;
        this.estado = estado;
        this.fecha_registro = fecha_registro;
    }

    get Id() {
        return this.#id;
    }
}

export default Cliente;
