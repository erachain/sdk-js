"use strict";

const { BigDecimal } = require("./BigDecimal.js");
const { DataWriter } = require("./DataWriter.js");
const { BlockChain } = require("./BlockChain.js");

//console.log({ EraCrypt, BlockChain, DataWriter, BigDecimal, Bytes });

class Transaction {

    //v : number
    //return : number
    static diffScale(v) {
        let n = new BigDecimal(v);
        let diffScale = n.getScale() - Transaction.AMOUNT_DEFAULT_SCALE;
        if (diffScale !== 0) {
            if (diffScale < 0) {
                diffScale += Transaction.SCALE_MASK + 1; 
            }
        } 
        return diffScale;
    }

    //typeBytes: Int8Array, 
    //typeName: string, 
    //creator: { secretKey : Int8Array, publiucKey : Int8Array }, 
    //feePow: number, 
    //timestamp: number, 
    //reference: number,
    //port: number,
    constructor(typeBytes, typeName, creator, feePow, timestamp, reference, port) {
        this.typeBytes = typeBytes;
        this.TYPE_NAME = typeName;
        if (this.TYPE_NAME) {}
        this.creator = creator;
        //this.props = props;
        this.timestamp = timestamp;
        this.reference = reference;

        if (feePow < 0) {
            feePow = 0;
        } else if (feePow > BlockChain.FEE_POW_MAX) {
            feePow = BlockChain.FEE_POW_MAX;
        }
        this.feePow = feePow;
        this.port = port;
    }

    //return : Int8Array
    get Signature()  {
        return this.signature;
    }

    //creator: PrivateKeyAccount, 
    //asPack: boolean
    sign(creator, asPack) {
        // use this.reference in any case and for Pack too
        // but not with SIGN
        const data = new DataWriter();
        data.set(this.toBytes(false, null));

        // all test a not valid for main test
        // all other network must be invalid here!
        //Если не ходят тразакции то возможно неверно указан порт. сейчас ок высчитывается при добавлении новой ноды как порт -1
        data.set(Bytes.intToByteArray(this.port));
        this.signature = EraCrypt.sign(data.data, creator.secretKey);
        if (!asPack) {
            // need for recalc! if not as a pack
            this.calcFee();
        }
    }

    //withSign: boolean, 
    //releaserReference: number | null
    //return Int8Array
    toBytes() {
        const asPack = releaserReference != null;
        //console.log("Transaction", { withSign, releaserReference, asPack });
        const data = new DataWriter();

        //WRITE TYPE
        data.set(this.typeBytes);
        //console.log("Transaction1", { data });

        if (!asPack) {
            //WRITE TIMESTAMP
            let timestampBytes = Bytes.longToByteArray(this.timestamp);
            timestampBytes = Bytes.ensureCapacity(timestampBytes, Transaction.TIMESTAMP_LENGTH, 0);
            data.set(timestampBytes);
            //console.log("Transaction2", { data });
        }

        //WRITE REFERENCE - in any case as Pack or not
        if (this.reference != null) {
            // NULL in imprints
            let referenceBytes = Bytes.longToByteArray(this.reference);
            referenceBytes = Bytes.ensureCapacity(referenceBytes, Transaction.REFERENCE_LENGTH, 0);
            data.set(referenceBytes);
            //console.log("Transaction3", { data });
        }

        //WRITE CREATOR
        data.set(this.creator.publicKey);
        //console.log("Transaction4",{ data });

        //WRITE FEE POWER
        if (!asPack) {
            const feePowBytes = new Int8Array([0]);
            feePowBytes[0] = this.feePow;
            data.set(feePowBytes);
            //console.log("Transaction5", { data });
        }
        //SIGNATURE
        if (withSign) {
            data.set(this.signature);
            //console.log("Transaction6",{ data, signature: this.signature });
        }
        
        return data.data;
    }

    //return : number
    calcBaseFee() {
        return this.calcCommonFee();
    }

    calcFee() {
        const fee = new BigDecimal(this.calcBaseFee())
            .setScale(8, BigDecimal.ROUND_UP);

        if (this.feePow > 0) {
            this.fee = fee
                .multiply(new BigDecimal(BlockChain.FEE_POW_BASE).pow(this.feePow))
                .setScale(8, BigDecimal.ROUND_UP);
        } else {
            this.fee = fee;
        }

    }

    //return : number
    calcCommonFee() {
        return this.getDataLength(false) * BlockChain.FEE_PER_BYTE;
    }


    //n: BigDecimal, 
    //dataWriter: DataWriter
    amountToBytes(n, dataWriter) {
        let bytes = new Int8Array([]);
        let diffScale = n.getScale() - Transaction.AMOUNT_DEFAULT_SCALE;
        if (diffScale !== 0) {
            const num = n.num * Math.pow(10, diffScale);
            if (diffScale < 0) {
                diffScale += Transaction.SCALE_MASK + 1; 
            }
            n = new BigDecimal(num);
        } 
        //console.log({ scale: n.getScale(), diffScale, value: n.unscaledValue() });
        bytes = Bytes.longToByteArray(n.unscaledValue());
        bytes = Bytes.ensureCapacity(bytes, Transaction.AMOUNT_LENGTH, 0);
        dataWriter.set(bytes);
    }
    
}

exports.Transaction = Transaction;

Transaction.ADDRESS_LENGTH = 25;
Transaction.CERTIFY_PUB_KEYS_TRANSACTION = 36;
Transaction.HASH_LENGTH = 32;
Transaction.SIGNATURE_LENGTH = 2 * Transaction.HASH_LENGTH;
Transaction.TIMESTAMP_LENGTH = 8;
Transaction.REFERENCE_LENGTH = Transaction.TIMESTAMP_LENGTH;
Transaction.ISSUE_PERSON_TRANSACTION = 24;
Transaction.ISSUE_ASSET_TRANSACTION = 21;
Transaction.SEND_ASSET_TRANSACTION = 31;
Transaction.ORDER_TRANSACTION = 50;
Transaction.ORDER_TRANSACTION_CANCEL = 51;
Transaction.KEY_LENGTH = 8;
Transaction.AMOUNT_DEFAULT_SCALE = 8;
Transaction.SCALE_MASK = 31;
Transaction.AMOUNT_LENGTH = 8;
Transaction.FEE_POWER_LENGTH = 1;
Transaction.TYPE_LENGTH = 4;
Transaction.PUBLIC_KEY_LENGTH = 32;
Transaction.CREATOR_LENGTH = Transaction.PUBLIC_KEY_LENGTH;
Transaction.BASE_LENGTH = Transaction.TYPE_LENGTH + Transaction.FEE_POWER_LENGTH + Transaction.REFERENCE_LENGTH + Transaction.TIMESTAMP_LENGTH + Transaction.CREATOR_LENGTH + Transaction.SIGNATURE_LENGTH;
Transaction.BASE_LENGTH_AS_PACK = Transaction.TYPE_LENGTH + Transaction.CREATOR_LENGTH + Transaction.SIGNATURE_LENGTH;
Transaction.IS_TEXT_LENGTH = 1;
Transaction.ENCRYPTED_LENGTH = 1;
Transaction.DATA_SIZE_LENGTH = 4;



