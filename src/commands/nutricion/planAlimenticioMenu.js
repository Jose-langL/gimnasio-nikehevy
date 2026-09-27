import inquirer from 'inquirer';
import chalk from 'chalk';
import PlanAlimenticio from '../../models/PlanAlimenticio.js';
import PlanAlimenticioService from '../../services/PlanAlimenticioService.js';
import PlanAlimenticioRepository from '../../repositories/PlanAlimenticioRepository.js';
import ConsumoAlimentoService from '../../services/ConsumoAlimentoService.js';
import ConsumoAlimentoRepository from '../../repositories/ConsumoAlimentoRepository.js';
import AlimentoService from '../../services/AlimentoService.js';
import AlimentoRepository from '../../repositories/AlimentoRepository.js';
import ContratoService from '../../services/ContratoService.js';
import ContratoRepository from '../../repositories/ContratoRepository.js';
import PlanEntrenamientoService from '../../services/PlanEntrenamientoService.js';
import PlanEntrenamientoRepository from '../../repositories/PlanEntrenamientoRepository.js';
import ClienteService from '../../services/ClienteService.js';
import ClienteRepository from '../../repositories/ClienteRepository.js';
import ContratoFactory from '../../factories/ContratoFactory.js';
import { fechaBonita, pausar } from './utils.js';
import { obtenerFechaHoy } from '../../utils/fechaUtils.js';

// Repositorios
const planAlimenticioRepository = new PlanAlimenticioRepository();
const consumoAlimentoRepository = new ConsumoAlimentoRepository();
const alimentoRepository = new AlimentoRepository();
const contratoRepository = new ContratoRepository();
const planRepository = new PlanEntrenamientoRepository();
const clienteRepository = new ClienteRepository();

// Services
const alimentoService = new AlimentoService(alimentoRepository);
const consumoAlimentoService = new ConsumoAlimentoService(consumoAlimentoRepository, alimentoService);
const planAlimenticioService = new PlanAlimenticioService(planAlimenticioRepository);
const planService = new PlanEntrenamientoService(planRepository);
const clienteService = new ClienteService(clienteRepository);
const contratoFactory = new ContratoFactory();
const contratoService = new ContratoService(contratoRepository, planService, contratoFactory);

const SubmenuPlanesAlimenticios = [
    { name: 'Crear plan alimenticio',      value: 'crear' },
    { name: 'Listar planes alimenticios',  value: 'listar' },
    { name: 'Actualizar plan alimenticio', value: 'actualizar' },
    { name: 'Eliminar plan alimenticio',   value: 'eliminar' },

    new inquirer.Separator(),
    { name: '<- Volver al menu de Nutricion', value: 'volver' }
];

export async function planAlimenticioMenu() {
    let volver = false;

    while (!volver) {
        console.clear();
        console.log(chalk.bold.yellow('\n=== PLANES ALIMENTICIOS ==='));

        const { opcion } = await inquirer.prompt([
            {
                type: 'select',
                name: 'opcion',
                message: 'Selecciona una opcion:',
                choices: SubmenuPlanesAlimenticios,
                loop: false
            }
        ]);

        switch (opcion) {
            case 'crear':      await crearPlanAlimenticio();      break;
            case 'listar':     await listarPlanesAlimenticios();  break;
            case 'actualizar': await actualizarPlanAlimenticio(); break;
            case 'eliminar':   await eliminarPlanAlimenticio();   break;
            case 'volver':     volver = true;                     break;
        }

        if (!volver) await pausar();
    }
}

