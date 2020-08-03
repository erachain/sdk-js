import { NodeBaseRequest } from './NodeBaseRequest';
import { IChatTransaction } from '../types/era/IChatTransaction';

export class TelegramRequest extends NodeBaseRequest {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  getfind(address: string, timestamp: number): Promise<ITelegramTransaction[]> {
    return this.fetchJSON(`get?address=${address}&timestamp=${timestamp}&outcomes=true`);
  }

  pollMessages(address: string, timestamp: number): Promise<ITelegramTransaction[]> {
    return this.fetchJSON(`get?address=${address}&timestamp=${timestamp}&outcomes=true`);
  }
}

export interface ITelegramTransaction {
  transaction: IChatTransaction;
}

export interface IBroadcastResponse {
  status: 'ok';
}
