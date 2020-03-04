import {FetchRequest} from "../request/FetchRequest";
import {APIInterface, IAsset} from "./APIInterface";
import {IWalletHistoryRow} from "../request/ApiRecordsRequest";
import {tranSend} from "./TranSend";
import {IBroadcastResponse} from "../request/BroadcastRequest";
import {Base58} from "../crypt/libs/Base58";
import {Qora} from "../crypt/libs/Qora";
import {KeyPair} from "../src/core/account/KeyPair";
import { ITranRecipient, ITranAsset } from "../src/core/transaction/TranTypes";
import { BigDecimal } from "../src/BigDecimal";
import {tranMessage} from "./TranMessage";
import {tranPerson} from "./TranPerson";
import {tranVerifyPerson} from "./TranPersonVerify";
import {IEraBlock} from "../types/era/IEraBlock";
import {IEraFirstBlock} from "../types/era/IEraBlock";
import {ITelegramTransaction} from "../request/TelegramRequest";
import {IEraAsset} from "../types/era/IEraAsset";
import {IEraAssetData} from "../types/era/IEraAssetData";
import {IEraAssetsList} from "../types/era/IEraAssetsList";
import {PersonHuman} from '../src/core/item/persons/PersonHuman';
import {IEraPerson} from "../types/era/IEraPerson";
import {IEraPersonData} from "../types/era/IEraPersonData";
import {AppCrypt} from "../crypt/AppCrypt";

const fetch = require("node-fetch");
const url = require('url');

enum TypeTransaction {
    SEND = 31,
    ORDER = 50,
    CANCEL_ORDER = 51,
    ASSET = 21,
    PERSON = 24,
    CALC = 100,
}

export class API implements APIInterface {

    static TYPE_TRANSACTION: TypeTransaction;

    private request: FetchRequest;
    private rpcPort: number;
    private url: any;

    constructor(baseUrl: string, rpcPort: number) {
        this.request = new FetchRequest(baseUrl);
        this.rpcPort = rpcPort;
        this.url = url.parse(baseUrl);
    }

    // APIInterface

    async query(method: string, path: string, params?: { [key: string]: string }, body?: any): Promise<any> {
        path = path.trim();
        if (!path.startsWith("/")) {
            path = `/${path}`;
        }
        let strParams = "";
        if (params) {
            let sep = "?";
            for (let [key, value] of Object.entries(params)) {
                if (strParams.length > 0) {
                    sep = "&";
                }
                strParams += `${sep}${key}=${value}`;
            }
        }
        return fetch(`${this.url.host}${path}${encodeURIComponent(strParams)}`, { method, body })
            .then((r: any) => {
                if (r.status < 200 || r.status >= 300) {
                    throw new Error(r.status.toString());
                }
                return r;
            })
            .catch((e: any) => {
                throw new Error(e);
            });
    }

    async height(): Promise<any> {
        return await this.request.block.height();
    }

    async firstBlock(): Promise<IEraFirstBlock> {
        return await this.request.block.firstBlock();
    }

    async lastBlock(): Promise<IEraBlock> {
        return await this.request.block.lastBlock();
    }

    async getLastReference(address: string): Promise<number> {
        return await this.request.address.lastReference(address);
    }

    async getPublicKeyByAddress(address: string): Promise<string> {
        return await this.request.address.addresspublickey(address);
    }

    async getTransactions(address: string, heightOfBlock: number, offsetInBlock: number, pageSize: number): Promise<IWalletHistoryRow[]> {
        const data = await this.request.records.findAll(address, heightOfBlock, offsetInBlock, pageSize)
                        .catch(e => {
                            throw new Error(e);
                        });
        return data;
    }

    async getAssetTransactions(address: string, assetKey: number, offset: number, pageSize: number, type: number): Promise<{ [id: string]: IWalletHistoryRow }> {
        const data = await this.request.records.getbyaddressfromtransactionlimit(address, assetKey, offset, offset + pageSize, type)
                        .catch(e => {
                            throw new Error(e);
                        });
        return data;
    }

    async getAllAssets(): Promise<IEraAssetsList> {
        const data = await this.request.assets.assets()
            .catch(e => {
                throw new Error(e);
            });
        return data;
    }

    async getAsset(assetKey: number): Promise<IEraAsset> {
        const data = await this.request.assets.asset(assetKey.toString())
            .catch(e => {
                throw new Error(e);
            });
        return data;
    }

    async getBalance(address: string, assetKey: number): Promise<number> {
        const data = await this.request.assets.assetBalance(address, assetKey)
                        .catch(e => {
                            throw new Error(e);
                        });
        if (
            data && 
            data.length > 0 &&
            data[0] &&
            data[0].length >= 2
        ) {
            const num = data[0][1];
            if (!Number.isNaN(Number(num))) {
                return num;
            }
        }     

        throw new Error("Balance error");
    }

    async getAssetData(assetKey: number): Promise<IEraAssetData> {
        const data = await this.request.assets.data(assetKey)
            .catch(e => {
                throw new Error(e);
            });
        return data;
    }

    async getAssetImage(assetKey: number): Promise<string | null> {
        const data = await this.request.assets.assetimage(assetKey)
            .catch(e => {
                throw new Error(e);
            });
        return data;
    }

