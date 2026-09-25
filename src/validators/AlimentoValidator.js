export function validarAlimento (nombre, id_categoria, calorias, proteinas, grasas){
    
        if (!nombre || nombre.trim() === "") {
            throw new Error("El nombre del alimento no puede estar vacio");
        }

        if (!id_categoria || id_categoria <= 0) {
            throw new Error("El id de la categoria no es valido");
        }

        if (!calorias || calorias <= 0) {
            throw new Error("Las calorias deben ser mayores a 0");
        }

        if (proteinas !== null && proteinas !== undefined) {
            if (proteinas < 0) {
                throw new Error("Las proteinas no pueden ser negativas");
            }
        }

        if (carbohidratos !== null && carbohidratos !== undefined) {
            if (carbohidratos < 0) {
                throw new Error("Los carbohidratos no pueden ser negativos");
            }
        }

        if (grasas !== null && grasas !== undefined) {
            if (grasas < 0) {
                throw new Error("Las grasas no pueden ser negativas");
            }
        }
}