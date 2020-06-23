import { IEraBlock, IEraFirstBlock } from "../types/era/IEraBlock";
import { IEraInfo } from "../types/era/IEraInfo";

import {NodeBaseRequest} from "./NodeBaseRequest";

export class BlockRequest extends NodeBaseRequest {
    constructor(baseUrl: string) {
        super(baseUrl);
    }

    async height(): Promise<any> {
        return await this.fetch("height");
    }

    async firstBlock(): Promise<IEraFirstBlock> {
        return await this.fetchJSON("blockssignaturesfromheight/1/1");
    }

    async lastBlock(): Promise<IEraBlock> {
        return await this.fetchJSON("lastblock");
    }

    async blockBySignature(signature: string): Promise<IEraBlock> {
        return await this.fetchJSON(`block/${signature}`);
    }

    async blockByHeight(height: number): Promise<IEraBlock> {
        return await this.fetchJSON(`blockbyheight/${height}`);
    }

    async childBlockSignature(signature: string): Promise<IEraBlock> {
        return await this.fetchJSON(`childblocksignature/${signature}`);
    }

    async childBlock(signature: string): Promise<IEraBlock> {
        return await this.fetchJSON(`childblock/${signature}`);
    }

    async info(): Promise<IEraInfo> {
        return this.fetchJSON("info");
    }
}
