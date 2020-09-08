
import { ExcelRwter } from "./lib/ExcelRwter";
import * as config from './config';
import { Tubby } from "./app/Tubby";

import {iOSFeed} from './feed/feed'

main();

async function main(){
    let app = new Tubby(config.input_file_path);
    app.checkDumpleKey();
    app.transfer();
}

// test()
// async function test(){
//     let fed = new iOSFeed();
//     fed.run("./inputfiles/iOSOrignal")
// }


