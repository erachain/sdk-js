import { NodeBaseRequest } from './NodeBaseRequest';
import { IChatTransaction } from '../types/era/IChatTransaction';
import { IOrderTransaction } from '../types/era/IOrderTransaction';
import { IEraParams } from '../types/era/IEraParams';

export class ApiRecordsRequest extends NodeBaseRequest {
  constructor(protected baseUrl: string) {
    super();
  }

  getbyaddress(address: string, asset: number): Promise<IWalletHistoryRow[]> {
    return this.fetchJSON(`getbyaddress?address=${address}&asset=${asset}`);
  }

  getbyaddressfromtransactionlimit(
    address: string,
    asset: number,
    start: number,
    end: number,
    type: number,
  ): Promise<{ [id: string]: IWalletHistoryRow }> {
    return this.fetchJSON(
      `getbyaddressfromtransactionlimit?address=${address}&asset=${asset}&start=${start}&end=${end}&type=${type}&sort=des`,
    );
  }

  getfind(address: string, offset: number, limit: number): Promise<IChatTransaction[]> {
    return this.fetchJSON(`find?address=${address}&type=31&offset=${offset}&limit=${limit}`);
  }

  pollMessages(address: string, height: number): Promise<IChatTransaction[]> {
    return this.fetchJSON(`find?address=${address}&type=31&startblock=${height}`);
  }

  findOrders(address: string, height: number): Promise<IOrderTransaction[]> {
    return this.fetchJSON(`find?address=${address}&type=50&startblock=${height}&limit=20`);
  }

  findAll(address: string, height: number, offset: number, limit: number): Promise<IWalletHistoryRow[]> {
    return this.fetchJSON(`find?address=${address}&startblock=${height}&offset=${offset}&limit=${limit}`);
  }

  orderTransaction(seqNo: string): Promise<IOrderTransaction> {
    return this.fetchJSON(`getbynumber/${seqNo}`);
  }

  getTransaction(seqNo: string): Promise<IWalletHistoryRow> {
    return this.fetchJSON(`getbynumber/${seqNo}`);
  }

  find(args: IEraParams): Promise<IWalletHistoryRow[]> {
    let sep = '';
    let params = '';

    if (args.type) {
      params = `type=${args.type}`;
    }

    sep = params.length > 0 ? '&' : '';
    if (args.address) {
      params += `${sep}address=${args.address}`;
    }

    sep = params.length > 0 ? '&' : '';
    if (args.sender) {
      params += `${sep}sender=${args.sender}`;
    }

    sep = params.length > 0 ? '&' : '';
    if (args.recipient) {
      params += `${sep}recipient=${args.recipient}`;
    }

    sep = params.length > 0 ? '&' : '';
    if (args.offset && args.offset >= 0) {
      params += `${sep}offset=${args.offset}`;
    }

    sep = params.length > 0 ? '&' : '';
    if (args.limit && args.limit >= 0) {
      params += `${sep}limit=${args.limit}`;
    }

    sep = params.length > 0 ? '&' : '';
    if (args.desc) {
      params += `${sep}desc=${args.desc}`;
    }

    sep = params.length > 0 ? '?' : '';

    // console.log(`find?${sep}${params}`);

    return this.fetchJSON(`find${sep}${params}`);
  }
}

export interface IWalletHistoryRow {
  action_key: number;
  amount: string;
  asset: number;
  confirmations: number;
  creator: string;
  data: string;
  encrypted: boolean;
  fee: string;
  head: string;
  height: number;
  isText: boolean;
  property1: number;
  property2: number;
  recipient: string;
  record_type: string;
  reference: string;
  sequence: number;
  signature: string;
  size: number;
  sub_type_name: string;
  timestamp: number;
  type: number;
  type_name: string;
  version: number;
  publickey: string;
  message: string;
}
