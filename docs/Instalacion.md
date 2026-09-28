# Guía de instalación
Esta guía describe paso a paso cómo instalar y ejecutar **Gimnasio NikeHevy** en tu máquina local.

## Requisitos previos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu sistema:

| Software | Versión mínima | Para qué sirve |
|---|---|---|
| **Node.js** | v18 | Ejecutar la aplicación |
| **npm** | v9 | Gestor de paquetes (viene con Node.js) |
| **MySQL** | v8 | Base de datos |
| **Git** | Cualquiera | Clonar el repositorio |

---

## Verificar versiones

Abre tu terminal (CMD, PowerShell, Git Bash o la terminal de tu preferencia) y ejecuta:

```bash
node -v
npm -v
mysql --version
git --version

Si algún comando no se reconoce, ese software no está instalado.
```
---

## Instalar dependencias

Dentro de la carpeta del proyecto, ejecuta:

```bash
npm install
```

Esto descargará todas las librerías declaradas en `package.json`:

| Librería | Función |
|---|---|
| `mysql2` | Conexión a MySQL con promesas |
| `inquirer` | Menús interactivos por consola |
| `chalk` | Colores en la terminal |
| `figlet` | Banner ASCII en el menú principal |
| `dotenv` | Variables de entorno |
| `nodemon` | Recarga automática (solo desarrollo) |

Al finalizar, verás una carpeta `node_modules/` en la raíz del proyecto.

---

## Crear la base de datos

El proyecto incluye un script SQL con toda la estructura. Está en:

```
database/schema.sql
```
### Desde MySQL Workbench / DBeaver / otro cliente

1. Abre tu cliente MySQL.
2. Abre el archivo `database/schema.sql`.
3. Ejecútalo completo (Run All).

### Verificar que se creó

```sql
SHOW DATABASES LIKE 'gimnasio_nikehevy';
  USE gimnasio_nikehevy;
  SHOW TABLES;
```
---

## Configurar variables de entorno

Crea un archivo llamado `.env` en la **raíz del proyecto**, copiando el archivo de ejemplo:

### En Linux / Mac:

```bash
cp .env.example .env
```

### En Windows (PowerShell):

```powershell
Copy-Item .env.example .env
```

### En Windows (CMD):

```cmd
copy .env.example .env
```

Luego **edita** `.env` con tus datos reales:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password_real
DB_NAME=gimnasio_nikehevy
```

### Importante

- **Nunca subas `.env` a GitHub.** El archivo `.gitignore` ya lo excluye por defecto.
- Si tu contraseña tiene caracteres especiales (`@`, `#`, `$`...), asegúrate de escribirla correctamente.

---

## Verificar la conexión

Puedes verificar que la conexión funciona así:

```bash
node -e "import('./src/config/DataBase.js').then(async (m) => { const pool = m.default; const [r] = await pool.query('SELECT 1+1 AS ok'); console.log('Conexion OK:', r[0].ok); process.exit(0); }).catch(e => { console.error('Fallo:', e.message); process.exit(1); })"
```

Si todo está bien, verás:

```
Conexion OK: 2
```

Si hay error, revisa tus credenciales en `.env`.

---

## Ejecutar la aplicación

### Modo producción (start)

```bash
npm start
```

### Modo desarrollo (con recarga automática)

```bash
npm run dev
```

Al arrancar verás el menú principal:

```
 _   _ ___ _  _______ _   _ _____   __
| \ | |_ _| |/ / ____| | | | ____\ \ / /
|  \| || || ' /|  _| | |_| |  _|  \ V /
| |\  || || . \| |___|  _  | |___  | |
|_| \_|___|_|\_\_____|_| |_|_____| |_|

        Sistema de Gestion - Gimnasio

? ¿Que deseas hacer?
❯ Gestion de Clientes
  Planes de Entrenamiento
  Seguimiento Fisico
  Nutricion
  Contratos
  Gestion Financiera
  ──────────────
  Salir
``` 