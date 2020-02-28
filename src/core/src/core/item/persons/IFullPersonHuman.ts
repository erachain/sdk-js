import {IPersonHuman} from "./IPersonHuman";

export interface IRegistrationData extends IPersonHuman {
    imageInfo: any;
    geoData: any;
    geoDetails: any;
    date: Date;
}
