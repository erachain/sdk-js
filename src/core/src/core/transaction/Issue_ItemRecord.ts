import {Transaction} from "./Transaction";
import {ItemCls} from "../item/ItemCls";
import {PrivateKeyAccount} from "../account/PrivateKeyAccount";
import {DataWriter} from "../DataWriter";

export class Issue_ItemRecord extends Transaction {
    private item: ItemCls;

    public constructor(typeBytes: Int8Array, NAME_ID: string, creator: PrivateKeyAccount, item: ItemCls, feePow: number, timestamp: number, reference: number, port: number) {
        super(typeBytes, NAME_ID, creator, feePow, timestamp, reference, port);
        this.item = item;
    }

    async getDataLength(asPack: boolean): Promise<number> {
        // not include item reference
        //console.log({ base: Transaction.BASE_LENGTH, pack: Transaction.BASE_LENGTH_AS_PACK, length: await this.item.getDataLength(false) });
        if (asPack) {
            return Transaction.BASE_LENGTH_AS_PACK + await this.item.getDataLength(false);
        } else {
            return Transaction.BASE_LENGTH + await this.item.getDataLength(false);
        }
    }

    public async toBytes(withSign: boolean, releaserReference: number | null): Promise<Int8Array> {
        //console.log("Issue_ItemRecord", { withSign, releaserReference: releaserReference });
        const dataWriter = new DataWriter();
        
        dataWriter.set(await super.toBytes(withSign, releaserReference));
        //console.log("Issue_ItemRecord1",{ dataWriter });
        dataWriter.set(await this.item.toBytes(false, false));
        //console.log("Issue_ItemRecord2",{ dataWriter });

        return dataWriter.data;
    }
}
