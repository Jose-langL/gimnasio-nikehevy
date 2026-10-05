import inquirer from 'inquirer';
import chalk from 'chalk';
import GestionFinanciera from '../../models/GestionFinanciera.js';
import GestionFinancieraService from '../../services/GestionFinancieraService.js';
import GestionFinancieraRepository from '../../repositories/GestionFinancieraRepository.js';
import ClienteService from '../../services/ClienteService.js';
import ClienteRepository from '../../repositories/ClienteRepository.js';
import { obtenerFechaHoy, formatearFecha } from '../../utils/fechaUtils.js';

// --- Repositorios ---
const finanzasRepository = new GestionFinancieraRepository();
const clienteRepository = new ClienteRepository();

// --- Services ---
const finanzasService = new GestionFinancieraService(finanzasRepository);
const clienteService = new ClienteService(clienteRepository);

export async function registrarMovimiento(tipo) {
    console.log(chalk.cyan(`\nRegistrar ${tipo}\n`));

    try {
        const respuestas = await inquirer.prompt([
            { type: 'input', name: 'monto',     message: 'Monto:' },
            { type: 'input', name: 'concepto',  message: 'Concepto (ej: Mensualidad, Suplementos):' },
            { type: 'input', name: 'fecha',     message: 'Fecha (YYYY-MM-DD):', default: obtenerFechaHoy() },
            { type: 'confirm', name: 'tieneCliente', message: '¿Asociar a un cliente?' }
        ]);

        let id_cliente = null;

        if (respuestas.tieneCliente) {
            const clientes = await clienteService.listar();
            if (clientes.length === 0) {
                console.log(chalk.yellow('No hay clientes registrados. Se guardara sin cliente.'));
            } else {
                const opciones = clientes.map(c => ({
                    name: `${c.nombre} ${c.apellido} (ID: ${c.id})`,
                    value: c.id
                }));
                const { id } = await inquirer.prompt([
                    { type: 'select', name: 'id', message: 'Selecciona el cliente:', choices: opciones }
                ]);
                id_cliente = id;
            }
        }

        const movimiento = new GestionFinanciera(
            null,
            id_cliente,
            tipo,
            Number(respuestas.monto),
            respuestas.concepto,
            respuestas.fecha
        );

        const id = await finanzasService.crear(movimiento);
        console.log(chalk.green(`\nMovimiento registrado con ID: ${id}`));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}`));
    }
}

export async function listarMovimientos() {
    console.log(chalk.cyan('\nListado de movimientos\n'));

    try {
        const movimientos = await finanzasService.listar();

        if (movimientos.length === 0) {
            console.log(chalk.yellow('No hay movimientos registrados.'));
            return;
        }

        for (const m of movimientos) {
            let nombreCliente = 'Sin cliente';
            if (m.id_cliente) {
                const cliente = await clienteService.buscarPorId(m.id_cliente);
                if (cliente) nombreCliente = `${cliente.nombre} ${cliente.apellido}`;
            }

            const color = m.tipo === 'ingreso' ? chalk.green : chalk.red;
            const signo = m.tipo === 'ingreso' ? '+' : '-';
            const fecha = formatearFecha(m.fecha);

            console.log(
                chalk.white(`ID: ${m.id}`) +
                chalk.gray(` | ${fecha} | `) +
                color(`${signo}$${m.monto}`) +
                chalk.gray(` | ${m.tipo} | ${m.concepto} | ${nombreCliente}`)
            );
        }
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}`));
    }
}

export async function verBalancePorCliente() {
    console.log(chalk.cyan('\nBalance por cliente\n'));

    try {
        const clientes = await clienteService.listar();
        if (clientes.length === 0) {
            console.log(chalk.yellow('No hay clientes registrados.'));
            return;
        }

        const opciones = clientes.map(c => ({
            name: `${c.nombre} ${c.apellido} (ID: ${c.id})`,
            value: c.id
        }));

        const { id_cliente } = await inquirer.prompt([
            { type: 'select', name: 'id_cliente', message: 'Selecciona el cliente:', choices: opciones }
        ]);

        const cliente = await clienteService.buscarPorId(id_cliente);
        const balance = await finanzasService.balancePorCliente(id_cliente);

        console.log(chalk.bold.white(`\n=== BALANCE DE ${cliente.nombre} ${cliente.apellido} ===`));
        console.log(chalk.green(`  Ingresos:  $${balance.ingresos}`));
        console.log(chalk.red(`  Egresos:   $${balance.egresos}`));
        console.log(chalk.bold.white(`  Balance:   $${balance.balance}`));
        console.log(chalk.gray(`  Movimientos: ${balance.cantidad}`));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}`));
    }
}

export async function eliminarMovimiento() {
    console.log(chalk.cyan('\nEliminar movimiento\n'));

    const { id } = await inquirer.prompt([
        { type: 'input', name: 'id', message: 'ID del movimiento a eliminar:' }
    ]);

    try {
        const existente = await finanzasService.buscarPorId(id);
        if (!existente) {
            console.log(chalk.red('\nMovimiento no encontrado.'));
            return;
        }

        const { confirmar } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirmar',
                message: `¿Eliminar el movimiento #${id} (${existente.tipo} de $${existente.monto})?`
            }
        ]);

        if (!confirmar) {
            console.log(chalk.yellow('\n Operacion cancelada.'));
            return;
        }

        await finanzasService.eliminar(id);
        console.log(chalk.green(`\nMovimiento eliminado.`));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}`));
    }
}