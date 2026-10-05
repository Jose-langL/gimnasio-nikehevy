import inquirer from 'inquirer';
import chalk from 'chalk';
import {
    listarContratos,
    verDetalleContrato,
    cancelarContrato,
    renovarContrato,
    finalizarContrato,
    eliminarContrato
} from './contratoFunciones.js';

const SubmenuContratos = [
    { name: 'Listar contratos',           value: 'listar' },
    { name: 'Ver detalle de un contrato', value: 'detalle' },
    { name: 'Cancelar contrato',          value: 'cancelar' },
    { name: 'Renovar contrato',           value: 'renovar' },
    { name: 'Finalizar contrato',         value: 'finalizar' },
    { name: 'Eliminar contrato',          value: 'eliminar' },

    new inquirer.Separator(),
    { name: '<- Volver al menu principal', value: 'volver' }
];

export async function ContratoMenu() {
    let volver = false;

    while (!volver) {
        console.clear();
        console.log(chalk.bold.yellow('\n=== GESTION CONTRATOS ==='));

        const { opcion } = await inquirer.prompt([
            {
                type: 'select',
                name: 'opcion',
                message: 'Selecciona una opcion:',
                choices: SubmenuContratos,
                loop: false
            }
        ]);

        switch (opcion) {
            case 'listar':     await listarContratos();    break;
            case 'detalle':    await verDetalleContrato(); break;
            case 'cancelar':   await cancelarContrato();   break;
            case 'renovar':    await renovarContrato();    break;
            case 'finalizar':  await finalizarContrato();  break;
            case 'eliminar':   await eliminarContrato();   break;
            case 'volver':     volver = true;              break;
        }

        if (!volver) await pausar();
    }
}

async function pausar() {
    await inquirer.prompt([
        { type: 'input', name: '_', message: chalk.gray('Presiona ENTER para continuar...') }
    ]);
}