    async getTelegrams(address: string, fromTimestamp: number): Promise<ITelegramTransaction[]> {
        const data = this.request.telegram.getfind(address, fromTimestamp)
                .catch(e => {
                    throw new Error(e);
                });
        return data;
    }

    async sendAsset(keyPair: KeyPair, asset: IAsset, recipientPublicKey: string, head: string, message: string, encrypted: boolean): Promise<IBroadcastResponse> {

        let recipient: ITranRecipient = { 
            address: recipientPublicKey,
            publicKey: null,
        }; 
    
        if (recipientPublicKey.length === 44) {
            const pk = await Base58.decode(recipientPublicKey);
            recipient = { 
                address: await Qora.getAccountAddressFromPublicKey(pk),
                publicKey: pk
            };   
        } 

        const tranBody = {
            head,
            message,
            encrypted,
        } 
    
        const transAsset: ITranAsset = {
            assetKey: asset.assetKey,
            amount: new BigDecimal(asset.amount),
        }
    
        const tran = await tranSend(recipient, keyPair, transAsset, tranBody, this.rpcPort);
        
        if (!tran.error) {
            const data = this.request.broadcast.broadcastPost(tran.raw)
                            .catch(e => {
                                throw new Error(e);
                            });
            return data;
        } else {
            throw new Error(tran.error);
        }
    }

    async sendPerson(keyPair: KeyPair, person: PersonHuman): Promise<IBroadcastResponse> {
        const tran = await tranPerson(keyPair, person, this.rpcPort);
        if (!tran.error) {
            const data = this.request.broadcast.broadcastPost(tran.raw)
                            .catch(e => {
                                throw new Error(e);
                            });
            return data;
        } else {
            throw new Error(tran.error);
        }
    }

    async verifyPerson(keyPair: KeyPair, personKey: number, personPublicKey: Int8Array,): Promise<IBroadcastResponse> {

        try {
            const address = await AppCrypt.getAddressBySecretKey(keyPair.secretKey);
            const reference = await this.request.address.lastReference(address);
            const tran = await tranVerifyPerson(keyPair, personKey, personPublicKey, reference, this.rpcPort);
            if (!tran.error) {
                const data = this.request.broadcast.broadcastPost(tran.raw)
                                .catch(e => {
                                    throw new Error(e);
                                });
                return data;
            } else {
                throw new Error(tran.error);
            }
        } catch(e) {
            throw new Error(e);
        }
        
    }

    async sendMessage(keyPair: KeyPair, recipientPublicKey: string, head: string, message: string, encrypted: boolean): Promise<IBroadcastResponse> {

        let recipient: ITranRecipient = { 
            address: recipientPublicKey,
            publicKey: null,
        }; 
    
        if (recipientPublicKey.length === 44) {
            const pk = await Base58.decode(recipientPublicKey);
            recipient = { 
                address: await Qora.getAccountAddressFromPublicKey(pk),
                publicKey: pk
            };   
        }

        const tranBody = {
            head,
            message,
            encrypted,
        } 
    
        const tran = await tranMessage(recipient, keyPair, tranBody, this.rpcPort);
        
        if (!tran.error) {
            const data = this.request.broadcast.broadcastPost(tran.raw)
                            .catch(e => {
                                throw new Error(e);
                            });
            return data;
        } else {
            throw new Error(tran.error);
        }
    }

    async sendTelegram(keyPair: KeyPair, recipientPublicKey: string, message: string, encrypted: boolean): Promise<IBroadcastResponse> {

        let recipient: ITranRecipient = { 
            address: recipientPublicKey,
            publicKey: null,
        }; 
    
        if (recipientPublicKey.length === 44) {
            const pk = await Base58.decode(recipientPublicKey);
            recipient = { 
                address: await Qora.getAccountAddressFromPublicKey(pk),
                publicKey: pk
            };   
        }

        const tranBody = {
            head: "",
            message,
            encrypted,
        } 
    
        const tran = await tranMessage(recipient, keyPair, tranBody, this.rpcPort);
        
        if (!tran.error) {
            const data = this.request.broadcast.telegramPost(tran.raw)
                            .catch(e => {
                                throw new Error(e);
                            });
            return data;
        } else {
            throw new Error(tran.error);
        }
    }

    async getPersonsByFilter(filter: string): Promise<IEraPerson[]> {
        const data = await this.request.person.personsfilter(filter)
            .catch(e => {
                throw new Error(e);
            });
        return data;
    }

    async getPersonData(personKey: number): Promise<IEraPersonData> {
        const data = await this.request.person.persondata(personKey)
            .catch(e => {
                throw new Error(e);
            });
        return data;
    }
    
    async getPerson(personKey: number): Promise<IEraPerson> {
        const data = await this.request.person.person(personKey)
            .catch(e => {
                throw new Error(e);
            });
        return data;
    }
  
    async getPersonByAddress(address: string): Promise<IEraPerson> {
        const data = await this.request.person.personbyaddress(address)
            .catch(e => {
                throw new Error(e);
            });
        return data;
    }

    async getPersonByPublicKey(base58key: string): Promise<IEraPerson> {
        const data = await this.request.persons.personbypublickey(base58key)
            .catch(e => {
                throw new Error(e);
            });
        return data;
    }

}
