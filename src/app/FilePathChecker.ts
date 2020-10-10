
import { APPSystem } from './Symbols';
import { dirExists } from '../lib';
import * as config from '../config';

export async function makeFilePath(file:string,system:APPSystem){
    //为每个文件生成各个语言的对应的文件路径，如果没有文件夹
    //就生成文件夹路径
    let file_paths;
    if(system == APPSystem.iOS){
        file_paths = config.out_ios_file_opts(file);
    }else if(system == APPSystem.Android){
        file_paths = config.out_android_file_opts(file);
    }else{
        console.log('still not support this system');
        throw "we still not supoort the system to make filepath";
    }

    // for(let key of file_paths.keys()){
    //     let file_path = file_paths.get(key);
    //     let folder_path =  file_path.replace(file,'');//计算folder路径
    //     await dirExists(folder_path);//检查路径是否存在，否则创建
    // }
    return file_paths;
}