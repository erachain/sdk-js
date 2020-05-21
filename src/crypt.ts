
import { AppCrypt } from './core/crypt/AppCrypt';

const crypt = require('./core/crypt/libs/aesCrypt');

export class Crypt {
    static generateSeed = AppCrypt.generateSeed
    static generateAccountSeed = AppCrypt.generateAccountSeed
    static getKeyPairFromSeed = AppCrypt.getKeyPairFromSeed
    static generateKeys = AppCrypt.generateKeys
    static addressByPublicKey = AppCrypt.getAccountAddressFromPublicKey
    static addressBySecretKey = AppCrypt.getAddressBySecretKey
    static publicKeyBySecretKey = AppCrypt.getPublicKeyBySecretKey
    static sign = AppCrypt.sign
    static decryptMessage = crypt.decryptMessage
}