import { Base58 } from './core/crypt/libs/Base58';
import { Bytes } from './core/src/core/Bytes';
import { AppCrypt } from './core/crypt/AppCrypt';
import { KeyPair } from './core/src/core/account/KeyPair';
import { tranMessage } from './core/api/TranMessage';

const crypt = require('./core/crypt/libs/aesCrypt');

module.exports = {
  Era: {
    Base58,
    Bytes,
    Crypt: {
      generateKeys: AppCrypt.generateKeys,
      KeyPair,
      addressByPublicKey: AppCrypt.getAccountAddressFromPublicKey,
      addressBySecretKey: AppCrypt.getAddressBySecretKey,
      publicKeyBySecretKey: AppCrypt.getPublicKeyBySecretKey,
      sign: AppCrypt.sign,
      verifySign: AppCrypt.verifySign,
      encryptMessage: crypt.encryptMessage,
      decryptMessage: crypt.decryptMessage,
    },
    Tran: {
      tranMessage,
    },
  },
};
