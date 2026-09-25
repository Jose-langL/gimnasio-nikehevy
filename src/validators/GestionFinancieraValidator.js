export function validatorGestionFinanciera(id_cliente, tipo, monto, concepto, fecha){
        if (id_cliente !== null && id_cliente !== undefined) {
            if (id_cliente <= 0) {
                throw new Error("El id del cliente no es valido");
            }
        }

        if (tipo !== "ingreso" && tipo !== "egreso") {
            throw new Error("El tipo debe ser ingreso o egreso");
        }

        if (!monto || monto <= 0) {
            throw new Error("El monto debe ser mayor a 0");
        }

        if (!concepto || concepto.trim() === "") {
            throw new Error("El concepto no puede estar vacio");
        }

        if (!fecha || fecha.length !== 10) {
            throw new Error("La fecha no es valida");
        }
};