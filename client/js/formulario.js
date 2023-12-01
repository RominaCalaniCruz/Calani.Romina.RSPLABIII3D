
export function crearSelect(titulo,array){
    const select = document.createElement("select");
    select.setAttribute("id",`select_${titulo}`);
    select.classList.add("form-select","mb-4");
    for (const key in array) {
        const option = document.createElement("option");
        option.setAttribute("value",array[key]);
        option.textContent = array[key];
        select.appendChild(option);
    }
    return select;
}