import { IssuePersonRecord } from '../src/core/transaction/IssuePersonRecord';
import { KeyPair } from '../src/core/account/KeyPair';
import { PrivateKeyAccount } from '../src/core/account/PrivateKeyAccount';
import { ITranRaw } from '../src/core/transaction/TranTypes';
import { Base58 } from '../crypt/libs/Base58';
import {PersonHuman} from '../src/core/item/persons/PersonHuman';

export const rawPerson = async (
  keyPair: KeyPair,
  person: PersonHuman,
  port: number,
): Promise<ITranRaw> => {
  try {

    const privateAccount = new PrivateKeyAccount(keyPair);

    const date = new Date();
    const timestamp = date.getTime();
    const reference = 1;
    const tx = new IssuePersonRecord(privateAccount, person, 0, timestamp, reference, port);

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


export const tranPerson = async (
  keyPair: KeyPair,
  person: PersonHuman,
  port: number,
): Promise<ITranRaw> => {
  try {

    const privateAccount = new PrivateKeyAccount(keyPair);

    const date = new Date();
    const timestamp = date.getTime();
    const reference = 1;
    const tx = new IssuePersonRecord(privateAccount, person, 0, timestamp, reference, port);

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
