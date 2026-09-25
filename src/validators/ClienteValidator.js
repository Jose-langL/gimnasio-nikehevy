export function validarCliente(nombre, apellido, email, telefono, estado, fecha_registro) {

    if (nombre.trim() === "") {
            throw new Error("El nombre no puede estar vacio");
    }

    if (apellido.trim() === "") {
            throw new Error("El apellido no puede estar vacio");
    }
  
    if (!email.includes("@") || !email.includes(".")) {
        throw new Error("El email no tiene un formato valido");
    }
  
    const posicionArroba = email.indexOf("@");
    const posicionPunto = email.lastIndexOf(".");
  
    if (posicionArroba === 0) {
            throw new Error("El email no puede empezar con @");
    }
  
    if (posicionPunto < posicionArroba) {
            throw new Error("El email no tiene un formato valido");
    }


    if (!telefono || telefono.trim() === "") {
        throw new Error("El telefono no puede estar vacio");
    }


    const soloNumeros = /^[0-9]+$/;
    if (!soloNumeros.test(telefono)) {
        throw new Error("El telefono solo puede contener numeros");
    }


    if (telefono.length < 8 || telefono.length > 15) {
        throw new Error("El telefono debe tener entre 8 y 15 digitos");
    }


    if (typeof estado !== "boolean") {
            throw new Error("El estado debe ser verdadero o falso");
    }


    if (!fecha_registro || isNaN(Date.parse(fecha_registro))) {
        throw new Error("La fecha de registro no es valida");
    }

}