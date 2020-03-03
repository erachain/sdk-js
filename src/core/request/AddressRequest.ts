import {NodeBaseRequest} from "./NodeBaseRequest";

export class AddressRequest extends NodeBaseRequest {
    async lastReference(address: string): Promise<number> {
        return this.fetch(`addresslastreference/${address}`)
            .then(r => parseFloat(r.data));
    }

    async addresspublickey(address: string): Promise<string> {
        return this.fetch(`addresspublickey/${address}`)
            .then(r => { 
                return r.data; 
            });
    }
}
