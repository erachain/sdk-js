import {Transaction} from "./Transaction";
import {DataWriter} from "../DataWriter";
import {PrivateKeyAccount} from "../account/PrivateKeyAccount";
import { Base58 } from "../../../crypt/libs/Base58";

export class CancelOrder extends Transaction {

    protected static BASE_LENGTH = Transaction.BASE_LENGTH;

    private signatureOrder: string;

    constructor(name: string, creator: PrivateKeyAccount, feePow: number, timestamp: number, reference: number, port: number, signatureOrder: string) {
        
        super(new Int8Array([Transaction.ORDER_TRANSACTION_CANCEL, 0, 0, 0]), name, creator, feePow, timestamp, reference, port);

        this.signatureOrder = signatureOrder;
    }

    async toBytes(withSign: boolean, releaserReference: number | null): Promise<Int8Array> {

        const data = new DataWriter();
        data.set(await super.toBytes(withSign, releaserReference));

        await this.signToBytes(data);

        return data.data;
    }

    async signToBytes(dataWriter: DataWriter): Promise<void> {
        const bytes = await Base58.decode(this.signatureOrder);
        dataWriter.set(bytes);
    }

    async getDataLength(includeReference: boolean): Promise<number> {
        return CancelOrder.BASE_LENGTH
            + Transaction.SIGNATURE_LENGTH;
    }

}
