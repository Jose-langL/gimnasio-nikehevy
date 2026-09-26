import pool from '../config/DataBase.js';

class ContratoService {
    constructor(contratoRepository, planEntrenamientoService, contratoFactory) {
        this.contratoRepository = contratoRepository;
        this.planEntrenamientoService = planEntrenamientoService;
        this.contratoFactory = contratoFactory;
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

    async asociarClienteAPlan(id_cliente, id_plan, condiciones) {
        const planData = await this.planEntrenamientoService.buscarPorId(id_plan);

        if (!planData) {
            throw new Error("El plan no existe");
        }

        const contrato = this.contratoFactory.crear(id_cliente, planData, condiciones);

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const [resultado] = await connection.query(
                'INSERT INTO contrato (id_cliente, id_plan, condiciones, duracion, precio, fecha_inicio, fecha_fin, id_estado) VALUES (?,?,?,?,?,?,?,?)',
                [contrato.id_cliente, contrato.id_plan, contrato.condiciones, contrato.duracion, contrato.precio, contrato.fecha_inicio, contrato.fecha_fin, contrato.id_estado]
            );

            await connection.commit();
            return resultado.insertId;

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

export default ContratoService;