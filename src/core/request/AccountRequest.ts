import {NodeBaseRequest} from "./NodeBaseRequest";

export class AccountRequest extends NodeBaseRequest {
    getaccountsfromperson(key: number): Promise<IEraPersonAccounts> {
        return this.fetchJSON(`getaccountsfromperson/${key}`);
    }
}

export interface IEraPersonAccounts {
    [key: number]: string;
}
