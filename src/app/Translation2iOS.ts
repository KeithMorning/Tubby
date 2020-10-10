import { BaseTranslation } from "./BaseTranslation";
import { iOSData, AndroidData, APPSystem } from './Symbols';
import * as fs from 'fs';
import * as config from '../config';
import { makeFilePath } from "./FilePathChecker";
import { get_current_day, get_current_year } from "./DateExtener";
import * as tfs from './FileWriter'


export class Translation2iOS extends BaseTranslation {

    async transfer(data: Map<string, Map<string, iOSData[]>>) {
        for (let file of data.keys()) {
            let filePaths = await makeFilePath(file, APPSystem.iOS);
            let lang_data_map = data.get(file);
            for (let lang of filePaths.keys()) {
                let filepath = filePaths.get(lang);
                await this.writeiOS(lang_data_map,lang,file,filepath);
            }
        }
    }

    private ios_obj2line(record: iOSData, lang: string): string {
        let string = '';
        let key = record.ios_key;
        let value = record[lang];
        let format_value = this.translate_language(value);
        if(!format_value){
            return null
        }
        string = "\"" + key + "\"" + ' = ' + "\"" + format_value + "\"" + ';' + '\n';
        return string;
    }

    private translate_language(value:string):string{

        let result = this.ios_escape_line(value);
        result = this.ios_formate_line(value);
        return result;
    }

    // iOS 需要将 " 转义为 \"
    private ios_escape_line(value:string):string{
        if(!value){
            return value;
        }

        let matchArray = value.match(/(?<!\\)"/g);
        if(!matchArray){
            return value;
        }

        let result = value.replace(/(?<!\\)"/g,(num)=>{
            return "\\\"";
        });

        return result;
        
    }

    private ios_formate_line(value:string):string{
        if(!value){
            return value;
        }
        
        let matchArray = value.match(/#/g);

        if(!matchArray){
            return value;
        }

        let result = value.replace(/#/g,(num)=>{
            return '%@';
        });

        return result;
    }

    private async writeiOS(data: Map<string, iOSData[]>, lang: string, file: string, file_path: string) {
        let contentVaild = false
        let string = `/*
        ${file}
        Arm
  
        Created by translater on ${ get_current_day()}.
        Copyright © ${ get_current_year()}年 iTalkBB. All rights reserved.
        */`;
        for (let key of data.keys()) {
            let comment = '\n' + '//' + key + '\n';
            let group = data.get(key);
            string = string + comment;
            for (let record of group) {

                let line = this.ios_obj2line(record, lang);
                if(line){
                    string = string + line;
                    contentVaild = true;
                }
            }
        }

        if(contentVaild){
            console.log('输出 iOS 语言🌶:' + lang + '输出文件路径:' + file_path);
            await tfs.writeStringToFile(string,file_path)
        }
    }
}