import { IssueAsset } from '../src/core/transaction/IssueAsset';
import { Asset } from '../src/core/item/assets/Asset';
import { KeyPair } from '../src/core/account/KeyPair';
import { PrivateKeyAccount } from '../src/core/account/PrivateKeyAccount';
import { PublicKeyAccount } from '../src/core/account/PublicKeyAccount';
import { ITranRaw } from '../src/core/transaction/TranTypes';
import { Base58 } from '../crypt/libs/Base58';
import base64 from "../src/core/util/base64";

export const tranAsset = async (
  keyPair: KeyPair,
  name: string,
  assetType: number,
  quantity: number,
  scale: number,
  icon: Int8Array,
  image: Int8Array,
  description: string,
  port: number,
  genesis_sign: Int8Array,
  isBase64?: boolean,
): Promise<ITranRaw> => {
  try {
    const feePow = 0;
    const privateAccount = new PrivateKeyAccount(keyPair);
    const owner = new PublicKeyAccount(keyPair.publicKey);

    const date = new Date();
    const timestamp = date.getTime();
    const reference = 0;
    const asset = new Asset(owner, quantity, scale, assetType, name, icon, image, description);

    const tx = new IssueAsset(privateAccount, asset, feePow, timestamp, reference, port, genesis_sign);
    await tx.sign(privateAccount, false);

    const bytes = await tx.toBytes(true, null);
    const raw = isBase64 ? base64.encodeFromByteArray(new Uint8Array(bytes)) : await Base58.encode(bytes);
    let size = await tx.getDataLength(false);

    const fee = (size * 100.0) / Math.pow(10, 8);
    size = size;

    return {
      raw,
      size,
      fee,
    };
  } catch (e) {
    return {
      raw: '',
      size: 0,
      fee: 0,
      error: e,
    };
  }
};
