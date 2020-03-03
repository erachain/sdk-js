import {BlockRequest} from "./BlockRequest";
import {BlocksRequest} from "./BlocksRequest";
import {PersonsRequest} from "./PersonsRequest";
import {AssetsRequest} from "./AssetsRequest";
import {PersonRequest} from "./PersonRequest";
import {BroadcastRequest} from "./BroadcastRequest";
import {ApiRecordRequest, ApiRecordsRequest} from "./ApiRecordsRequest";
import {AddressRequest} from "./AddressRequest";
import {AccountRequest} from "./AccountRequest";
import {TelegramRequest} from "./TelegramRequest";
import {ExchangeRequest} from "./ExchangeRequest";

export class FetchRequest {
    block: BlockRequest;
    blocks: BlocksRequest;
    persons: PersonsRequest;
    assets: AssetsRequest;
    person: PersonRequest;
    broadcast: BroadcastRequest;
    records: ApiRecordsRequest;
    record: ApiRecordRequest;
    address: AddressRequest;
    account: AccountRequest;
    telegram: TelegramRequest;
    exchange: ExchangeRequest;

    constructor(baseUrl: string) {
        this.block = new BlockRequest(baseUrl);
        this.blocks = new BlocksRequest(baseUrl);
        this.persons = new PersonsRequest(baseUrl);
        this.assets = new AssetsRequest(baseUrl);
        this.person = new PersonRequest(baseUrl);
        this.broadcast = new BroadcastRequest(baseUrl);
        this.records = new ApiRecordsRequest(baseUrl + "records");
        this.record = new ApiRecordRequest(baseUrl);
        this.address = new AddressRequest(baseUrl);
        this.account = new AccountRequest(baseUrl);
        this.telegram = new TelegramRequest(baseUrl + "telegrams");
        this.exchange = new ExchangeRequest(baseUrl + "exchange");
    }
}