async function crearPlanAlimenticio() {
    console.log(chalk.cyan('\nNuevo plan alimenticio\n'));

    const { id_contrato } = await inquirer.prompt([
        { type: 'input', name: 'id_contrato', message: 'ID del contrato:' }
    ]);

    try {
        const contrato = await contratoService.buscarPorId(id_contrato);
        if (!contrato) {
            console.log(chalk.red('\nContrato no encontrado.'));
            return;
        }

        const cliente = await clienteService.buscarPorId(contrato.id_cliente);
        const nombreCliente = cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Desconocido';
        console.log(chalk.gray(`Cliente: ${nombreCliente}\n`));

        const datos = await inquirer.prompt([
            { type: 'input', name: 'nombre',       message: 'Nombre del plan (ej: Volumen):' },
            { type: 'input', name: 'fecha_inicio', message: 'Fecha inicio (YYYY-MM-DD):', default: obtenerFechaHoy() },
            { type: 'input', name: 'fecha_fin',    message: 'Fecha fin (YYYY-MM-DD):' }
        ]);

        const plan = new PlanAlimenticio(
            null,
            Number(id_contrato),
            datos.nombre,
            datos.fecha_inicio,
            datos.fecha_fin
        );

        const id = await planAlimenticioService.crear(plan);
        console.log(chalk.green(`\nPlan alimenticio creado con ID: ${id}`));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}`));
    }
}

async function listarPlanesAlimenticios() {
    console.log(chalk.cyan('\nListado de planes alimenticios\n'));

    try {
        const planes = await planAlimenticioService.listar();

        if (planes.length === 0) {
            console.log(chalk.yellow('No hay planes alimenticios registrados.'));
            return;
        }

        for (const p of planes) {
            const contrato = await contratoService.buscarPorId(p.id_contrato);
            const cliente = contrato ? await clienteService.buscarPorId(contrato.id_cliente) : null;
            const nombreCliente = cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Desconocido';
            const inicio = fechaBonita(p.fecha_inicio);
            const fin = fechaBonita(p.fecha_fin);

            console.log(
                chalk.white(`ID: ${p.id}`) +
                chalk.gray(` | ${p.nombre} | Cliente: ${nombreCliente} | ${inicio} -> ${fin}`)
            );
        }
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}`));
    }
}

async function actualizarPlanAlimenticio() {
    console.log(chalk.cyan('\nActualizar plan alimenticio\n'));

    const { id } = await inquirer.prompt([
        { type: 'input', name: 'id', message: 'ID del plan a actualizar:' }
    ]);

    try {
        const existente = await planAlimenticioService.buscarPorId(id);
        if (!existente) {
            console.log(chalk.red('\nPlan alimenticio no encontrado.'));
            return;
        }

        const datos = await inquirer.prompt([
            { type: 'input', name: 'nombre',       message: 'Nuevo nombre:',       default: existente.nombre },
            { type: 'input', name: 'fecha_inicio', message: 'Nueva fecha inicio:', default: fechaBonita(existente.fecha_inicio) },
            { type: 'input', name: 'fecha_fin',    message: 'Nueva fecha fin:',    default: fechaBonita(existente.fecha_fin) }
        ]);

        const plan = new PlanAlimenticio(
            existente.id,
            existente.id_contrato,
            datos.nombre,
            datos.fecha_inicio,
            datos.fecha_fin
        );

        const filas = await planAlimenticioService.actualizar(id, plan);
        console.log(chalk.green(`\nPlan alimenticio actualizado (${filas} fila afectada)`));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}`));
    }
}

async function eliminarPlanAlimenticio() {
    console.log(chalk.cyan('\nEliminar plan alimenticio\n'));

    const { id } = await inquirer.prompt([
        { type: 'input', name: 'id', message: 'ID del plan a eliminar:' }
    ]);

    try {
        const existente = await planAlimenticioService.buscarPorId(id);
        if (!existente) {
            console.log(chalk.red('\nPlan alimenticio no encontrado.'));
            return;
        }

        const { confirmar } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirmar',
                message: `¿Eliminar el plan "${existente.nombre}"? Tambien se borraran sus consumos asociados.`
            }
        ]);

        if (!confirmar) {
            console.log(chalk.yellow('\n Operacion cancelada.'));
            return;
        }

        await consumoAlimentoService.eliminarPorPlan(id);
        await planAlimenticioService.eliminar(id);
        console.log(chalk.green(`\nPlan alimenticio y consumos eliminados.`));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}`));
    }
}