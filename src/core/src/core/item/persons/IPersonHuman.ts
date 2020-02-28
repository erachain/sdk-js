import {IPerson} from "../../account/IPerson";

export interface IPersonHuman extends IPerson {
    image?: Int8Array;
    imagePath?: string;
}
