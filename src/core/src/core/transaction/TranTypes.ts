import { BigDecimal } from "../../BigDecimal";

export interface ITranRecipient {
    address: string;
    publicKey: Int8Array | null;
}

export interface ITranAsset {
    assetKey: number;
    amount: BigDecimal | null;
}

export interface ITranMessage {
    head: string;
    message: string;
    encrypted: boolean;
}

export interface ITranRaw {
    raw: string;
    size: number;
    fee: number;
    error?: any;
}