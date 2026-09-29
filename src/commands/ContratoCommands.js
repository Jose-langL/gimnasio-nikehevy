import inquirer from 'inquirer';
import chalk from 'chalk';
import ContratoService from '../services/ContratoService.js';
import ContratoRepository from '../repositories/ContratoRepository.js';
import PlanEntrenamientoService from '../services/PlanEntrenamientoService.js';
import PlanEntrenamientoRepository from '../repositories/PlanEntrenamientoRepository.js';
import ClienteService from '../services/ClienteService.js';
import ClienteRepository from '../repositories/ClienteRepository.js';
import ContratoFactory from '../factories/ContratoFactory.js';

const contratoRepository = new ContratoRepository();
const planRepository = new PlanEntrenamientoRepository();
const planService = new PlanEntrenamientoService(planRepository);
const clienteRepository = new ClienteRepository();
const clienteService = new ClienteService(clienteRepository);
const contratoFactory = new ContratoFactory();
const contratoService = new ContratoService(contratoRepository, planService, contratoFactory);

const Estados = {
    1: 'Activo',
    2: 'Renovado',
    3: 'Cancelado',
    4: 'Finalizado'
};

function fechaBonita(fecha) {
    if (typeof fecha === 'string') {
        return fecha.split('T')[0];
    }
    const d = new Date(fecha);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

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

async function listarContratos() {
    console.log(chalk.cyan('\nListado de contratos\n'));

    try {
        const contratos = await contratoService.listar();

        if (contratos.length === 0) {
            console.log(chalk.yellow('No hay contratos registrados.'));
            return;
        }

        for (const ct of contratos) {
            const cliente = await clienteService.buscarPorId(ct.id_cliente);
            const plan = await planService.buscarPorId(ct.id_plan);
            const nombreCliente = cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Desconocido';
            const nombrePlan = plan ? plan.nombre : 'Desconocido';
            const estado = Estados[ct.id_estado] || 'Desconocido';
            const inicio = fechaBonita(ct.fecha_inicio);
            const fin = fechaBonita(ct.fecha_fin);

            console.log(
                chalk.white(`ID: ${ct.id}`) +
                chalk.gray(` | Cliente: ${nombreCliente}`) +
                chalk.gray(` | Plan: ${nombrePlan}`) +
                chalk.gray(` | Inicio: ${inicio}`) +
                chalk.gray(` | Fin: ${fin}`) +
                chalk.gray(` | Estado: ${estado}`)
            );
        }
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}`));
    }
}

async function verDetalleContrato() {
    console.log(chalk.cyan('\nDetalle de contrato\n'));

    const { id } = await inquirer.prompt([
        { type: 'input', name: 'id', message: 'ID del contrato:' }
    ]);

    try {
        const ct = await contratoService.buscarPorId(id);
        if (!ct) {
            console.log(chalk.red('\nContrato no encontrado.'));
            return;
        }

        const cliente = await clienteService.buscarPorId(ct.id_cliente);
        const plan = await planService.buscarPorId(ct.id_plan);
        const nombreCliente = cliente ? `${cliente.nombre} ${cliente.apellido} (ID: ${cliente.id})` : 'Desconocido';
        const nombrePlan = plan ? `${plan.nombre} (ID: ${plan.id})` : 'Desconocido';
        const estado = Estados[ct.id_estado] || 'Desconocido';

        console.log(chalk.bold.white(`\n=== DETALLE DEL CONTRATO #${ct.id} ===`));
        console.log(chalk.white(`Cliente:     ${nombreCliente}`));
        console.log(chalk.white(`Plan:        ${nombrePlan}`));
        console.log(chalk.white(`Condiciones: ${ct.condiciones}`));
        console.log(chalk.white(`Duracion:    ${ct.duracion} semanas`));
        console.log(chalk.white(`Precio:      ${ct.precio}`));
        console.log(chalk.white(`Inicio:      ${fechaBonita(ct.fecha_inicio)}`));
        console.log(chalk.white(`Fin:         ${fechaBonita(ct.fecha_fin)}`));
        console.log(chalk.white(`Estado:      ${estado}`));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}`));
    }
}

async function cancelarContrato() {
    console.log(chalk.cyan('\nCancelar contrato\n'));

    const { id } = await inquirer.prompt([
        { type: 'input', name: 'id', message: 'ID del contrato a cancelar:' }
    ]);

    try {
        const ct = await contratoService.buscarPorId(id);
        if (!ct) {
            console.log(chalk.red('\nContrato no encontrado.'));
            return;
        }

        if (ct.id_estado !== 1) {
            console.log(chalk.red(`\nSolo se pueden cancelar contratos ACTIVOS. Este esta: ${Estados[ct.id_estado]}`));
            return;
        }

        const { confirmar } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirmar',
                message: `¿Seguro que quieres CANCELAR el contrato #${id}? Esto eliminara el seguimiento fisico y los planes alimenticios asociados.`
            }
        ]);

        if (!confirmar) {
            console.log(chalk.yellow('\n Operacion cancelada.'));
            return;
        }

        await contratoService.cancelarPlan(id);
        console.log(chalk.green(`\nContrato #${id} cancelado correctamente.`));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}`));
    }
}

async function renovarContrato() {
    console.log(chalk.cyan('\nRenovar contrato\n'));

    const { id } = await inquirer.prompt([
        { type: 'input', name: 'id', message: 'ID del contrato a renovar:' }
    ]);

    try {
        const ct = await contratoService.buscarPorId(id);
        if (!ct) {
            console.log(chalk.red('\nContrato no encontrado.'));
            return;
        }

        if (ct.id_estado !== 1) {
            console.log(chalk.red(`\nSolo se pueden renovar contratos ACTIVOS. Este esta: ${Estados[ct.id_estado]}`));
            return;
        }

        const plan = await planService.buscarPorId(ct.id_plan);
        if (!plan) {
            console.log(chalk.red('\nEl plan asociado a este contrato no existe.'));
            return;
        }

        const { confirmar } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirmar',
                message: `¿Renovar el contrato #${id} con el mismo plan "${plan.nombre}" (${plan.duracion} semanas)?`
            }
        ]);

        if (!confirmar) {
            console.log(chalk.yellow('\n Operacion cancelada.'));
            return;
        }

        await contratoService.renovarPlan(id, plan);
        console.log(chalk.green(`\nContrato #${id} renovado correctamente.`));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}`));
    }
}

async function finalizarContrato() {
    console.log(chalk.cyan('\nFinalizar contrato\n'));

    const { id } = await inquirer.prompt([
        { type: 'input', name: 'id', message: 'ID del contrato a finalizar:' }
    ]);

    try {
        const ct = await contratoService.buscarPorId(id);
        if (!ct) {
            console.log(chalk.red('\nContrato no encontrado.'));
            return;
        }

        if (ct.id_estado !== 1) {
            console.log(chalk.red(`\nSolo se pueden finalizar contratos ACTIVOS. Este esta: ${Estados[ct.id_estado]}`));
            return;
        }

        const { confirmar } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirmar',
                message: `¿Finalizar el contrato #${id}?`
            }
        ]);

        if (!confirmar) {
            console.log(chalk.yellow('\n Operacion cancelada.'));
            return;
        }

        await contratoService.finalizarPlan(id);
        console.log(chalk.green(`\nContrato #${id} finalizado correctamente.`));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}`));
    }
}

async function eliminarContrato() {
    console.log(chalk.cyan('\nEliminar contrato\n'));

    const { id } = await inquirer.prompt([
        { type: 'input', name: 'id', message: 'ID del contrato a eliminar:' }
    ]);

    try {
        const ct = await contratoService.buscarPorId(id);
        if (!ct) {
            console.log(chalk.red('\nContrato no encontrado.'));
            return;
        }

        const cliente = await clienteService.buscarPorId(ct.id_cliente);
        const plan = await planService.buscarPorId(ct.id_plan);
        const nombreCliente = cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Desconocido';
        const nombrePlan = plan ? plan.nombre : 'Desconocido';
        const estado = Estados[ct.id_estado] || 'Desconocido';

        console.log(chalk.yellow(`\nVas a eliminar el siguiente contrato:`));
        console.log(chalk.white(`  ID:      ${ct.id}`));
        console.log(chalk.white(`  Cliente: ${nombreCliente}`));
        console.log(chalk.white(`  Plan:    ${nombrePlan}`));
        console.log(chalk.white(`  Estado:  ${estado}`));

        console.log(chalk.gray(`   Se borraran tambien: seguimiento fisico, medidas, planes alimenticios y consumos asociados.`));

        const { confirmar } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirmar',
                message: `¿Eliminar DEFINITIVAMENTE el contrato #${id}?`,
                default: false
            }
        ]);

        if (!confirmar) {
            console.log(chalk.yellow('\n Operacion cancelada.'));
            return;
        }

        await contratoService.eliminar(id);
        console.log(chalk.green(`\nContrato #${id} eliminado correctamente.`));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}`));
    }
}

async function pausar() {
    await inquirer.prompt([
        { type: 'input', name: '_', message: chalk.gray('Presiona ENTER para continuar...') }
    ]);
}