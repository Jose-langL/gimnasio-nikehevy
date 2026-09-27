import inquirer from 'inquirer';
import chalk from 'chalk';
import ConsumoAlimentoService from '../../services/ConsumoAlimentoService.js';
import ConsumoAlimentoRepository from '../../repositories/ConsumoAlimentoRepository.js';
import AlimentoService from '../../services/AlimentoService.js';
import AlimentoRepository from '../../repositories/AlimentoRepository.js';
import PlanAlimenticioService from '../../services/PlanAlimenticioService.js';
import PlanAlimenticioRepository from '../../repositories/PlanAlimenticioRepository.js';
import { calcularSemana, pausar } from './utils.js';
import { obtenerFechaHoy } from '../../utils/fechaUtils.js';

// --- Repositorios ---
const consumoAlimentoRepository = new ConsumoAlimentoRepository();
const alimentoRepository = new AlimentoRepository();
const planAlimenticioRepository = new PlanAlimenticioRepository();

// --- Services ---
const alimentoService = new AlimentoService(alimentoRepository);
const consumoAlimentoService = new ConsumoAlimentoService(consumoAlimentoRepository, alimentoService);
const planAlimenticioService = new PlanAlimenticioService(planAlimenticioRepository);

const SubmenuReportes = [
    { name: 'Reporte semanal por plan', value: 'semanal' },

    new inquirer.Separator(),
    { name: '<- Volver al menu de Nutricion', value: 'volver' }
];

export async function reporteMenu() {
    let volver = false;

    while (!volver) {
        console.clear();
        console.log(chalk.bold.yellow('\n=== REPORTES ==='));

        const { opcion } = await inquirer.prompt([
            {
                type: 'select',
                name: 'opcion',
                message: 'Selecciona una opcion:',
                choices: SubmenuReportes,
                loop: false
            }
        ]);

        switch (opcion) {
            case 'semanal': await reporteSemanal(); break;
            case 'volver':  volver = true;          break;
        }

        if (!volver) await pausar();
    }
}

async function reporteSemanal() {
    console.log(chalk.cyan('\nReporte semanal\n'));

    const { id_plan } = await inquirer.prompt([
        { type: 'input', name: 'id_plan', message: 'ID del plan alimenticio:' }
    ]);

    try {
        const plan = await planAlimenticioService.buscarPorId(id_plan);
        if (!plan) {
            console.log(chalk.red('\nPlan alimenticio no encontrado.'));
            return;
        }

        const { fechaReferencia } = await inquirer.prompt([
            {
                type: 'input',
                name: 'fechaReferencia',
                message: 'Fecha dentro de la semana a reportar (YYYY-MM-DD):',
                default: obtenerFechaHoy()
            }
        ]);

        const { lunes, domingo } = calcularSemana(fechaReferencia);

        console.log(chalk.bold.white(`\n=== REPORTE SEMANAL ===`));
        console.log(chalk.white(`Plan: ${plan.nombre}`));
        console.log(chalk.white(`Semana: ${lunes} al ${domingo}\n`));

        const reporte = await consumoAlimentoService.obtenerReporteSemanal(id_plan, lunes, domingo);

        console.log(chalk.bold.cyan('TOTALES DE LA SEMANA:'));
        console.log(chalk.white(`  Calorias:       ${reporte.totales.calorias} kcal`));
        console.log(chalk.white(`  Proteinas:      ${reporte.totales.proteinas} g`));
        console.log(chalk.white(`  Carbohidratos:  ${reporte.totales.carbohidratos} g`));
        console.log(chalk.white(`  Grasas:         ${reporte.totales.grasas} g`));

        const dias = Object.keys(reporte.porDia);

        if (dias.length === 0) {
            console.log(chalk.yellow('\nNo hay consumos registrados en esta semana.'));
            return;
        }

        console.log(chalk.bold.cyan('\nDETALLE POR DIA:'));
        dias.forEach((fecha) => {
            const d = reporte.porDia[fecha];
            console.log(
                chalk.white(`  ${fecha}: `) +
                chalk.gray(`${d.calorias} kcal | P: ${d.proteinas}g | C: ${d.carbohidratos}g | G: ${d.grasas}g`)
            );
        });

        console.log(chalk.gray(`\nTotal de registros: ${reporte.cantidadRegistros}`));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}`));
    }
}