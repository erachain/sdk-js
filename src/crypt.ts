import { AppCrypt } from './core/crypt/AppCrypt';

const crypt = require('./core/crypt/libs/aesCrypt');

export class Crypt {
  static generateSeed = AppCrypt.generateSeed;
  static generateAccountSeed = AppCrypt.generateAccountSeed;
  static getKeyPairFromSeed = AppCrypt.getKeyPairFromSeed;
  static generateKeys = AppCrypt.generateKeys;
  static addressByPublicKey = AppCrypt.getAccountAddressFromPublicKey;
  static addressBySecretKey = AppCrypt.getAddressBySecretKey;
  static publicKeyBySecretKey = AppCrypt.getPublicKeyBySecretKey;
  static sign = AppCrypt.sign;
  static sha256 = AppCrypt.sha256big;
  static encrypt32 = crypt.encrypt32;
  static decrypt32 = crypt.decrypt32;
  static decryptMessage = crypt.decryptMessage;
  static encryptMessage = crypt.encryptMessage;
}
