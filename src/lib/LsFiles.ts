import * as fs from 'fs';

function read_files_promise(path:string):Promise<string[]>{
    return  new Promise((resolve,reject)=>{
        fs.readdir(path,(error,files)=>{
            if(error){
                console.log(error);
                reject(error);
                return;
            }
            resolve(files);
        });
    });
}

export async function read_files(path:string):Promise<string[]>{
    const files = await read_files_promise(path);
    return files;
}