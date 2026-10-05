import inquirer from 'inquirer';
import chalk from 'chalk';
import {
    crearPlan,
    listarPlanes,
    actualizarPlan,
    eliminarPlan,
    asignarPlanCliente
} from './planFunciones.js';

const SubmenuPlanes = [
    { name: 'Crear plan',              value: 'crear' },
    { name: 'Listar planes',           value: 'listar' },
    { name: 'Actualizar plan',         value: 'actualizar' },
    { name: 'Eliminar plan',           value: 'eliminar' },
    { name: 'Asignar plan a cliente',  value: 'asignar' },

    new inquirer.Separator(),
    { name: '<- Volver al menu principal', value: 'volver' }
];

export async function PlanEntrenamientoMenu() {
    let volver = false;

    while (!volver) {
        console.clear();
        console.log(chalk.bold.yellow('\n=== GESTION PLANES DE ENTRENAMIENTO ==='));

        const { opcion } = await inquirer.prompt([
            {
                type: 'select',
                name: 'opcion',
                message: 'Selecciona una opcion:',
                choices: SubmenuPlanes,
                loop: false
            }
        ]);

        switch (opcion) {
            case 'crear':
                await crearPlan();
                break;
            case 'listar':
                await listarPlanes();
                break;
            case 'actualizar':
                await actualizarPlan();
                break;
            case 'eliminar':
                await eliminarPlan();
                break;
            case 'asignar':
                await asignarPlanCliente();
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