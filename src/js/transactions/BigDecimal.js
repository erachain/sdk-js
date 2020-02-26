"use strict";

class BigDecimal {
    constructor(num, scale) {
        this.scale = 8;
        if (typeof num === "string") {
            num = parseFloat(num);
        }
        if (scale !== undefined) {
            this.scale = scale;
        }
        this._num = num;
    }
    getScale() {
        const a = this._num.toString().split('.');
        if (a.length > 1) {
            return a[1].length;
        }
        return 0;
    }
    get intCompact() {
        return this._num * Math.pow(10, this.scale);
    }
    get stringCache() {
        const float = this.intCompact.toString();
        let repeat = 0;
        if (this.scale > float.length) {
            repeat = this.scale - float.length;
        }
        const zeros = "0".repeat(repeat);
        return `${Math.floor(this._num)}.${zeros}${float}`;
    }
    get num() {
        return this._num;
    }
    multiply(x) {
        return new BigDecimal(this.num * this._numValue(x));
    }
    setScale(newScale = this.scale, roundingMode = BigDecimal.ROUND_DOWN) {
        const precision = Math.pow(10, newScale + 1);
        let value = this.num * precision;
        value = roundingMode === BigDecimal.ROUND_UP ? Math.ceil(value) : Math.floor(value);
        value = value / precision;
        return new BigDecimal(value);
    }
    pow(x) {
        return new BigDecimal(Math.pow(this.num, this._numValue(x)));
    }
    valueOf() {
        return this.num;
    }
    unscaledValue() {
        return this.intCompact;
    }
    _numValue(x) {
        if (x instanceof BigDecimal) {
            x = x.num;
        }
        return x;
    }
}

exports.BigDecimal = BigDecimal;

BigDecimal.ROUND_UP = 1;
BigDecimal.ROUND_DOWN = 2;
