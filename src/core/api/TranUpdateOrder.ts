import { KeyPair } from '../src/core/account/KeyPair';
import { PrivateKeyAccount } from '../src/core/account/PrivateKeyAccount';
import { ITranRaw } from '../src/core/transaction/TranTypes';
import { Base58 } from '../crypt/libs/Base58';
import base64 from "../src/core/util/base64";
import { TransactionUpdateOrder } from '../src/core/transaction/TransactionUpdateOrder';

export const tranUpdateOrder = async (
    keyPair: KeyPair,
    name: string,
    signature: string,
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

    const tx = new TransactionUpdateOrder(name, privateAccount, feePow, timestamp, reference, signature, wantAmount, port, genesis_sign);

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
