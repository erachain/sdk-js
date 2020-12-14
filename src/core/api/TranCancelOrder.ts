import { CancelOrder } from '../src/core/transaction/CancelOrder';
import { KeyPair } from '../src/core/account/KeyPair';
import { PrivateKeyAccount } from '../src/core/account/PrivateKeyAccount';
import { ITranRaw } from '../src/core/transaction/TranTypes';
import { Base58 } from '../crypt/libs/Base58';

export const tranCancelOrder = async (
    keyPair: KeyPair,
    name: string,
    signature: string,
    port: number,
    genesis_sign: Int8Array,
): Promise<ITranRaw> => {
  try {
    const feePow = 0;
    const privateAccount = new PrivateKeyAccount(keyPair);

    const date = new Date();
    const timestamp = date.getTime();
    const reference = 0;

    const tx = new CancelOrder(name, privateAccount, feePow, timestamp, reference, port, signature, genesis_sign);

    await tx.sign(privateAccount, false);
    const raw = await Base58.encode(await tx.toBytes(true, null));
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
