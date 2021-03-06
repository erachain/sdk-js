import { sign } from 'tweetnacl';
import { Base58 } from '../../../crypt/libs/Base58';

/**
 * @class
 * @classdesc Key pair class.
 */
export class KeyPair {
  /** @member {Int8Array} */
  secretKey: Int8Array;

  /** @member {Int8Array} */
  publicKey: Int8Array;

  /**
   * Create instance of KeyPair.
   *
   * @constructor
   * @param {KeyPair | Int8Array} secretKey - Private key or KeyPair (Optional).
   * @param {Int8Array} publicKey - Public key (Optional).
   */
  constructor();
  constructor(secretKey: Int8Array, publicKey: Int8Array);
  constructor(secretKey?: IKeyPair | Int8Array, publicKey?: Int8Array) {
    if (arguments.length === 0) {
      const keys = this.generate();
      secretKey = keys.secretKey;
      publicKey = keys.publicKey;
    }

    if (arguments.length === 1) {
      const keyPair: IKeyPair = secretKey as IKeyPair;
      secretKey = keyPair.secretKey;
      publicKey = keyPair.publicKey;
    }

    this.secretKey = new Int8Array(secretKey as Int8Array);
    this.publicKey = new Int8Array(publicKey as Int8Array);
  }

  toArray() {
    return {
      secretKey: Array.from(this.secretKey),
      publicKey: Array.from(this.publicKey),
    };
  }

  /** @description Convert keys to base58 string.
   * @return {Promise<IKeyPairString>}
   */
  async toString(): Promise<IKeyPairString> {
    return {
      secretKey: await Base58.encode(this.secretKey),
      publicKey: await Base58.encode(this.publicKey),
    };
  }

  toJSON() {
    return this.toArray();
  }

  private generate(): IKeyPair {
    const keys = sign.keyPair();
    return {
      secretKey: new Int8Array(keys.secretKey),
      publicKey: new Int8Array(keys.publicKey),
    };
  }
}

export interface IKeyPair {
  secretKey: Int8Array;
  publicKey: Int8Array;
}

export interface IKeyPairArray {
  secretKey: number[];
  publicKey: number[];
}

export interface IKeyPairString {
  secretKey: string;
  publicKey: string;
}
