import { TransactionOrder } from '../src/core/transaction/TransactionOrder';
import { KeyPair } from '../src/core/account/KeyPair';
import { PrivateKeyAccount } from '../src/core/account/PrivateKeyAccount';
import { ITranRaw } from '../src/core/transaction/TranTypes';
import { Base58 } from '../crypt/libs/Base58';
import base64 from "../src/core/util/base64";

export const tranOrder = async (
    keyPair: KeyPair,
    name: string,
    haveAssetKey: number,
    haveAmount: number,
    wantAssetKey: number,
    wantAmount: number,
    port: number,
    genesis_sign: Int8Array,
    isBase64?: boolean,
): Promise<ITranRaw> => {
  try {
    const feePow = 0;
    const privateAccount = new PrivateKeyAccount(keyPair);

    const date = new Date();
    const timestamp = date.getTime();
    const reference = 0;

    const tx = new TransactionOrder(name, privateAccount, feePow, timestamp, reference, haveAssetKey, wantAssetKey, haveAmount, wantAmount, port, genesis_sign);

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
