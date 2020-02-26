"use strict";

const Bytes = require("../Bytes");

class DataWriter {
    constructor() {
        this._data = [];
    }
    get data() {
        const dataLength = this._data.reduce((length, d) => length + d.length, 0);
        const data = new Int8Array(dataLength);
        let offset = 0;
        this._data.forEach(d => {
            data.set(d, offset);
            offset += d.length;
        });
        return data;
    }
    set(data) {
        this._data.push(data);
        return this;
    }
    setString(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.set(new Int8Array(Bytes.stringToByteArray(data)));
            return this;
        });
    }
    setNumber(data) {
        this.set(new Int8Array([data]));
        return this;
    }
}

exports.DataWriter = DataWriter;
