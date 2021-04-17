import {Bytes} from "../Bytes";
import {DataWriter} from "../DataWriter";

export class AppData {
    static APP_DATA_LENGTH = 4;
    static FLAGS1_LENGTH = 2;
    static FLAGS2_LENGTH = 8;
    static ICON_TYPE_LENGTH = 1;
    static IMAGE_TYPE_LENGTH = 1;

    protected static BASE_LENGTH = AppData.FLAGS1_LENGTH + AppData.FLAGS2_LENGTH + AppData.ICON_TYPE_LENGTH + AppData.IMAGE_TYPE_LENGTH;

    flags1: Int8Array;
    flags2: number = 0;
    typeIcon: Int8Array;
    typeImage: Int8Array;

    constructor(typeIcon: Int8Array, typeImage: Int8Array, flag1?: Int8Array, flag2?: number) {
        this.flags1 = flag1 ? flag1.slice(0, 2) : new Int8Array([-128, 0]);
        this.flags2 = flag2 ? flag2 : 0;
        this.typeIcon = typeIcon.slice(0, 1);
        this.typeImage = typeImage.slice(0, 1);
    }

    getDataLength(): number {
        return AppData.BASE_LENGTH;
    }

    async toBytes(): Promise<Int8Array> {
        const data = new DataWriter();

        await this.lengthToBytes(data);
        data.set(this.flags1);

        await this.flag2ToBytes(data);

        data.set(this.typeIcon);
        data.set(this.typeImage);

        return data.data;
    }

    async flag2ToBytes(dataWriter: DataWriter): Promise<void> {
        const flagBytes = await Bytes.longToByteArray(this.flags2);
        const bytes = Bytes.ensureCapacity(flagBytes, AppData.FLAGS2_LENGTH, 0);
        dataWriter.set(bytes);
    }

    async lengthToBytes(dataWriter: DataWriter): Promise<void> {
        dataWriter.set(await Bytes.intToByteArray(AppData.BASE_LENGTH));
    }
}
