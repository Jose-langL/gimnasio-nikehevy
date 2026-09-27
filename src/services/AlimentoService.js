class AlimentoService {
    constructor(alimentoRepository) {
        this.alimentoRepository = alimentoRepository;
    }

    async crear(alimento) {
        const id = await this.alimentoRepository.crear(alimento);
        return id;
    }

    async buscarPorId(id) {
        return await this.alimentoRepository.buscarPorId(id);
    }

    async listar() {
        return await this.alimentoRepository.listar();
    }

    async listarPorCategoria(id_categoria) {
        return await this.alimentoRepository.listarPorCategoria(id_categoria);
    }

    async actualizar(id, alimento) {
        return await this.alimentoRepository.actualizar(id, alimento);
    }

    async eliminar(id) {
        return await this.alimentoRepository.eliminar(id);
    }
}

export default AlimentoService;