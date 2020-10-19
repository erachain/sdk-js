export interface IAuthors {
    type: number; // byte
    flags: number; // byte
    value_1: number; // byte
    value_2: number; // byte
    link: number; // long
}

export class Authors implements IAuthors {

    public static TYPE_NONE = 0;
    public static TYPE_APPENDIX = 1;
    public static TYPE_REPLY_COMMENT = 2;
    public static TYPE_SURELY = 3;

    type: number; // byte
    flags: number; // byte
    value_1: number; // byte
    value_2: number; // byte
    link: number; // long

    constructor(type: number, seqNo: string, flags: number = 0, value1: number = 0, value2: number = 0) {
        this.type = type;
        this.flags = flags ? flags : 0;
        this.value_1 = value1 ? value1 : 0;
        this.value_2 = value2 ? value2 : 0;
        const s = seqNo.split('-');
        if (s.length === 2 && !isNaN(Number(s[0])) && !isNaN(Number(s[1]))) {
            const seq = Number(s[0]);
            const no = Number(s[1]);
            this.link = (seq << 4) | (no & 0xFFFFFFFF);
        } else {
            throw new Error('Error format SeqNo');
        }
    }
}