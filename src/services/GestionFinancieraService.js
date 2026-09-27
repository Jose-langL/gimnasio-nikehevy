import pool from '../config/DataBase.js';

class GestionFinancieraService {
    constructor(gestionFinancieraRepository) {
        this.gestionFinancieraRepository = gestionFinancieraRepository;
    }

    async crear(movimiento) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            
            if (movimiento.id_cliente) {
                const [clientes] = await connection.query(
                    'SELECT id FROM clientes WHERE id = ?',
                    [movimiento.id_cliente]
                );
                if (clientes.length === 0) {
                    throw new Error('El cliente no existe');
                }
            }

            const [resultado] = await connection.query(
                'INSERT INTO gestion_financiera (id_cliente, tipo, monto, concepto, fecha) VALUES (?,?,?,?,?)',
                [
                    movimiento.id_cliente,
                    movimiento.tipo,
                    movimiento.monto,
                    movimiento.concepto,
                    movimiento.fecha
                ]
            );

            await connection.commit();
            return resultado.insertId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async buscarPorId(id) {
        return await this.gestionFinancieraRepository.buscarPorId(id);
    }

    async listar() {
        return await this.gestionFinancieraRepository.listar();
    }

    async listarPorCliente(id_cliente) {
        return await this.gestionFinancieraRepository.listarPorCliente(id_cliente);
    }

    async actualizar(id, movimiento) {
        return await this.gestionFinancieraRepository.actualizar(id, movimiento);
    }

    async eliminar(id) {
        return await this.gestionFinancieraRepository.eliminar(id);
    }

    async balancePorCliente(id_cliente) {
        const movimientos = await this.gestionFinancieraRepository.listarPorCliente(id_cliente);

        let ingresos = 0;
        let egresos = 0;

        for (const m of movimientos) {
            const monto = Number(m.monto);
            if (m.tipo === 'ingreso') ingresos += monto;
            else if (m.tipo === 'egreso') egresos += monto;
        }

        return {
            cantidad: movimientos.length,
            ingresos: this._redondear(ingresos),
            egresos: this._redondear(egresos),
            balance: this._redondear(ingresos - egresos)
        };
    }

    async balancePorFecha(fecha_inicio, fecha_fin) {
        const movimientos = await this.gestionFinancieraRepository.listarPorRango(fecha_inicio, fecha_fin);

        let ingresos = 0;
        let egresos = 0;

        for (const m of movimientos) {
            const monto = Number(m.monto);
            if (m.tipo === 'ingreso') ingresos += monto;
            else if (m.tipo === 'egreso') egresos += monto;
        }

        return {
            fecha_inicio,
            fecha_fin,
            cantidad: movimientos.length,
            ingresos: this._redondear(ingresos),
            egresos: this._redondear(egresos),
            balance: this._redondear(ingresos - egresos)
        };
    }

    _redondear(n) {
        return Math.round(n * 100) / 100;
    }
}

export default GestionFinancieraService;