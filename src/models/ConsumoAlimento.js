class ConsumoAlimento{
    #id; 
    id_plan_alimenticio; 
    id_alimento; 
    fecha; 
    cantidad;

    constructor(id, id_plan_alimenticio, id_alimento, fecha, cantidad){
        this.#id = id;
        this.id_plan_alimenticio = id_plan_alimenticio;
        this.id_alimento = id_alimento;
        this.fecha = fecha; 
        this.cantidad = cantidad;
    }

    get Id() {
        return this.#id;
    }
}

export default ConsumoAlimento;