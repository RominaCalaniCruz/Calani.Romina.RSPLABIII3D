import {Personaje} from './personaje.js';


export function Monstruo(id, nombre, alias, defensa, miedo, tipo){
    Personaje.call(this, id, nombre);
    this.alias = alias;
    this.defensa = defensa;
    this.miedo = miedo;
    this.tipo = tipo;
}

export function traerMayorId(array){
    let ID = 0;
    array.forEach(element => {
        if(ID == 0 || parseInt(element["id"]) > ID){
            ID = parseInt(element["id"]);
        }
    });
    return ++ID;
}