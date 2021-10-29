import { TransactionAmount } from './TransactionAmount';
import { Account } from '../account/Account';
import { Transaction } from './Transaction';
import { Bytes } from '../Bytes';
import { DataWriter } from '../DataWriter';
import { BigDecimal } from '../../BigDecimal';
import { PrivateKeyAccount } from '../account/PrivateKeyAccount';
import { ETransferType } from './TranTypes';

interface ITransferFields {
  typeBytes: Int8Array;
  assetKey: number;
  amount: BigDecimal | null;
}

/* tslint:disable-next-line */
export class R_Send extends TransactionAmount {
  protected static BASE_LENGTH =
    Transaction.IS_TEXT_LENGTH + Transaction.ENCRYPTED_LENGTH + Transaction.DATA_SIZE_LENGTH;
  private static TYPE_ID: number = Transaction.SEND_ASSET_TRANSACTION;
  private static NAME_ID = 'Send';
  private head: string;
  private data: Int8Array;
  private encrypted: Int8Array;
  private isText: Int8Array;

  static transferTypeFields(
    transferType: ETransferType,
    assetKey: number,
    amount: BigDecimal | null,
  ): ITransferFields {
    const transferFields = {
      typeBytes: new Int8Array([
        R_Send.TYPE_ID,
        2,
        0,
        amount ? Transaction.diffScale(amount.num) : 0,
      ]),
      assetKey,
      amount
    };

    if (transferType === ETransferType.DEBT) {
      // выдать в долг
      transferFields.assetKey = -1 * transferFields.assetKey;
    } else if (transferType === ETransferType.RETURN_DEBT) {
      // вернуть долг
      transferFields.assetKey = -1 * transferFields.assetKey;
      // BACKWARD
      // transferFields.typeBytes[2] = transferFields.typeBytes[2] | 2 | 64;
    } else if (transferType === ETransferType.CONFISCATE_DEBT) {
      // конфисковать долг
      transferFields.assetKey = -1 * transferFields.assetKey;
      // BACKWARD
      transferFields.typeBytes[2] = transferFields.typeBytes[2] | 64;
    } else if (
      (transferType === ETransferType.TAKE) &&
      transferFields.amount
    ) {
      // принять на руки
      transferFields.amount = new BigDecimal(-1 * transferFields.amount.num);
      // BACKWARD
      transferFields.typeBytes[2] = transferFields.typeBytes[2] | 64;
    } else if (
      (transferType === ETransferType.SPEND) &&
      transferFields.amount
    ) {
      // потратить
      transferFields.amount = new BigDecimal(-1 * transferFields.amount.num);
      transferFields.assetKey = -1 * transferFields.assetKey;
    } else if (transferType === ETransferType.PLEDGE && transferFields.amount) {
      // передать в залог
      // BACKWARD
      transferFields.typeBytes[2] = transferFields.typeBytes[2] | 64;
    } else if (transferType === ETransferType.RETURN_PLEDGE && transferFields.amount) {
      // вернуть с залога
      transferFields.amount = new BigDecimal(-1 * transferFields.amount.num);
    }

    return transferFields;
  }

  constructor(
    creator: PrivateKeyAccount,
    feePow: number,
    recipient: Account,
    key: number,
    amount: BigDecimal | null,
    head: string | null,
    data: Int8Array | null,
    isText: Int8Array,
    encrypted: Int8Array,
    timestamp: number,
    reference: number,
    port: number,
    genesis_sign: Int8Array,
    transferType: ETransferType = ETransferType.DEFAULT,
  ) {
    const transferFields = R_Send.transferTypeFields(transferType, key, amount);
    super(transferFields.typeBytes, R_Send.NAME_ID, creator, feePow, recipient, transferFields.amount, transferFields.assetKey, timestamp, reference, port, genesis_sign);

    this.head = head || '';

    if (data == null || data.length === 0) {
      // set version byte
      this.typeBytes[3] = this.typeBytes[3] | -128;
    } else {
      this.data = data;
      this.encrypted = encrypted;
      this.isText = isText;
    }
  }

  async getDataLength(asPack: boolean): Promise<number> {
    const headBytes = await Bytes.stringToByteArray(this.head);
    const dataLen = (await super.getDataLength(asPack)) + 1 + headBytes.length;

    if (this.typeBytes[3] >= 0) {
      return dataLen + R_Send.BASE_LENGTH + this.data.length;
    } else {
      return dataLen;
    }
  }

  getFee(): number {
    return this.feePow;
  }

  getFeeBig(): BigDecimal {
    return this.fee;
  }

  async toBytes(withSign: boolean, releaserReference: number | null): Promise<Int8Array> {
    const data = new DataWriter();
    data.set(await super.toBytes(withSign, releaserReference));

    // WRITE HEAD
    const headBytes = await Bytes.stringToByteArray(this.head);
    //HEAD SIZE
    data.setNumber(headBytes.length);
    //HEAD
    data.set(headBytes);

    if (this.data != null) {
      //WRITE DATA SIZE
      const dataSizeBytes = await Bytes.intToByteArray(this.data.length);
      data.set(dataSizeBytes);

      //WRITE DATA
      data.set(this.data);

      //WRITE ENCRYPTED
      data.set(this.encrypted);

      //WRITE ISTEXT
      data.set(this.isText);
    }

    return data.data;
  }
}
