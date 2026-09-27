import inquirer from 'inquirer';
import chalk from 'chalk';
import Cliente from '../models/Cliente.js';
import ClienteService from '../services/ClienteService.js';
import ClienteRepository from '../repositories/ClienteRepository.js';
import { obtenerFechaHoy } from '../utils/fechaUtils.js';

const clienteRepository = new ClienteRepository();
const clienteService = new ClienteService(clienteRepository);

const SubmenuClientes = [
    { name: 'Crear cliente',        value: 'crear' },
    { name: 'Listar clientes',      value: 'listar' },
    { name: 'Actualizar cliente',   value: 'actualizar' },
    { name: 'Eliminar cliente',     value: 'eliminar' },
    { name: 'Asignar plan',         value: 'asignarPlan' },

    new inquirer.Separator(),
    { name: '<- Volver al menu principal', value: 'volver' }
];

export async function ClienteMenu() {
    let volver = false;

    while (!volver) {
        console.clear();
        console.log(chalk.bold.yellow('\n=== GESTION CLIENTES ==='));

        const { opcion } = await inquirer.prompt([
            {
                type: 'select',
                name: 'opcion',
                message: 'Selecciona una opcion:',
                choices: SubmenuClientes,
                loop: false
            }
        ]);

        switch (opcion) {
            case 'crear':
                await crearCliente();
                break;
            case 'listar':
                await listarCliente();
                break;
            case 'actualizar':
                await actualizarCliente();
                break;
            case 'eliminar':
                await eliminarCliente();
                break;
            case 'asignarPlan':
                await asignarPlanCliente();
                break;
            case 'volver':
                volver = true;
                break;
        }

        if (!volver) await pausar();
    }
}

async function crearCliente() {
    console.log(chalk.cyan('\nNuevo cliente\n'));

    const datos = await inquirer.prompt([
        { type: 'input', name: 'nombre',   message: 'Nombre:' },
        { type: 'input', name: 'apellido', message: 'Apellido:' },
        { type: 'input', name: 'email',    message: 'Email:' },
        { type: 'input', name: 'telefono', message: 'Teléfono:' }
    ]);

    try {
        const cliente = new Cliente(
            datos.nombre,
            datos.apellido,
            datos.email,
            datos.telefono,
            true,
            obtenerFechaHoy()
        );

        const id = await clienteService.crear(cliente);
        console.log(chalk.green(`\n Se creo el cliente con ID: ${id}`));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}`));
    }
}

async function listarCliente() {
    console.log(chalk.cyan('\nListado de clientes\n'));

    try {
        const clientes = await clienteService.listar();

        if (clientes.length === 0) {
            console.log(chalk.yellow('No hay clientes registrados.'));
            return;
        }

        clientes.forEach((c) => {
            console.log(
                chalk.white(`ID: ${c.id}`) +
                chalk.gray(` | ${c.nombre} ${c.apellido} | ${c.email} | ${c.telefono} | ${c.estado ? 'Activo' : 'Inactivo'}`)
            );
        });
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}`));
    }
}

async function actualizarCliente() {
    console.log(chalk.cyan('\nActualizar cliente\n'));

    const { id } = await inquirer.prompt([
        { type: 'input', name: 'id', message: 'ID del cliente a actualizar:' }
    ]);

    try {
        const existente = await clienteService.buscarPorId(id);
        if (!existente) {
            console.log(chalk.red('\n Cliente no encontrado.'));
            return;
        }

        const datos = await inquirer.prompt([
            { type: 'input',   name: 'nombre',   message: 'Nuevo nombre:',   default: existente.nombre },
            { type: 'input',   name: 'apellido', message: 'Nuevo apellido:', default: existente.apellido },
            { type: 'input',   name: 'email',    message: 'Nuevo email:',    default: existente.email },
            { type: 'input',   name: 'telefono', message: 'Nuevo teléfono:', default: existente.telefono },
            { type: 'confirm', name: 'estado',   message: '¿Cliente activo?', default: !!existente.estado }
        ]);

        const cliente = new Cliente(
            datos.nombre,
            datos.apellido,
            datos.email,
            datos.telefono,
            datos.estado,
            existente.fecha_registro
        );

        const filas = await clienteService.actualizar(id, cliente);
        console.log(chalk.green(`\nCliente actualizado (${filas} fila afectada)`));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}`));
    }
}

async function eliminarCliente() {
    console.log(chalk.cyan('\nEliminar cliente\n'));

    const { id } = await inquirer.prompt([
        { type: 'input', name: 'id', message: 'ID del cliente a eliminar:' }
    ]);

    const { confirmar } = await inquirer.prompt([
        { type: 'confirm', name: 'confirmar', message: `¿Seguro que quieres eliminar el cliente con ID ${id}?` }
    ]);

    if (!confirmar) {
        console.log(chalk.yellow('\n Operación cancelada.'));
        return;
    }

    try {
        const filas = await clienteService.eliminar(id);
        if (filas === 0) {
            console.log(chalk.red('\nCliente no encontrado.'));
        } else {
            console.log(chalk.green(`\nCliente eliminado.`));
        }
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}`));
    }
}