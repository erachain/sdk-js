import { Transaction } from './Transaction';
import { ItemCls } from '../item/ItemCls';
import { PrivateKeyAccount } from '../account/PrivateKeyAccount';
import { DataWriter } from '../DataWriter';

export class TransactionImprint extends Transaction {
  private item: ItemCls;

  public constructor(
    creator: PrivateKeyAccount,
    item: ItemCls,
    feePow: number,
    timestamp: number,
    port: number,
    genesis_sign: Int8Array,
  ) {
    super(new Int8Array([22, 0, 0, 0]), "Imprint", creator, feePow, timestamp, null, port, genesis_sign);
    this.item = item;
  }

  async getDataLength(asPack: boolean): Promise<number> {
    // not include item reference
    //console.log({ base: Transaction.BASE_LENGTH, pack: Transaction.BASE_LENGTH_AS_PACK, length: await this.item.getDataLength(false) });
    if (asPack) {
      return Transaction.BASE_LENGTH_AS_PACK + (await this.item.getDataLength(false));
    } else {
      return Transaction.BASE_LENGTH + (await this.item.getDataLength(false));
    }
  }

  public async toBytes(withSign: boolean, releaserReference: number | null): Promise<Int8Array> {
    // console.log("TransactionImprint.toBytes", { withSign, releaserReference });
    const dataWriter = new DataWriter();

    dataWriter.set(await super.toBytes(withSign, releaserReference));
    
    dataWriter.set(await this.item.toBytes(false, false));
    // console.log("TransactionImprint.toBytes", dataWriter.data);

    return dataWriter.data;
  }
}
