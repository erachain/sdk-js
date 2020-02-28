import {Transaction} from "./Transaction";
import {DataWriter} from "../DataWriter";
import {Bytes} from "../Bytes";
import {BigDecimal} from "../../BigDecimal";
import {PrivateKeyAccount} from "../account/PrivateKeyAccount";

export class TransactionOrder extends Transaction {

    protected static BASE_LENGTH = Transaction.BASE_LENGTH;
    static KEY_LENGTH = Transaction.KEY_LENGTH;

    private haveAssetKey: number;
    private wantAssetKey: number;
    private haveAmount: number;
    private wantAmount: number;

    constructor(name: string, creator: PrivateKeyAccount, feePow: number, timestamp: number, reference: number, haveAssetKey: number, wantAssetKey: number, haveAmount: number, wantAmount: number, port: number) {
        
        super(new Int8Array([Transaction.ORDER_TRANSACTION, 0, Transaction.diffScale(haveAmount), Transaction.diffScale(wantAmount)]), name, creator, feePow, timestamp, reference, port);

        this.haveAssetKey = haveAssetKey;
        this.wantAssetKey = wantAssetKey;
        this.haveAmount = haveAmount;
        this.wantAmount = wantAmount;
    }

    async toBytes(withSign: boolean, releaserReference: number | null): Promise<Int8Array> {

        const data = new DataWriter();
        data.set(await super.toBytes(withSign, releaserReference));

        await this.keyToBytes(this.haveAssetKey, data);
        await this.keyToBytes(this.wantAssetKey, data);
        await this.amountToBytes(new BigDecimal(this.haveAmount), data);
        await this.amountToBytes(new BigDecimal(this.wantAmount), data);

        return data.data;
    }

    async keyToBytes(n: number, dataWriter: DataWriter): Promise<void> {
        let bytes = await Bytes.longToByteArray(n);
        bytes = Bytes.ensureCapacity(bytes, TransactionOrder.KEY_LENGTH, 0);
        dataWriter.set(bytes);
    }

    async getDataLength(includeReference: boolean): Promise<number> {
        return TransactionOrder.BASE_LENGTH
            + TransactionOrder.KEY_LENGTH
            + TransactionOrder.KEY_LENGTH
            + TransactionOrder.AMOUNT_LENGTH
            + TransactionOrder.AMOUNT_LENGTH;
    }

}
