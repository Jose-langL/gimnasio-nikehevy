import pool from '../config/DataBase.js';

class PlanEntrenamientoRepository {

    async crear (plan){
        const [resultado] = await pool.query(
            'INSERT INTO planes_entrenamiento (nombre, duracion, metas_fisicas, id_nivel, precio) VALUES (?,?,?,?,?)',
            [plan.nombre, plan.duracion, plan.metas_fisicas, plan.id_nivel, plan.precio]
        );
        return resultado.insertId;
    }

    async buscarPorId(id) {
        const [rows] = await pool.query('SELECT * FROM planes_entrenamiento  WHERE id = ?', [id]);
        return rows[0];
    }
    
    async listar(){
        const [resultado] = await pool.query(
            'SELECT * FROM planes_entrenamiento'
        );
        return resultado;
    }

    async actualizar(id, plan){
        const [resultado] = await pool.query(
            'UPDATE planes_entrenamiento SET nombre = ?, duracion = ?, metas_fisicas = ?, id_nivel = ?, precio = ? WHERE id = ? ',
            [plan.nombre, plan.duracion, plan.metas_fisicas, plan.id_nivel, plan.precio, id]
        );
        return resultado.affectedRows;
    }

    async eliminar (id){
        const [resultado] = await pool.query(
            'DELETE FROM planes_entrenamiento where id = ?',
            [id]
        );
        return resultado.affectedRows;
    }
}

export default PlanEntrenamientoRepository;
