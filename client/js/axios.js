
export function deleteAxios(URL,id){
    axios
    .delete(URL + "/" +id)
    .then(({data})=>{
        console.log(data);
        return data;
    })
    .catch(({message})=>{
        console.error(message);
    })
    .finally(()=>{
        console.log("enviado");
    });
}