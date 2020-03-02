/* tslint:disable */

export class RIPEMD160 {
  private MDbuf: number[];
  private working: Int32Array;
  private working_ptr: number;
  private msglen: number;
  private ArgArray: [number[], number[]];
  private IndexArray: [number[], number[]];

  constructor() {
    this.MDbuf = [];
    this.MDbuf[0] = 1732584193;
    this.MDbuf[1] = -271733879;
    this.MDbuf[2] = -1732584194;
    this.MDbuf[3] = 271733878;
    this.MDbuf[4] = -1009589776;
    this.working = new Int32Array(16);

    this.working_ptr = 0;
    this.msglen = 0;

    this.ArgArray = [
      [
        11,
        14,
        15,
        12,
        5,
        8,
        7,
        9,
        11,
        13,
        14,
        15,
        6,
        7,
        9,
        8,
        7,
        6,
        8,
        13,
        11,
        9,
        7,
        15,
        7,
        12,
        15,
        9,
        11,
        7,
        13,
        12,
        11,
        13,
        6,
        7,
        14,
        9,
        13,
        15,
        14,
        8,
        13,
        6,
        5,
        12,
        7,
        5,
        11,
        12,
        14,
        15,
        14,
        15,
        9,
        8,
        9,
        14,
        5,
        6,
        8,
        6,
        5,
        12,
        9,
        15,
        5,
        11,
        6,
        8,
        13,
        12,
        5,
        12,
        13,
        14,
        11,
        8,
        5,
        6,
      ],
      [
        8,
        9,
        9,
        11,
        13,
        15,
        15,
        5,
        7,
        7,
        8,
        11,
        14,
        14,
        12,
        6,
        9,
        13,
        15,
        7,
        12,
        8,
        9,
        11,
        7,
        7,
        12,
        7,
        6,
        15,
        13,
        11,
        9,
        7,
        15,
        11,
        8,
        6,
        6,
        14,
        12,
        13,
        5,
        14,
        13,
        13,
        7,
        5,
        15,
        5,
        8,
        11,
        14,
        14,
        6,
        14,
        6,
        9,
        12,
        9,
        12,
        5,
        15,
        8,
        8,
        5,
        12,
        9,
        12,
        5,
        14,
        6,
        8,
        13,
        6,
        5,
        15,
        13,
        11,
        11,
      ],
    ];
    this.IndexArray = [
      [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        7,
        4,
        13,
        1,
        10,
        6,
        15,
        3,
        12,
        0,
        9,
        5,
        2,
        14,
        11,
        8,
        3,
        10,
        14,
        4,
        9,
        15,
        8,
        1,
        2,
        7,
        0,
        6,
        13,
        11,
        5,
        12,
        1,
        9,
        11,
        10,
        0,
        8,
        12,
        4,
        13,
        3,
        7,
        15,
        14,
        5,
        6,
        2,
        4,
        0,
        5,
        9,
        7,
        12,
        2,
        10,
        14,
        1,
        3,
        8,
        11,
        6,
        15,
        13,
      ],
      [
        5,
        14,
        7,
        0,
        9,
        2,
        11,
        4,
        13,
        6,
        15,
        8,
        1,
        10,
        3,
        12,
        6,
        11,
        3,
        7,
        0,
        13,
        5,
        10,
        14,
        15,
        8,
        12,
        4,
        9,
        1,
        2,
        15,
        5,
        1,
        3,
        7,
        14,
        6,
        9,
        11,
        8,
        12,
        2,
        10,
        0,
        4,
        13,
        8,
        6,
        4,
        1,
        3,
        11,
        15,
        0,
        5,
        12,
        2,
        13,
        9,
        7,
        10,
        14,
        12,
        15,
        10,
        4,
        1,
        5,
        8,
        7,
        6,
        2,
        13,
        14,
        0,
        3,
        9,
        11,
      ],
    ];
  }

  reset() {
    this.MDbuf = [];
    this.MDbuf[0] = 1732584193;
    this.MDbuf[1] = -271733879;
    this.MDbuf[2] = -1732584194;
    this.MDbuf[3] = 271733878;
    this.MDbuf[4] = -1009589776;
    this.working = new Int32Array(16);
    this.working_ptr = 0;
    this.msglen = 0;
  }

