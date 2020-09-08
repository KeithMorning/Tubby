

export function get_file_extern(path:string):string{
    let index = path.lastIndexOf("\.");  
    let key  = path.substring(index, path.length);
    return key;
}
