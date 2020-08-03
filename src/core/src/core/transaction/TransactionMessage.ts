import { Transaction } from './Transaction';
import { Account } from '../account/Account';
import { DataWriter } from '../DataWriter';
import { Base58 } from '../../../crypt/libs/Base58';
import { Bytes } from '../Bytes';

import { PrivateKeyAccount } from '../account/PrivateKeyAccount';

export class TransactionMessage extends Transaction {
  protected static RECIPIENT_LENGTH = Account.ADDRESS_LENGTH;

  protected static BASE_LENGTH = Transaction.BASE_LENGTH + TransactionMessage.RECIPIENT_LENGTH;
  protected static HEAD_LENGTH = 1;
  protected static MESSAGE_LENGTH = 4;

  private recipient: Account;
  private head: string;
  private message: Int8Array;
  private encrypted: Int8Array;
  private isText: Int8Array;

  constructor(
    typeBytes: Int8Array,
    name: string,
    creator: PrivateKeyAccount,
    feePow: number,
    recipient: Account,
    timestamp: number,
    reference: number,
    head: string,
    message: Int8Array,
    encrypted: Int8Array,
    isText: Int8Array,
    port: number,
    genesis_sign: Int8Array,
  ) {
    super(typeBytes, name, creator, feePow, timestamp, reference, port, genesis_sign);
    this.typeBytes[2] = typeBytes[2] | -128;

    this.recipient = recipient;
    this.head = head;
    this.message = message;
    this.encrypted = encrypted;
    this.isText = isText;
  }

  async toBytes(withSign: boolean, releaserReference: number | null): Promise<Int8Array> {
    const data = new DataWriter();
    data.set(await super.toBytes(withSign, releaserReference));

    //WRITE RECIPIENT
    data.set(await Base58.decode(this.recipient.getAddress()));

    await this.headToBytes(data);

    await this.messageToBytes(data);

    //WRITE ENCRYPTED
    data.set(this.encrypted);

    //WRITE ISTEXT
    data.set(this.isText);

    return data.data;
  }

  async messageToBytes(dataWriter: DataWriter): Promise<void> {
    const bytes = this.message;
    const messageBytes = await Bytes.intToByteArray(bytes.length);
    dataWriter.set(messageBytes);
    dataWriter.set(bytes);
  }

  async headToBytes(dataWriter: DataWriter): Promise<void> {
    const bytes = await Bytes.stringToByteArray(this.head);
    dataWriter.setNumber(bytes.length);
    dataWriter.set(bytes);
  }

  async getDataLength(includeReference: boolean): Promise<number> {
    return (
      TransactionMessage.BASE_LENGTH +
      TransactionMessage.HEAD_LENGTH +
      (await Bytes.stringToByteArray(this.head)).length +
      TransactionMessage.MESSAGE_LENGTH +
      this.message.length +
      Transaction.ENCRYPTED_LENGTH +
      Transaction.IS_TEXT_LENGTH
    );
  }
}
