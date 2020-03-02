import { PublicKeyAccount } from '../../account/PublicKeyAccount';
import { ItemCls } from '../ItemCls';
import { DataWriter } from '../../DataWriter';
import { Bytes } from '../../Bytes';

export class AssetCls extends ItemCls {
  static QUANTITY_LENGTH = ItemCls.TIMESTAMP_LENGTH;
  static SCALE_LENGTH = 1;
  static ASSET_TYPE_LENGTH = 1;

  quantity: number;
  scale: number;
  asset_type: number;

  constructor(
    typeBytes: Int8Array,
    owner: PublicKeyAccount,
    quantity: number,
    scale: number,
    asset_type: number,
    name: string,
    icon: Int8Array,
    image: Int8Array,
    description: string,
  ) {
    super(typeBytes, owner, name, icon, image, description);

    this.quantity = quantity;
    this.scale = scale;
    this.asset_type = asset_type;
  }

  async toBytes(includeReference: boolean, forOwnerSign: boolean): Promise<Int8Array> {
    //console.log({ includeReference, forOwnerSign });
    const dataWriter = new DataWriter();

    dataWriter.set(await super.toBytes(includeReference, forOwnerSign));

    //console.log({ dataWriter: dataWriter.data });
    // WRITE QUANTITY
    await this.quantityToBytes(dataWriter);
    //console.log({ dataWriter: dataWriter.data });
    // WRITE SCALE
    await this.scaleToBytes(dataWriter);
    //console.log({ dataWriter: dataWriter.data });
    // WRITE ASSET_TYPE
    await this.assetTypeToBytes(dataWriter);
    //console.log({ dataWriter: dataWriter.data });
    return dataWriter.data;
  }

  async quantityToBytes(dataWriter: DataWriter): Promise<void> {
    const dayBytes = await Bytes.longToByteArray(this.quantity);
    const bytes = Bytes.ensureCapacity(dayBytes, AssetCls.QUANTITY_LENGTH, 0);
    dataWriter.set(bytes);
  }

  async scaleToBytes(dataWriter: DataWriter): Promise<void> {
    dataWriter.setNumber(this.scale);
  }

  async assetTypeToBytes(dataWriter: DataWriter): Promise<void> {
    dataWriter.setNumber(this.asset_type);
  }
}
