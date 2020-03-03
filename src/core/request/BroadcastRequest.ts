import {ResponseError} from "./ResponseError";
import {NodeBaseRequest} from "./NodeBaseRequest";

export class BroadcastRequest extends NodeBaseRequest {

    constructor(baseUrl: string) {
        super(baseUrl);
    }

    broadcast(transaction: string): Promise<IBroadcastResponse> {
        return this.fetchJSON(`broadcast/${transaction}`);
    }

    broadcastPost(raw: string): Promise<IBroadcastResponse> {
        return this
            .fetchJSON(`broadcast`, "POST", raw, {"content-type": "application/x-www-form-urlencoded"});
    }

    telegram(transaction: string): Promise<IBroadcastResponse | ResponseError> {
        return this.fetchJSON(`broadcasttelegram/${transaction}`);
    }

    telegramPost(raw: string): Promise<IBroadcastResponse | ResponseError> {
        return this
            .fetchJSON(`broadcasttelegram`, "POST", raw, {"content-type": "application/x-www-form-urlencoded"});
    }
}

export interface IBroadcastResponse {
    status: "ok";
}
