import { Issue_ItemRecord } from './Issue_ItemRecord';
import { Transaction } from './Transaction';
import { AssetCls } from '../item/assets/AssetCls';
import { PrivateKeyAccount } from '../account/PrivateKeyAccount';

export class IssueAsset extends Issue_ItemRecord {
  private static TYPE_ID = Transaction.ISSUE_ASSET_TRANSACTION;
  private static NAME_ID = 'Issue Asset';

  public constructor(
    creator: PrivateKeyAccount,
    asset: AssetCls,
    feePow: number,
    timestamp: number,
    reference: number,
    port: number,
    genesis_sign: Int8Array
  ) {
    super(
      new Int8Array([IssueAsset.TYPE_ID, 0, 0, 0]),
      IssueAsset.NAME_ID,
      creator,
      asset,
      feePow,
      timestamp,
      reference,
      port,
      genesis_sign
    );
  }
}
