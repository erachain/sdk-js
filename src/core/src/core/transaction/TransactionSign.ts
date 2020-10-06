import { Transaction } from './Transaction';
import { DataWriter } from '../DataWriter';
import { Bytes } from '../Bytes';
import { PrivateKeyAccount } from '../account/PrivateKeyAccount';

export class TransactionSign extends Transaction {
  protected static TYPE = 40;
  protected static BASE_LENGTH = Transaction.BASE_LENGTH;
  protected static BLOCK_HEIGHT_LENGTH = 4;
  protected static NUM_IN_BLOCK_LENGTH = 4;

  private seq: number;
  private no: number;

  constructor(
    creator: PrivateKeyAccount,
    feePow: number,
    timestamp: number,
    reference: number,
    seqNo: string,
    port: number,
    genesis_sign: Int8Array,
  ) {
    super(
      new Int8Array([TransactionSign.TYPE, 0, 0, 0]),
      "",
      creator,
      feePow,
      timestamp,
      reference,
      port,
      genesis_sign,
    );
    const s = seqNo.split('-');
    if (s.length === 2 && !isNaN(Number(s[0])) && !isNaN(Number(s[1]))) {
      this.seq = Number(s[0]);
      this.no = Number(s[1]);
    } else {
        throw new Error('Error format SeqNo');
    }
  }

  async toBytes(withSign: boolean, releaserReference: number | null): Promise<Int8Array> {
    const data = new DataWriter();
    data.set(await super.toBytes(withSign, releaserReference));

    data.set(await Bytes.intToByteArray(this.seq));
    
    data.set(await Bytes.intToByteArray(this.no));

    return data.data;
  }

  async getDataLength(): Promise<number> {
    return TransactionSign.BASE_LENGTH + TransactionSign.BLOCK_HEIGHT_LENGTH + TransactionSign.NUM_IN_BLOCK_LENGTH;
  }

}
