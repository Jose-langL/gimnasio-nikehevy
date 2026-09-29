CREATE DATABASE IF NOT EXISTS gimnasio_nikehevy;


USE gimnasio_nikehevy;

-- CLIENTES
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_registro DATE NOT NULL
);

-- NIVEL PLAN ENTRENAMIENTO
CREATE TABLE nivel_plan_entrenamiento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nivel VARCHAR(20) NOT NULL UNIQUE
);


-- PLANES DE ENTRENAMIENTO
CREATE TABLE planes_entrenamiento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL UNIQUE,
    descripcion TEXT,
    duracion INT NOT NULL,
    metas_fisicas VARCHAR(150),
    id_nivel INT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (id_nivel) REFERENCES nivel_plan_entrenamiento(id) ON DELETE RESTRICT
);

-- ESTADO CONTRATO
CREATE TABLE estado_contrato (
    id INT AUTO_INCREMENT PRIMARY KEY,
    estado VARCHAR(20) NOT NULL UNIQUE
);

-- CONTRATO
CREATE TABLE contrato (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_plan INT NOT NULL,
    condiciones TEXT,
    duracion INT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    id_estado INT NOT NULL,

    FOREIGN KEY (id_cliente) REFERENCES clientes(id) ON DELETE RESTRICT,
    FOREIGN KEY (id_plan) REFERENCES planes_entrenamiento(id) ON DELETE RESTRICT,
    FOREIGN KEY (id_estado) REFERENCES estado_contrato(id) ON DELETE RESTRICT
);

-- SEGUIMIENTO FISICO 
CREATE TABLE seguimiento_fisico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_contrato INT NOT NULL,
    fecha DATE NOT NULL,
    peso DECIMAL(5,2) NOT NULL,
    grasa_corporal DECIMAL(5,2),
    comentarios TEXT,
	foto VARCHAR(255) NULL,
    
    FOREIGN KEY (id_contrato) REFERENCES contrato(id) ON DELETE CASCADE
);

-- MEDIDAS 
CREATE TABLE medidas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_seguimiento_fisico INT NOT NULL,
    tipo_medida VARCHAR(30) NOT NULL,
    valor DECIMAL(5,2) NOT NULL,

    FOREIGN KEY (id_seguimiento_fisico) REFERENCES seguimiento_fisico(id) ON DELETE CASCADE
);

-- PLANES ALIMENTICIOS
CREATE TABLE planes_alimenticios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_contrato INT NOT NULL,
    nombre VARCHAR(80) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,

    FOREIGN KEY (id_contrato) REFERENCES contrato(id) ON DELETE CASCADE
);

-- CATEGORIA DE ALIMENTO
CREATE TABLE categoria_alimentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria VARCHAR(30) NOT NULL UNIQUE
);

-- ALIMENTO
CREATE TABLE alimento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL,
    id_categoria INT NOT NULL,
    calorias DECIMAL(6,2) NOT NULL,
    proteinas DECIMAL(5,2),
    carbohidratos DECIMAL(5,2),
    grasas DECIMAL(5,2),

    FOREIGN KEY (id_categoria) REFERENCES categoria_alimentos(id) ON DELETE RESTRICT
);

-- CONSUMO ALIMENTO
CREATE TABLE consumo_alimento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_plan_alimenticio INT NOT NULL,
    id_alimento INT NOT NULL,
    fecha DATE NOT NULL,
    cantidad DECIMAL(5,2) NOT NULL,

    FOREIGN KEY (id_plan_alimenticio) REFERENCES planes_alimenticios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_alimento) REFERENCES alimento(id) ON DELETE RESTRICT
);

-- GESTION FINANCIERA 
CREATE TABLE gestion_financiera (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    tipo VARCHAR(10) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    concepto VARCHAR(100) NOT NULL,
    fecha DATE NOT NULL,

    FOREIGN KEY (id_cliente) REFERENCES clientes(id) ON DELETE SET NULL
);

-- Niveles del plan entrenamiento 
INSERT INTO nivel_plan_entrenamiento (nivel) VALUES
('Principiante'),
('Intermedio'),
('Avanzado');


-- Categorias de Alimentos
INSERT INTO categoria_alimentos (categoria) VALUES
('Carnes'),
('Granos'),
('Frutas'),
('Verduras'),
('Lácteos'),
('Bebidas'),
('Suplementos'),
('Snacks');

-- Estados de contrato
INSERT INTO estado_contrato (estado) VALUES
( 'activo'),
( 'renovado'),
( 'cancelado'),
('finalizado');

-- usario y permisos
CREATE USER 'entrenador'@'localhost' IDENTIFIED BY 'NikeHevy2026!';

GRANT ALL PRIVILEGES ON gimnasio_nikehevy.* TO 'entrenador'@'localhost';
FLUSH PRIVILEGES;

