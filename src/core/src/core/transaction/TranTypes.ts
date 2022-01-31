import { BigDecimal } from '../../BigDecimal';

export enum ETransferType {
  DEFAULT, // передать в собственность
  DEBT, // выдать в долг
  RETURN_DEBT, // вернуть долг
  CONFISCATE_DEBT, // конфисковать долг
  TAKE, // принять на руки
  SPEND, // потратить
  PLEDGE, // передать в залог
  RETURN_PLEDGE // вернуть залог
}

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
