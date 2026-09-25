export function validatorMedidas(id_seguimiento, tipo_medida, valor){
    if (!id_seguimiento || id_seguimiento <= 0) {
        throw new Error("El id del seguimiento no es valido");
    }

    if (!tipo_medida || tipo_medida.trim() === "") {
        throw new Error("El tipo de medida no puede estar vacio");
    }

    if (!valor || valor <= 0) {
        throw new Error("El valor de la medida debe ser mayor a 0");
    }

    if (valor > 300) {
        throw new Error("El valor de la medida no es realista");
    }
};