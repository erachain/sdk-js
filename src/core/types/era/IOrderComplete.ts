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
