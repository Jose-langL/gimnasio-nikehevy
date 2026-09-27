class MedidasService {
    constructor(medidasRepository) {
        this.medidasRepository = medidasRepository;
    }

    async crear(medida) {
        const id = await this.medidasRepository.crear(medida);
        return id;
    }

    async buscarPorId(id) {
        return await this.medidasRepository.buscarPorId(id);
    }

    async listarPorSeguimiento(id_seguimiento_fisico) {
        return await this.medidasRepository.listarPorSeguimiento(id_seguimiento_fisico);
    }

    async actualizar(id, medida) {
        return await this.medidasRepository.actualizar(id, medida);
    }

    async eliminar(id) {
        return await this.medidasRepository.eliminar(id);
    }

    async eliminarPorSeguimiento(id_seguimiento_fisico) {
        return await this.medidasRepository.eliminarPorSeguimiento(id_seguimiento_fisico);
    }
}

export default MedidasService;