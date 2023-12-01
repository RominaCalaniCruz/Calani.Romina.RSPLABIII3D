export async function getMonstruos(URL,loader){
    loader.classList.remove("ocultar_fantasma");
    try {
        const res = await fetch(URL);
        if(!res.ok) throw res;
        const data = await res.json();
        console.log(data);
        return data;
        
    } catch (err) {
        console.error(err);
    }
    finally{
        loader.classList.add("ocultar_fantasma");
        
    }

};

export async function getMonstruo(URL,id,loader){
    loader.classList.remove("ocultar_fantasma");
    try {
        const res = await fetch(URL + "/" + id);
        if(!res.ok) throw res;
        const data = await res.json();
        console.log(data);
        return data;
    } catch (err) {
        console.error(err);
    } finally {
        console.log(loader);
        loader.classList.add("ocultar_fantasma");
    }
}
export function postMonstruo(URL,monstruo){

    loader.classList.remove("oculto");
    fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type":"application/json;charset=UTF-8"
        },
        body: JSON.stringify(monstruo)
    })
    .then((res)=>(res.ok ? res.json() : Promise.reject(res) ))
    .then((data)=>console.log(data))
    .catch((res)=> console.error(`error ${res.status}: ${res.statusText}`))
    .finally(()=>loader.classList.add("oculto"));
}