import inquirer from 'inquirer';
import chalk from 'chalk';
import { alimentoMenu } from './alimentoMenu.js';
import { planAlimenticioMenu } from './planAlimenticioMenu.js';
import { consumoMenu } from './consumoMenu.js';
import { reporteMenu } from './reporteMenu.js';

const SubmenuNutricion = [
    { name: 'Alimentos',            value: 'alimentos' },
    { name: 'Planes alimenticios',  value: 'planes' },
    { name: 'Consumos',             value: 'consumos' },
    { name: 'Reportes',             value: 'reportes' },

    new inquirer.Separator(),
    { name: '<- Volver al menu principal', value: 'volver' }
];

export async function nutricionMenu() {
    let volver = false;

    while (!volver) {
        console.clear();
        console.log(chalk.bold.yellow('\n=== NUTRICION ==='));

        const { opcion } = await inquirer.prompt([
            {
                type: 'select',
                name: 'opcion',
                message: 'Selecciona una opcion:',
                choices: SubmenuNutricion,
                loop: false
            }
        ]);

        switch (opcion) {
            case 'alimentos': await alimentoMenu();         break;
            case 'planes':    await planAlimenticioMenu();  break;
            case 'consumos':  await consumoMenu();          break;
            case 'reportes':  await reporteMenu();          break;
            case 'volver':    volver = true;                break;
        }
    }
}