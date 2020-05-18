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
                const key = "hairСolor";
                item.hairColor = p[i][key];
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
                // const key = "hairСolor";
                // p.hairColor = p[key];
                return p;
            });
    }

    personbyaddress(address: string): Promise<IEraPerson> {
        return this.fetchJSON(`personbyaddress/${address}`)
            .then(p => {
                const key = "hairСolor";
                p.hairColor = p[key];
                return p;
            });
    }

}
