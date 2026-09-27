import pool from '../config/DataBase.js';

class SeguimientoFisicoRepository {

    async crear(seguimiento) {
        const [resultado] = await pool.query(
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
        return resultado.insertId;
}

    async buscarPorId(id) {
        const [rows] = await pool.query(
            'SELECT * FROM seguimiento_fisico WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    async listarPorContrato(id_contrato) {
        const [rows] = await pool.query(
            'SELECT * FROM seguimiento_fisico WHERE id_contrato = ? ORDER BY fecha ASC',
            [id_contrato]
        );
        return rows;
    }

    async listar() {
        const [rows] = await pool.query('SELECT * FROM seguimiento_fisico ORDER BY fecha DESC');
        return rows;
    }

    async actualizar(id, seguimiento) {
        const [resultado] = await pool.query(
            'UPDATE seguimiento_fisico SET id_contrato = ?, fecha = ?, peso = ?, grasa_corporal = ?, comentarios = ?, foto = ? WHERE id = ?',
            [
                seguimiento.id_contrato,
                seguimiento.fecha,
                seguimiento.peso,
                seguimiento.grasa_corporal,
                seguimiento.comentarios,
                seguimiento.foto,
                id
            ]
        );
        return resultado.affectedRows;
}
    async eliminar(id) {
        const [resultado] = await pool.query(
            'DELETE FROM seguimiento_fisico WHERE id = ?',
            [id]
        );
        return resultado.affectedRows;
    }
}

export default SeguimientoFisicoRepository;