import { TransactionMessage } from '../src/core/transaction/TransactionMessage';
import { Account } from '../src/core/account/Account';
import { KeyPair } from '../src/core/account/KeyPair';
import { PrivateKeyAccount } from '../src/core/account/PrivateKeyAccount';
import { ITranRecipient, ITranMessage, ITranRaw } from '../src/core/transaction/TranTypes';
import { Base58 } from '../crypt/libs/Base58';
import { Bytes } from '../src/core/Bytes';
import base64 from "../src/core/util/base64";

const crypt = require('../crypt/libs/aesCrypt');

export const tranMessage = async (
  recipient: ITranRecipient,
  keyPair: KeyPair,
  body: ITranMessage,
  port: number,
  genesis_sign: Int8Array,
  isBase64?: boolean,
): Promise<ITranRaw> => {
  try {
    const account = new Account(recipient.address);
    const name = 'Letter';
    const feePow = 0;
    const reference = 0;
    const timestamp = new Date().getTime();

    const isText = new Int8Array([1]);

    const privateOwner = new PrivateKeyAccount(keyPair);

    let messageBytes;

    let isEncripted = new Int8Array([0]);
    if (body.encrypted && recipient.publicKey) {
      messageBytes = await crypt.encryptMessage(body.message, recipient.publicKey, keyPair.secretKey);
      isEncripted = new Int8Array([1]);
    } else {
      messageBytes = await Bytes.stringToByteArray(body.message);
    }
    // console.log({ encryptedMessage });

    const tx = new TransactionMessage(
      new Int8Array([31, 0, 0, 0]),
      name,
      privateOwner,
      feePow,
      account,
      timestamp,
      reference,
      body.head,
      messageBytes,
      isEncripted,
      isText,
      port,
      genesis_sign,
    );
    await tx.sign(privateOwner, false);

    const bytes = await tx.toBytes(true, null);
    const raw = isBase64 ? base64.encodeFromByteArray(new Uint8Array(bytes)) : await Base58.encode(bytes);

    const fee = (bytes.length * 100.0) / Math.pow(10, 8);

    return {
      raw,
      size: bytes.length,
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
