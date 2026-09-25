import { validatorPlanEntrenamiento  } from "../validators/PlanEntrenamientoValidator.js";

class PlanEntrenamiento {
    #id;
    nombre;
    descripcion;
    duracion;
    metas_fisicas;
    id_nivel;
    precio;

    constructor(id, nombre, descripcion, duracion, metas_fisicas, id_nivel, precio) {
        validatorPlanEntrenamiento(nombre, duracion, metas_fisicas, id_nivel, precio);

        this.#id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.duracion = duracion;
        this.metas_fisicas = metas_fisicas;
        this.id_nivel = id_nivel;
        this.precio = precio;
    }

    get Id() {
        return this.#id;
    }
}

export default PlanEntrenamiento;