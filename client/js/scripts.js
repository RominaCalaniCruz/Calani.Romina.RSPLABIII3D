//  import {monstruos as moon} from "../data/data.js";
import {actualizarTabla , CalcularPromedioMiedo , crearDropDown, FiltrarPorMiedo, MapearColumnas,  BuscarMiedoMin, BuscarMiedoMax} from "./tabla.js";
import {getMonstruo,postMonstruo} from "./fetch.js";
import {Monstruo , traerMayorId} from "./monstruo.js";
import { crearSelect } from "./formulario.js";
import { getMonstruosAjax , updateAjax} from "./ajax.js";
import { deleteAxios } from "./axios.js";

const URLmonstruos = "http://localhost:3000/monstruos";
const URLtipos_monstruos = "http://localhost:3000/tipos_monstruos";
const $seccionTabla = document.getElementById("tabla");
const $seccionFormulario = document.forms[0];
const $checksArray = document.querySelectorAll("#columnasSeleccionadas .prop_check");
const loader = document.getElementById("gato_loader");
const formLoader = document.getElementById("form_loader");
const columnasSeleccionadasStorage = getStorageChecks();
const $divTiposMonstruos = document.getElementById("tipos_monstruos");
const $divTiposFiltro = document.getElementById("tipos_monstruos_filtros");
const $menorMiedo = document.getElementById("miedo_min");
const $promedioInput = document.getElementById("promedio_miedo");
const $mayorMiedo = document.getElementById("miedo_max");
let monstruos = null;
let listaConFiltro = [];

$checksArray.forEach((check)=>{
    if(columnasSeleccionadasStorage.length){
        check.checked = columnasSeleccionadasStorage.includes(check.value) ? true : false;
    }
});

window.addEventListener("click",(event)=>{
    if(event.target.matches("td")){
        $seccionFormulario.classList.add("ocultar-form");
        manejadorTD(event);
    }
    else if(event.target.matches("#btnEliminar")){ //input[value='Eliminar']
        const id = parseInt($seccionFormulario.txtId.value);
        if(confirm("Esta seguro que desea eliminar a este monstruo?")) handlerDelete(id);
    }
    else if(event.target.matches("#btnCancelar")){
        reiniciarForm();
    }
});

async function manejadorTD(e){
    const id = e.target.parentElement.dataset.id;
    const monstruoElegido = await getMonstruo(URLmonstruos,id,formLoader);
    $seccionFormulario.classList.remove("ocultar-form");
    cargarFormMonstruo($seccionFormulario,monstruoElegido);
}

$seccionFormulario.classList.add("ocultar-form");
formLoader.classList.remove("ocultar_fantasma");

function ObtenerChecks(){
    let listaChecksGuardados = [];
    $checksArray.forEach((check)=> {
        if(check.checked){
            listaChecksGuardados.push(check.value);
        }});
    return listaChecksGuardados;
}

$checksArray.forEach(check=>{
    check.addEventListener("change", ()=>{
        actualizarStorage("checks",ObtenerChecks());
            loader.classList.remove("ocultar_gato");
            document.getElementById("tabla_monstruos").classList.add("ocultar_gato");
            setTimeout(()=>{
                const listaActualizada = (listaConFiltro.length) ? listaConFiltro : monstruos;
                const listaMapeada = MapearColumnas(listaActualizada,$checksArray);
                loader.classList.add("ocultar_gato");
                actualizarTabla($seccionTabla,listaMapeada);
                document.getElementById("tabla_monstruos").classList.remove("ocultar_gato");
                console.log("Lista: ",listaMapeada);
            },500);
    })
});



getMonstruosAjax(URLmonstruos,loader,"ocultar_gato")
.then(data=>{
    monstruos = data.sort((m1,m2)=>m2.miedo - m1.miedo);
    if(monstruos.length){    
        if(columnasSeleccionadasStorage.length){
            const listaMapeada = MapearColumnas(monstruos,$checksArray);
            actualizarTabla($seccionTabla,listaMapeada);
        }else{
            actualizarTabla($seccionTabla,monstruos);      
        }
        ActualizarInputs(monstruos);
    }
});

function ActualizarInputs(lista){
    $promedioInput.value = CalcularPromedioMiedo(lista);
    $menorMiedo.value = BuscarMiedoMin(lista);
    $mayorMiedo.value = BuscarMiedoMax(lista);
}

