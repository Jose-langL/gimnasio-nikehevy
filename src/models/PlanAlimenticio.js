class PlanAlimenticio{
    #id; 
    id_contrato;
    nombre; 
    fecha_inicio;
    fecha_fin;

    constructor (id, id_contrato, nombre, fecha_inicio, fecha_fin){
        this.#id = id; 
        this.id_contrato = id_contrato;
        this.nombre = nombre; 
        this.fecha_inicio = fecha_inicio; 
        this.fecha_fin = fecha_fin;
    }
    
    get Id() {
        return this.#id;
    }
}

export default PlanAlimenticio;