"use strict";

const { TransactionAmount } = require("./TransactionAmount");
const { Transaction } = require("./Transaction");
const { DataWriter } = require("./DataWriter");

/* tslint:disable-next-line */
class R_Send extends TransactionAmount {
    
    constructor(creator, feePow, recipient, key, amount, head, data, isText, encrypted, timestamp, reference) {
        const typeBytes = new Int8Array([R_Send.TYPE_ID, 0, 0, 0]);
        super(typeBytes, R_Send.NAME_ID, creator, feePow, recipient, amount, key, timestamp, reference);
        this.head = head || "";
        if (data == null || data.length === 0) {
            // set version byte
            typeBytes[3] = (typeBytes[3] | -128);
        }
        else {
            this.data = data;
            this.encrypted = encrypted;
            this.isText = isText;
        }
    }

    getDataLength(asPack) {
        const _super = Object.create(null, {
            getDataLength: { get: () => super.getDataLength }
        });

        const headBytes = Bytes.stringToByteArray(this.head);
        const dataLen = (_super.getDataLength.call(this, asPack)) + 1 + headBytes.length;
        if (this.typeBytes[3] >= 0) {
            return dataLen + R_Send.BASE_LENGTH + this.data.length;
        }
        else {
            return dataLen;
        }
    }

    getFee() {
        return this.feePow;
    }
    getFeeBig() {
        return this.fee;
    }
    toBytes(withSign, releaserReference) {
        const _super = Object.create(null, {
            toBytes: { get: () => super.toBytes }
        });

        const data = new DataWriter();
        data.set(_super.toBytes.call(this, withSign, releaserReference));
        // WRITE HEAD
        const headBytes = Bytes.stringToByteArray(this.head);
        //HEAD SIZE
        data.setNumber(headBytes.length);
        //HEAD
        data.set(headBytes);
        if (this.data != null) {
            //WRITE DATA SIZE
            const dataSizeBytes = Bytes.intToByteArray(this.data.length);
            data.set(dataSizeBytes);
            //WRITE DATA
            data.set(this.data);
            //WRITE ENCRYPTED
            data.set(this.encrypted);
            //WRITE ISTEXT
            data.set(this.isText);
        }
        return data.data;

    }
}

exports.R_Send = R_Send;

R_Send.BASE_LENGTH = Transaction.IS_TEXT_LENGTH + Transaction.ENCRYPTED_LENGTH + Transaction.DATA_SIZE_LENGTH;
R_Send.TYPE_ID = Transaction.SEND_ASSET_TRANSACTION;
R_Send.NAME_ID = "Send";