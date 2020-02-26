"use strict";

const { Transaction } = require("./Transaction");
const { DataWriter } = require("./DataWriter");

class TransactionAmount extends Transaction {

    constructor(typeBytes, name, creator, feePow, recipient, amount, key, timestamp, reference) {
        super(typeBytes, name, creator, feePow, timestamp, reference);
        this.recipient = recipient;
        if (amount == null || amount.num === 0) {
            // set version to 1
            typeBytes[2] = (typeBytes[2] | -128);
        }
        else {
            this.amount = amount;
        }
        this.key = key;
    }

    toBytes(withSign, releaserReference) {
        const _super = Object.create(null, {
            toBytes: { get: () => super.toBytes }
        });

        const data = new DataWriter();
        data.set(_super.toBytes.call(this, withSign, releaserReference));
        //WRITE RECIPIENT
        data.set(Base58.decode(this.recipient.getAddress()));
        if (this.amount != null) {
            //WRITE KEY
            let keyBytes = Bytes.longToByteArray(this.key);
            keyBytes = Bytes.ensureCapacity(keyBytes, Transaction.KEY_LENGTH, 0);
            data.set(keyBytes);
            //WRITE AMOUNT
            let amountBytes = Bytes.longToByteArray(this.amount.unscaledValue());
            amountBytes = Bytes.ensureCapacity(amountBytes, TransactionAmount.AMOUNT_LENGTH, 0);
            data.set(amountBytes);
        }
        return data.data;

    }

    getDataLength(asPack) {

        return (asPack ? TransactionAmount.BASE_LENGTH_AS_PACK : TransactionAmount.BASE_LENGTH) -
            (this.typeBytes[2] < 0 ? (Transaction.KEY_LENGTH + TransactionAmount.AMOUNT_LENGTH) : 0);

    }

}

exports.TransactionAmount = TransactionAmount;

TransactionAmount.RECIPIENT_LENGTH = Transaction.ADDRESS_LENGTH;
TransactionAmount.AMOUNT_LENGTH = 8;
TransactionAmount.BASE_LENGTH_AS_PACK = Transaction.BASE_LENGTH_AS_PACK + TransactionAmount.RECIPIENT_LENGTH + Transaction.KEY_LENGTH + TransactionAmount.AMOUNT_LENGTH;
TransactionAmount.BASE_LENGTH = Transaction.BASE_LENGTH + TransactionAmount.RECIPIENT_LENGTH + Transaction.KEY_LENGTH + TransactionAmount.AMOUNT_LENGTH;
