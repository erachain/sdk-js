import { Transaction } from './Transaction';
import { DataWriter } from '../DataWriter';
import { BigDecimal } from '../../BigDecimal';
import { PrivateKeyAccount } from '../account/PrivateKeyAccount';
import { Base58 } from '../../../crypt/libs/Base58';

export class TransactionUpdateOrder extends Transaction {
  protected static BASE_LENGTH = Transaction.BASE_LENGTH;
  static KEY_LENGTH = Transaction.KEY_LENGTH;

  private signatureOrder: string;
  private wantAmount: number;

  constructor(
    name: string,
    creator: PrivateKeyAccount,
    feePow: number,
    timestamp: number,
    reference: number,
    signatureOrder: string,
    wantAmount: number,
    port: number,
    genesis_sign: Int8Array,
  ) {
    super(
      new Int8Array([
        Transaction.UPDATE_ORDER_TRANSACTION,
        0,
        0,
        Transaction.diffScale(wantAmount),
      ]),
      name,
      creator,
      feePow,
      timestamp,
      reference,
      port,
      genesis_sign,
    );
    this.signatureOrder = signatureOrder;
    this.wantAmount = wantAmount;
  }

  async toBytes(withSign: boolean, releaserReference: number | null): Promise<Int8Array> {
    const data = new DataWriter();
    data.set(await super.toBytes(withSign, releaserReference));
    await this.signToBytes(data);
    await this.amountToBytes(new BigDecimal(this.wantAmount), data);

    return data.data;
  }

  async signToBytes(dataWriter: DataWriter): Promise<void> {
    const bytes = await Base58.decode(this.signatureOrder);
    dataWriter.set(bytes);
  }

  async getDataLength(_includeReference: boolean): Promise<number> {
    return (
      TransactionUpdateOrder.BASE_LENGTH +
      Transaction.SIGNATURE_LENGTH +
      TransactionUpdateOrder.AMOUNT_LENGTH
    );
  }
}
