import pool from '../config/DataBase.js';

class AlimentoRepository {

    async crear(alimento) {
        const [resultado] = await pool.query(
            'INSERT INTO alimento (nombre, id_categoria, calorias, proteinas, carbohidratos, grasas) VALUES (?,?,?,?,?,?)',
            [
                alimento.nombre,
                alimento.id_categoria,
                alimento.calorias,
                alimento.proteinas,
                alimento.carbohidratos,
                alimento.grasas
            ]
        );
        return resultado.insertId;
    }

    async buscarPorId(id) {
        const [rows] = await pool.query(
            'SELECT * FROM alimento WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    async listar() {
        const [rows] = await pool.query('SELECT * FROM alimento ORDER BY nombre ASC');
        return rows;
    }

    async listarPorCategoria(id_categoria) {
        const [rows] = await pool.query(
            'SELECT * FROM alimento WHERE id_categoria = ? ORDER BY nombre ASC',
            [id_categoria]
        );
        return rows;
    }

    async actualizar(id, alimento) {
        const [resultado] = await pool.query(
            'UPDATE alimento SET nombre = ?, id_categoria = ?, calorias = ?, proteinas = ?, carbohidratos = ?, grasas = ? WHERE id = ?',
            [
                alimento.nombre,
                alimento.id_categoria,
                alimento.calorias,
                alimento.proteinas,
                alimento.carbohidratos,
                alimento.grasas,
                id
            ]
        );
        return resultado.affectedRows;
    }

    async eliminar(id) {
        const [resultado] = await pool.query(
            'DELETE FROM alimento WHERE id = ?',
            [id]
        );
        return resultado.affectedRows;
    }
}

export default AlimentoRepository;