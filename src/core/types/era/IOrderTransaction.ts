export interface IOrderTransaction {
    wantKey: number;
    type_name: string;
    creator: string;
    signature: string;
    fee: number;
    publickey: string;
    haveKey: number;
    type: number;
    confirmations: number;
    amountHave: number;
    version: number;
    record_type: string;
    property2: number;
    property1: number;
    sequence: number;
    size: number;
    amountWant: number;
    sub_type_name: string;
    timestamp: number;
    height: number;
    status?: number;
}
