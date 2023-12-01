export function getMonstruosAjax(URL,loader,classTxt){
    return new Promise((resolve,reject) =>{
        const xhr = new XMLHttpRequest(); 
        loader.classList.remove(classTxt);
        xhr.onreadystatechange = () =>{
            if(xhr.readyState == 4){
                if(xhr.status >= 200 && xhr.status<300){
                    const data = JSON.parse(xhr.responseText);
                    console.log(data);
                    resolve(data);
                }
                else{
                    console.error(`error ${xhr.status}: ${xhr.statusText}`);
                }
                loader.classList.add(classTxt);
            }
        }
        xhr.open("GET", URL, true);
        try{
            xhr.send();
        }
        catch(err){
            console.error(err.message);
        }
    });
}

export function updateAjax(URL, monstruo){
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () =>{
        if(xhr.readyState == 4){
            if(xhr.status >= 200 && xhr.status<300){
                const data = JSON.parse(xhr.responseText);
                console.log(data);
            }
            else{
                console.error(`error ${xhr.status}: ${xhr.statusText}`);
            }
        }
    };
    xhr.open("PUT", URL + "/" + monstruo.id);
    xhr.setRequestHeader("Content-Type","application/json;charset=UTF-8");
    try{
        xhr.send(JSON.stringify(monstruo));
    }
    catch(err){
        console.error(err);
    }
}