import pool from '../config/DataBase.js';

class SeguimientoFisicoService {
    constructor(seguimientoFisicoRepository, medidasService) {
        this.seguimientoFisicoRepository = seguimientoFisicoRepository;
        this.medidasService = medidasService;
    }

    async crear(seguimiento, medidas = []) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const [resSeg] = await connection.query(
                'INSERT INTO seguimiento_fisico (id_contrato, fecha, peso, grasa_corporal, comentarios, foto) VALUES (?,?,?,?,?,?)',
                [
                    seguimiento.id_contrato,
                    seguimiento.fecha,
                    seguimiento.peso,
                    seguimiento.grasa_corporal,
                    seguimiento.comentarios,
                    seguimiento.foto
                ]
            );
            const id_seguimiento = resSeg.insertId;

            for (const medida of medidas) {
                await connection.query(
                    'INSERT INTO medidas (id_seguimiento_fisico, tipo_medida, valor) VALUES (?,?,?)',
                    [id_seguimiento, medida.tipo_medida, medida.valor]
                );
            }

            await connection.commit();
            return id_seguimiento;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async buscarPorId(id) {
        return await this.seguimientoFisicoRepository.buscarPorId(id);
    }

    async listarPorContrato(id_contrato) {
        return await this.seguimientoFisicoRepository.listarPorContrato(id_contrato);
    }

    async listar() {
        return await this.seguimientoFisicoRepository.listar();
    }

    async actualizar(id, seguimiento) {
        return await this.seguimientoFisicoRepository.actualizar(id, seguimiento);
    }

    async eliminar(id) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            await connection.query('DELETE FROM medidas WHERE id_seguimiento_fisico = ?', [id]);
            await connection.query('DELETE FROM seguimiento_fisico WHERE id = ?', [id]);

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async obtenerProgreso(id_contrato) {
        const seguimientos = await this.seguimientoFisicoRepository.listarPorContrato(id_contrato);

        const resultado = [];
        for (const seg of seguimientos) {
            const medidas = await this.medidasService.listarPorSeguimiento(seg.id);
            resultado.push({ ...seg, medidas });
        }

        return resultado;
    }
}

export default SeguimientoFisicoService;