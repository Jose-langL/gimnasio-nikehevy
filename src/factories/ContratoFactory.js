import Contrato from '../models/Contrato.js';

class ContratoFactory {
    crear(id_cliente, plan, condiciones) {
        const hoy = new Date();
        const diasTotales = plan.duracion * 7;

        const fechaFinObjeto = new Date(hoy);
        fechaFinObjeto.setDate(fechaFinObjeto.getDate() + diasTotales);

        const fecha_inicio = hoy.toISOString().split("T")[0];
        const fecha_fin = fechaFinObjeto.toISOString().split("T")[0];

        const id_estado = 1;

        return new Contrato(
            null,
            id_cliente,
            plan.id,
            condiciones,
            plan.duracion,
            plan.precio,
            fecha_inicio,
            fecha_fin,
            id_estado
        );
    }
}

export default ContratoFactory