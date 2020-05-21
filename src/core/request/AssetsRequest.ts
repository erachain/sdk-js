import {IEraAsset} from "../types/era/IEraAsset";
import {IEraAssetsList} from "../types/era/IEraAssetsList";
import {IEraBalance} from "../types/era/IEraBalanse";
import {IEraAssetData} from "../types/era/IEraAssetData";
import {NodeBaseRequest} from "./NodeBaseRequest";

export class AssetsRequest extends NodeBaseRequest {
    constructor(protected baseUrl: string) {
        super();
    }

    assets(): Promise<IEraAssetsList> {
        return this.fetchJSON(`assets/`);
    }

    asset(assetId: string): Promise<IEraAsset> {
        return this.fetchJSON(`asset/${assetId}`);
    }

    addressassets(address: string): Promise<IEraBalance> {
        return this.fetchJSON(`addressassets/${address}`);
    }

    assetBalance(address: string, assetKey: number): Promise<number[][]> {
        return this.fetchJSON(`addressassetbalance/${address}/${assetKey}`);
    }

    assetsfilter(filter: string): Promise<IEraAsset[]> {
        filter = encodeURI(filter);
        return this.fetchJSON(`assetsfilter/${filter}`);
    }

    data(key: number): Promise<IEraAssetData> {
        return this.fetchJSON(`assetdata/${key}`);
    }

    assetimage(key: number): Promise<string | null> {
        return this.fetch(`assetimage/${key}`);
    }

    asseticon(key: number): Promise<string | null> {
        return this.fetch(`asseticon/${key}`);
    }
}
