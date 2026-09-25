import { validatorContrato } from "../validators/ContratoValidator.js";

class Contrato {
    #id;
    id_cliente;
    id_plan;
    condiciones;
    duracion;
    precio;
    fecha_inicio;
    fecha_fin;
    id_estado;
    
    constructor(id_cliente, id_plan, condiciones, duracion, precio, fecha_inicio, fecha_fin, id_estado) {
        validatorContrato(id_cliente, id_plan, condiciones, duracion, precio, fecha_inicio, fecha_fin, id_estado);

        this.id_cliente = id_cliente;
        this.id_plan = id_plan;
        this.condiciones = condiciones;
        this.duracion = duracion;
        this.precio = precio;
        this.fecha_inicio = fecha_inicio;
        this.fecha_fin = fecha_fin;
        this.id_estado = id_estado;
    }

    get Id() {
        return this.#id;
    }
}

export default Contrato;