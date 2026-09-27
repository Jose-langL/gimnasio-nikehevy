class ConsumoAlimentoService {
    constructor(consumoAlimentoRepository, alimentoService) {
        this.consumoAlimentoRepository = consumoAlimentoRepository;
        this.alimentoService = alimentoService;
    }

    async crear(consumo) {
        const id = await this.consumoAlimentoRepository.crear(consumo);
        return id;
    }

    async buscarPorId(id) {
        return await this.consumoAlimentoRepository.buscarPorId(id);
    }

    async listarPorPlan(id_plan_alimenticio) {
        return await this.consumoAlimentoRepository.listarPorPlan(id_plan_alimenticio);
    }

    async listar() {
        return await this.consumoAlimentoRepository.listar();
    }

    async actualizar(id, consumo) {
        return await this.consumoAlimentoRepository.actualizar(id, consumo);
    }

    async eliminar(id) {
        return await this.consumoAlimentoRepository.eliminar(id);
    }

    async eliminarPorPlan(id_plan_alimenticio) {
        return await this.consumoAlimentoRepository.eliminarPorPlan(id_plan_alimenticio);
    }

    async obtenerReporteSemanal(id_plan_alimenticio, fecha_inicio, fecha_fin) {
        const consumos = await this.consumoAlimentoRepository.listarPorPlanYRango(
            id_plan_alimenticio,
            fecha_inicio,
            fecha_fin
        );

        const totales = { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 };
        const porDia = {};

        for (const c of consumos) {
            const alimento = await this.alimentoService.buscarPorId(c.id_alimento);
            if (!alimento) continue;

            const factor = c.cantidad / 100;

            const kcal = Number(alimento.calorias) * factor;
            const prot = Number(alimento.proteinas) * factor;
            const carb = Number(alimento.carbohidratos) * factor;
            const gras = Number(alimento.grasas) * factor;

            totales.calorias += kcal;
            totales.proteinas += prot;
            totales.carbohidratos += carb;
            totales.grasas += gras;

            const fecha = this._fechaBonita(c.fecha);
            if (!porDia[fecha]) {
                porDia[fecha] = { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 };
            }
            porDia[fecha].calorias += kcal;
            porDia[fecha].proteinas += prot;
            porDia[fecha].carbohidratos += carb;
            porDia[fecha].grasas += gras;
        }
        const redondear = (n) => Math.round(n * 10) / 10;

        totales.calorias = redondear(totales.calorias);
        totales.proteinas = redondear(totales.proteinas);
        totales.carbohidratos = redondear(totales.carbohidratos);
        totales.grasas = redondear(totales.grasas);

        for (const fecha in porDia) {
            porDia[fecha].calorias = redondear(porDia[fecha].calorias);
            porDia[fecha].proteinas = redondear(porDia[fecha].proteinas);
            porDia[fecha].carbohidratos = redondear(porDia[fecha].carbohidratos);
            porDia[fecha].grasas = redondear(porDia[fecha].grasas);
        }

        return {
            fecha_inicio,
            fecha_fin,
            totales,
            porDia,
            cantidadRegistros: consumos.length
        };
    }

    _fechaBonita(fecha) {
        if (typeof fecha === 'string') {
            return fecha.split('T')[0];
        }
        const d = new Date(fecha);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}

export default ConsumoAlimentoService;