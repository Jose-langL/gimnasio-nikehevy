import pool from '../config/DataBase.js';

class GestionFinancieraRepository {

    async crear(movimiento) {
        const [resultado] = await pool.query(
            'INSERT INTO gestion_financiera (id_cliente, tipo, monto, concepto, fecha) VALUES (?,?,?,?,?)',
            [
                movimiento.id_cliente,
                movimiento.tipo,
                movimiento.monto,
                movimiento.concepto,
                movimiento.fecha
            ]
        );
        return resultado.insertId;
    }

    async buscarPorId(id) {
        const [rows] = await pool.query(
            'SELECT * FROM gestion_financiera WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    async listar() {
        const [rows] = await pool.query(
            'SELECT * FROM gestion_financiera ORDER BY fecha DESC'
        );
        return rows;
    }

    async listarPorCliente(id_cliente) {
        const [rows] = await pool.query(
            'SELECT * FROM gestion_financiera WHERE id_cliente = ? ORDER BY fecha DESC',
            [id_cliente]
        );
        return rows;
    }

    async listarPorRango(fecha_inicio, fecha_fin) {
        const [rows] = await pool.query(
            'SELECT * FROM gestion_financiera WHERE fecha BETWEEN ? AND ? ORDER BY fecha DESC',
            [fecha_inicio, fecha_fin]
        );
        return rows;
    }

    async actualizar(id, movimiento) {
        const [resultado] = await pool.query(
            'UPDATE gestion_financiera SET id_cliente = ?, tipo = ?, monto = ?, concepto = ?, fecha = ? WHERE id = ?',
            [
                movimiento.id_cliente,
                movimiento.tipo,
                movimiento.monto,
                movimiento.concepto,
                movimiento.fecha,
                id
            ]
        );
        return resultado.affectedRows;
    }

    async eliminar(id) {
        const [resultado] = await pool.query(
            'DELETE FROM gestion_financiera WHERE id = ?',
            [id]
        );
        return resultado.affectedRows;
    }
}

export default GestionFinancieraRepository;