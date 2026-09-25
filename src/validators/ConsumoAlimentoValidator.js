export function validatorConsumoAlimento(id_plan_alimenticio, id_alimento, fecha, cantidad){
    if (!id_plan_alimenticio || id_plan_alimenticio <= 0) {
            throw new Error("El id del plan alimenticio no es valido");
        }

        if (!id_alimento || id_alimento <= 0) {
            throw new Error("El id del alimento no es valido");
        }

        if (!fecha || fecha.length !== 10) {
            throw new Error("La fecha no es valida");
        }

        if (!cantidad || cantidad <= 0) {
            throw new Error("La cantidad debe ser mayor a 0");
        }

};