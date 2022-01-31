import { NodeBaseRequest } from './NodeBaseRequest';
import { IWalletHistoryRow } from './ApiRecordsRequest';

export class ApiRecordRequest extends NodeBaseRequest {
  constructor(protected baseUrl: string) {
    super();
  }

  record(signature: string): Promise<IWalletHistoryRow> {
    return this.fetchJSON(`record/${signature}`);
  }
}
