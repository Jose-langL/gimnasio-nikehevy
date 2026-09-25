class PlanEntrenamientoService {
    constructor (PlanEntrenamientoRepository){
        this.PlanEntrenamientoRepository = PlanEntrenamientoRepository;
    }

    async crear(plan){
        const id = await this.PlanEntrenamientoRepository.crear(plan);
        return id;
    }

    async buscarPorId(id) {
        const resultado = await this.PlanEntrenamientoRepository.buscarPorId(id);
        return resultado
    }

    async listar(){
        const planEntrenamiento = await this.PlanEntrenamientoRepository.listar();
        return planEntrenamiento;
    }

    async actualizar(id, plan){
        const resultado = await this.PlanEntrenamientoRepository.actualizar(id, plan);
        return resultado;
    }

    async eliminar (id){
        const resultado = await this.PlanEntrenamientoRepository.eliminar(id);
        return resultado;
    }
}

export default PlanEntrenamientoService;
