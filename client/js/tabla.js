
export const crearTabla = (data)=>{
    const divContainer = document.createElement("div");
    divContainer.classList.add("mt-r","container");
    const tabla = document.createElement("table");
    tabla.classList.add("table","table-bordered","table-hover");
    tabla.setAttribute("id","tabla_monstruos");
    if(Array.isArray(data)){
        tabla.appendChild(crearCabecera(data[0]));
        tabla.appendChild(crearCuerpo(data));
    }
    divContainer.appendChild(tabla);
    return divContainer;
}

const crearCabecera = (elemento)=>{
    const tHead = document.createElement("thead");
    const headRow = document.createElement("tr");
    for (const key in elemento) {
        if(key === "id") continue;
        const th = document.createElement("th");
        th.textContent = key;
        headRow.appendChild(th);
    }
    tHead.appendChild(headRow);
    return tHead;
}

const crearCuerpo = (data)=>{
    const tBody = document.createElement("tbody");
    data.forEach((element,index) => {
        const tr = document.createElement("tr");
        for (const key in element) {
            if(key === "id") {
                tr.dataset.id = element[key];
            }
            else{
                const td = document.createElement("td");
                td.textContent = element[key];
                tr.appendChild(td);
            }
        }
        tBody.appendChild(tr);
    });
    return tBody;
}

export function BuscarMiedoMin(dataArray){
    let menorMiedo = null;
    if(dataArray.length){
        menorMiedo = dataArray.reduce((ant,act)=>{
            return (ant.miedo > act.miedo) ? act : ant;
        });
    }
    return menorMiedo.miedo;
}
export function BuscarMiedoMax(dataArray){
    let mayorMiedo = null;
    if(dataArray.length){
        mayorMiedo = dataArray.reduce((ant,act)=>{
            return (ant.miedo < act.miedo) ? act : ant;
        });
    }
    return mayorMiedo.miedo;
}

export function CalcularPromedioMiedo(dataArray){
    const suma = dataArray.reduce((ant,act)=>{
        return ant + parseInt(act.miedo);
    },0);
    return (suma / dataArray.length).toFixed(2);
}

export function FiltrarPorMiedo(dataArray,opcion){
    let listaFiltrada = dataArray;
    if(opcion != "Todos"){
        listaFiltrada = dataArray.filter((elemento)=>{
            return opcion == elemento.tipo;
        })

    }
    return listaFiltrada;
}
export const actualizarTabla = (contenedor, data)=>{
    while(contenedor.hasChildNodes()){
        contenedor.removeChild(contenedor.firstChild);
    }
    contenedor.appendChild(crearTabla(data));
}

export function MapearColumnas(dataArray,columnasCheck){    
    const checkeados = Array.from(columnasCheck)
        .filter(check => check.checked)
        .map(checkbox=>checkbox.value.toLowerCase());
        if (!checkeados.includes('id')) {
            checkeados.push('id');
        }
    const listaMapeada = dataArray.map((elemento)=>{
        const nuevoMons = {};
        checkeados.forEach(columna=>{
                nuevoMons[columna] = elemento[columna];
        });
        return nuevoMons;
    });
    return listaMapeada;
}

export function crearDropDown(titulo,array){
    const divBoton = document.createElement("dropdown");
    const botonPpal = document.createElement("button");
    botonPpal.setAttribute("id",`drop_${titulo}`);
    botonPpal.setAttribute("type","button");
    botonPpal.setAttribute("data-bs-toggle","dropdown");
    botonPpal.textContent = "Todos";
    botonPpal.classList.add("btn","btn-secondary","dropdown-toggle");
    divBoton.appendChild(botonPpal);
    const ul = document.createElement("ul");
    ul.classList.add("dropdown-menu","dropdown-menu-dark");
    ul.setAttribute("id","drop_menu");
    for (const key in array) {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.classList.add("dropdown-item");
        a.setAttribute("value",array[key]);
        a.textContent = array[key];
        li.appendChild(a);
        ul.appendChild(li);
    }
    divBoton.appendChild(ul);
    return divBoton;
}