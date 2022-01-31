export interface ITrade {
  wantKey: number;
  sequence: number;
  price: number;
  initiator: string;
  initiatorCreator: string;
  haveKey: number;
  amountWant: number;
  type: string;
  amountHave: number;
  target: string;
  targetCreator: string;
  height: number;
  timestamp: number;
  reversePrice: number;
}
