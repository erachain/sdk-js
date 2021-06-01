export class BigDecimal {
  static ROUND_UP = 1;
  static ROUND_DOWN = 2;
  private scale = 8;
  private _num: number;

  constructor(num: number | string, scale?: number) {
    if (typeof num === 'string') {
      num = parseFloat(num);
    }

    if (scale !== undefined) {
      this.scale = scale;
    }
    this._num = num;
  }

  getScale(): number {
    const a = this._num.toString().split('.');
    if (a.length > 1) {
      return a[1].length;
    }
    return 0;
  }

  get intCompact(): number {
    return this._num * BigDecimal.pow(10, this.scale);
  }

  get stringCache(): string {
    const float = this.intCompact.toString();
    let repeat = 0;
    if (this.scale > float.length) {
      repeat = this.scale - float.length;
    }
    const zeros = '0'.repeat(repeat);

    return `${Math.floor(this._num)}.${zeros}${float}`;
  }

  get num(): number {
    return this._num;
  }

  multiply(x: number | BigDecimal): BigDecimal {
    return new BigDecimal(this.num * this._numValue(x));
  }

  setScale(newScale: number = this.scale, roundingMode: number = BigDecimal.ROUND_DOWN): BigDecimal {
    const precision = BigDecimal.pow(10, newScale + 1);
    let value = this.num * precision;
    value = roundingMode === BigDecimal.ROUND_UP ? Math.ceil(value) : Math.floor(value);
    value = value / precision;

    return new BigDecimal(value);
  }

  pow(x: number | BigDecimal): BigDecimal {
    return new BigDecimal(BigDecimal.pow(this.num, this._numValue(x)));
  }

  valueOf(): number {
    return this.num;
  }

  unscaledValue(): number {
    return Math.trunc(this.intCompact);
  }

  private _numValue(x: number | BigDecimal): number {
    if (x instanceof BigDecimal) {
      x = x.num;
    }
    return x;
  }

  // за место Math.pow
  static pow(a: number, b: number): number {
    const n = b < 0 ? b * -1 : b;
    let z = 1;
    for (let i = 0; i < n; i += 1) {
      z *= a;
    }

    return b < 0 ? 1 / z : z;
  }
}
