import { R_Send } from '../src/core/transaction/R_Send';
import { Account } from '../src/core/account/Account';
import { KeyPair } from '../src/core/account/KeyPair';
import { PrivateKeyAccount } from '../src/core/account/PrivateKeyAccount';
import { ITranRecipient, ITranAsset, ITranMessage, ITranRaw } from '../src/core/transaction/TranTypes';
import { Base58 } from '../crypt/libs/Base58';
import { Bytes } from '../src/core/Bytes';

const crypt = require('../crypt/libs/aesCrypt');

export const tranSend = async (
  recipient: ITranRecipient,
  keyPair: KeyPair,
  asset: ITranAsset,
  body: ITranMessage,
  port: number,
): Promise<ITranRaw> => {
  try {
    const feePow = 0;
    const privateAccount = new PrivateKeyAccount(keyPair);
    const recipientAccount = new Account(recipient.address);

    let messageBytes;
    let isEncripted = new Int8Array([0]);
    if (body.encrypted && recipient.publicKey) {
      messageBytes = await crypt.encryptMessage(body.message, recipient.publicKey, keyPair.secretKey);
      isEncripted = new Int8Array([1]);
    } else {
      messageBytes = await Bytes.stringToByteArray(body.message);
    }

    const isText = new Int8Array([1]);

    const date = new Date();
    const timestamp = date.getTime();
    const reference = 1;
    const tx = new R_Send(
      privateAccount,
      feePow,
      recipientAccount,
      asset.assetKey,
      asset.amount,
      body.head,
      messageBytes,
      isText,
      isEncripted,
      timestamp,
      reference,
      port,
    );
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
