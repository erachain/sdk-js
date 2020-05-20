import { Base58 } from './libs/Base58';
import { Qora } from './libs/Qora';
import { sign, SignKeyPair } from 'tweetnacl';
import { createHash } from 'crypto';

const bip39 = require('bip39');

export class AppCrypt {
  public static HASH_LENGTH = 32;

  /** @description Generate pass code by bip39.
   * @return {Promise<string>}
   */
  static generatePasscode(): string {
    bip39.setDefaultWordlist('english');
    return bip39.generateMnemonic();
  }

  
  /** @description Generate seed.
   * @return {Promise<string>}
   */
  static async generateSeed(): Promise<string> {
    const phrase = AppCrypt.generatePasscode();
    const byteSeed = AppCrypt.sha256(AppCrypt.sha256(phrase));

    return await Base58.encode(byteSeed);
  }

  /** @description Generate account seed.
   * @param {string | Int8Array} seed Seed.
   * @param {number} nonce Nonce.
   * @return {Promise<string>}
   */
  static async generateAccountSeed(seed: string | Int8Array, nonce: number) {
    return Qora.generateAccountSeed(seed, nonce);
  }

  /** @description Gets key pair from seed.
   * @param {string | Int8Array} seed Seed.
   * @return {Promise<SignKeyPair>} Tweetnacl type.
   */
  static async getKeyPairFromSeed(seed: string | Uint8Array): Promise<SignKeyPair>
  {
    if(typeof(seed) === "string") {
      seed = new Uint8Array(await Base58.decode(seed));
    }
    
    return sign.keyPair.fromSeed(seed);
  }

  /** @description SHA256 algorithm.
   * @param {Buffer | string | Int8Array} input Input value.
   * @return {Promise<Int8Array>}
   */
  static sha256(input: Buffer | string | Int8Array): Int8Array {
    if (typeof input === 'string') {
      return new Int8Array(
        createHash('sha256')
          .update(input)
          .digest(),
      );
    }
    if (input instanceof Int8Array) {
      return AppCrypt.sha256(new Buffer(input));
    }

    const hash = createHash('SHA256');
    hash.end(input);

    return new Int8Array(hash.read());
  }

  /** @description Create new erachain address.
   * @return {Promise<string>}
   */
  static async createAddress(): Promise<string> {
    const keys = AppCrypt.generateKeys();
    return Qora.getAccountAddressFromPublicKey(new Int8Array(keys.publicKey));
  }

  /** @description Gets address from public key.
   * @param {Int8Array} key Public key.
   * @return {Promise<string>}
   */
  static async getAccountAddressFromPublicKey(key: Int8Array): Promise<string> {
    return Qora.getAccountAddressFromPublicKey(key);
  }

  /** @description Generate new key pair.
   * @return {Promise<SignKeyPair>}
   */
  static generateKeys(): SignKeyPair {
    return sign.keyPair();
  }

  /** @description Signing message.
   * @param {Int8Array} message Message to sign.
   * @param {Int8Array} secretKey Private key.
   * @return {Promise<Int8Array>}
   */
  static sign(message: Int8Array, secretKey: Int8Array): Int8Array {
    const result = sign.detached(new Uint8Array(message), new Uint8Array(secretKey));

    return new Int8Array(result);
  }

  /** @description Verify sign.
   * @param {Int8Array} message Message to sign.
   * @param {Int8Array} result Result.
   * @param {Int8Array} publicKey Public key.
   * @return {Promise<Int8Array>}
   */
  static verifySign(message: Int8Array, result: Int8Array, publicKey: Int8Array): boolean {
    return sign.detached.verify(new Uint8Array(message), new Uint8Array(result), new Uint8Array(publicKey));
  }

  static async getAddressByPublicKey(publicKey: string | Int8Array): Promise<string> {
    if (typeof publicKey === 'string') {
      publicKey = await Base58.decode(publicKey);
    }

    publicKey = new Int8Array(publicKey);

    return Qora.getAccountAddressFromPublicKey(publicKey);
  }

  /** @description Gets address from private key.
   * @param {Int8Array | string} secretKey Private key.
   * @return {Promise<string>}
   */
  static async getAddressBySecretKey(secretKey: string | Int8Array): Promise<string> {
    if (typeof secretKey === 'string') {
      secretKey = await Base58.decode(secretKey);
    }
    const keys = sign.keyPair.fromSecretKey(new Uint8Array(secretKey));

    return AppCrypt.getAddressByPublicKey(new Int8Array(keys.publicKey));
  }

  /** @description Gets public key from private key.
   * @param {Int8Array | string} secretKey Private key.
   * @return {Promise<Int8Array>}
   */
  static async getPublicKeyBySecretKey(secretKey: string | Int8Array): Promise<Int8Array> {
    if (typeof secretKey === 'string') {
      secretKey = await Base58.decode(secretKey);
    }

    const keys = sign.keyPair.fromSecretKey(new Uint8Array(secretKey));

    return new Int8Array(keys.publicKey);
  }
}
