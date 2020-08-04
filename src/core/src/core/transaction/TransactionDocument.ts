import { Transaction } from './Transaction';
import { DataWriter } from '../DataWriter';
import { Bytes } from '../Bytes';
import { PrivateKeyAccount } from '../account/PrivateKeyAccount';

export class TransactionDocument extends Transaction {
  protected static BASE_LENGTH = Transaction.BASE_LENGTH;

  private exData: Int8Array;

  constructor(
    name: string,
    creator: PrivateKeyAccount,
    feePow: number,
    timestamp: number,
    reference: number,
    exData: Int8Array,
    port: number,
    genesis_sign: Int8Array,
  ) {
    super(
      new Int8Array([Transaction.DOCUMENT_TRANSACTION, 3, 0, exData.length > 0 ? -1 : 0]),
      name,
      creator,
      feePow,
      timestamp,
      reference,
      port,
      genesis_sign,
    );
    this.exData = exData ? exData : new Int8Array([]);
  }

  async toBytes(withSign: boolean, releaserReference: number | null): Promise<Int8Array> {
    const data = new DataWriter();
    data.set(await super.toBytes(withSign, releaserReference));

    await this.lengthToBytes(this.exData.length, data);
    if (this.exData.length > 0) {
      data.set(this.exData);
    }

    return data.data;
  }

  async lengthToBytes(length: number, dataWriter: DataWriter): Promise<void> {
    const bytes = await Bytes.intToByteArray(length);
    dataWriter.set(bytes);
  }

  async getDataLength(): Promise<number> {
    return TransactionDocument.BASE_LENGTH + Transaction.DATA_SIZE_LENGTH + this.exData.length;
  }

}
