import { NodeBaseRequest } from './NodeBaseRequest';

export class BroadcastRequest extends NodeBaseRequest {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  broadcast(transaction: string): Promise<IBroadcastResponse> {
    const lang = 'en';
    return this.fetchJSON(`broadcast/${transaction}?lang=${lang.toLowerCase()}`);
  }

  broadcast64(transaction: string): Promise<IBroadcastResponse> {
    const lang = 'en';
    return this.fetchJSON(`broadcast64/${transaction}?lang=${lang.toLowerCase()}`);
  }

  broadcastPost(raw: string): Promise<IBroadcastResponse> {
      const lang = 'en';
      return this
          .fetchJSON(`broadcast?lang=${lang.toLowerCase()}`, "POST", raw, {"content-type": "application/x-www-form-urlencoded"});
  }

  broadcastPost64(raw: string): Promise<IBroadcastResponse> {
      const lang = 'en';
      return this
          .fetchJSON(`broadcast64?lang=${lang.toLowerCase()}`, "POST", raw, {"content-type": "application/x-www-form-urlencoded"});
  }

  telegram(transaction: string): Promise<IBroadcastResponse> {
    return this.fetchJSON(`broadcasttelegram/${transaction}`);
  }

  telegramPost(raw: string): Promise<IBroadcastResponse> {
    return this.fetchJSON(`broadcasttelegram`, 'POST', raw, { 'content-type': 'application/x-www-form-urlencoded' });
  }
}

export interface IBroadcastResponse {
  status: 'ok';
}
