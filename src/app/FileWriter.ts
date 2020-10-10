import * as fs from 'fs';
import { dirExists } from '../lib';

export async function writeStringToFile(data:any,filepath:string) {
    let folderpath;
    let files = filepath.split('/')
    if(files.length > 1){//大于1 删除最后一个获取文件夹
        folderpath = filepath.replace('/' + files[files.length-1],"")
    }
    await dirExists(folderpath)
    fs.writeFileSync(filepath,data,{encoding:"utf-8"})
}