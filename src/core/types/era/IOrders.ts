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
