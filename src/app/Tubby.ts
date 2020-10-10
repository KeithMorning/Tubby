
import * as config from '../config';
import { dirExists, get_file_extern, Reader, ExcelRwter } from '../lib';
import { InputData, iOSData,AndroidData,APPSystem } from './Symbols';
import { BaseTranslation } from './BaseTranslation';
import { Translation2iOS } from './Translation2iOS';
import { TranslationFactory } from './TranslationFactory';


export class Tubby{
    private filePath:string;
    private fileType:string;
    private fileToJSONReader:Reader;

    constructor(FilePath:string){
        this.filePath = FilePath;
        this.fileType = get_file_extern(this.filePath);
        
    }

    private initReader():void{
        if(!this.fileType){
            throw("we can't know the fileType,do you have a file extern file name");
        }
        let fileytype = this.fileType.toLowerCase();
        switch(fileytype){
            case '.xlsx':
            case '.xls':
                this.fileToJSONReader = new ExcelRwter();
                break;

            case '.csv':
            default:
                console.log('we still not support other filetype');
                break;
        }
    }

    async transfer(){
        if(!this.fileToJSONReader){
            this.initReader();
        }
        //read the data need to transfer
        // <sheetname:sheet's data>
        let data = this.fileToJSONReader.readFileToJson(this.filePath);
        let [ios,android] =  this.spliteData(data);
        let factory = new TranslationFactory();
        let iOSTranslater = factory.translater(APPSystem.iOS);
        let AndroidTranslater = factory.translater(APPSystem.Android);
        await iOSTranslater.transfer(ios);
        await AndroidTranslater.transfer(android);

    }

    checkDumpleKey(){
        if(!this.fileToJSONReader){
            this.initReader();
        }
        let data = this.fileToJSONReader.readFileToJson(this.filePath);
        let ios_key_set = new Set();
        let android_key_set = new Set();
        for(let sheet of data.keys()){
            let sheet_data = data.get(sheet);
            for(let sheet_data_row of sheet_data){
                let ios_key = sheet_data_row.ios_key;
                let android_key = sheet_data_row.android_key;
                if(ios_key){

                    if(!ios_key_set.has(ios_key)){
                        ios_key_set.add(ios_key);
                    }else{
                        console.log('  iOS Key  '+ios_key + " is more than one 💄💄💄");
                        throw(" 💋💋💋 we find this key  has more than one ")
                    }
                }

                if(android_key){

                    if(!android_key_set.has(android_key)){
                        android_key_set.add(android_key);
                    }else{
                        console.log("🤖🤖 Android Key  "+android_key + " is more than one 💄💄💄");
                        throw(" 💋💋💋 we find this key  has more than one ")
                    }
                }
                    

            }
        }
    }

    //sheetname
    //--module
    //  --iosfile
    //    --ios
    //  --androidfile
    //    --android
    //查找 ios 国际化，先记录模块名称，再记录需要转换成的国际化文件名称，再查找
    //ios_key 是否存在，存在则进行翻译
    private spliteData(records:Map<string,InputData[]>){

        let iOS:Map<string,Map<string,iOSData[]>> = new Map();
        let Android:Map<string,Map<string,AndroidData[]>> = new Map();

        for(let r_key of records.keys()){
            //第一级为sheetname
            let data = records.get(r_key);
            for(let row of data){
                if(row.ios_key){ //need ios translater
                    let r_ios:iOSData = {};
                    r_ios.sheetname = r_key;
                    r_ios.name = row.name;
                    r_ios.ios_key = row.ios_key;
                    if(!r_ios.name){
                        r_ios.name = 'unkonw';
                    }
                    r_ios.ios_file = row.ios_file;
                    if(!r_ios.ios_file){
                        r_ios.ios_file = config.default_ios_file;//
                    }
                    //复制语言
                    for(let lange of config.languages){
                        r_ios[lange] = row[lange];
                    }
                    let modulename_value =  iOS.get(r_ios.ios_file);
                    if(!modulename_value){
                        modulename_value = new Map();
                        iOS.set(r_ios.ios_file,modulename_value);
                    }
                    let langesValues = modulename_value.get(r_ios.name);
                    if(!langesValues){
                        langesValues = [];
                        modulename_value.set(r_ios.name,langesValues);
                    }
                    langesValues.push(r_ios);
                }

                if(row.android_key){//need android translater
                    let r_android:AndroidData = {};
                    r_android.android_key = row.android_key;
                    r_android.sheetname = r_key;
                    r_android.name = row.name;
                    if(!r_android.name){
                        r_android.name = 'unkonw';
                    }
                    r_android.android_file = row.android_file;
                    if(!r_android.android_file){
                        r_android.android_file = config.default_android_file;//
                    }
                    //复制语言
                    for(let lange of config.languages){
                        r_android[lange] = row[lange];
                    }
                    let modulename_value =  Android.get(r_android.android_file);
                    if(!modulename_value){
                        modulename_value = new Map();
                        Android.set(r_android.android_file,modulename_value);
                    }
                    let langesValues = modulename_value.get(r_android.name);
                    if(!langesValues){
                        langesValues = [];
                        modulename_value.set(r_android.name,langesValues);
                    }
                    langesValues.push(r_android);
                }
            }
        } 

        return [iOS,Android]; 
    }
}