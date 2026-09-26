class PlanEntrenamientoService {
    constructor(planEntrenamientoRepository) {
        this.planEntrenamientoRepository = planEntrenamientoRepository;
    }

    async crear(plan) {
        const id = await this.planEntrenamientoRepository.crear(plan);
        return id;
    }

    async buscarPorId(id) {
        const resultado = await this.planEntrenamientoRepository.buscarPorId(id);
        return resultado;
    }

    async listar() {
        const planes = await this.planEntrenamientoRepository.listar();
        return planes;
    }

    async actualizar(id, plan) {
        const resultado = await this.planEntrenamientoRepository.actualizar(id, plan);
        return resultado;
    }

    async eliminar(id) {
        const resultado = await this.planEntrenamientoRepository.eliminar(id);
        return resultado;
    }
}

export default PlanEntrenamientoService;