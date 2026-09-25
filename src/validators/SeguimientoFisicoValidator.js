export function validatorSeguimientoFisico(id_contrato, fecha, peso, grasa_corporal){
        if (!id_contrato || id_contrato <= 0) {
            throw new Error("El id del contrato no es valido");
        }

        if (!fecha || fecha.length !== 10) {
            throw new Error("La fecha no es valida");
        }

        if (!peso || peso <= 0) {
            throw new Error("El peso debe ser mayor a 0");
        }

        if (peso > 500) {
            throw new Error("El peso ingresado no es realista");
        }

        if (grasa_corporal !== null && grasa_corporal !== undefined) {
            if (grasa_corporal < 0 || grasa_corporal > 100) {
                throw new Error("El porcentaje de grasa corporal debe estar entre 0 y 100");
            }
        }
}