import {CoreCrypto} from "../crypto/Crypto";
import {PublicKeyAccount} from "../account/PublicKeyAccount";
import {BlockChain} from "../BlockChain";
import {PrivateKeyAccount} from "../account/PrivateKeyAccount";
import {DataWriter} from "../DataWriter";
import {Bytes} from "../Bytes";
import {AppCrypt} from "../../../crypt/AppCrypt";
import {BigDecimal} from "../../BigDecimal";

export abstract class Transaction {
    public static CERTIFY_PUB_KEYS_TRANSACTION = 36;

    static SIGNATURE_LENGTH = CoreCrypto.SIGNATURE_LENGTH;

    static TIMESTAMP_LENGTH = 8;

    static REFERENCE_LENGTH = Transaction.TIMESTAMP_LENGTH;

    static ISSUE_PERSON_TRANSACTION = 24;

    static ISSUE_ASSET_TRANSACTION = 21;
    
    static SEND_ASSET_TRANSACTION = 31;

    static ORDER_TRANSACTION = 50;

    static ORDER_TRANSACTION_CANCEL = 51;

    static KEY_LENGTH = 8;

    static AMOUNT_DEFAULT_SCALE = 8;

    static SCALE_MASK = 31;

    static AMOUNT_LENGTH = 8;

    protected static FEE_POWER_LENGTH = 1;

    protected static TYPE_LENGTH = 4;

    protected static CREATOR_LENGTH = PublicKeyAccount.PUBLIC_KEY_LENGTH;

    protected static BASE_LENGTH = Transaction.TYPE_LENGTH + Transaction.FEE_POWER_LENGTH + Transaction.REFERENCE_LENGTH + Transaction.TIMESTAMP_LENGTH + Transaction.CREATOR_LENGTH + Transaction.SIGNATURE_LENGTH;

    protected static BASE_LENGTH_AS_PACK = Transaction.TYPE_LENGTH + Transaction.CREATOR_LENGTH + Transaction.SIGNATURE_LENGTH;

    protected static IS_TEXT_LENGTH = 1;

    protected static ENCRYPTED_LENGTH = 1;

    protected static DATA_SIZE_LENGTH = 4;

    protected typeBytes: Int8Array;

    protected feePow: number;

    protected signature: Int8Array;

    protected fee: BigDecimal;

    private creator: PrivateKeyAccount;

    private timestamp: number;

    private reference: number;

    private port: number;

    static diffScale(v: number) {
        const n = new BigDecimal(v);
        let diffScale = n.getScale() - Transaction.AMOUNT_DEFAULT_SCALE;
        if (diffScale !== 0) {
            if (diffScale < 0) {
                diffScale += Transaction.SCALE_MASK + 1; 
            }
        } 
        return diffScale;
    }

    constructor(typeBytes: Int8Array, typeName: string, creator: PrivateKeyAccount, feePow: number, timestamp: number, reference: number, port: number) {
        this.typeBytes = typeBytes;
        this.port = port;
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
    }

    get Signature(): Int8Array {
        return this.signature;
    }

    async sign(creator: PrivateKeyAccount, asPack: boolean): Promise<void> {
        // use this.reference in any case and for Pack too
        // but not with SIGN
        const data = new DataWriter();
        data.set(await this.toBytes(false, null));

        // all test a not valid for main test
        // all other network must be invalid here!
        //Если не ходят тразакции то возможно неверно указан порт. сейчас ок высчитывается при добавлении новой ноды как порт -1
        data.set(await Bytes.intToByteArray(this.port));
        this.signature = AppCrypt.sign(data.data, creator.getSecretKey());
        if (!asPack) {
            // need for recalc! if not as a pack
            await this.calcFee();
        }
    }

    async toBytes(withSign: boolean, releaserReference: number | null): Promise<Int8Array> {
        const asPack = releaserReference != null;
        //console.log("Transaction", { withSign, releaserReference, asPack });
        const data = new DataWriter();

        //WRITE TYPE
        data.set(this.typeBytes);
        //console.log("Transaction1", { data });

        if (!asPack) {
            //WRITE TIMESTAMP
            let timestampBytes = await Bytes.longToByteArray(this.timestamp);
            timestampBytes = Bytes.ensureCapacity(timestampBytes, Transaction.TIMESTAMP_LENGTH, 0);
            data.set(timestampBytes);
            //console.log("Transaction2", { data });
        }

        //WRITE REFERENCE - in any case as Pack or not
        if (this.reference != null) {
            // NULL in imprints
            let referenceBytes = await Bytes.longToByteArray(this.reference);
            referenceBytes = Bytes.ensureCapacity(referenceBytes, Transaction.REFERENCE_LENGTH, 0);
            data.set(referenceBytes);
            //console.log("Transaction3", { data });
        }

        //WRITE CREATOR
        data.set(await this.creator.getPublicKey().publicKey);
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

    async calcBaseFee(): Promise<number> {
        return this.calcCommonFee();
    }

    async calcFee(): Promise<void> {
        const fee = new BigDecimal(await this.calcBaseFee())
            .setScale(8, BigDecimal.ROUND_UP);

        if (this.feePow > 0) {
            this.fee = fee
                .multiply(new BigDecimal(BlockChain.FEE_POW_BASE).pow(this.feePow))
                .setScale(8, BigDecimal.ROUND_UP);
        } else {
            this.fee = fee;
        }
        //console.log({ fee: this.fee });
    }

    async calcCommonFee(): Promise<number> {
        return await this.getDataLength(false) * BlockChain.FEE_PER_BYTE;
    }

    abstract async getDataLength(asPack: boolean): Promise<number>;
    
    async amountToBytes(n: BigDecimal, dataWriter: DataWriter): Promise<void> {
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
        bytes = await Bytes.longToByteArray(n.unscaledValue());
        bytes = Bytes.ensureCapacity(bytes, Transaction.AMOUNT_LENGTH, 0);
        dataWriter.set(bytes);
    }

}
