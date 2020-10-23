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
  static decryptMessage = crypt.decryptMessage;
  static encryptMessage = crypt.encryptMessage;
  static decryptAES = crypt.decryptAES;
  static encryptAES = crypt.encryptAES;
  static encryptBytes = crypt.encryptBytes;
  static passwordAES = crypt.passwordAES;
  static wordsToBase58 = crypt.wordsToBase58;
  static wordsToUtf8 = crypt.wordsToUtf8;
  static wordsToBytes = crypt.wordsToBytes;
  static bytesToWords = crypt.bytesToWords;

}
