class Medidas {
    #id;
    id_seguimiento;
    tipo_medida;
    valor;

    constructor(id, id_seguimiento, tipo_medida, valor) {
        this.#id = id;
        this.id_seguimiento = id_seguimiento;
        this.tipo_medida = tipo_medida;
        this.valor = valor;
    }

    get Id() {
        return this.#id;
    }
}

export default Medidas;