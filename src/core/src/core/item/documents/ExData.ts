import { KeyPair } from '../../account/KeyPair';
import { Bytes } from '../../Bytes';
import { DataWriter } from '../../DataWriter';
import { Documents } from './Documents';
import { Base58 } from '../../../../crypt/libs/Base58';
import { AppCrypt } from '../../../../crypt/AppCrypt';
import { encryptMessage, encrypt32, getPassword } from '../../../../crypt/libs/aesCrypt';
import { ExLink, IExLink } from './ExLink';

export class ExData {
  static RECIPIENTS_LENGTH_SIZE = 3;

  keys: KeyPair;
  shareKeys: KeyPair;
  private _password32: string | null;
  flags: Int8Array;
  title: string;
  exLink?: IExLink;
  recipientFlags: Int8Array;
  recipients: Int8Array[];
  secretFlags: Int8Array;
  secrets: Int8Array[];
  data: Documents;
  publics: Int8Array[];
  authors?: IExLink[];
  sources?: IExLink[];
  tags?: string[];

  constructor(keys: KeyPair, title: string, data: Documents, encrypted: boolean, exLink: IExLink | undefined, onlyRecipients: boolean | undefined = false) {
    this.keys = keys;
    this.flags = new Int8Array([0, encrypted ? 32 : (exLink ? -1 : 0), 0, 0]);
    this.title = title;
    this.data = data;
    this.recipientFlags = onlyRecipients ? new Int8Array([1]) : new Int8Array([0]);
    this.recipients = [];
    this.secretFlags = new Int8Array([0]);
    this.secrets = [];
    this.publics = [];
    this.shareKeys = new KeyPair();
    this.exLink = exLink;
  }

  async password32(): Promise<string> {
    if (!this._password32) {
      const pwd = await getPassword(this.shareKeys.publicKey, this.shareKeys.secretKey);
      this._password32 = await Base58.encode(new Int8Array(pwd));
    }

    return this._password32;
  } 

  async addRecipient(recipient: Int8Array | string): Promise<void> {
    const addressOrPublic = typeof recipient === 'string' ? await Base58.decode(recipient) : recipient;
    const length = addressOrPublic.length;
    if ((this.flags[1] & 32) === 32 && length !== 32) {
      throw new Error('Not public key');
    }
    if (length === 32) {
      this.publics.push(addressOrPublic);
      const address = await AppCrypt.getAddressByPublicKey(addressOrPublic);
      const short = await AppCrypt.shortAddress(address);
      this.recipients.push(short);
      const stringShare = await this.password32();
      const secret = await encryptMessage(stringShare, addressOrPublic, this.keys.secretKey);
      const l = new Int8Array([0]);
      l[0] = secret.length;
      this.secrets.push(new Int8Array([l[0], ...secret]));
      // console.log("secrets", this.secrets);
    } else {
      const short = await AppCrypt.shortAddress(addressOrPublic);
      this.recipients.push(short);
    }
    this.flags[1] = this.flags[1] | 64;
  }

  addAuthor(id: number, weight: number, desc: string): void {
    if (weight < 0 || weight > 1000) {
      throw new Error("The weight must be in the range from 0 to 1000");
    }
    const exLink = new ExLink(ExLink.TYPE_AUTHOR, id.toString(), 0, weight, 0, desc);
    if (!this.authors) {
      this.authors = [];
    }
    this.authors.push(exLink);
    this.flags[1] = this.flags[1] | 16;
  }

  addSource(seqNo: string, weight: number, desc: string): void {
    if (weight < 0 || weight > 1000) {
      throw new Error("The weight must be in the range from 0 to 1000");
    }
    const exLink = new ExLink(ExLink.TYPE_SOURCE, seqNo, 0, weight, 0, desc);
    if (!this.sources) {
      this.sources = [];
    }
    this.sources.push(exLink);
    this.flags[1] = this.flags[1] | 8;
  }

  addTags(tags: string[]): void {
    this.tags = tags;
    this.flags[1] = this.flags[1] | 4;
  }
  
  async selfShortAddress(): Promise<Int8Array> {
    const address = await AppCrypt.getAddressByPublicKey(this.keys.publicKey);
    return await AppCrypt.shortAddress(address);
  }

  async linkToBytes(link: number, dataWriter: DataWriter): Promise<void> {
    const bytes = await Bytes.longToByteArray(link);
    dataWriter.set(bytes);
  }

  async toBytes(): Promise<Int8Array> {
    const data = new DataWriter();

    data.set(this.flags);

    await this.stringToBytes(this.title, data, true);

    if (this.flags[1] < 0) {

      if (!this.exLink) {
        throw new Error("The 'exLink' parameter not found");
      }

      data.setNumber(this.exLink.type);
      data.setNumber(this.exLink.flags);
      data.setNumber(this.exLink.value_1);
      data.setNumber(this.exLink.value_2);

      await this.linkToBytes(this.exLink.link, data);
    }

    if ((this.flags[1] & 64) === 64) {
      data.set(this.recipientFlags);

      await this.recipientsLengthToBytes(data);
  
      this.recipients.forEach(bytes => data.set(bytes));
    }

    if (this.authors) {
      data.setNumber(0); // AUTHORS FLAGS
      await this.authorsLengthToBytes(data);
      this.authors.every(async (exLink) => {
        data.setNumber(exLink.type);
        data.setNumber(exLink.flags);
        const weight = await Bytes.intToByteArray2((exLink.value_1));
        data.set(weight);
        const memo = await Bytes.stringToByteArray(exLink.memo!);
        data.setNumber(memo.length);
        data.set(memo);
      });
    }

    if (this.sources) {
      data.setNumber(0); // SOURCES FLAGS
      await this.sourcesLengthToBytes(data);
      this.sources.every(async (exLink) => {
        data.setNumber(exLink.type);
        data.setNumber(exLink.flags);
        const weight = await Bytes.intToByteArray2((exLink.value_1));
        data.set(weight);
        const memo = await Bytes.stringToByteArray(exLink.memo!);
        data.setNumber(memo.length);
        data.set(memo);
      });
    }

    if (this.tags) {
      const tags = await Bytes.stringToByteArray(this.tags.join(","));
      data.setNumber(tags.length);
      data.set(tags);
    }

    if ((this.flags[1] & 32) === 32) {
      data.set(this.secretFlags);
      this.secrets.forEach(bytes => data.set(bytes));
      const l = new Int8Array([0]);
      l[0] = this.keys.publicKey.length;

      data.set(new Int8Array([l[0], ...this.keys.publicKey]));
    }    

    let bytesData = await this.data.toBytes();

    if ((this.flags[1] & 32) === 32) {
      const stringData = await Base58.encode(bytesData);
      const secret32 = await this.password32();
      bytesData = await encrypt32(stringData, secret32);
    }

    data.set(bytesData);

    return data.data;
  }

  async recipientsLengthToBytes(dataWriter: DataWriter): Promise<void> {
    const lengthBytes = await Bytes.intToByteArray3(this.recipients.length);
    dataWriter.set(lengthBytes);
  }

  async authorsLengthToBytes(dataWriter: DataWriter): Promise<void> {
    const lengthBytes = await Bytes.intToByteArray3(this.authors!.length);
    dataWriter.set(lengthBytes);
  }

  async sourcesLengthToBytes(dataWriter: DataWriter): Promise<void> {
    const lengthBytes = await Bytes.intToByteArray3(this.sources!.length);
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
