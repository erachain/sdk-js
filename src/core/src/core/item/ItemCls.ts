import { PublicKeyAccount } from '../account/PublicKeyAccount';
// import * as base58 from "bs58";
import { Transaction } from '../transaction/Transaction';
import { Bytes } from '../Bytes';
import { DataWriter } from '../DataWriter';
import {AppData} from './AppData';

const regexURL = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/i;

export class ItemCls {
  static MAX_ICON_LENGTH = 51200;
  static MAX_IMAGE_LENGTH = 1100000;
  static HAIR_COLOR_SIZE_LENGTH = 1;
  static MAX_HAIR_COLOR_LENGTH = 256 ^ (ItemCls.HAIR_COLOR_SIZE_LENGTH - 1);
  static EYE_COLOR_SIZE_LENGTH = 1;
  static MAX_EYE_COLOR_LENGTH = 256 ^ (ItemCls.EYE_COLOR_SIZE_LENGTH - 1);
  static SKIN_COLOR_SIZE_LENGTH = 1;
  static MAX_SKIN_COLOR_LENGTH = 256 ^ (ItemCls.SKIN_COLOR_SIZE_LENGTH - 1);
  static RACE_SIZE_LENGTH = 1;
  static MAX_RACE_LENGTH = 256 ^ (ItemCls.RACE_SIZE_LENGTH - 1);
  static REFERENCE_LENGTH = Transaction.SIGNATURE_LENGTH;
  static TIMESTAMP_LENGTH = Transaction.TIMESTAMP_LENGTH;
  static BIRTHDAY_LENGTH = ItemCls.TIMESTAMP_LENGTH;
  static DEATHDAY_LENGTH = ItemCls.TIMESTAMP_LENGTH;
  static LATITUDE_LENGTH = 4;
  static TYPE_LENGTH = 2;
  static OWNER_LENGTH = PublicKeyAccount.PUBLIC_KEY_LENGTH;
  static NAME_SIZE_LENGTH = 1;
  static MAX_NAME_LENGTH = Math.pow(256, ItemCls.NAME_SIZE_LENGTH) - 1;
  static IMAGE_SIZE_LENGTH = 4;
  static ICON_SIZE_LENGTH = 2;
  static DESCRIPTION_SIZE_LENGTH = 4;
  protected static BASE_LENGTH =
    ItemCls.TYPE_LENGTH +
    ItemCls.OWNER_LENGTH +
    ItemCls.NAME_SIZE_LENGTH +
    ItemCls.ICON_SIZE_LENGTH +
    ItemCls.IMAGE_SIZE_LENGTH +
    ItemCls.DESCRIPTION_SIZE_LENGTH;
  typeBytes: Int8Array;
  owner: PublicKeyAccount;
  name: string;
  icon: Int8Array;
  image: Int8Array;
  description: string;
  reference?: Int8Array;
  appData?: AppData;
  iconType?: number;
  imageType?: number;

  constructor(
    typeBytes: Int8Array,
    owner: PublicKeyAccount,
    name: string,
    icon: Int8Array,
    image: Int8Array,
    description: string,
    iconType?: number,
    imageType?: number,
  ) {
    this.typeBytes = typeBytes;
    this.owner = owner;
    this.name = name.trim();
    this.icon = icon;
    this.image = image;
    this.description = description.trim();
    this.iconType = iconType ?? 0;
    this.imageType = imageType ?? 0;
    this.initAppData();

    // this.reference = Bytes.ensureCapacity(base58.decode(name), ItemCls.REFERENCE_LENGTH, 0) as Int8Array;
  }

  public initAppData = async (): Promise<boolean> => {
    if (!!this.appData) return true;
    try {
        const sIcon = (await Bytes.stringFromByteArray(this.icon)).toLowerCase();
        const sImage = (await Bytes.stringFromByteArray(this.image)).toLowerCase();

        const isIconURL = regexURL.test(sIcon);
        const isImageURL = regexURL.test(sImage);
        let iconType = new Int8Array([ 0 ]);
        if (isIconURL) {
            if (
                (sIcon.indexOf(".jpg") >= 0) ||
                (sIcon.indexOf(".jpeg") >= 0) ||
                (sIcon.indexOf(".gif") >= 0) ||
                (sIcon.indexOf(".png") >= 0)
            ) {
                iconType = new Int8Array([-128 | 0]);
            } else if (
                (sIcon.indexOf(".mp4") >= 0) 
            ) {
                iconType = new Int8Array([-128 | 1]);
            }
        }
        let imageType = new Int8Array([ 0 ]);
        if (isImageURL) {
            if (
                (sImage.indexOf(".jpg") >= 0) ||
                (sImage.indexOf(".jpeg") >= 0) ||
                (sImage.indexOf(".gif") >= 0) ||
                (sImage.indexOf(".png") >= 0)
            ) {
                imageType = new Int8Array([-128 | 0]);
            } else if (
                (sImage.indexOf(".mp4") >= 0)
            ) {
                imageType = new Int8Array([-128 | 1]);
            }
        }
        if (isIconURL || isImageURL) {
            this.appData = new AppData(iconType, imageType);

            return true;
        }
        // Если не ссылки, то смотрим iconType и imageType
        if (this.iconType) {
          iconType = new Int8Array([this.iconType]);
        }
        if (this.imageType) {
          imageType = new Int8Array([this.imageType]);
        }
        if (this.iconType || this.imageType) {
          this.appData = new AppData(iconType, imageType);

          return true;
        }
    } catch (e) { /**/ }
    return false;
  }

