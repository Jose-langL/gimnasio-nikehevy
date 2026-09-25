export function validatorPlanEntrenamiento(nombre, duracion, metas_fisicas, id_nivel, precio){
        if (!nombre || nombre.trim() === "") {
            throw new Error("El nombre del plan no puede estar vacio");
        }

        if (!duracion || duracion <= 0) {
            throw new Error("La duracion debe ser mayor a 0");
        }

        if (!metas_fisicas || metas_fisicas.trim() === "") {
            throw new Error("Las metas fisicas no pueden estar vacias");
        }

        if (!id_nivel || id_nivel <= 0) {
            throw new Error("El id del nivel no es valido");
        }

        if (!precio || precio <= 0) {
            throw new Error("El precio debe ser mayor a 0");
        }
};