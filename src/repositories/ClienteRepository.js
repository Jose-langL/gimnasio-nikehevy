import pool from '../config/DataBase.js';

class ClienteRepository {

    async crear (cliente) {
    const [resultado] = await pool.query(
        'INSERT INTO clientes (nombre, apellido, email, telefono, estado, fecha_registro) VALUES (?,?,?,?,?,?)',
        [cliente.nombre, cliente.apellido, cliente.email, cliente.telefono, cliente.estado, cliente.fecha_registro ]
    );
    return resultado.insertId
    }

    async buscarPorId(id) {
        const [rows] = await pool.query('SELECT * FROM clientes WHERE id = ?', [id]);
        return rows[0];
    }
    
    async listar(){
        const [resultado] = await pool.query(
            'SELECT * FROM clientes'
        );
        return resultado;
    }

    async actualizar(id, cliente){
        const [resultado] = await pool.query(
            'UPDATE clientes SET nombre = ?, apellido = ?, email = ?, telefono = ?, estado = ? WHERE id = ? ',
            [cliente.nombre, cliente.apellido, cliente.email, cliente.telefono, cliente.estado, id ]
        );
        return resultado.affectedRows;
    }

    async eliminar (id){
        const [resultado] = await pool.query(
            'DELETE FROM clientes where id = ?',
            [id]
        );
        return resultado.affectedRows;
    }
}

export default ClienteRepository;