  async getDataLength(includeReference: boolean): Promise<number> {
    return (
      ItemCls.BASE_LENGTH +
      (await Bytes.stringToByteArray(this.name)).length +
      this.icon.length +
      this.image.length +
      (this.appData ? this.appData.getDataLength() : 0) +
      (await Bytes.stringToByteArray(this.description)).length +
      (includeReference ? ItemCls.REFERENCE_LENGTH : 0)
    );
  }

  async toBytes(includeReference: boolean, forOwnerSign: boolean): Promise<Int8Array> {
    const data = new DataWriter();
    const useAll = !forOwnerSign;
    //console.log("ItemCls", { includeReference, forOwnerSign, useAll });
    if (useAll) {
      //WRITE TYPE
      this.typeToBytes(data);
    }

    if (useAll) {
      // WRITE OWNER
      this.ownerToBytes(data);
    }

    //WRITE NAME
    await this.nameToBytes(data, useAll);
    //console.log("ItemCls1", { data });

    if (useAll) {
      //WRITE ICON SIZE - 2 bytes = 64kB max
      //WRITE ICON
      await this.iconToBytes(data);
    }
    //console.log("ItemCls2", { data });
    await this.imageToBytes(data, useAll);
    if (this.appData) {
      const bytesAppData = await this.appData.toBytes();
      data.set(bytesAppData);
    }
    //console.log("ItemCls3", { data });
    // WRITE DESCRIPTION
    await this.descriptionToBytes(data, useAll);
    //console.log("ItemCls4", { data });

    if (useAll && includeReference && this.reference) {
      //WRITE REFERENCE
      data.set(this.reference);
    }
    //console.log("ItemCls5", { data });
    return data.data;
  }

  async toBytesWithoutAppData(includeReference: boolean, forOwnerSign: boolean): Promise<Int8Array> {
    const data = new DataWriter();
    const useAll = !forOwnerSign;
    //console.log("ItemCls", { includeReference, forOwnerSign, useAll });
    if (useAll) {
      //WRITE TYPE
      this.typeToBytes(data);
    }

    if (useAll) {
      // WRITE OWNER
      this.ownerToBytes(data);
    }

    //WRITE NAME
    await this.nameToBytes(data, useAll);
    //console.log("ItemCls1", { data });

    if (useAll) {
      //WRITE ICON SIZE - 2 bytes = 64kB max
      //WRITE ICON
      await this.iconToBytes(data);
    }
    //console.log("ItemCls2", { data });
    await this.imageToBytes(data, useAll);

    //console.log("ItemCls3", { data });
    // WRITE DESCRIPTION
    await this.descriptionToBytes(data, useAll);
    //console.log("ItemCls4", { data });

    if (useAll && includeReference && this.reference) {
      //WRITE REFERENCE
      data.set(this.reference);
    }
    //console.log("ItemCls5", { data });
    return data.data;
  }

  typeToBytes(dataWriter: DataWriter): void {
    dataWriter.set(this.typeBytes);
  }

  ownerToBytes(dataWriter: DataWriter): void {
    dataWriter.set(this.owner.publicKey);
  }

  async nameToBytes(dataWriter: DataWriter, prependLength: boolean = false): Promise<void> {
    const name = await Bytes.stringToByteArray(this.name);
    if (prependLength) {
      dataWriter.setNumber(name.length);
    }
    dataWriter.set(name);
  }

  async iconToBytes(dataWriter: DataWriter): Promise<void> {
    const length = this.icon.length;
    const iconsLength = await Bytes.intToByteArray(length);

    dataWriter.set(new Int8Array([iconsLength[2], iconsLength[3]]));
    dataWriter.set(this.icon);
  }

  async imageToBytes(dataWriter: DataWriter, prependLength: boolean = false): Promise<void> {
    if (prependLength) {
      let length = this.image.length;
      if (this.appData) {
          length = length | 1 << 31; 
      }
      const bytes = await Bytes.intToByteArray(length);
      dataWriter.set(bytes);
    }

    dataWriter.set(this.image);
  }

  async descriptionToBytes(dataWriter: DataWriter, prependLength: boolean = false): Promise<void> {
    const description = await Bytes.stringToByteArray(this.description);
    if (prependLength) {
      dataWriter.set(await Bytes.intToByteArray(description.length));
    }

    dataWriter.set(description);
  }
}
