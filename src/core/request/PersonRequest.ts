import {IEraPerson} from "../types/era/IEraPerson";
import {IEraPersonData} from "../types/era/IEraPersonData";
import {NodeBaseRequest} from "./NodeBaseRequest";

export class PersonRequest extends NodeBaseRequest {
    constructor(protected baseUrl: string) {
        super();
    }

    personsfilter(filter: string): Promise<IEraPerson[]> {
        filter = encodeURI(filter);
        return this.fetchJSON(`personsfilter/${filter}`).then(p => {
            p.forEach((item: IEraPerson, i: number) => {
                item.hairColor = p[i]["hairСolor"];
            });
            return p;
        });
    }

    persondata(key: number): Promise<IEraPersonData> {
        return this.fetchJSON(`persondata/${key}`);
    }

    person(key: number): Promise<IEraPerson> {
        return this.fetchJSON(`person/${key}`)
            .then(p => {
                p.hairColor = p["hairСolor"];
                return p;
            });
    }

    personbyaddress(address: string): Promise<IEraPerson> {
        return this.fetchJSON(`personbyaddress/${address}`)
            .then(p => {
                p.hairColor = p["hairСolor"];
                return p;
            });
    }

}
