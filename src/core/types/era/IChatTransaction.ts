export interface IChatTransaction {
  type_name: string;
  record_type: string;
  title: string;
  timestamp: number;
  creator: string;
  recipient: string;
  publickey: string;
  signature: string;
  message: string;
  encrypted: false;
  isText: boolean;
  fee: number;
  confirmations: number;
  property2: number;
  property1: number;
  height: number;
}
