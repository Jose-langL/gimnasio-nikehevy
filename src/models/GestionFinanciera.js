import { validatorGestionFinanciera } from "../validators/GestionFinancieraValidator.js";

class GestionFinanciera {
    #id;
    id_cliente;
    tipo;
    monto;
    concepto;
    fecha;

    constructor(id_cliente, tipo, monto, concepto, fecha) {
        validatorGestionFinanciera(id_cliente, tipo, monto, concepto, fecha)
        
        this.#id = id; 
        this.id_cliente = id_cliente;
        this.tipo = tipo;
        this.monto = monto;
        this.concepto = concepto;
        this.fecha = fecha;
    }

    get Id() {
        return this.#id;
    }
}

export default GestionFinanciera;