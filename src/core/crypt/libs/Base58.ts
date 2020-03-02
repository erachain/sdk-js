const RNBase58 = require('./Base58_');

export class Base58 {
  static async encode(input: Int8Array): Promise<string> {
    return RNBase58.encode(Array.from(input));
  }

  static encodeSync(input: Int8Array): string {
    return RNBase58.encode(Array.from(input));
  }

  static async decode(input: string): Promise<Int8Array> {
    const data = RNBase58.decode(input);
    return new Int8Array(data);
  }
}
