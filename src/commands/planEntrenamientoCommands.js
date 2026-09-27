import inquirer from 'inquirer';
import chalk from 'chalk';
import PlanEntrenamiento from '../models/PlanEntrenamiento.js';
import PlanEntrenamientoService from '../services/PlanEntrenamientoService.js';
import PlanEntrenamientoRepository from '../repositories/PlanEntrenamientoRepository.js';
import ClienteService from '../services/ClienteService.js';
import ClienteRepository from '../repositories/ClienteRepository.js';
import ContratoService from '../services/ContratoService.js';
import ContratoRepository from '../repositories/ContratoRepository.js';
import ContratoFactory from '../factories/ContratoFactory.js';

const planRepository = new PlanEntrenamientoRepository();
const planService = new PlanEntrenamientoService(planRepository);

const clienteRepository = new ClienteRepository();
const clienteService = new ClienteService(clienteRepository);

const contratoRepository = new ContratoRepository();
const contratoFactory = new ContratoFactory();
const contratoService = new ContratoService(contratoRepository, planService, contratoFactory);

const Niveles = [
    { name: 'Principiante', value: 1 },
    { name: 'Intermedio',   value: 2 },
    { name: 'Avanzado',     value: 3 }
];


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

async function crearPlan() {
    console.log(chalk.cyan('\nNuevo plan de entrenamiento\n'));

    const datos = await inquirer.prompt([
        { type: 'input', name: 'nombre',        message: 'Nombre del plan:' },
        { type: 'input', name: 'descripcion',   message: 'Descripcion:' },
        { type: 'input', name: 'duracion',      message: 'Duracion (en semanas):' },
        { type: 'input', name: 'metas_fisicas', message: 'Metas fisicas:' },
        { type: 'select', name: 'id_nivel',     message: 'Nivel:', choices: Niveles },
        { type: 'input', name: 'precio',        message: 'Precio:' }
    ]);

    try {
        const plan = new PlanEntrenamiento(
            null,
            datos.nombre,
            datos.descripcion,
            Number(datos.duracion),
            datos.metas_fisicas,
            Number(datos.id_nivel),
            Number(datos.precio)
        );

        const id = await planService.crear(plan);
        console.log(chalk.green(`\n Se creo el plan con ID: ${id}`));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}`));
    }
}

async function listarPlanes() {
    console.log(chalk.cyan('\nListado de planes\n'));

    try {
        const planes = await planService.listar();

        if (planes.length === 0) {
            console.log(chalk.yellow('No hay planes registrados.'));
            return;
        }

        planes.forEach((p) => {
            const nombreNivel = Niveles.find(n => n.value === p.id_nivel)?.name || 'Desconocido';
            console.log(
                chalk.white(`ID: ${p.id}`) +
                chalk.gray(` | ${p.nombre} | Duracion: ${p.duracion} semanas | Nivel: ${nombreNivel} | Precio: ${p.precio}`)
            );
        });
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}`));
    }
}

async function actualizarPlan() {
    console.log(chalk.cyan('\nActualizar plan\n'));

    const { id } = await inquirer.prompt([
        { type: 'input', name: 'id', message: 'ID del plan a actualizar:' }
    ]);

    try {
        const existente = await planService.buscarPorId(id);
        if (!existente) {
            console.log(chalk.red('\n Plan no encontrado.'));
            return;
        }

        const datos = await inquirer.prompt([
            { type: 'input',  name: 'nombre',        message: 'Nuevo nombre:',              default: existente.nombre },
            { type: 'input',  name: 'descripcion',   message: 'Nueva descripcion:',         default: existente.descripcion },
            { type: 'input',  name: 'duracion',      message: 'Nueva duracion (semanas):',  default: existente.duracion },
            { type: 'input',  name: 'metas_fisicas', message: 'Nuevas metas fisicas:',      default: existente.metas_fisicas },
            { type: 'select', name: 'id_nivel',      message: 'Nuevo nivel:',               choices: Niveles, default: existente.id_nivel },
            { type: 'input',  name: 'precio',        message: 'Nuevo precio:',              default: existente.precio }
        ]);

        const plan = new PlanEntrenamiento(
            existente.id,
            datos.nombre,
            datos.descripcion,
            Number(datos.duracion),
            datos.metas_fisicas,
            Number(datos.id_nivel),
            Number(datos.precio)
        );

        const filas = await planService.actualizar(id, plan);
        console.log(chalk.green(`\nPlan actualizado (${filas} fila afectada)`));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}`));
    }
}

async function eliminarPlan() {
    console.log(chalk.cyan('\nEliminar plan\n'));

    const { id } = await inquirer.prompt([
        { type: 'input', name: 'id', message: 'ID del plan a eliminar:' }
    ]);

    try {
        const planExistente = await planService.buscarPorId(id);
        if (!planExistente) {
            console.log(chalk.red('\nPlan no encontrado.'));
            return;
        }

        const contratos = await contratoService.listar();
        const contratosAsociados = contratos.filter(c => c.id_plan === Number(id));

        if (contratosAsociados.length > 0) {
            console.log(chalk.red(`\nNo se puede eliminar: este plan tiene ${contratosAsociados.length} contratos asociados.`));
            console.log(chalk.gray('   Cancela primero los contratos desde el menu de Contratos.'));
            return;
        }

        const { confirmar } = await inquirer.prompt([
            { type: 'confirm', name: 'confirmar', message: `¿Seguro que quieres eliminar el plan "${planExistente.nombre}" (ID ${id})?` }
        ]);

        if (!confirmar) {
            console.log(chalk.yellow('\n Operacion cancelada.'));
            return;
        }

        const filas = await planService.eliminar(id);

        if (filas === 0) {
            console.log(chalk.red('\nPlan no encontrado.'));
        } else {
            console.log(chalk.green(`\nPlan eliminado.`));
        }
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}`));
    }
}

async function asignarPlanCliente() {
    console.log(chalk.cyan('\nAsignar plan a cliente\n'));

    try {
        const clientes = await clienteService.listar();
        if (clientes.length === 0) {
            console.log(chalk.yellow('No hay clientes registrados. Primero crea uno.'));
            return;
        }

        const planes = await planService.listar();
        if (planes.length === 0) {
            console.log(chalk.yellow('No hay planes registrados. Primero crea uno.'));
            return;
        }

        const opcionesClientes = clientes.map(c => ({
            name: `${c.nombre} ${c.apellido} (ID: ${c.id})`,
            value: c.id
        }));

        const opcionesPlanes = planes.map(p => ({
            name: `${p.nombre} - ${p.duracion} semanas - $${p.precio}`,
            value: p.id
        }));

        const respuestas = await inquirer.prompt([
            { type: 'select', name: 'id_cliente',   message: 'Selecciona el cliente:', choices: opcionesClientes },
            { type: 'select', name: 'id_plan',      message: 'Selecciona el plan:',    choices: opcionesPlanes },
            { type: 'input',  name: 'condiciones',  message: 'Condiciones del contrato (ej: Pago mensual):' }
        ]);

        const idContrato = await contratoService.asociarClienteAPlan(
            respuestas.id_cliente,
            respuestas.id_plan,
            respuestas.condiciones
        );

        console.log(chalk.green(`\n Contrato generado con ID: ${idContrato}`));
        console.log(chalk.gray('Se creo el contrato automaticamente.'));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}`));
    }
}

async function pausar() {
    await inquirer.prompt([
        { type: 'input', name: '_', message: chalk.gray('Presiona ENTER para continuar...') }
    ]);
}
