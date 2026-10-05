import inquirer from 'inquirer';
import chalk from 'chalk';
import {
    registrarMovimiento,
    listarMovimientos,
    verBalancePorCliente,
    eliminarMovimiento
} from './finanzasFunciones.js';

const SubmenuFinanzas = [
    { name: 'Registrar ingreso',      value: 'ingreso' },
    { name: 'Registrar egreso',       value: 'egreso' },
    { name: 'Listar movimientos',     value: 'listar' },
    { name: 'Balance por cliente',    value: 'balanceCliente' },
    { name: 'Eliminar movimiento',    value: 'eliminar' },

    new inquirer.Separator(),
    { name: '<- Volver al menu principal', value: 'volver' }
];

export async function FinanzasMenu() {
    let volver = false;

    while (!volver) {
        console.clear();
        console.log(chalk.bold.yellow('\n=== GESTION FINANCIERA ==='));

        const { opcion } = await inquirer.prompt([
            {
                type: 'select',
                name: 'opcion',
                message: 'Selecciona una opcion:',
                choices: SubmenuFinanzas,
                loop: false
            }
        ]);

        switch (opcion) {
            case 'ingreso':
                await registrarMovimiento('ingreso');
                break;
            case 'egreso':
                await registrarMovimiento('egreso');
                break;
            case 'listar':
                await listarMovimientos();
                break;
            case 'balanceCliente':
                await verBalancePorCliente();
                break;
            case 'eliminar':
                await eliminarMovimiento();
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