import { EraTransactionsTypes } from './EraTransactionsTypes';
import { EraTransactionIssuePersonItem } from './EraTransactionIssuePersonItem';

export interface IEraTransaction {
  type: EraTransactionsTypes;
  item: EraTransactionIssuePersonItem;
  sertified_public_keys: string[];
}
