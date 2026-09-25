class ClienteService {
    constructor(clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    async crear(cliente) {
        const id = await this.clienteRepository.crear(cliente);
        return id;
    }

    async buscarPorId(id) {
        const resultado = await this.clienteRepository.buscarPorId(id);
        return resultado
    }

    async listar(){
        const clientes = await this.clienteRepository.listar();
        return clientes;
    }

    async actualizar(id, cliente){
        const resultado = await this.clienteRepository.actualizar(id, cliente);
        return resultado;
    }

    async eliminar (id){
        const resultado = await this.clienteRepository.eliminar(id);
        return resultado;
    }
}


export default ClienteService;