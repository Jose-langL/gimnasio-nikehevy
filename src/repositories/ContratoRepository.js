import pool from '../config/DataBase.js';

class ContratoRepository {

    async crear (contrato){
        const [resultado] = await pool.query(
            'INSERT INTO contrato (id_cliente, id_plan, condiciones, duracion, precio, fecha_inicio, fecha_fin, id_estado) VALUES (?,?,?,?,?,?,?,?)',
            [contrato.id_cliente, contrato.id_plan, contrato.condiciones, contrato.duracion, contrato.precio, contrato.fecha_inicio, contrato.fecha_fin, contrato.id_estado]
        );
        return resultado.insertId;
    }

    async buscarPorId(id) {
        const [rows] = await pool.query('SELECT * FROM contrato  WHERE id = ?', [id]);
        return rows[0];
    }
    
    async listar(){
        const [resultado] = await pool.query(
            'SELECT * FROM contrato'
        );
        return resultado;
    }

    async actualizar(id, contrato){
        const [resultado] = await pool.query(
            'UPDATE contrato SET id_cliente = ?, id_plan = ?, condiciones = ?, duracion = ?, precio = ?, fecha_inicio = ?, fecha_fin = ?, id_estado = ? WHERE id = ?',
            [contrato.id_cliente, contrato.id_plan, contrato.condiciones, contrato.duracion, contrato.precio, contrato.fecha_inicio, contrato.fecha_fin, contrato.id_estado, id]

        );
        return resultado.affectedRows;
    }

    async eliminar (id){
        const [resultado] = await pool.query(
            'DELETE FROM contrato where id = ?',
            [id]
        );
        return resultado.affectedRows;
    }
}

export default ContratoRepository;


