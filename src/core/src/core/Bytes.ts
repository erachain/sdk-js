/* tslint:disable:no-bitwise number-literal-format */
const { StringDecoder } = require('string_decoder');

export class Bytes {
  static ensureCapacity(numbers: Int8Array, minLength: number, padding: number): Int8Array {
    const array =
      numbers.length < minLength
        ? [...new Array(numbers), ...new Array(minLength + padding - numbers.length).fill(0)]
        : numbers;

    return new Int8Array(array);
  }

  static async intToByteArray3(int32: number): Promise<Int8Array> {
    const byteArray = [];
    for (let b = 8; b < 32; b += 8) {
      byteArray.push((int32 >>> (24 - (b % 32))) & 0xff);
    }
    return new Int8Array(byteArray);
  }

  static async intToByteArray(int32: number): Promise<Int8Array> {
    /*
    const buffer = new ArrayBuffer(4);
    const int32View = new Int32Array(buffer);
    int32View[0] = int32;
    return new Int8Array(int32View.buffer, 0, 4);
    */
    const byteArray = [];
    for (let b = 0; b < 32; b += 8) {
      byteArray.push((int32 >>> (24 - (b % 32))) & 0xff);
    }
    return new Int8Array(byteArray);
  }

  static async intFromByteArray(bytes: Int8Array): Promise<number> {
    /*
    const a = new Int32Array(bytes.buffer);
    return Number(a[0]);
    */
    let value = 0;
    const ubytes = new Uint8Array(bytes);
    for (const n of ubytes) {
      value = value * 256 + n;
    }
    return value;
  }

  static async longToByteArray(int64: number): Promise<Int8Array> {
    /*
    const buffer = new ArrayBuffer(8);
    const int64View = new BigInt64Array(buffer);
    int64View[0] = BigInt(int64);
    return new Int8Array(int64View.buffer, 0, 8);
    */
    const byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
    for (let index = 0; index < byteArray.length; index++) {
      const byte = int64 & 0xff;
      byteArray[byteArray.length - index - 1] = byte;
      int64 = (int64 - byte) / 256;
    }
    return new Int8Array(byteArray);
  }

  static async longFromByteArray(bytes: Int8Array): Promise<number> {
    /*
    const a = new BigInt64Array(bytes.buffer);
    return Number(a[0]);
    */
    let value = 0;
    const ubytes = new Uint8Array(bytes);
    for (const n of ubytes) {
      value = value * 256 + n;
    }
    return value;
  }

  static async floatToByteArray(float32: number): Promise<Int8Array> {
    /*
    const buffer = new ArrayBuffer(8);
    const float32View = new Float64Array(buffer);
    float32View[0] = float32;
    return new Int8Array(float32View.buffer, 0, 4);
    */
    const farr = new Float32Array(1); // two indexes each 4 bytes
    farr[0] = float32;
    const buff = new Int8Array(farr.buffer);
    const out = [];
    let k = 3;
    for (let i = 0; i < 4; i += 1) {
      out.push(buff[k]);
      k--;
    }
    return new Int8Array(out);
  }

  static async floatFromByteArray(bytes: Int8Array): Promise<number> {
    /*
    const a = new Float64Array(bytes.buffer);
    return a[0];
    */
    if (bytes.length === 4) {
      const bytesArray = new DataView(new Uint8Array(bytes).buffer);
      return bytesArray.getFloat32(0);
    } else {
      return 0;
    }
  }

  static async stringToByteArray(str: string): Promise<Int8Array> {
    const utf8 = [];
    if (str !== undefined) {
      for (let i = 0; i < str.length; i++) {
        let charcode: number = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
          utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
        } else if (charcode < 0xd800 || charcode >= 0xe000) {
          utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
          i++;
          // UTF-16 encodes 0x10000-0x10FFFF by
          // subtracting 0x10000 and splitting the
          // 20 bits of 0x0-0xFFFFF into two halves
          charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
          utf8.push(
            0xf0 | (charcode >> 18),
            0x80 | ((charcode >> 12) & 0x3f),
            0x80 | ((charcode >> 6) & 0x3f),
            0x80 | (charcode & 0x3f),
          );
        }
      }
    }
    return new Int8Array(utf8);
  }

  static async stringFromByteArray(bytes: Int8Array): Promise<string> {
    const decoder = new StringDecoder('utf8');
    return decoder.end(Buffer.from(bytes));
  }

  static wordsToByteArray(wordArray: any) {
    if (wordArray.hasOwnProperty('sigBytes') && wordArray.hasOwnProperty('words')) {
      wordArray = wordArray.words;
    }
    const byteArray = [];
    for (const word of wordArray) {
      for (let j = 3; j >= 0; --j) {
        byteArray.push((word >> (8 * j)) & 0xff);
      }
    }
    return byteArray;
  }

  static prepareAfterDecrypt(byteArray: any) {
    for (let i = byteArray.length - 1; i >= 0; i--) {
      if (byteArray[i] === 125) {
        return byteArray.slice(0, ++i);
      }
    }
    return byteArray;
  }

  static convertUint8ArrayToWordArray(u8Array: any) {
    const words = [];
    let i = 0;
    const len = u8Array.length;

    while (i < len) {
      words.push((u8Array[i++] << 24) | (u8Array[i++] << 16) | (u8Array[i++] << 8) | u8Array[i++]);
    }

    return {
      sigBytes: words.length * 4,
      words,
    };
  }

}
