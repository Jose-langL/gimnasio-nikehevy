import { validatorSeguimientoFisico  } from "../validators/SeguimientoFisicoValidator.js";

class SeguimientoFisico {
    #id;
    id_contrato;
    fecha;
    peso;
    grasa_corporal;
    comentarios
    foto;

    constructor(id, id_contrato, fecha, peso, grasa_corporal, comentarios, foto) {
        validatorSeguimientoFisico(id_contrato, fecha, peso, grasa_corporal,)
        
        this.#id = id;
        this.id_contrato = id_contrato;
        this.fecha = fecha;
        this.peso = peso;
        this.grasa_corporal = grasa_corporal;
        this.comentarios = comentarios;
        this.foto = foto;
    }

    get Id() {
        return this.#id;
    }
}

export default SeguimientoFisico;