export function validatorPlanAlimenticio(id_contrato, nombre, fecha_inicio, fecha_fin){
        if (!id_contrato || id_contrato <= 0) {
            throw new Error("El id del contrato no es valido");
        }

        if (!nombre || nombre.trim() === "") {
            throw new Error("El nombre del plan alimenticio no puede estar vacio");
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
};