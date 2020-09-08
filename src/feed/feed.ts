// 输入 iOS 国际化整理成 excel

import * as ph from "path";
import * as fs from "fs";
import * as fconfig from "./feedConfig"
import {ExcelRwter} from "../lib/ExcelRwter"

interface file{
    name:string;
    path:string;
    parent:string;
}

interface line{
    name:string;
    ios_file:string;
    ios_key:string;
    android_file:string;
    android_key:string;
}

class FeedTool{
    private async openFromPath(path:string) {
        return new Promise<fs.Dir>((resolve,reject)=>{
            fs.opendir(path,{encoding:"utf-8",bufferSize:1},(error,dir)=>{
                if(error){
                    reject(error)
                    return
                }
                resolve(dir)
            })
        })
    }

    //返回目录下的文件,扩展名称用 '.strings' 
    async internalReadFromPath(path:string,files:file[],filter?:string[]){
        let dir = await this.openFromPath(path)
        for await(const dirent of dir){
            if(dirent.isDirectory()){
                await this.internalReadFromPath(dir.path+"/"+dirent.name,files)
            }else{
                if(filter != null){
                    let filterset  = new Set(filter)
                    if(!filterset.has(ph.extname(dirent.name))){
                        continue;
                    }
                }
                files.push({
                    name:dirent.name,//文件名
                    path:dir.path+"/"+dirent.name,//路径
                    parent:ph.basename(path),//父路径的名称
                })
            }
        }
    }

    async readFromPath(path:string,filters?:string[]){
        let files:file[] = []
        await this.internalReadFromPath(path,files,filters);
        return files;
    }
}



export class iOSFeed {

    constructor(){

    }

    async run(rootpath:string){
        let reader = new FeedTool()
        let files = await reader.readFromPath(rootpath,['.strings'])
        let mapdata = await this.makeDataStructure(files)
        let linedata = this.convertToData(mapdata)
        let rw = new ExcelRwter()
        let map = new Map()
        map.set("result",linedata)
        rw.writeArrayToFile(fconfig.outputPath,map)
        console.log("🎉🎉 finish the ios translation file to xlsx file")
    }

    //input en.lproj return en
    getLanguage(path:string) {
        let index = path.lastIndexOf("\.");
        let key  = path.substring(0, index);
        return key
    }
    
    getGroupName(file:file){
       return file.name
    }


    async makeDataStructure(files:file[]){
        let result = new Map()
        for(let file of files){
            if(!result.get(file.name)){
                result.set(file.name,new Map())
            }
            await this.convertIntoJson(file,result)
        } 
        return result
    }

    //context 结构
    // file
    //   --groupname
    //     --key
    //       --en
    //       --chs
    //       ...
    async convertIntoJson(file:file,context:Map<string,Map<any,Map<any,any>>>){
        let content = this.readToString(file.path);
        content = this.delcomment(content)
        let lines = this.spliteInline(content)

        let language = this.getLanguage(file.parent)//en.lproj => en

        let currentGroup = "";
        let filecontext = context.get(file.name)
        if(!filecontext){
            filecontext = new Map<any,Map<any,any>>();
            context.set(file.name,filecontext);
        }
        for(let line of lines){
            if(this.islineComment(line)){
                //do nothing for this lineComment if is not good
                if(!fconfig.gerateGroup){
                    return;
                }
                currentGroup = this.lineCommentToGroupName(line);
                let groupcontext = filecontext.get(currentGroup)
                    if(!groupcontext){
                        groupcontext = new Map<any,Map<any,any>>() 
                        filecontext.set(currentGroup,groupcontext)
                    }  
            }else{
                try{
                    let data = this.linetoKeyValue(line)
                    let groupcontext = filecontext.get(currentGroup)
                    let key = data["key"]
                    let value = data["value"]
                    let keycontext = groupcontext.get(key)
                    if(!keycontext){
                        keycontext = new Map<any,any>()
                        groupcontext.set(key,keycontext)
                    }
                    let langecontext = keycontext.get(language)
                    if(!langecontext){
                        langecontext = new Map<any,any>()
                        keycontext.set(language,langecontext)
                    }
                    langecontext.set(language,value)

                }catch{
                    console.log("❌❌❌❌ this line is not right "+line)
                }
            }
            
            
            
        }
        
    }

    convertToData(context:Map<any,any>){
        let datas:line[] = []
        for(let filename of context.keys()){
            let filemap = context.get(filename);

            for(let groupname of filemap.keys()){
                let group = filemap.get(groupname)
                for(let key of group.keys()){
                    let keymap = group.get(key)
                    let data:line = {
                        name:groupname,
                        ios_file:filename,
                        ios_key:key,
                        android_file:"strings.xml",
                        android_key:"",
                    }
                    for(let language of keymap.keys()){
                        let languagemap = keymap.get(language)
                        let standtardname = fconfig.iOS_language_map.get(language)
                        if(!standtardname){
                            standtardname = language
                        }
                        data[standtardname] = languagemap.get(language)
                    }
                    datas.push(data)
                }
            }
     
        }

        return datas;        
    }
    
    readToString(path:string):string{
       let data = fs.readFileSync(path);
       return data.toString()
    }

    delcomment(content:string):string{
        content = content.replace(/\/\*(\s|.)*?\*\//g,'')
        return content
    }

    spliteInline(content:string):string[]{
        let lines = content.split(/\n/g);
        let result:string[] = []
        for(let line of lines){
            if(line.length>2 && line!= '\n'){
                result.push(line)
            }
        }
        return result
    }
    
    islineComment(line:string){
        if(line.match(/\/\/[^\n]*/)){
            return true;
        }else{
            return false;
        }
    }

    lineCommentToGroupName(line:string){
        let matcharray = line.match(/(\/\/*)\s*?([^\s].*)/)
        if(matcharray.length>2){
            return matcharray[2]
        }else{
            return "";
        }
    }

    linetoKeyValue(line:string){
        line = line.replace(/%@/g,'#') //将%@切换为通用格式 #
        //let keymath = /(?<=")(.*)(?="\s?=)/
        let keymathreg = /(?<=")(.*)(?=("\s*?\=\s*?"))/  //取第一组就是
        let valuereg = /(?<=.)"(\s*?=\s*?")(.*)";/  //取第二组
        
        let key = line.match(keymathreg)[1]
        let value = line.match(valuereg)[2]

        return {
            key:key,
            value:value
        };
    }



}