
import {getMonstruos} from "./fetch.js";

const URL = "http://localhost:3000/monstruos";

const loader = document.querySelector("#loader");
const iconosCards = {
    "alias":"./assets/images/mask.svg",
    "nombre":"./assets/images/pumpkin.svg",
    "defensa":"./assets/images/defensa.svg",
    "miedo":"./assets/images/ghost.svg",
    "tipo":"./assets/images/monster.svg",
};

crearListaCards();
    
function crearCards(data,imagenes){
    const contenedor = document.createElement("div");
    contenedor.classList.add("row","cards-contenedor");
    if(Array.isArray(data)){
        data.forEach((element,index)=>{
            const divCard = document.createElement("div");
            const cardBody = document.createElement("div");
            const card = document.createElement("div");
            divCard.classList.add("col-lg-3","col-md-4","col-sm-6","mb-4");
            cardBody.classList.add("card-body","mx-auto");
            card.classList.add("card","estilo-fondo");
            for (const key in element) {
                if(key === "id") {
                    continue;
                }
                else if(key!="alias" && key!="miedo"){
                    const imagen = document.createElement("img");
                    imagen.src = imagenes[key];
                    const p = document.createElement("p");
                    p.classList.add("card-text","img-icon");
                    p.textContent =key +": "+element[key];
                    p.prepend(imagen);
                    cardBody.appendChild(p);
                }
            }
            if("alias" in element){
                const imagen = document.createElement("img");
                imagen.src = imagenes["alias"];
                const h5 = document.createElement("h5");
                h5.classList.add("card-title","img-icon");
                h5.textContent = "alias: "+element["alias"];
                h5.prepend(imagen);
                cardBody.insertBefore(h5, cardBody.firstChild);
            }
            if("miedo" in element){
                const span = document.createElement("span");
                const imagen = document.createElement("img");
                imagen.src = "./assets/images/ghost.svg";
                span.textContent = "miedo";
                span.prepend(imagen);
                span.classList.add("img-icon");
                cardBody.appendChild(span);
                const cardProgress = document.createElement("div");
                cardProgress.classList.add("progress","mt-1");
                cardProgress.style="height: 25px";
                cardProgress.ariaValueNow = element["miedo"];
                cardProgress.ariaValueMin = 0;
                cardProgress.ariaValueMax = 100;
                const divContenidoProgress = document.createElement("div");
                divContenidoProgress.classList.add("progress-bar","bg-warning","estilo-progress-bar");
                divContenidoProgress.textContent = element["miedo"];
                divContenidoProgress.style = "width:"+element["miedo"]+"%; text-align:center; color: black";
                cardProgress.appendChild(divContenidoProgress);
                cardBody.appendChild(cardProgress);
            }
            card.appendChild(cardBody);
            divCard.appendChild(card);
            contenedor.appendChild(divCard);
        });
    }
    else{
        console.log("error no es array");
    }
    return contenedor;
}
async function crearListaCards(){
    const monstruos = await getMonstruos(URL,loader);
    const $seccion_cards = document.getElementById("seccion-cards");
    $seccion_cards.appendChild(crearCards(monstruos,iconosCards));
}

