import * as xlsx from 'xlsx';
import {Reader} from './Reader';
import { InputData } from '../app/Symbols';



export class ExcelRwter implements Reader{
    
    readFile(path:string):xlsx.WorkBook{
        let workbook = xlsx.readFile(path);
        return workbook;
    }

    readFileToJson(path:string):Map<string,InputData[]>{
        let workbook = this.readFile(path);
        let result  = new Map();
        for(let sheetname of workbook.SheetNames){
             let worksheet = workbook.Sheets[sheetname];
             let data = xlsx.utils.sheet_to_json(worksheet);
             result.set(sheetname,data);
         }

         return result;   
    }
    private testData = [
        {"name":"keith",'sex':'boy'},
        {"name":'rita','sex':'girl'}
    ];

    private testData2 = [
        {"name":"keith1",'sex':'boy'},
        {"name":'rita1','sex':'girl'}
    ];
    writeArrayToFile(path:string,data:Map<string,JSON[]>):boolean{
        let workbookNames = data.keys();
        let workbook_sheets:{[name:string]: xlsx.WorkSheet}={};
        let sheetnames = [];
        for(let key of workbookNames){
            let json = data.get(key);
            let ss = xlsx.utils.json_to_sheet(json);
            workbook_sheets[key]=ss;
            sheetnames.push(key);
        }

        let workbook:xlsx.WorkBook = {
            SheetNames:sheetnames,
            Sheets:workbook_sheets,
        }

        xlsx.writeFile(workbook,path);

        return true;
    }

    testWrite(){
        let data = new Map();
        data.set('d1',this.testData);
        data.set('d2',this.testData2);
        this.writeArrayToFile('./test.xlsx',data);
    }

}