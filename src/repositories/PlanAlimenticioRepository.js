import pool from '../config/DataBase.js';

class PlanAlimenticioRepository {

    async crear(plan) {
        const [resultado] = await pool.query(
            'INSERT INTO planes_alimenticios (id_contrato, nombre, fecha_inicio, fecha_fin) VALUES (?,?,?,?)',
            [
                plan.id_contrato,
                plan.nombre,
                plan.fecha_inicio,
                plan.fecha_fin
            ]
        );
        return resultado.insertId;
    }

    async buscarPorId(id) {
        const [rows] = await pool.query(
            'SELECT * FROM planes_alimenticios WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    async listarPorContrato(id_contrato) {
        const [rows] = await pool.query(
            'SELECT * FROM planes_alimenticios WHERE id_contrato = ? ORDER BY fecha_inicio DESC',
            [id_contrato]
        );
        return rows;
    }

    async listar() {
        const [rows] = await pool.query('SELECT * FROM planes_alimenticios ORDER BY fecha_inicio DESC');
        return rows;
    }

    async actualizar(id, plan) {
        const [resultado] = await pool.query(
            'UPDATE planes_alimenticios SET id_contrato = ?, nombre = ?, fecha_inicio = ?, fecha_fin = ? WHERE id = ?',
            [
                plan.id_contrato,
                plan.nombre,
                plan.fecha_inicio,
                plan.fecha_fin,
                id
            ]
        );
        return resultado.affectedRows;
    }

    async eliminar(id) {
        const [resultado] = await pool.query(
            'DELETE FROM planes_alimenticios WHERE id = ?',
            [id]
        );
        return resultado.affectedRows;
    }
}

export default PlanAlimenticioRepository;   