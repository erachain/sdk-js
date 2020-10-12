import { TransactionTemplate } from '../src/core/transaction/TransactionTemplate';
import { Template } from '../src/core/item/template/Template';
import { KeyPair } from '../src/core/account/KeyPair';
import { PrivateKeyAccount } from '../src/core/account/PrivateKeyAccount';
import { PublicKeyAccount } from '../src/core/account/PublicKeyAccount';
import { ITranRaw } from '../src/core/transaction/TranTypes';
import { Base58 } from '../crypt/libs/Base58';

export const tranTemplate = async (
  keyPair: KeyPair,
  name: string,
  icon: Int8Array,
  image: Int8Array,
  description: string,
  port: number,
  genesis_sign: Int8Array,
): Promise<ITranRaw> => {
  try {

    if (name.length < 12) {
      throw new Error("Invalid name MIN length = 12");
    }

    const feePow = 0;
    const privateAccount = new PrivateKeyAccount(keyPair);
    const owner = new PublicKeyAccount(keyPair.publicKey);

    const date = new Date();
    const timestamp = date.getTime();
    const reference = 0;
    const template = new Template(owner, name, icon, image, description);

    const tx = new TransactionTemplate(privateAccount, template, feePow, timestamp, reference, port, genesis_sign);
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

const testTranTemplate = async (
  keyPair: KeyPair,
  timestamp: number,
  name: string,
  icon: Int8Array,
  image: Int8Array,
  description: string,
  port: number,
  genesis_sign: Int8Array,
): Promise<ITranRaw> => {
  try {

    if (name.length < 12) {
      throw new Error("Invalid name MIN length = 12");
    }
    
    const feePow = 0;
    const privateAccount = new PrivateKeyAccount(keyPair);
    const owner = new PublicKeyAccount(keyPair.publicKey);

    const reference = 0;
    const template = new Template(owner, name, icon, image, description);

    const tx = new TransactionTemplate(privateAccount, template, feePow, timestamp, reference, port, genesis_sign);
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

export const testTranRawTemplate = async (
  keyPair: KeyPair,
  timestamp: number,
  name: string,
  icon: Int8Array,
  image: Int8Array,
  description: string,
): Promise<ITranRaw> => {

    const genesis_sign = new Int8Array([]);

    return await testTranTemplate(
      keyPair,
      timestamp,
      name,
      icon,
      image,
      description,
      9066,
      genesis_sign,
    );

}
  
