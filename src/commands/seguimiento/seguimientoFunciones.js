import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

import SeguimientoFisicoService from '../../services/SeguimientoFisicoService.js';
import SeguimientoFisicoRepository from '../../repositories/SeguimientoFisicoRepository.js';
import MedidasService from '../../services/MedidasService.js';
import MedidasRepository from '../../repositories/MedidasRepository.js';
import ContratoService from '../../services/ContratoService.js';
import ContratoRepository from '../../repositories/ContratoRepository.js';
import PlanEntrenamientoService from '../../services/PlanEntrenamientoService.js';
import PlanEntrenamientoRepository from '../../repositories/PlanEntrenamientoRepository.js';
import ClienteService from '../../services/ClienteService.js';
import ClienteRepository from '../../repositories/ClienteRepository.js';
import ContratoFactory from '../../factories/ContratoFactory.js';
import SeguimientoFisico from '../../models/SeguimientoFisico.js';
import { obtenerFechaHoy, formatearFecha } from '../../utils/fechaUtils.js';

// Plan alimenticio, consumo y alimento
import PlanAlimenticioService from '../../services/PlanAlimenticioService.js';
import PlanAlimenticioRepository from '../../repositories/PlanAlimenticioRepository.js';
import ConsumoAlimentoService from '../../services/ConsumoAlimentoService.js';
import ConsumoAlimentoRepository from '../../repositories/ConsumoAlimentoRepository.js';
import AlimentoService from '../../services/AlimentoService.js';
import AlimentoRepository from '../../repositories/AlimentoRepository.js';

// --- Instancias de repositories ---
const segRepository = new SeguimientoFisicoRepository();
const medidasRepository = new MedidasRepository();
const contratoRepository = new ContratoRepository();
const planRepository = new PlanEntrenamientoRepository();
const clienteRepository = new ClienteRepository();
const planAlimenticioRepository = new PlanAlimenticioRepository();
const consumoAlimentoRepository = new ConsumoAlimentoRepository();
const alimentoRepository = new AlimentoRepository();

// --- Instancias de services ---
const medidasService = new MedidasService(medidasRepository);
const segService = new SeguimientoFisicoService(segRepository, medidasService);
const planService = new PlanEntrenamientoService(planRepository);
const clienteService = new ClienteService(clienteRepository);
const contratoFactory = new ContratoFactory();
const contratoService = new ContratoService(contratoRepository, planService, contratoFactory);
const planAlimenticioService = new PlanAlimenticioService(planAlimenticioRepository);
const alimentoService = new AlimentoService(alimentoRepository);
const consumoAlimentoService = new ConsumoAlimentoService(consumoAlimentoRepository, alimentoService);

