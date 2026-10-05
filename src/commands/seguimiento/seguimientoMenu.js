import inquirer from 'inquirer';
import chalk from 'chalk';
import {
    registrarSeguimiento,
    verHistorial,
    eliminarSeguimiento,
    clienteJson
} from './seguimientoFunciones.js';

const SubmenuSeguimiento = [
    { name: 'Registrar nuevo avance',       value: 'crear' },
    { name: 'Ver historial con medidas',    value: 'historial' },
    { name: 'Eliminar un registro',         value: 'eliminar' },
    { name: 'Exportar Cliente a JSON',      value: 'exportar' },

    new inquirer.Separator(),
    { name: '<- Volver al menu principal',  value: 'volver' }
];

export async function SeguimientoMenu() {
    let volver = false;

    while (!volver) {
        console.clear();
        console.log(chalk.bold.yellow('\n=== SEGUIMIENTO FISICO ==='));

        const { opcion } = await inquirer.prompt([
            {
                type: 'select',
                name: 'opcion',
                message: 'Selecciona una opcion:',
                choices: SubmenuSeguimiento,
                loop: false
            }
        ]);

        switch (opcion) {
            case 'crear':      await registrarSeguimiento(); break;
            case 'historial':  await verHistorial();          break;
            case 'eliminar':   await eliminarSeguimiento();   break;
            case 'exportar':   await clienteJson();           break;
            case 'volver':     volver = true;                 break;
        }

        if (!volver) await pausar();
    }
}

async function pausar() {
    await inquirer.prompt([
        { type: 'input', name: '_', message: chalk.gray('Presiona ENTER para continuar...') }
    ]);
}