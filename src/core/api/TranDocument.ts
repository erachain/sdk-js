import { TransactionDocument } from '../src/core/transaction/TransactionDocument';
import { KeyPair } from '../src/core/account/KeyPair';
import { PrivateKeyAccount } from '../src/core/account/PrivateKeyAccount';
import { ITranRaw } from '../src/core/transaction/TranTypes';
import { Base58 } from '../crypt/libs/Base58';

export const tranDocument = async (
  keyPair: KeyPair,
  exData: Int8Array,
  port: number,
  genesis_sign: Int8Array,
): Promise<ITranRaw> => {
  try {
    const feePow = 0;
    const privateAccount = new PrivateKeyAccount(keyPair);

    const date = new Date();
    const timestamp = date.getTime();
    const reference = 0;
    console.log("tranDocument.start");
    const tx = new TransactionDocument("Note", privateAccount, feePow, timestamp, reference, exData, port, genesis_sign);
    console.log("tranDocument.tx");
    await tx.sign(privateAccount, false);
    console.log("tranDocument.sign");
    const raw = await Base58.encode(await tx.toBytes(true, null));
    console.log("tranDocument.base58encode");
    let size = await tx.getDataLength();

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
