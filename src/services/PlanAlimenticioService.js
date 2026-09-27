class PlanAlimenticioService {
    constructor(planAlimenticioRepository) {
        this.planAlimenticioRepository = planAlimenticioRepository;
    }

    async crear(plan) {
        const id = await this.planAlimenticioRepository.crear(plan);
        return id;
    }

    async buscarPorId(id) {
        return await this.planAlimenticioRepository.buscarPorId(id);
    }

    async listarPorContrato(id_contrato) {
        return await this.planAlimenticioRepository.listarPorContrato(id_contrato);
    }

    async listar() {
        return await this.planAlimenticioRepository.listar();
    }

    async actualizar(id, plan) {
        return await this.planAlimenticioRepository.actualizar(id, plan);
    }

    async eliminar(id) {
        return await this.planAlimenticioRepository.eliminar(id);
    }
}

export default PlanAlimenticioService;