export async function registrarSeguimiento() {
    console.log(chalk.cyan('\nNuevo avance\n'));

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
        console.log(chalk.gray(`Cliente del contrato: ${nombreCliente}\n`));

        const datos = await inquirer.prompt([
            { type: 'input',   name: 'fecha',          message: 'Fecha (YYYY-MM-DD):', default: obtenerFechaHoy() },
            { type: 'input',   name: 'peso',           message: 'Peso (kg):' },
            { type: 'confirm', name: 'tieneGrasa',     message: '¿Registrar grasa corporal?' },
            { type: 'input',   name: 'grasa_corporal', message: 'Grasa corporal (%):', when: (a) => a.tieneGrasa },
            { type: 'input',   name: 'comentarios',    message: 'Comentarios:' },
            { type: 'input',   name: 'foto',           message: 'URL de la foto:' }
        ]);

        const medidas = [];
        let agregarMas = true;

        while (agregarMas) {
            const { agregar } = await inquirer.prompt([
                { type: 'confirm', name: 'agregar', message: '¿Agregar una medida?', default: medidas.length === 0 }
            ]);

            if (!agregar) {
                agregarMas = false;
                continue;
            }

            const medida = await inquirer.prompt([
                { type: 'input', name: 'tipo_medida', message: 'Tipo de medida (ej: brazo, cintura):' },
                { type: 'input', name: 'valor',       message: 'Valor (cm):' }
            ]);

            medidas.push({
                tipo_medida: medida.tipo_medida,
                valor: Number(medida.valor)
            });
        }

        const seguimiento = new SeguimientoFisico(
            null,
            Number(id_contrato),
            datos.fecha,
            Number(datos.peso),
            datos.tieneGrasa ? Number(datos.grasa_corporal) : null,
            datos.comentarios,
            datos.foto
        );

        const id = await segService.crear(seguimiento, medidas);
        console.log(chalk.green(`\nSeguimiento registrado con ID: ${id}`));
        if (medidas.length > 0) {
            console.log(chalk.gray(`Se guardaron ${medidas.length} medida(s).`));
        }
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}`));
    }
}

export async function verHistorial() {
    console.log(chalk.cyan('\nHistorial de seguimiento\n'));

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
        const plan = await planService.buscarPorId(contrato.id_plan);
        const nombreCliente = cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Desconocido';
        const nombrePlan = plan ? plan.nombre : 'Desconocido';

        console.log(chalk.bold.white(`\nCliente: ${nombreCliente} | Plan: ${nombrePlan}\n`));

        const registros = await segService.obtenerProgreso(id_contrato);

        if (registros.length === 0) {
            console.log(chalk.yellow('No hay registros de seguimiento para este contrato.'));
            return;
        }

        registros.forEach((seg) => {
            console.log(chalk.bold.cyan(`\n=== SEGUIMIENTO #${seg.id} (${formatearFecha(seg.fecha)}) ===`));
            console.log(chalk.white(`Peso:        ${seg.peso} kg`));
            console.log(chalk.white(`Grasa:       ${seg.grasa_corporal !== null ? seg.grasa_corporal + '%' : 'No registrada'}`));
            console.log(chalk.white(`Comentarios: ${seg.comentarios || '-'}`));
            console.log(chalk.white(`Foto:        ${seg.foto || '-'}`));

            if (seg.medidas && seg.medidas.length > 0) {
                console.log(chalk.gray('Medidas:'));
                seg.medidas.forEach((m) => {
                    console.log(chalk.gray(`   - ${m.tipo_medida}: ${m.valor} cm`));
                });
            } else {
                console.log(chalk.gray('Sin medidas registradas.'));
            }
        });
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}`));
    }
}

export async function eliminarSeguimiento() {
    console.log(chalk.cyan('\nEliminar seguimiento\n'));

    const { id } = await inquirer.prompt([
        { type: 'input', name: 'id', message: 'ID del seguimiento a eliminar:' }
    ]);

    try {
        const existente = await segService.buscarPorId(id);
        if (!existente) {
            console.log(chalk.red('\nSeguimiento no encontrado.'));
            return;
        }

        const { confirmar } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirmar',
                message: `¿Seguro que quieres eliminar el seguimiento #${id}? Esto tambien eliminara sus medidas asociadas.`
            }
        ]);

        if (!confirmar) {
            console.log(chalk.yellow('\n Operacion cancelada.'));
            return;
        }

        await segService.eliminar(id);
        console.log(chalk.green(`\nSeguimiento #${id} eliminado correctamente.`));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}`));
    }
}

// Función para exportar cliente a JSON
export async function clienteJson() {
    console.log(chalk.cyan('\nExportar cliente a JSON\n'));

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
        const plan = await planService.buscarPorId(contrato.id_plan);
        const registros = await segService.obtenerProgreso(id_contrato);
        const planesAlimenticios = await planAlimenticioService.listarPorContrato(contrato.id);

        console.log(chalk.bold.white(`\nCliente: ${cliente.nombre} ${cliente.apellido}\n`));

        const seguimiento = registros.map((seg) => ({
            fecha: formatearFecha(seg.fecha),
            peso_kg: seg.peso,
            grasa_corporal: seg.grasa_corporal,
            comentarios: seg.comentarios,
            foto: seg.foto,
            medidas: (seg.medidas || []).map((m) => ({ tipo: m.tipo_medida, valor: m.valor, unidad: 'cm' }))
        }));

        const planesData = [];
        for (const planAli of planesAlimenticios) {
            const consumos = await consumoAlimentoService.listarPorPlan(planAli.id);
            const porDia = {};

            for (const c of consumos) {
                const alimento = await alimentoService.buscarPorId(c.id_alimento);
                if (!alimento) continue;

                const fecha = formatearFecha(c.fecha);
                const factor = Number(c.cantidad) / 100;

                if (!porDia[fecha]) {
                    porDia[fecha] = { fecha, alimentos: [], totales_dia: { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 } };
                }

                porDia[fecha].alimentos.push({
                    alimento: alimento.nombre,
                    cantidad_gramos: Number(c.cantidad),
                    calorias_estimadas: Number((Number(alimento.calorias) * factor).toFixed(2)),
                    proteinas_g: Number((Number(alimento.proteinas) * factor).toFixed(2)),
                    carbohidratos_g: Number((Number(alimento.carbohidratos) * factor).toFixed(2)),
                    grasas_g: Number((Number(alimento.grasas) * factor).toFixed(2))
                });

                porDia[fecha].totales_dia.calorias += Number(alimento.calorias) * factor;
                porDia[fecha].totales_dia.proteinas += Number(alimento.proteinas) * factor;
                porDia[fecha].totales_dia.carbohidratos += Number(alimento.carbohidratos) * factor;
                porDia[fecha].totales_dia.grasas += Number(alimento.grasas) * factor;
            }

            planesData.push({
                id: planAli.id,
                nombre: planAli.nombre,
                fecha_inicio: formatearFecha(planAli.fecha_inicio),
                fecha_fin: formatearFecha(planAli.fecha_fin),
                consumos_por_dia: Object.values(porDia)
            });
        }

        const data = {
            metadata: { fecha_exportacion: new Date().toISOString(), generado_por: 'Gimnasio NikeHevy CLI' },
            cliente: {
                id: cliente.id, nombre: cliente.nombre, apellido: cliente.apellido,
                email: cliente.email, telefono: cliente.telefono,
                estado: !!cliente.estado, fecha_registro: formatearFecha(cliente.fecha_registro)
            },
            contrato: {
                id: contrato.id, condiciones: contrato.condiciones,
                fecha_inicio: formatearFecha(contrato.fecha_inicio),
                fecha_fin: formatearFecha(contrato.fecha_fin),
                id_estado: contrato.id_estado
            },
            plan_entrenamiento: plan ? {
                id: plan.id, nombre: plan.nombre, duracion_semanas: plan.duracion,
                id_nivel: plan.id_nivel, precio: plan.precio, metas_fisicas: plan.metas_fisicas
            } : null,
            seguimiento_fisico: seguimiento,
            planes_alimenticios: planesData
        };

        const dir = path.resolve('exports');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const slug = `${cliente.nombre}_${cliente.apellido}`
            .toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');

        const ruta = path.join(dir, `cliente_${slug}_progreso.json`);
        fs.writeFileSync(ruta, JSON.stringify(data, null, 2), 'utf-8');

        console.log(chalk.green(`\nArchivo exportado:`));
        console.log(chalk.gray(`   ${ruta}`));
        console.log(chalk.gray(`   Seguimientos: ${seguimiento.length} | Planes alimenticios: ${planesData.length}`));
    } catch (error) {
        console.log(chalk.red(`\nError: ${error.message}`));
    }
}