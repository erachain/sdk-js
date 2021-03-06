import { PublicKeyAccount } from '../../account/PublicKeyAccount';
import { AppCrypt } from '../../../../crypt/AppCrypt';
import { Base58 } from '../../../../crypt/libs/Base58';
import { ItemCls } from '../ItemCls';
import { Bytes } from '../../Bytes';
import { BlockChain } from '../../BlockChain';
import { Transaction } from '../../transaction/Transaction';
import { DataWriter } from '../../DataWriter';
import Base64 from '../../util/base64';

export class Imprint extends ItemCls {
  ownerSignature: Int8Array;

  constructor(
    owner: PublicKeyAccount,
    name: string,
    icon: Int8Array,
    image: Int8Array,
    description: string,
  ) {
    super(new Int8Array([0, 0]), owner, name, icon, image, description);
  }

  /* tslint:disable-next-line */
  static async parse(rowData: string, includeReference: boolean = false): Promise<Imprint> {
    let data: Int8Array; 
    if (Base64.isBase64(rowData)) {
      data = Base64.decodeToByteArray(rowData);
    } else {
      data = await Base58.decode(rowData);
    }

    // READ TYPE
    const typeBytes = data.slice(0, ItemCls.TYPE_LENGTH);
    let position = ItemCls.TYPE_LENGTH;

    //READ CREATOR
    const ownerBytes = data.slice(position, position + ItemCls.OWNER_LENGTH);
    const owner = new PublicKeyAccount(ownerBytes);
    position += ItemCls.OWNER_LENGTH;

    //READ FULL NAME
    let fullNameLength = data[position];
    position++;

    if (fullNameLength < 0) {
      fullNameLength = 256 + fullNameLength;
    }

    if (fullNameLength < 1 || fullNameLength > ItemCls.MAX_NAME_LENGTH) {
      throw new Error(`Invalid full name length: ${fullNameLength}`);
    }

    const fullNameBytes = data.slice(position, position + fullNameLength);
    const fullName = await Bytes.stringFromByteArray(fullNameBytes);
    position += fullNameLength;

    //READ ICON
    const iconLengthBytes = data.slice(position, position + ItemCls.ICON_SIZE_LENGTH);
    const iconLength = await Bytes.intFromByteArray(new Int8Array([0, 0, iconLengthBytes[0], iconLengthBytes[1]]));
    position += ItemCls.ICON_SIZE_LENGTH;

    if (iconLength < 0 || iconLength > ItemCls.MAX_ICON_LENGTH) {
      throw new Error('Invalid icon length: ' + iconLength);
    }

    const icon = data.slice(position, position + iconLength);

    position += iconLength;

    //READ IMAGE
    const imageLengthBytes = data.slice(position, position + ItemCls.IMAGE_SIZE_LENGTH);
    const imageLength = await Bytes.intFromByteArray(imageLengthBytes);
    position += ItemCls.IMAGE_SIZE_LENGTH;

    //if (imageLength < 0 || imageLength > ItemCls.MAX_IMAGE_LENGTH) {
    if (imageLength < 0) {
      throw new Error('Invalid image length: ' + imageLength);
    }

    const image = data.slice(position, position + imageLength);
    position += imageLength;

    //READ DESCRIPTION
    const descriptionLengthBytes = data.slice(position, position + ItemCls.DESCRIPTION_SIZE_LENGTH);
    const descriptionLength = await Bytes.intFromByteArray(descriptionLengthBytes);
    position += ItemCls.DESCRIPTION_SIZE_LENGTH;

    if (descriptionLength < 0 || descriptionLength > BlockChain.MAX_REC_DATA_BYTES) {
      throw new Error(`Invalid description length: ${descriptionLength}`);
    }

    const descriptionBytes = data.slice(position, position + descriptionLength);
    const description = await Bytes.stringFromByteArray(descriptionBytes);
    position += descriptionLength;

    let reference: Int8Array | null = null;
    if (includeReference) {
      //READ REFERENCE
      reference = data.slice(position, position + ItemCls.REFERENCE_LENGTH);
      position += ItemCls.REFERENCE_LENGTH;
    }

    let ownerSignature = null;
    if (typeBytes[1] === 1) {
      // with signature
      //READ SIGNATURE
      ownerSignature = data.slice(position, position + Transaction.SIGNATURE_LENGTH);
      // position += Transaction.SIGNATURE_LENGTH;
    }

    //RETURN
    const imprint = new Imprint(owner, fullName, icon, image, description);

    imprint.typeBytes = typeBytes;

    if (includeReference && reference) {
      imprint.reference = reference;
    }

    if (ownerSignature) {
      imprint.ownerSignature = ownerSignature;
    }

    return imprint;
  }

  async sign(secretKey: Int8Array): Promise<void> {
    const data = await this.toBytes(false, true);
    const sign = AppCrypt.sign(data, secretKey);
    this.ownerSignature = new Int8Array(sign);
  }

  async toBytes(includeReference: boolean, onlyBody: boolean): Promise<Int8Array> {
    const data = new DataWriter();
    data.set(await super.toBytes(includeReference, onlyBody));
    if (!onlyBody && this.ownerSignature) {
      data.set(this.ownerSignature);
    }

    return data.data;
  }
}
