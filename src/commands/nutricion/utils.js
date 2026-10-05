import inquirer from 'inquirer';
import chalk from 'chalk';
import { formatearFecha } from '../../utils/fechaUtils.js';

const fechaBonita = formatearFecha;
export { fechaBonita };

export const CATEGORIAS = [
    { name: 'Carnes',      value: 1 },
    { name: 'Granos',      value: 2 },
    { name: 'Frutas',      value: 3 },
    { name: 'Verduras',    value: 4 },
    { name: 'Lacteos',     value: 5 },
    { name: 'Bebidas',     value: 6 },
    { name: 'Suplementos', value: 7 },
    { name: 'Snacks',      value: 8 }
];

export function calcularSemana(fechaReferencia) {
    const fecha = new Date(fechaReferencia + 'T00:00:00');
    const diaSemana = fecha.getDay();
    const retroceso = diaSemana === 0 ? 6 : diaSemana - 1;

    const lunes = new Date(fecha);
    lunes.setDate(fecha.getDate() - retroceso);

    const domingo = new Date(lunes);
    domingo.setDate(lunes.getDate() + 6);

    return {
        lunes: formatearFecha(lunes),
        domingo: formatearFecha(domingo)
    };
}

export async function pausar() {
    await inquirer.prompt([
        { type: 'input', name: '_', message: chalk.gray('Presiona ENTER para continuar...') }
    ]);
}