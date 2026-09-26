class ContratoService {
    constructor(contratoRepository) {
        this.contratoRepository = contratoRepository;
    }

    async crear(contrato) {
        const id = await this.contratoRepository.crear(contrato);
        return id;
    }

    async buscarPorId(id) {
        const resultado = await this.contratoRepository.buscarPorId(id);
        return resultado;
    }

    async listar() {
        const contratos = await this.contratoRepository.listar();
        return contratos;
    }

    async actualizar(id, contrato) {
        const resultado = await this.contratoRepository.actualizar(id, contrato);
        return resultado;
    }

    async eliminar(id) {
        const resultado = await this.contratoRepository.eliminar(id);
        return resultado;
    }
}

export default ContratoService;