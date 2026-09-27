import inquirer from 'inquirer';
import chalk from 'chalk';
import ConsumoAlimento from '../../models/ConsumoAlimento.js';
import ConsumoAlimentoService from '../../services/ConsumoAlimentoService.js';
import ConsumoAlimentoRepository from '../../repositories/ConsumoAlimentoRepository.js';
import AlimentoService from '../../services/AlimentoService.js';
import AlimentoRepository from '../../repositories/AlimentoRepository.js';
import PlanAlimenticioService from '../../services/PlanAlimenticioService.js';
import PlanAlimenticioRepository from '../../repositories/PlanAlimenticioRepository.js';
import ContratoService from '../../services/ContratoService.js';
import ContratoRepository from '../../repositories/ContratoRepository.js';
import PlanEntrenamientoService from '../../services/PlanEntrenamientoService.js';
import PlanEntrenamientoRepository from '../../repositories/PlanEntrenamientoRepository.js';
import ClienteService from '../../services/ClienteService.js';
import ClienteRepository from '../../repositories/ClienteRepository.js';
import ContratoFactory from '../../factories/ContratoFactory.js';
import { fechaBonita, pausar } from './utils.js';
import { obtenerFechaHoy } from '../../utils/fechaUtils.js';

// --- Repositorios ---
const consumoAlimentoRepository = new ConsumoAlimentoRepository();
const alimentoRepository = new AlimentoRepository();
const planAlimenticioRepository = new PlanAlimenticioRepository();
const contratoRepository = new ContratoRepository();
const planRepository = new PlanEntrenamientoRepository();
const clienteRepository = new ClienteRepository();

// --- Services ---
const alimentoService = new AlimentoService(alimentoRepository);
const consumoAlimentoService = new ConsumoAlimentoService(consumoAlimentoRepository, alimentoService);
const planAlimenticioService = new PlanAlimenticioService(planAlimenticioRepository);
const planService = new PlanEntrenamientoService(planRepository);
const clienteService = new ClienteService(clienteRepository);
const contratoFactory = new ContratoFactory();
const contratoService = new ContratoService(contratoRepository, planService, contratoFactory);

const SubmenuConsumos = [
    { name: 'Registrar consumo',       value: 'crear' },
    { name: 'Ver consumos de un plan', value: 'listar' },
    { name: 'Eliminar consumo',        value: 'eliminar' },

    new inquirer.Separator(),
    { name: '<- Volver al menu de Nutricion', value: 'volver' }
];

export async function consumoMenu() {
    let volver = false;

    while (!volver) {
        console.clear();
        console.log(chalk.bold.yellow('\n=== CONSUMOS ==='));

        const { opcion } = await inquirer.prompt([
            {
                type: 'select',
                name: 'opcion',
                message: 'Selecciona una opcion:',
                choices: SubmenuConsumos,
                loop: false
            }
        ]);

        switch (opcion) {
            case 'crear':    await registrarConsumo();   break;
            case 'listar':   await verConsumosDePlan();  break;
            case 'eliminar': await eliminarConsumo();    break;
            case 'volver':   volver = true;              break;
        }

        if (!volver) await pausar();
    }
}

async function registrarConsumo() {
    console.log(chalk.cyan('\nRegistrar consumo\n'));

    try {
        // 1. Elegir plan alimenticio
        const planes = await planAlimenticioService.listar();
        if (planes.length === 0) {
            console.log(chalk.yellow('No hay planes alimenticios. Crea uno primero.'));
            return;
        }

        const opcionesPlanes = [];
        for (const p of planes) {
            const contrato = await contratoService.buscarPorId(p.id_contrato);
            const cliente = contrato ? await clienteService.buscarPorId(contrato.id_cliente) : null;
            const nombreCliente = cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Desconocido';
            opcionesPlanes.push({
                name: `${p.nombre} - ${nombreCliente} (ID: ${p.id})`,
                value: p.id
            });
        }

        const { id_plan } = await inquirer.prompt([
            { type: 'select', name: 'id_plan', message: 'Selecciona el plan alimenticio:', choices: opcionesPlanes }
        ]);

        // 2. Elegir alimento
        const alimentos = await alimentoService.listar();
        if (alimentos.length === 0) {
            console.log(chalk.yellow('No hay alimentos. Crea uno primero.'));
            return;
        }

        const opcionesAlimentos = alimentos.map(a => ({
            name: `${a.nombre} - ${a.calorias} kcal/100g (ID: ${a.id})`,
            value: a.id
        }));

        const respuestas = await inquirer.prompt([
            { type: 'select', name: 'id_alimento', message: 'Selecciona el alimento:', choices: opcionesAlimentos },
            { type: 'input',  name: 'cantidad',    message: 'Cantidad (en gramos):' },
            { type: 'input',  name: 'fecha',       message: 'Fecha (YYYY-MM-DD):', default: obtenerFechaHoy() }
        ]);

        const consumo = new ConsumoAlimento(
            null,
            Number(id_plan),
            Number(respuestas.id_alimento),
            respuestas.fecha,
            Number(respuestas.cantidad)
        );

        const id = await consumoAlimentoService.crear(consumo);
        console.log(chalk.green(`\nConsumo registrado con ID: ${id}`));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}`));
    }
}

async function verConsumosDePlan() {
    console.log(chalk.cyan('\nConsumos por plan\n'));

    const { id_plan } = await inquirer.prompt([
        { type: 'input', name: 'id_plan', message: 'ID del plan alimenticio:' }
    ]);

    try {
        const plan = await planAlimenticioService.buscarPorId(id_plan);
        if (!plan) {
            console.log(chalk.red('\nPlan alimenticio no encontrado.'));
            return;
        }

        console.log(chalk.bold.white(`\nPlan: ${plan.nombre}`));
        console.log(chalk.gray(`Periodo: ${fechaBonita(plan.fecha_inicio)} -> ${fechaBonita(plan.fecha_fin)}\n`));

        const consumos = await consumoAlimentoService.listarPorPlan(id_plan);

        if (consumos.length === 0) {
            console.log(chalk.yellow('No hay consumos registrados en este plan.'));
            return;
        }

        for (const c of consumos) {
            const alimento = await alimentoService.buscarPorId(c.id_alimento);
            const nombreAlimento = alimento ? alimento.nombre : 'Desconocido';
            const kcal = alimento ? ((Number(alimento.calorias) / 100) * Number(c.cantidad)).toFixed(1) : '?';

            console.log(
                chalk.white(`ID: ${c.id}`) +
                chalk.gray(` | ${fechaBonita(c.fecha)} | ${nombreAlimento} | ${c.cantidad}g | ~${kcal} kcal`)
            );
        }
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}`));
    }
}

async function eliminarConsumo() {
    console.log(chalk.cyan('\nEliminar consumo\n'));

    const { id } = await inquirer.prompt([
        { type: 'input', name: 'id', message: 'ID del consumo a eliminar:' }
    ]);

    try {
        const existente = await consumoAlimentoService.buscarPorId(id);
        if (!existente) {
            console.log(chalk.red('\nConsumo no encontrado.'));
            return;
        }

        const { confirmar } = await inquirer.prompt([
            { type: 'confirm', name: 'confirmar', message: `¿Eliminar el consumo #${id}?` }
        ]);

        if (!confirmar) {
            console.log(chalk.yellow('\n Operacion cancelada.'));
            return;
        }

        await consumoAlimentoService.eliminar(id);
        console.log(chalk.green(`\nConsumo #${id} eliminado.`));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}`));
    }
}