import { BaseTranslation } from "./BaseTranslation";
import { Translation2iOS } from "./Translation2iOS";
import { Translation2Android } from "./Traslation2Android";
import { APPSystem } from './Symbols';




export class TranslationFactory{

    constructor(){

    }

    translater(system:APPSystem):BaseTranslation{
        switch(system){
            case APPSystem.iOS:
                return  new Translation2iOS();
                break;

            case APPSystem.Android:
                return new Translation2Android();
                break;

            default:
                throw "no tranaltion for this system";
        }
    }
}