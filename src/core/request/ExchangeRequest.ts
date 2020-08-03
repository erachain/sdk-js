import { NodeBaseRequest } from './NodeBaseRequest';
import { IOrders, IPlayOrders } from '../types/era/IOrders';
import { ITrade } from '../types/era/ITrade';
import { IOrderComplete } from '../types/era/IOrderComplete';

export class ExchangeRequest extends NodeBaseRequest {
  static limit = 50;

  constructor(protected baseUrl: string) {
    super();
  }

  orders(baseKey: number, quoteKey: number): Promise<IOrders> {
    return this.fetchJSON(`ordersbook/${baseKey}/${quoteKey}?limit=${ExchangeRequest.limit}`);
  }

  lasttrade(baseKey: number, quoteKey: number): Promise<ITrade[]> {
    return this.fetchJSON(`tradesfrom/${baseKey}/${quoteKey}?limit=1`);
  }

  playOrders(baseKey: number, quoteKey: number): Promise<IPlayOrders> {
    return this.fetchJSON(`pair/${baseKey}/${quoteKey}`);
  }

  tradesAll(baseKey: number, quoteKey: number, orderID: string): Promise<ITrade[]> {
    let paramOrderID = '';
    if (orderID) {
      paramOrderID = `order=${orderID}&`;
    }
    return this.fetchJSON(`tradesfrom/${quoteKey}/${baseKey}?${paramOrderID}limit=${ExchangeRequest.limit}`);
  }

  order(signature: string): Promise<IOrderComplete> {
    return this.fetchJSON(`order/${signature}`);
  }
}
