import pool from '../config/DataBase.js';

class MedidasRepository {

    async crear(medida) {
        const [resultado] = await pool.query(
            'INSERT INTO medidas (id_seguimiento_fisico, tipo_medida, valor) VALUES (?,?,?)',
            [
                medida.id_seguimiento_fisico,
                medida.tipo_medida,
                medida.valor
            ]
        );
        return resultado.insertId;
    }

    async buscarPorId(id) {
        const [rows] = await pool.query(
            'SELECT * FROM medidas WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    async listarPorSeguimiento(id_seguimiento_fisico) {
        const [rows] = await pool.query(
            'SELECT * FROM medidas WHERE id_seguimiento_fisico = ?',
            [id_seguimiento_fisico]
        );
        return rows;
    }

    async actualizar(id, medida) {
        const [resultado] = await pool.query(
            'UPDATE medidas SET id_seguimiento_fisico = ?, tipo_medida = ?, valor = ? WHERE id = ?',
            [
                medida.id_seguimiento_fisico,
                medida.tipo_medida,
                medida.valor,
                id
            ]
        );
        return resultado.affectedRows;
    }

    async eliminar(id) {
        const [resultado] = await pool.query(
            'DELETE FROM medidas WHERE id = ?',
            [id]
        );
        return resultado.affectedRows;
    }

    async eliminarPorSeguimiento(id_seguimiento_fisico) {
        const [resultado] = await pool.query(
            'DELETE FROM medidas WHERE id_seguimiento_fisico = ?',
            [id_seguimiento_fisico]
        );
        return resultado.affectedRows;
    }
}

export default MedidasRepository;