## ¿Algo salió mal?
Aquí están los errores más comunes y cómo solucionarlos:

### `Cannot find module 'mysql2'`
**Causa:** No instalaste las librerías.
**Solución:** Ejecuta `npm install`.

### `Access denied for user 'root'`
**Causa:** Contraseña incorrecta en `.env`.
**Solución:** Revisa que `DB_PASSWORD` sea la contraseña real de tu MySQL.

### `Unknown database 'gimnasio_nikehevy'`
**Causa:** No creaste la base de datos.
**Solución:** Ejecuta el archivo `database/schema.sql`.

### `Prompt type "list" is not registered`
**Causa:** Estás usando una versión muy nueva de `inquirer`.
**Solución:** En el código debe decir `type: 'select'`, no `type: 'list'`.

### `ERR_MODULE_NOT_FOUND`
**Causa:** Falta un archivo o la ruta está mal.
**Solución:** Revisa que el archivo exista y que la ruta del `import` esté bien escrita.

### `npm run dev` no funciona
**Causa:** No está configurado ese comando.
**Solución:** Agrega esto en `package.json`:
```json
"scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js"
}
```
