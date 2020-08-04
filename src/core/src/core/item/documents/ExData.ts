import { KeyPair } from '../../account/KeyPair';
import { Bytes } from '../../Bytes';
import { DataWriter } from '../../DataWriter';
import { Documents } from './Documents';
import { Base58 } from '../../../../crypt/libs/Base58';
import { AppCrypt } from '../../../../crypt/AppCrypt';
import { encryptMessage } from '../../../../crypt/libs/aesCrypt';

export class ExData {
  static RECIPIENTS_LENGTH_SIZE = 3;

  keys: KeyPair;
  shareKeys: KeyPair;
  flags: Int8Array;
  title: string;
  recipientFlags: Int8Array;
  recipients: Int8Array[];
  secretFlags: Int8Array;
  secrets: Int8Array[];
  data: Documents;
  publics: Int8Array[];

  constructor(keys: KeyPair, title: string, data: Documents, encrypted: boolean) {
    this.keys = keys;
    this.flags = new Int8Array([0, encrypted ? 32 : 0, 0, 0]);
    this.title = title;
    this.data = data;
    this.recipientFlags = new Int8Array([0]);
    this.recipients = [];
    this.secretFlags = new Int8Array([0]);
    this.secrets = [];
    this.publics = [];
    this.shareKeys = new KeyPair();
  }

  async addRecipient(recipient: Int8Array | string): Promise<void> {
    const addressOrPublic = typeof recipient === 'string' ? await Base58.decode(recipient) : recipient;
    const length = addressOrPublic.length;
    if (this.secretFlags[0] > 0 && length !== 32) {
      throw new Error('Not public key');
    }
    if (length === 32) {
      this.publics.push(addressOrPublic);
      const address = await AppCrypt.getAddressByPublicKey(addressOrPublic);
      const arr_address = await Base58.decode(address);
      this.recipients.push(arr_address.slice(1, 21));
      const stringShare = await Base58.encode(this.shareKeys.secretKey);
      const secret = await encryptMessage(stringShare, addressOrPublic, this.keys.secretKey);
      const l = new Int8Array([0]);
      l[0] = secret.length;
      this.secrets.push(new Int8Array([l[0], ...secret]));
    } else {
      this.recipients.push(addressOrPublic.slice(1, 21));
    }
    this.flags[1] = this.flags[1] | 64;
  }

  async toBytes(): Promise<Int8Array> {
    const data = new DataWriter();

    data.set(this.flags);

    await this.stringToBytes(this.title, data, true);

    if ((this.flags[1] & 64) === 64) {
      data.set(this.recipientFlags);

      await this.recipientsLengthToBytes(data);
  
      this.recipients.forEach(bytes => data.set(bytes));
    }

    if ((this.flags[1] & 32) === 32) {
      data.set(this.secretFlags);
      this.secrets.forEach(bytes => data.set(bytes));
    }    

    const bytesData = await this.data.toBytes();

    //if ((this.flags[1] & 32) === 32) {
    //  const stringData = await Base58.encode(bytesData);
    //  bytesData = await encryptMessage(stringData, this.keys.publicKey, this.shareKeys.secretKey);
    //}

    data.set(bytesData);

    return data.data;
  }

  async recipientsLengthToBytes(dataWriter: DataWriter): Promise<void> {
    const lengthBytes = await Bytes.intToByteArray3(this.recipients.length);
    console.log("stringToBytes", {
      recipientsLength: lengthBytes,
    });
    dataWriter.set(lengthBytes);
  }

  async stringToBytes(str: string, dataWriter: DataWriter, preLength: boolean): Promise<void> {
    const bytes = await Bytes.stringToByteArray(str);
    if (preLength) {
      const lengthBytes = new Int8Array([0]);
      lengthBytes[0] = bytes.length;
      dataWriter.set(lengthBytes);
    }
    dataWriter.set(bytes);
  }

}
