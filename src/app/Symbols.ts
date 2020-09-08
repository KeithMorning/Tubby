

export interface InputData extends JSON{
    readonly name:string;
    readonly ios_file:string;
    readonly ios_key:string;
    readonly android_file:string;
    readonly android_key:string;
}

export interface iOSData {
     sheetname?:string;
     name?:string;
     ios_file?:string;
     ios_key?:string;
}

export interface AndroidData {
    sheetname?:string;
     name?:string;
     android_file?:string;
     android_key?:string;
}

export enum APPSystem{
    iOS,
    Android,
}
