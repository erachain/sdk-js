const RNBase58 = require('./Base58_');

export class Base58 {
  /** @description Base58 encode.
   * @param {Int8Array} input Input value to encode.
   * @return {Promise<string>} Base58.
   */
  static async encode(input: Int8Array): Promise<string> {
    return RNBase58.encode(Array.from(input));
  }

  static encodeSync(input: Int8Array): string {
    return RNBase58.encode(Array.from(input));
  }

  /** @description Base58 decode.
   * @param {string} input Input string in Base58.
   * @return {Promise<Int8Array>}
   */
  static async decode(input: string): Promise<Int8Array> {
    const data = RNBase58.decode(input);
    return new Int8Array(data);
  }
}
