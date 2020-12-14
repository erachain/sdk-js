# Assets types

```javascript

export interface IPlayOrders {
  wantPrice: number;
  havePrice: number;
  lastDir: string;
  vol24: number;
  lastAmount: number;
  lastPrice: number;
}

export interface IAPIOrder {
  id: number;
  creator: string;
  leftPrice: number;
  pairAmount: number;
  seqNo: string;
  leftPriceReverse: number;
  pairTotal: number;
  leftHave: number;
  amountHave: number;
  price: number;
  fulfilledHave: number;
  wantAssetKey: number;
  statusName: string;
  pairPrice: number;
  priceReverse: number;
  amountWant: number;
  haveAssetKey: number;
  status: number;
}

export interface IOrders {
  amountAssetKey: number;
  priceAssetKey: number;
  limited: number;
  want: IAPIOrder[];
  have: IAPIOrder[];
}

export interface IOrder {
  id: number;
  creator: string;
  amount: number;
  total: number;
  seqNo: string;
  price: number;
}

export interface IOrderComplete {
  id: number;
  canceled?: boolean;
  creator: string;
  leftPrice: number;
  seqNo: string;
  leftPriceReverse: number;
  leftHave: number;
  active: boolean;
  amountHave: number;
  price: number;
  fulfilledHave: number;
  wantAssetKey: number;
  statusName: string;
  priceReverse: number;
  amountWant: number;
  haveAssetKey: number;
  status: number;
}

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

```
