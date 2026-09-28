# Arquitectura del proyecto

Este documento explica **cómo está organizado el proyecto por dentro**: qué hace cada carpeta, qué es una "capa" y cómo fluye la información desde que el usuario elige una opción en el menú hasta que se guarda en la base de datos.

---


## Las 4 capas del proyecto

Este proyecto tiene **4 capas** principales:

```
┌──────────────────────────────────────────────┐
│  1. COMMANDS  (Interfaz de usuario)          │
│     Muestra menús y pide datos.              │              │
├──────────────────────────────────────────────┤
│  2. SERVICES  (Reglas del negocio)           │
│     Decide qué hacer, valida, coordina.      │
├──────────────────────────────────────────────┤
│  3. REPOSITORIES  (Acceso a datos)           │
│     Ejecuta las consultas SQL.               │
├──────────────────────────────────────────────┤
│  4. BASE DE DATOS  (MySQL)                   │
│     Guarda la información.                   │
└──────────────────────────────────────────────┘
```

### Además hay carpetas de apoyo:

- **`src/models/`** → las "cosas" del negocio: Cliente, Plan, Contrato, etc.
- **`src/validators/`** → reglas de validación por cada modelo.
- **`src/factories/`** → construye objetos complejos (como un Contrato).
- **`src/config/`** → configuración (conexión a MySQL).
- **`src/utils/`** → funciones útiles reutilizables.

---

## Estructura de carpetas

```
    └── 📁database           → Schema de la base de datos
    └── 📁docs               → Documentacion del proyecto
    └── 📁src
        └── 📁commands       → Menús de la terminal
        └── 📁config         → Conexión y configuracion la base de datos
        └── 📁factories      → Construcción de objetos complejos
        └── 📁models         → Clases
        └── 📁repositories   → Consultas SQL
        └── 📁services       → Lógica del negocio 
        └── 📁utils          → Funciones auxiliares
        └── 📁validators     → Validaciones 
        ├── app.js           → Punto de entrada
    ├── .env.example         → env de ejemplo
    ├── .gitignore
    ├── package.json        
    └── README.md
```