  compress(X: Int32Array) {
    let index = 0;
    let a;
    let b;
    let c;
    let d;
    let e;
    let A;
    let B;
    let C;
    let D;
    let E;
    let temp;
    let s;
    A = a = this.MDbuf[0];
    B = b = this.MDbuf[1];
    C = c = this.MDbuf[2];
    D = d = this.MDbuf[3];
    E = e = this.MDbuf[4];
    for (; index < 16; index++) {
      temp = a + (b ^ c ^ d) + X[this.IndexArray[0][index]];
      a = e;
      e = d;
      d = (c << 10) | (c >>> 22);
      c = b;
      s = this.ArgArray[0][index];
      b = ((temp << s) | (temp >>> (32 - s))) + a;
      temp = A + (B ^ (C | ~D)) + X[this.IndexArray[1][index]] + 1352829926;
      A = E;
      E = D;
      D = (C << 10) | (C >>> 22);
      C = B;
      s = this.ArgArray[1][index];
      B = ((temp << s) | (temp >>> (32 - s))) + A;
    }
    for (; index < 32; index++) {
      temp = a + ((b & c) | (~b & d)) + X[this.IndexArray[0][index]] + 1518500249;
      a = e;
      e = d;
      d = (c << 10) | (c >>> 22);
      c = b;
      s = this.ArgArray[0][index];
      b = ((temp << s) | (temp >>> (32 - s))) + a;
      temp = A + ((B & D) | (C & ~D)) + X[this.IndexArray[1][index]] + 1548603684;
      A = E;
      E = D;
      D = (C << 10) | (C >>> 22);
      C = B;
      s = this.ArgArray[1][index];
      B = ((temp << s) | (temp >>> (32 - s))) + A;
    }
    for (; index < 48; index++) {
      temp = a + ((b | ~c) ^ d) + X[this.IndexArray[0][index]] + 1859775393;
      a = e;
      e = d;
      d = (c << 10) | (c >>> 22);
      c = b;
      s = this.ArgArray[0][index];
      b = ((temp << s) | (temp >>> (32 - s))) + a;
      temp = A + ((B | ~C) ^ D) + X[this.IndexArray[1][index]] + 1836072691;
      A = E;
      E = D;
      D = (C << 10) | (C >>> 22);
      C = B;
      s = this.ArgArray[1][index];
      B = ((temp << s) | (temp >>> (32 - s))) + A;
    }
    for (; index < 64; index++) {
      temp = a + ((b & d) | (c & ~d)) + X[this.IndexArray[0][index]] + -1894007588;
      a = e;
      e = d;
      d = (c << 10) | (c >>> 22);
      c = b;
      s = this.ArgArray[0][index];
      b = ((temp << s) | (temp >>> (32 - s))) + a;
      temp = A + ((B & C) | (~B & D)) + X[this.IndexArray[1][index]] + 2053994217;
      A = E;
      E = D;
      D = (C << 10) | (C >>> 22);
      C = B;
      s = this.ArgArray[1][index];
      B = ((temp << s) | (temp >>> (32 - s))) + A;
    }
    for (; index < 80; index++) {
      temp = a + (b ^ (c | ~d)) + X[this.IndexArray[0][index]] + -1454113458;
      a = e;
      e = d;
      d = (c << 10) | (c >>> 22);
      c = b;
      s = this.ArgArray[0][index];
      b = ((temp << s) | (temp >>> (32 - s))) + a;
      temp = A + (B ^ C ^ D) + X[this.IndexArray[1][index]];
      A = E;
      E = D;
      D = (C << 10) | (C >>> 22);
      C = B;
      s = this.ArgArray[1][index];
      B = ((temp << s) | (temp >>> (32 - s))) + A;
    }
    D += c + this.MDbuf[1];
    this.MDbuf[1] = this.MDbuf[2] + d + E;
    this.MDbuf[2] = this.MDbuf[3] + e + A;
    this.MDbuf[3] = this.MDbuf[4] + a + B;
    this.MDbuf[4] = this.MDbuf[0] + b + C;
    this.MDbuf[0] = D;
  }

  MDfinish(array: Int32Array, lswlen: number, mswlen: number) {
    const X = array;
    X[(lswlen >> 2) & 15] ^= 1 << (((lswlen & 3) << 3) + 7);
    if ((lswlen & 63) > 55) {
      this.compress(X);
      for (let i = 0; i < 14; i++) {
        X[i] = 0;
      }
    }
    X[14] = lswlen << 3;
    X[15] = (lswlen >> 29) | (mswlen << 3);
    this.compress(X);
  }

  update(input: Int8Array) {
    for (let i = 0; i < input.length; i++) {
      this.working[this.working_ptr >> 2] ^= input[i] << ((this.working_ptr & 3) << 3);
      this.working_ptr++;
      if (this.working_ptr === 64) {
        this.compress(this.working);
        for (let j = 0; j < 16; j++) {
          this.working[j] = 0;
        }
        this.working_ptr = 0;
      }
    }
    this.msglen += input.length;
  }

  digestBin() {
    this.MDfinish(this.working, this.msglen, 0);
    //  var res = new Int8Array()

    const res = [];
    for (let i = 0; i < 20; i++) {
      res[i] = (this.MDbuf[i >> 2] >>> ((i & 3) << 3)) & 255;
    }
    return new Int8Array(res);
  }

  digest(input: Int8Array) {
    this.update(new Int8Array(input));
    return this.digestBin();
  }
}
