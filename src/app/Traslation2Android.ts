import { BaseTranslation } from "./BaseTranslation";
import { AndroidData, APPSystem } from "./Symbols";
import { makeFilePath } from "./FilePathChecker";
import * as tfs from './FileWriter';

interface Translater {
    translater(from:string,index:number):string;
}

class Formate_line implements Translater{
    translater(value: string,index:number):string {
        if (!value) {
            return value;
        }

        let result;
        let matchArray = value.match(/#/g);

        if (!matchArray) {
            return value;
        }

        if (matchArray.length == 1) {
            result = value.replace(/#/g, '%s');
            return result;
        }

        let i = 0;
        result = value.replace(/#/g, (num) => {
            i++;
            return '%' + i + '$' + 's';
        });

        return result;
    }
}

class EscapeDoubleQuotation implements Translater {
    translater(value:string, index:number):string{
        if (!value) {
            return value;
        }

        let matchArray = value.match(/(?<!\\)"/g);
        if (!matchArray) {
            return value;
        }

        let result = value.replace(/(?<!\\)"/g, (num) => {
            return "\\\"";
        });
        return result;
    }
}

class EscapeSingleQuotation implements Translater {
    translater(value:string, index:number):string{
        if (!value) {
            return value;
        }

        let matchArray = value.match(/(?<!\\)'/g);
        if (!matchArray) {
            return value;
        }

        let result = value.replace(/(?<!\\)'/g, (num) => {
            return "\\'";
        });
        return result;
    }
}


export class Translation2Android extends BaseTranslation {

    private plugin:Translater[] = [];

    constructor(){
        super();
        this.plugin.push(...[new EscapeDoubleQuotation(),
            new EscapeSingleQuotation(),
            new Formate_line()]);
    }

    async transfer(data: Map<string, Map<string, AndroidData[]>>) {
        for (let file of data.keys()) {
            let filePaths = await makeFilePath(file, APPSystem.Android);
            let lang_data_map = data.get(file);
            for (let lang of filePaths.keys()) {
                let filepath = filePaths.get(lang);
                await this.writeAndroid(lang_data_map, lang, filepath);
            }
        }
    }


   private async  writeAndroid(data: Map<string, AndroidData[]>, lang: string, file_path: string) {
        let string = '';
        let contentValied = false;//判断内容是否有效，如果一直是空值，删除它
        for (let key of data.keys()) {
            let comment = `\n\t<!--${key}-->\n`;
            let group = data.get(key);
            string = string + comment;
            for (let record of group) {
                let line = this.android_obj2line(record, lang);
                if(line){
                    string = string + line;
                    contentValied = true;
                }
            }
        }

        if(contentValied){
            string = `<resources xmlns:tools="http://schemas.android.com/tools">\n
            ${ string} \n</resources>`;
            
            console.log('输出 Android 语言🌶:' + lang + '输出文件路径:' + file_path);
            await tfs.writeStringToFile(string,file_path);
        }

    }

    android_line_transfer(value:string):string{
        this.plugin.forEach((transfer,index)=>{
            value = transfer.translater(value,index);  
        });
        return value;
    }

    android_obj2line(record: AndroidData, lang: string) {
        let key = record.android_key;
        let value = record[lang];
        value = this.android_line_transfer(value);
        if(!value){
            return null
        }
        let line = `\t<string name="${key}">${value}</string>\n`;
        return line;
    }
}

