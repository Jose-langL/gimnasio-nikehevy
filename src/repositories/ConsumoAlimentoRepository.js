import pool from '../config/DataBase.js';

class ConsumoAlimentoRepository {

    async crear(consumo) {
        const [resultado] = await pool.query(
            'INSERT INTO consumo_alimento (id_plan_alimenticio, id_alimento, fecha, cantidad) VALUES (?,?,?,?)',
            [
                consumo.id_plan_alimenticio,
                consumo.id_alimento,
                consumo.fecha,
                consumo.cantidad
            ]
        );
        return resultado.insertId;
    }

    async buscarPorId(id) {
        const [rows] = await pool.query(
            'SELECT * FROM consumo_alimento WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    async listarPorPlan(id_plan_alimenticio) {
        const [rows] = await pool.query(
            'SELECT * FROM consumo_alimento WHERE id_plan_alimenticio = ? ORDER BY fecha ASC',
            [id_plan_alimenticio]
        );
        return rows;
    }

    async listarPorPlanYRango(id_plan_alimenticio, fecha_inicio, fecha_fin) {
        const [rows] = await pool.query(
            'SELECT * FROM consumo_alimento WHERE id_plan_alimenticio = ? AND fecha BETWEEN ? AND ? ORDER BY fecha ASC',
            [id_plan_alimenticio, fecha_inicio, fecha_fin]
        );
        return rows;
    }

    async listar() {
        const [rows] = await pool.query('SELECT * FROM consumo_alimento ORDER BY fecha DESC');
        return rows;
    }

    async actualizar(id, consumo) {
        const [resultado] = await pool.query(
            'UPDATE consumo_alimento SET id_plan_alimenticio = ?, id_alimento = ?, fecha = ?, cantidad = ? WHERE id = ?',
            [
                consumo.id_plan_alimenticio,
                consumo.id_alimento,
                consumo.fecha,
                consumo.cantidad,
                id
            ]
        );
        return resultado.affectedRows;
    }

    async eliminar(id) {
        const [resultado] = await pool.query(
            'DELETE FROM consumo_alimento WHERE id = ?',
            [id]
        );
        return resultado.affectedRows;
    }

    async eliminarPorPlan(id_plan_alimenticio) {
        const [resultado] = await pool.query(
            'DELETE FROM consumo_alimento WHERE id_plan_alimenticio = ?',
            [id_plan_alimenticio]
        );
        return resultado.affectedRows;
    }
}

export default ConsumoAlimentoRepository;