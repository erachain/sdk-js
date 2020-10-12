import { TransactionImprint } from '../src/core/transaction/TransactionImprint';
import { Imprint } from '../src/core/item/imprint/Imprint';
import { KeyPair } from '../src/core/account/KeyPair';
import { PrivateKeyAccount } from '../src/core/account/PrivateKeyAccount';
import { PublicKeyAccount } from '../src/core/account/PublicKeyAccount';
import { ITranRaw } from '../src/core/transaction/TranTypes';
import { Base58 } from '../crypt/libs/Base58';
import { AppCrypt } from '../crypt/AppCrypt';

export const tranImprint = async (
  keyPair: KeyPair,
  names: string[],
  icon: Int8Array,
  image: Int8Array,
  description: string,
  port: number,
  genesis_sign: Int8Array,
): Promise<ITranRaw> => {
  try {
    const feePow = 0;
    const privateAccount = new PrivateKeyAccount(keyPair);
    const owner = new PublicKeyAccount(keyPair.publicKey);

    const date = new Date();
    const timestamp = date.getTime();

    const fullName = names.join('');
    const hash = AppCrypt.sha256(fullName);
    const name58 = await Base58.encode(hash);
    const name = name58.length > 40 ? name58.slice(0, 40) : name58;
    if (name.length < 20 || name.length > 40) {
      throw new Error("Error parameters 'names'");
    }
    const imprint = new Imprint(owner, name, icon, image, description);

    const tx = new TransactionImprint(privateAccount, imprint, feePow, timestamp, port, genesis_sign);

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

const testTranImprint = async (
  keyPair: KeyPair,
  timestamp: number,
  names: string[],
  icon: Int8Array,
  image: Int8Array,
  description: string,
  port: number,
  genesis_sign: Int8Array,
): Promise<ITranRaw> => {
  try {
    const feePow = 0;
    const privateAccount = new PrivateKeyAccount(keyPair);
    const owner = new PublicKeyAccount(keyPair.publicKey);

    const fullName = names.join('');
    const hash = AppCrypt.sha256(fullName);
    const name58 = await Base58.encode(hash);
    const name = name58.length > 40 ? name58.slice(0, 40) : name58;
    if (name.length < 20 || name.length > 40) {
      throw new Error("Error parameters 'names'");
    }
    const imprint = new Imprint(owner, name, icon, image, description);

    const tx = new TransactionImprint(privateAccount, imprint, feePow, timestamp, port, genesis_sign);

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

export const testTranRawImprint = async (
  keyPair: KeyPair,
  timestamp: number,
  names: string[],
  icon: Int8Array,
  image: Int8Array,
  description: string,
): Promise<ITranRaw> => {

    const genesis_sign = new Int8Array([]);

    return await testTranImprint(
      keyPair,
      timestamp,
      names,
      icon,
      image,
      description,
      9066,
      genesis_sign,
    );

  }