getMonstruosAjax(URLtipos_monstruos,formLoader,"ocultar_fantasma")
.then(tipos=>{
    $divTiposMonstruos.appendChild(crearSelect("Tipo",tipos));
    let filtroArray = tipos;
    filtroArray.unshift("Todos");
    $divTiposFiltro.appendChild(crearDropDown("Filtro",filtroArray));
    const dropButton = document.getElementById("drop_Filtro");
    const dropMenu = document.getElementById("drop_menu");
    dropMenu.addEventListener("click",(event)=>{
        const opcion = event.target.textContent;
        listaConFiltro = FiltrarPorMiedo(monstruos,opcion);
        if(listaConFiltro.length){
            dropButton.textContent = opcion;
            const checksActualizados = getStorageChecks();
            ActualizarInputs(listaConFiltro);
            loader.classList.remove("ocultar_gato");
            document.getElementById("tabla_monstruos").classList.add("ocultar_gato"); 
            setTimeout(()=>{
                const listaActualizada = (checksActualizados.length > 0 && checksActualizados.length<5) 
                    ? MapearColumnas(listaConFiltro,$checksArray) : listaConFiltro; 
                actualizarTabla($seccionTabla,listaActualizada);
                loader.classList.add("ocultar_gato");
                document.getElementById("tabla_monstruos").classList.remove("ocultar_gato");
            },500);
        }
        else alert("No hay monstruos de tipo : "+opcion);
    })
    $seccionFormulario.classList.remove("ocultar-form");
});

$seccionFormulario.addEventListener("submit",(event)=>{
    event.preventDefault();
    const {txtId,txtNombre,txtAlias,radio_Defensa,range_Miedo,select_Tipo} = $seccionFormulario;
    if(txtId.value === ""){
        let id = 1;
        if(monstruos.length){
            id = traerMayorId(monstruos);
        }
        const nuevoMons = new Monstruo(id, txtNombre.value, txtAlias.value, radio_Defensa.value, parseInt(range_Miedo.value), select_Tipo.value);
        handlerCreate(nuevoMons);
    }
    else{
        const actualizadoMons = new Monstruo(parseInt(txtId.value), txtNombre.value, txtAlias.value, radio_Defensa.value, parseInt(range_Miedo.value), select_Tipo.value);
        if(confirm("Esta seguro de guardar cambios?")) handlerUpdate(actualizadoMons);
    }
});

function handlerCreate(nuevoMonstruo){
    postMonstruo(URLmonstruos,nuevoMonstruo);
    location.reload();
}

function handlerUpdate(editMonstruo){
    updateAjax(URLmonstruos,editMonstruo);
    location.reload();
}
function handlerDelete(id){
    deleteAxios(URLmonstruos,id);
    location.reload();
}

function actualizarStorage(clave, data){
    localStorage.setItem(clave, JSON.stringify(data));
}
function getStorageChecks(){
    return JSON.parse(localStorage.getItem("checks")) || [];
}

function cargarFormMonstruo(formulario, monstruo){
    formulario.txtId.value = monstruo.id;
    formulario.txtNombre.value = monstruo.nombre;
    formulario.txtAlias.value = monstruo.alias;
    formulario.radio_Defensa.value = monstruo.defensa;
    formulario.range_Miedo.value = monstruo.miedo;
    formulario.select_Tipo.value = monstruo.tipo;

    const $btnEliminar = document.getElementById("btnEliminar");
    const $btnAltaMod = document.getElementById("btnAltaMod");
    const $btnCancelar = document.getElementById("btnCancelar");
    const $tituloForm = document.getElementById("titulo_form");
    $tituloForm.textContent = "Modificar Monstruo";
    $btnAltaMod.textContent = "Modificar";
    $btnCancelar.classList.remove("ocultar_boton");
    $btnEliminar.classList.remove("ocultar_boton");
}

function reiniciarForm(){
    const $titulo = document.getElementById("titulo_form");
    $titulo.textContent = "Información del Monstruo";

    const $btnEliminar = document.getElementById("btnEliminar");
    $btnEliminar.classList.add("ocultar_boton");

    const $btnAlta = document.getElementById("btnAltaMod");
    $btnAlta.textContent = "Guardar";
    const $btnCancelar = document.getElementById("btnCancelar");
    $btnCancelar.classList.add("ocultar_boton");
    $seccionFormulario.txtId.value = "";

    $seccionFormulario.reset();
}
