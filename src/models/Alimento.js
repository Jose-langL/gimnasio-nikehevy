import { validarAlimento } from "../validators/AlimentoValidator.js";

class Alimento {
    #id;
    nombre;
    id_categoria;
    calorias;
    proteinas;
    carbohidratos;
    grasas;

    constructor( nombre, id_categoria, calorias, proteinas, carbohidratos, grasas) {
        validarAlimento(nombre, id_categoria, calorias, proteinas, grasas)

        this.nombre = nombre;
        this.id_categoria = id_categoria;
        this.calorias = calorias;
        this.proteinas = proteinas;
        this.carbohidratos = carbohidratos;
        this.grasas = grasas;
    }

    get Id() {
        return this.#id;
    }
}

export default Alimento;