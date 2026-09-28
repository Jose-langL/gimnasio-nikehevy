
# Gimnasio NikeHevy

Aplicación de línea de comandos (CLI) desarrollada en **Node.js** para la gestión integral de un gimnasio o entrenador personal. Permite administrar clientes, planes de entrenamiento, seguimiento físico, nutrición, contratos y finanzas, todo desde una interfaz de consola interactiva con persistencia en **MySQL**.

---
## Tabla de contenido

Toda la documentación detallada está en la carpeta [`docs/`](./docs/):

| Documento | Contenido |
|---|---|
| [Instalación](./docs/Instalacion.md) | Guía paso a paso|
| [Arquitectura](./docs/Arquitectura.md) | Capas, estructura y flujo de datos |
| [Planeación Scrum](./docs/PlaneacionProyecto.md) | Metodología, roles y sprints |
| [Soluciones](./docs/Soluciones.md) | Solución a problemas  |



## ¿Qué puedes hacer con este proyecto?

- **Clientes:** crear, listar, actualizar y eliminar.
- **Planes de entrenamiento:** con generación automática de contratos.
- **Seguimiento físico:** progreso cronológico con medidas.
- **Nutrición:** alimentos, planes alimenticios y reportes semanales.
- **Contratos:** renovación, cancelación y finalización con rollback.
- **Finanzas:** ingresos, egresos y balances por cliente o fecha.

---

## Tecnologías y dependencias

| Tecnología | Uso |
|---|---|
| **Node.js** (`v24.18.0`) | Entorno de ejecución |
| **JavaScript (ES Modules)** | Lenguaje principal |
| **MySQL** | Base de datos relacional |
| **mysql2** | Driver oficial de MySQL con promesas |
| **inquirer** | Menús interactivos por consola |
| **chalk** | Colores y estilos en la terminal |
| **figlet** | Banner ASCII en el menú principal |
| **dotenv** | Variables de entorno |
| **nodemon** | Recarga automática (devDependency) |

---

## 📋 Requisitos previos
Antes de ejecutar el proyecto, asegúrate de tener instalado:

- **Node.js** v18 o superior → [descargar](https://nodejs.org/)
- **MySQL** v8 o superior → [descargar](https://dev.mysql.com/downloads/)
- **Git** → [descargar](https://git-scm.com/)

Verifica las versiones:

```bash
node -v
npm -v
mysql --version
```
---

## Instalación y uso

### 1. Clonar repositorio

```bash
git clone <url-del-repositorio>
cd gimnasio-nikehevy
npm install
```

### 2. instalar dependencias

```bash
npm install
```

### 3. Crear la base de datos

```bash
mysql -u root -p < database/schema.sql
```

Esto crea la base `gimnasio_nikehevy` con todas las tablas necesarias.

### 4. Configurar variables de entorno

Crea un archivo `.env` en la raíz (copia el ejemplo):

```bash
cp .env.example .env
```

Edítalo con tus credenciales:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=gimnasio_nikehevy
```
### 4. Arrancar la aplicación

```bash
npm start        # producción
npm run dev      # desarrollo (con recarga automática)
```
---

## Video de presentación

[Ver video de presentación](https://drive.google.com/drive/folders/1Kxm66ZYxx5mjuUUrm48KXoQJXvWU4oUF?usp=sharing)

En el video se explica:
- Qué principios y patrones se aplicaron y dónde.
- Demo funcional por consola.

---

## Autor

**Jose Luis Tot** 
Proyecto académico 
