
//支持的语言，对应CSV文件的头部列名
export const languages = ['en', 'zhs', 'zh-hk', 'kr'];

//iOS 输出文件与xcode名称保持一致
export const iOS_language_map = new Map([
    ['en', 'en'],
    ['zhs', 'zh-Hans'],
    ['zh-hk', 'zh-HK'],
    ['kr', 'ko'],
    ['zh-hant','zh-Hant']
]);

//android 输出文件与 Android studio 名称保持一致
export const Android_language_map = new Map([
    ['en', 'values'],
    ['zhs', 'values-zh-rCN'],
    ['zh-hk', 'values-zh-rHK'],
    ['kr', 'values-ko-rKR'],
    ['zh-hant','values-zh-rHK'],
]);

//国际化文件
const input_base_path = './inputfiles';
export const input_file_path = input_base_path+'/source.xlsx';

//默认名称
export const default_ios_file = 'Localizable.strings';
export const default_android_file = 'strings.xml';

//输出文件地址
const out_folder = './publish';
export const out_ios_file_opts = function (filename?:string) {
    let ios_out_folder = './appfiles/publish/iOS';
    filename = filename.trim();
    if (!filename) {
        filename = default_ios_file; //默认值
    }
    let out_files:Map<string,string> = function () {
        let out = new Map();
        for (let lang of languages) {
            let ios_lang = iOS_language_map.get(lang);
            if (!ios_lang) {
                ios_lang = lang;
            }
            let file_path = `${ios_out_folder}/${ios_lang}.lproj/${filename}`;
            out.set(lang, file_path);
        }
        return out;
    }();
    return out_files;

};

export const out_android_file_opts = function (filename?:string) {
    let android_out_folder = './appfiles/publish/android';
    filename = filename.trim();
    if (!filename || filename.length == 0) {
        filename = default_android_file;
    }

    let out_files = function () {
        let out = new Map();
        for (let lang of languages) {
            let android_lang = Android_language_map.get(lang);
            if(!android_lang){
                android_lang = lang;
            }
            let file_path = `${android_out_folder}/${android_lang}/${filename}`;
            out.set(lang, file_path);
        }
        return out;
    }();
    return out_files;
};