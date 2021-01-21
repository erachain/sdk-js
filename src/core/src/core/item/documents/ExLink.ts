import { Bytes } from '../../Bytes';

export interface IExLink {
    type: number; // byte
    flags: number; // byte
    value_1: number; // byte
    value_2: number; // byte
    link: number; // long
    memo?: string; // string 
}

export class ExLink implements IExLink {

    public static TYPE_NONE = 0;
    public static TYPE_APPENDIX = 1;
    public static TYPE_REPLY_COMMENT = 2;
    public static TYPE_SURELY = 5;
    public static TYPE_SOURCE = 6;
    public static TYPE_AUTHOR = 7;

    type: number; // byte
    flags: number; // byte
    value_1: number; // byte
    value_2: number; // byte
    link: number; // long
    memo: string | undefined;

    constructor(type: number, seqNo: string, flags: number = 0, value1: number = 0, value2: number = 0, memo: string | undefined) {
        this.type = type;
        this.flags = flags ? flags : 0;
        this.value_1 = value1 ? value1 : 0;
        this.value_2 = value2 ? value2 : 0;
        this.memo = memo ? memo : undefined;
        if (this.type === ExLink.TYPE_AUTHOR) {
            this.link = Number(seqNo);
            if (isNaN(this.link)) {
                throw new Error('ID Person not number');
            }
        } else {
            const s = seqNo.split('-');
            if (s.length === 2 && !isNaN(Number(s[0])) && !isNaN(Number(s[1]))) {
                const seq = Number(s[0]);
                const no = Number(s[1]);

                const aSeq = Bytes.syncIntToByteArray(seq);
                const aNo = Bytes.syncIntToByteArray(no);

                const aLink = new Int8Array([aSeq[0], aSeq[1], aSeq[2], aSeq[3], aNo[0], aNo[1], aNo[2], aNo[3]]);
                this.link = Bytes.syncLongFromByteArray(aLink);

                // console.log("test.exLink", {
                //     aSeq,
                //     aNo,
                //     aLink,
                //     link: this.link,
                // });
            } else {
                throw new Error('Error format SeqNo');
            }
        }
    }
}