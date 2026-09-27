import inquirer from 'inquirer';
import chalk from 'chalk';
import figlet from 'figlet';
import { ClienteMenu } from './clienteCommands.js';
import { PlanEntrenamientoMenu } from './planEntrenamientoCommands.js';
import { SeguimientoMenu } from './seguimientoCommands.js';
import { ContratoMenu } from './ContratoCommands.js';
import { nutricionMenu } from './nutricion/nutricionMenu.js';
import { FinanzasMenu } from './finanzasCommands.js';

const MENU_PRINCIPAL = [
    { name: 'Gestion de Clientes',       value: 'clientes' },
    { name: 'Planes de Entrenamiento',  value: 'planes' },
    { name: 'Seguimiento Fisico',        value: 'seguimiento' },
    { name: 'Nutricion',                  value: 'nutricion' },
    { name: 'Contratos',                  value: 'contratos' },
    { name: 'Gestion Financiera',         value: 'finanzas' },

    new inquirer.Separator(),
    { name: 'Salir',                       value: 'salir' }
];

export async function menuPrincipal() {
    while (true) {
        console.clear();

        const banner = figlet.textSync('NIKEHEVY', { font: 'Standard' });
        console.log(chalk.bold.cyan(banner));
        console.log(chalk.bold.cyan('        Sistema de Gestion - Gimnasio\n'));

        const { opcion } = await inquirer.prompt([
            {
                type: 'select',
                name: 'opcion',
                message: '¿Que deseas hacer?',
                choices: MENU_PRINCIPAL,
                loop: false
            }
        ]);

        switch (opcion) {
            case 'clientes':    
                await ClienteMenu();      
                break;
            case 'planes':      
                await PlanEntrenamientoMenu(); 
                break;
            case 'seguimiento': 
                await SeguimientoMenu();       
                break;
            case 'nutricion':   
                await nutricionMenu();         
                break;
            case 'contratos':   
                await ContratoMenu();          
                break;
            case 'finanzas':    
                await FinanzasMenu();          
                break;
            case 'salir':
                console.log(chalk.green('\n ¡Hasta luego!\n'));
                process.exit(0);
        }
    }
}