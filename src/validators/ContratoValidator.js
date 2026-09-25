export function validatorContrato(id_cliente, id_plan, condiciones, duracion, precio, fecha_inicio, fecha_fin, id_estado){
    
        if (!id_cliente || id_cliente <= 0) {
            throw new Error("El id del cliente no es valido");
        }

        if (!id_plan || id_plan <= 0) {
            throw new Error("El id del plan no es valido");
        }

        if (!condiciones || condiciones.trim() === "") {
            throw new Error("Las condiciones no pueden estar vacias");
        }

        if (!duracion || duracion <= 0) {
            throw new Error("La duracion debe ser mayor a 0");
        }

        if (!precio || precio <= 0) {
            throw new Error("El precio debe ser mayor a 0");
        }

        if (!fecha_inicio || fecha_inicio.length !== 10) {
            throw new Error("La fecha de inicio no es valida");
        }

        if (!fecha_fin || fecha_fin.length !== 10) {
            throw new Error("La fecha de fin no es valida");
        }

        if (fecha_fin <= fecha_inicio) {
            throw new Error("La fecha de fin debe ser posterior a la fecha de inicio");
        }

        if (!id_estado || id_estado <= 0) {
            throw new Error("El id del estado no es valido");
        }
};