import inquirer from 'inquirer';
import chalk from 'chalk';
import Alimento from '../../models/Alimento.js';
import AlimentoService from '../../services/AlimentoService.js';
import AlimentoRepository from '../../repositories/AlimentoRepository.js';
import { CATEGORIAS, pausar } from './utils.js';

const alimentoRepository = new AlimentoRepository();
const alimentoService = new AlimentoService(alimentoRepository);

const SubmenuAlimentos = [
    { name: 'Crear alimento',       value: 'crear' },
    { name: 'Listar alimentos',     value: 'listar' },
    { name: 'Actualizar alimento',  value: 'actualizar' },
    { name: 'Eliminar alimento',    value: 'eliminar' },

    new inquirer.Separator(),
    { name: '<- Volver al menu de Nutricion', value: 'volver' }
];

export async function alimentoMenu() {
    let volver = false;

    while (!volver) {
        console.clear();
        console.log(chalk.bold.yellow('\n=== ALIMENTOS ==='));

        const { opcion } = await inquirer.prompt([
            {
                type: 'select',
                name: 'opcion',
                message: 'Selecciona una opcion:',
                choices: SubmenuAlimentos,
                loop: false
            }
        ]);

        switch (opcion) {
            case 'crear':      await crearAlimento();      break;
            case 'listar':     await listarAlimentos();    break;
            case 'actualizar': await actualizarAlimento(); break;
            case 'eliminar':   await eliminarAlimento();   break;
            case 'volver':     volver = true;              break;
        }

        if (!volver) await pausar();
    }
}

async function crearAlimento() {
    console.log(chalk.cyan('\nNuevo alimento\n'));
    console.log(chalk.gray('(Los valores son POR 100 GRAMOS)\n'));

    const datos = await inquirer.prompt([
        { type: 'input',  name: 'nombre',         message: 'Nombre del alimento:' },
        { type: 'select', name: 'id_categoria',   message: 'Categoria:', choices: CATEGORIAS },
        { type: 'input',  name: 'calorias',       message: 'Calorias por 100g:' },
        { type: 'input',  name: 'proteinas',      message: 'Proteinas por 100g:' },
        { type: 'input',  name: 'carbohidratos',  message: 'Carbohidratos por 100g:' },
        { type: 'input',  name: 'grasas',         message: 'Grasas por 100g:' }
    ]);

    try {
        const alimento = new Alimento(
            null,
            datos.nombre,
            Number(datos.id_categoria),
            Number(datos.calorias),
            Number(datos.proteinas),
            Number(datos.carbohidratos),
            Number(datos.grasas)
        );

        const id = await alimentoService.crear(alimento);
        console.log(chalk.green(`\nAlimento creado con ID: ${id}`));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}`));
    }
}

async function listarAlimentos() {
    console.log(chalk.cyan('\nCatalogo de alimentos\n'));

    try {
        const alimentos = await alimentoService.listar();

        if (alimentos.length === 0) {
            console.log(chalk.yellow('No hay alimentos registrados.'));
            return;
        }

        alimentos.forEach((a) => {
            const categoria = CATEGORIAS.find(c => c.value === a.id_categoria)?.name || 'Desconocida';
            console.log(
                chalk.white(`ID: ${a.id}`) +
                chalk.gray(` | ${a.nombre} | ${categoria} | ${a.calorias} kcal | P: ${a.proteinas}g | C: ${a.carbohidratos}g | G: ${a.grasas}g (por 100g)`)
            );
        });
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}`));
    }
}

async function actualizarAlimento() {
    console.log(chalk.cyan('\nActualizar alimento\n'));

    const { id } = await inquirer.prompt([
        { type: 'input', name: 'id', message: 'ID del alimento a actualizar:' }
    ]);

    try {
        const existente = await alimentoService.buscarPorId(id);
        if (!existente) {
            console.log(chalk.red('\nAlimento no encontrado.'));
            return;
        }

        const datos = await inquirer.prompt([
            { type: 'input',  name: 'nombre',        message: 'Nuevo nombre:',                 default: existente.nombre },
            { type: 'select', name: 'id_categoria',  message: 'Nueva categoria:',              choices: CATEGORIAS, default: existente.id_categoria },
            { type: 'input',  name: 'calorias',      message: 'Nuevas calorias por 100g:',     default: existente.calorias },
            { type: 'input',  name: 'proteinas',     message: 'Nuevas proteinas por 100g:',    default: existente.proteinas },
            { type: 'input',  name: 'carbohidratos', message: 'Nuevos carbohidratos por 100g:', default: existente.carbohidratos },
            { type: 'input',  name: 'grasas',        message: 'Nuevas grasas por 100g:',       default: existente.grasas }
        ]);

        const alimento = new Alimento(
            existente.id,
            datos.nombre,
            Number(datos.id_categoria),
            Number(datos.calorias),
            Number(datos.proteinas),
            Number(datos.carbohidratos),
            Number(datos.grasas)
        );

        const filas = await alimentoService.actualizar(id, alimento);
        console.log(chalk.green(`\nAlimento actualizado (${filas} fila afectada)`));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}`));
    }
}

async function eliminarAlimento() {
    console.log(chalk.cyan('\nEliminar alimento\n'));

    const { id } = await inquirer.prompt([
        { type: 'input', name: 'id', message: 'ID del alimento a eliminar:' }
    ]);

    try {
        const existente = await alimentoService.buscarPorId(id);
        if (!existente) {
            console.log(chalk.red('\nAlimento no encontrado.'));
            return;
        }

        const { confirmar } = await inquirer.prompt([
            { type: 'confirm', name: 'confirmar', message: `¿Eliminar "${existente.nombre}"?` }
        ]);

        if (!confirmar) {
            console.log(chalk.yellow('\n Operacion cancelada.'));
            return;
        }

        await alimentoService.eliminar(id);
        console.log(chalk.green(`\nAlimento eliminado.`));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}`));
    }
}