import inquirer from 'inquirer';
import chalk from 'chalk';
import {
    crearCliente,
    listarCliente,
    actualizarCliente,
    eliminarCliente
} from './clienteFunciones.js';

const SubmenuClientes = [
    { name: 'Crear cliente',        value: 'crear' },
    { name: 'Listar clientes',      value: 'listar' },
    { name: 'Actualizar cliente',   value: 'actualizar' },
    { name: 'Eliminar cliente',     value: 'eliminar' },

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
            case 'volver':
                volver = true;
                break;
        }

        if (!volver) await pausar();
    }
}

async function pausar() {
    await inquirer.prompt([
        { type: 'input', name: '_', message: chalk.gray('Presiona ENTER para continuar...') }
    ]);
}