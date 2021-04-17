import { IssuePersonRecord } from '../src/core/transaction/IssuePersonRecord';
import { KeyPair } from '../src/core/account/KeyPair';
import { PrivateKeyAccount } from '../src/core/account/PrivateKeyAccount';
import { ITranRaw } from '../src/core/transaction/TranTypes';
import { Base58 } from '../crypt/libs/Base58';
import { PersonHuman } from '../src/core/item/persons/PersonHuman';
import base64 from "../src/core/util/base64";

export const tranPerson = async (
  keyPair: KeyPair,
  person: PersonHuman,
  port: number,
  genesis_sign: Int8Array,
  isBase64?: boolean,
): Promise<ITranRaw> => {
  try {
    const privateAccount = new PrivateKeyAccount(keyPair);

    const date = new Date();
    const timestamp = date.getTime();
    const reference = 1;
    const tx = new IssuePersonRecord(privateAccount, person, 0, timestamp, reference, port, genesis_sign);

    await tx.sign(privateAccount, false);

    const bytes = await tx.toBytes(true, null);
    const raw = isBase64 ? base64.encodeFromByteArray(new Uint8Array(bytes)) : await Base58.encode(bytes);
    let size = await tx.getDataLength(false);

    // 2 times less than usual
    const fee = (size * 100.0) / (Math.pow(10, 8) * 2) ;
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

export const testTranPerson = async (
  keyPair: KeyPair,
  person: PersonHuman,
  timestamp: number,
  port: number,
  genesis_sign: Int8Array,
  isBase64?: boolean,
): Promise<ITranRaw> => {
  try {
    const privateAccount = new PrivateKeyAccount(keyPair);

    const reference = 1;
    const tx = new IssuePersonRecord(privateAccount, person, 0, timestamp, reference, port, genesis_sign);

    await tx.sign(privateAccount, false);
    const bytes = await tx.toBytes(true, null);
    const raw = isBase64 ? base64.encodeFromByteArray(new Uint8Array(bytes)) : await Base58.encode(bytes);
    let size = await tx.getDataLength(false);

    // 2 times less than usual
    const fee = (size * 100.0) / (Math.pow(10, 8) * 2);
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
