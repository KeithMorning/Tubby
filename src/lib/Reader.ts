import { InputData } from "../app/Symbols";

export interface Reader{
    readFile(path:string):any;
    readFileToJson(path:string):Map<string,InputData[]>;
}