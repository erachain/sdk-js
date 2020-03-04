import { KeyPair } from '../src/core/account/KeyPair';
import {IBroadcastResponse} from "../request/BroadcastRequest";
import {IWalletHistoryRow} from "../request/ApiRecordsRequest";
import {IEraBlock} from "../types/era/IEraBlock";
import {IEraFirstBlock} from "../types/era/IEraBlock";
import {ITelegramTransaction} from "../request/TelegramRequest";
import {IEraAsset} from "../types/era/IEraAsset";
import {IEraAssetData} from "../types/era/IEraAssetData";
import {IEraAssetsList} from "../types/era/IEraAssetsList";
import {PersonHuman} from '../src/core/item/persons/PersonHuman';
import {IEraPerson} from "../types/era/IEraPerson";
import {IEraPersonData} from "../types/era/IEraPersonData";

export interface IAsset {
  assetKey: number;
  amount: number;
}

export interface APIInterface {

  query(method: string, path: string, params?: { [key: string]: string }, body?: any): Promise<any>;

  height(): Promise<any>;

  firstBlock(): Promise<IEraFirstBlock>;

  lastBlock(): Promise<IEraBlock>;

  getLastReference(address: string): Promise<number>;

  getPublicKeyByAddress(address: string): Promise<string>;

  getTransactions(address: string, heightOfBlock: number, offsetInBlock: number, pageSize: number): Promise<IWalletHistoryRow[]>;

  getAssetTransactions(address: string, assetKey: number, offset: number, pageSize: number, type: number): Promise<{ [id: string]: IWalletHistoryRow }>;

  getAllAssets(): Promise<IEraAssetsList>

  getAsset(assetKey: number): Promise<IEraAsset>;

  getBalance(address: string, assetKey: number): Promise<number | null>;

  getAssetData(assetKey: number): Promise<IEraAssetData>;

  getAssetImage(assetKey: number): Promise<string | null>;

  getPersonsByFilter(filter: string): Promise<IEraPerson[]>;

  getPersonData(personKey: number): Promise<IEraPersonData>;
  
  getPerson(personKey: number): Promise<IEraPerson>;

  getPersonByAddress(address: string): Promise<IEraPerson>;

  getPersonByPublicKey(base58key: string): Promise<IEraPerson>;

  getTelegrams(address: string, fromTimestamp: number): Promise<ITelegramTransaction[]>;

  sendAsset(keyPair: KeyPair, asset: IAsset, recipientPublicKey: string, head: string, message: string, encrypted: boolean): Promise<IBroadcastResponse>;

  sendPerson(keyPair: KeyPair, person: PersonHuman): Promise<IBroadcastResponse>;

  verifyPerson(keyPair: KeyPair, personKey: number, personPublicKey: Int8Array,): Promise<IBroadcastResponse>;

  sendMessage(keyPair: KeyPair, recipientPublicKey: string, head: string, message: string, encrypted: boolean): Promise<IBroadcastResponse>;

  sendTelegram(keyPair: KeyPair, recipientPublicKey: string, message: string, encrypted: boolean): Promise<IBroadcastResponse>;
      
}