export interface IEraForgingStatus {
  code: number;
  name: string;
}

export interface IEraVersion {
  buildTimeStamp: number;
  buildDate: string;
  version: string;
}

export interface IEraSide {
  name: string;
  sign: string;
  timestamp: number;
}

export interface IEraLastBlock {
  creator: string;
  signature: string;
  fee: string;
  forgingValue: number;
  version: number;
  winValue: number;
  target: number;
  reference: string;
  emittedFee: number;
  winValueTargeted: number;
  transactionsCount: number;
  transactionsHash: string;
  timestamp: number;
  height: number;
}

export interface IEraInfo {
  networkMode: number;
  forgingStatus: IEraForgingStatus;
  side?: IEraSide;
  rpc: boolean;
  web: boolean;
  version: IEraVersion;
  status: string;
  height: number;
}
