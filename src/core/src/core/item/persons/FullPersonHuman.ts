import {IRegistrationData} from "./IFullPersonHuman";
import {base64ToArray} from "../../util/resizeImage";
import {KeyPair} from "../../account/KeyPair";
import {PublicKeyAccount} from "../../account/PublicKeyAccount";
import {PersonHuman} from "./PersonHuman";
import {Base58} from "../../../../crypt/libs/Base58";
import {Bytes} from "../../Bytes";

export class FullPersonHuman implements IRegistrationData {
    imageInfo: any; //image base64
    geoData: Object;
    geoDetails: any;
    date: Date;
    creator: string;
    name: string;
    image: Int8Array;

    description: string;
    birthday: number;
    deathday: number;
    gender: number;
    race: string;
    birthLatitude: number;
    birthLongitude: number;
    skinColor: string;
    eyeColor: string;
    hairColor: string;
    height: number = 150;
    /* tslint:disable-next-line */
    item_type: string;
    type1: number;
    type0: number;
    reference: string;
    /* tslint:disable-next-line */
    item_type_sub: string;
    isConfirmed: boolean;
    key: number;
    timestamp: number;

    async validate(): Promise<string[]> {
        let error = await this.validateName();
        return ([] as string[]).concat(
            error,
            this.validateImage(),
            this.validateDescription(),
            this.validateDate(),
            this.validateGeo()
        );
    }

    async getShareData(keyPair: KeyPair): Promise<string> {
        const image = this.getImage();
        const keys = keyPair;
        let dt = this.date;
        if (typeof this.date === 'string') {
            dt = new Date(this.date);
        }
        
        let tzOffset = dt.getTimezoneOffset() * 60000;
       
        //приведение даты рождения и смерти к времени UTC + 0
        //const proxyDate = Date.UTC(this.date.getFullYear(), this.date.getUTCMonth(), this.date.getUTCDay(), 0, 0, 0, 0);
        const person = new PersonHuman(
            new PublicKeyAccount(keys.publicKey),
            this.name || "",
            ( (dt.valueOf() - tzOffset) || 0),
            ( (dt.valueOf() - tzOffset) || 0) - 1,
            this.gender,
            this.race || "",
            this.geoDetails.geometry.location.lat || 0,
            this.geoDetails.geometry.location.lng || 0,
            this.skinColor || "",
            this.eyeColor || "",
            this.hairColor || "",
            this.height || 0,
            new Int8Array(0),
            image,
            this.description
        );
        await person.sign(keys.secretKey);
        const bytes = await person.toBytes(false, false);
        const encode = await Base58.encode(new Int8Array(bytes));

        return encode;
    }

    private validateImage(): string[] {
        if (!this.imageInfo) {
            return ["Image is empty"];
        }

        return [];
    }

    private async validateName(): Promise<string[]> {
        const bytes = await Bytes.stringToByteArray(this.name);
        if (bytes.length > 250) {
            return ["Length of name larger 250"];
        }
        return [];
    }

    private validateDescription(): string[] {
        if (!this.description) {
            return ["Description is empty"];
        }

        return [];
    }

    private validateDate(): string[] {
        if (!this.date) {
            return ["Date is empty"];
        }

        return [];
    }

    private validateGeo(): string[] {
        if (!this.geoData || !this.geoDetails) {
            return ["Geo not valid"];
        }

        return [];
    }

    private getImage(): Int8Array {
        return base64ToArray(this.imageInfo);
    }

}
