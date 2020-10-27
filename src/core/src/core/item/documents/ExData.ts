import { KeyPair } from '../../account/KeyPair';
import { Bytes } from '../../Bytes';
import { DataWriter } from '../../DataWriter';
import { Documents } from './Documents';
import { Base58 } from '../../../../crypt/libs/Base58';
import { AppCrypt } from '../../../../crypt/AppCrypt';
import { encryptBytes, getPassword, passwordAES, bytesToWords } from '../../../../crypt/libs/aesCrypt';
import { ExLink, IExLink } from './ExLink';

export class ExData {
  static RECIPIENTS_LENGTH_SIZE = 3;

  keys: KeyPair;
  shareKeys: KeyPair;
  private _password32: Int8Array | null;
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
    this.flags = new Int8Array([3, encrypted ? 32 : (exLink ? -1 : 0), 0, 0]);
    this.title = title;
    this.data = data;
    this.recipientFlags = onlyRecipients ? new Int8Array([-128]) : new Int8Array([0]);
    this.recipients = [];
    this.secretFlags = new Int8Array([0]);
    this.secrets = [];
    this.publics = [];
    this.shareKeys = new KeyPair();
    this.exLink = exLink;
  }

  async password32(): Promise<Int8Array> {
    if (!this._password32) {
      this._password32 = new Int8Array(await getPassword(this.shareKeys.publicKey, this.shareKeys.secretKey));
    }

    return this._password32;
  } 

  async addRecipient(recipient: Int8Array | string): Promise<void> {
    const addressOrPublic = typeof recipient === 'string' ? await Base58.decode(recipient) : recipient;
    const length = addressOrPublic.length;
    if ((this.flags[1] & 32) === 32) {

      if (length !== 32) {
        throw new Error('Not public key');
      }

      this.publics.push(addressOrPublic);
      const address = await AppCrypt.getAddressByPublicKey(addressOrPublic);
      const short = await AppCrypt.shortAddress(address);
      this.recipients.push(short);
      const secret = await this.password32();
      const sharedKey = await passwordAES(addressOrPublic, this.keys.secretKey);

      const encryptedSecret = await encryptBytes(secret, sharedKey);

      const l = new Int8Array([0]);
      l[0] = encryptedSecret.length;
      this.secrets.push(new Int8Array([l[0], ...encryptedSecret]));
      
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
  
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.recipients.length; i += 1) {
        const recipient = this.recipients[i];
        data.set(recipient);
      }
    }

    if (this.authors) {
      data.setNumber(0); // AUTHORS FLAGS
      await this.authorsLengthToBytes(data);
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.authors.length; i += 1) {
        const exLink = this.authors[i];
        data.setNumber(exLink.type);
        data.setNumber(exLink.flags);
        const weight = await Bytes.intToByteArray2(exLink.value_1);
        data.set(weight);
        await this.linkToBytes(exLink.link, data);
        const memo = await Bytes.stringToByteArray(exLink.memo!);
        data.setNumber(memo.length);
        data.set(memo);
      }
    }

    if (this.sources) {
      data.setNumber(0); // SOURCES FLAGS
      await this.sourcesLengthToBytes(data);
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.sources.length; i += 1) {
        const exLink = this.sources[i];
        data.setNumber(exLink.type);
        data.setNumber(exLink.flags);
        const weight = await Bytes.intToByteArray2(exLink.value_1);
        data.set(weight);
        await this.linkToBytes(exLink.link, data);
        const memo = await Bytes.stringToByteArray(exLink.memo!);
        data.setNumber(memo.length);
        data.set(memo);
      }
    }

    if (this.tags) {
      const tags = await Bytes.stringToByteArray(this.tags.join(","));
      data.setNumber(tags.length);
      data.set(tags);
    }

    if ((this.flags[1] & 32) === 32) {
      data.set(this.secretFlags);

      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.secrets.length; i += 1) {
        const bytes = this.secrets[i];
        data.set(bytes);
      }
      const secret = await this.password32();
      const sharedKey = await passwordAES(this.keys.publicKey, this.keys.secretKey);
      const encryptedSecret = await encryptBytes(secret, sharedKey);

      const l = new Int8Array([0]);
      l[0] = encryptedSecret.length;
      data.set(new Int8Array([l[0], ...encryptedSecret]));
    }    

    let bytesData = await this.data.toBytes();

    if ((this.flags[1] & 32) === 32) {
      const secret = await this.password32();
      const sharedKey = bytesToWords(secret);
      bytesData = await encryptBytes(bytesData, sharedKey, false);
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
