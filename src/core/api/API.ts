import {FetchRequest} from "../request/FetchRequest";
import {IWalletHistoryRow} from "../request/ApiRecordsRequest";
import {tranSend} from "./TranSend";
import {IBroadcastResponse} from "../request/BroadcastRequest";
import {Base58} from "../crypt/libs/Base58";
import {Qora} from "../crypt/libs/Qora";
import {KeyPair} from "../src/core/account/KeyPair";
import { ITranRecipient, ITranAsset, ITranRaw } from "../src/core/transaction/TranTypes";
import { BigDecimal } from "../src/BigDecimal";
import {tranMessage} from "./TranMessage";
import {tranPerson} from "./TranPerson";
import {tranAsset} from "./TranAsset";
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
import {IEraBalance} from "../types/era/IEraBalanse";
import {IEraParams} from "../types/era/IEraParams";
import {IEraInfo} from "../types/era/IEraInfo";
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

/**
 * @type {Object} IAsset
 * @property {number}  assetKey Asset key ID.
 * @property {number}  amount Amount.
 */
export interface IAsset {
    assetKey: number;
    amount: number;
}

export class API {

    static TYPE_TRANSACTION: TypeTransaction;

    private request: FetchRequest;
    private rpcPort: number;
    private url: any;
    private genesis_sign: Int8Array;

    constructor(baseUrl: string, rpcPort: number) {
        this.request = new FetchRequest(baseUrl);
        this.rpcPort = rpcPort;
        this.genesis_sign = new Int8Array([]);
        this.url = url.parse(baseUrl);
    }

    get sidechainMode(): boolean {
        return Math.trunc(this.rpcPort / 10) === 905;
    }

    async genesisSignature(): Promise<Int8Array> {
        if (this.genesis_sign.length > 0) {
            return this.genesis_sign;
        }
        try {
            const block: IEraFirstBlock = await this.request.block.firstBlock();
            const sign = block.signatures[0];
            this.genesis_sign = await Base58.decode(sign);
        } catch (e) {
            this.genesis_sign = new Int8Array([]);
            console.log(e);
        }
        return this.genesis_sign;
    }

    // APIInterface
            
    async query(method: string, path: string, headers?: { [key: string]: string }, params?: { [key: string]: string }, body?: any): Promise<any> {
        path = path.trim();
        if (!path.startsWith("/")) {
            path = `/${path}`;
        }
        let strParams = "";
        if (params) {
            if (method === "post" || method === "POST") {
                body = JSON.stringify(params);
            } else {
                let sep = "?";
                for (const [key, value] of Object.entries(params)) {
                    if (strParams.length > 0) {
                        sep = "&";
                    }
                    strParams += `${sep}${key}=${encodeURIComponent(value)}`;
                }
            }
        }

        return fetch(`${this.url.protocol}//${this.url.host}${path}${strParams}`, { method, headers, body })
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

    async getInfo(): Promise<IEraInfo> {
        return await this.request.block.info();
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

    async blocksFromHeight(height: number, limit: number): Promise<{ blocks: IEraBlock[] }> {
        return await this.request.blocks.blocksFromHeight(height, limit);
    }

    async blockByHeight(height: number): Promise<IEraBlock> {
        return await this.request.block.blockByHeight(height);
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

    async find(args: IEraParams): Promise<IWalletHistoryRow[]> {
        return await this.request.records.find(args);
    }

    async tranBySeq(seqNo: string): Promise<IWalletHistoryRow> {
        return await this.request.records.getTransaction(seqNo);
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

    async getAllBalance(address: string): Promise<IEraBalance> {
        const data = await this.request.assets.addressassets(address)
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

    async getAssetImage(assetKey: number): Promise<any> {
        const data = await this.request.assets.assetimage(assetKey)
            .catch(e => {
                throw new Error(e);
            });
        return data;
    }

    async getAssetIcon(assetKey: number): Promise<any> {
        const data = await this.request.assets.asseticon(assetKey)
            .catch(e => {
                throw new Error(e);
            });
        return data;
    }

    async getAssetsByFilter(filter: string): Promise<IEraAsset[]> {
        return await this.request.assets.assetsfilter(filter);
    }

    async getTelegrams(address: string, fromTimestamp: number): Promise<ITelegramTransaction[]> {
        const data = await this.request.telegram.getfind(address, fromTimestamp)
                .catch(e => {
                    throw new Error(e);
                });
        return data;
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

    async getPersonImage(key: number): Promise<any> {
        return await this.request.person.getPersonImage(key);
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

    // SDK

    /** @description API send amount of asset to recipient.
     * @param {KeyPair} keyPair Key pair.
     * @param {IAsset} asset Amount and asset key.
     * @param {string} recipientPublicKey Recipient public key.
     * @param {string} head Title.
     * @param {string} message Message.
     * @param {boolean} encrypted Encryption flag.
     * @return {Promise<IBroadcastResponse>}
     */
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
    
        const genesis_sign = this.sidechainMode ? await this.genesisSignature() : new Int8Array([]);

        const tran = await tranSend(recipient, keyPair, transAsset, tranBody, this.rpcPort, genesis_sign);
        
        if (!tran.error) {
            const data = await this.request.broadcast.broadcastPost(tran.raw)
                            .catch(e => {
                                throw new Error(e);
                            });
            return data;
        } else {
            throw new Error(tran.error);
        }
    }

    /** @description API get transaction raw of person.
     * @param {KeyPair} keyPair Key pair.
     * @param {PersonHuman} person Person.
     * @return {Promise<ITranRaw>}
     */
    async tranRawPerson(keyPair: KeyPair, person: PersonHuman): Promise<ITranRaw> {
        const genesis_sign = this.sidechainMode ? await this.genesisSignature() : new Int8Array([]);

        return await tranPerson(keyPair, person, this.rpcPort, genesis_sign);
    }

    /** @description API register person.
     * @param {string} tranRaw Base58 string tran raw of person see tranRawPerson.
     * @return {Promise<IBroadcastResponse>}
     */
    async registerPerson(tranRaw: string): Promise<IBroadcastResponse> {
        return await this.request.broadcast.broadcastPost(tranRaw)
                        .catch(e => {
                            throw new Error(e);
                        });
    }

    /** @description API verify person.
     * @param {KeyPair} keyPair Key pair.
     * @param {number} personKey Person key ID.
     * @param {Int8Array} personPublicKey Person public key.
     * @return {Promise<IBroadcastResponse>}
     */
    async verifyPerson(keyPair: KeyPair, personKey: number, personPublicKey: Int8Array): Promise<IBroadcastResponse> {

        try {
            const address = await AppCrypt.getAddressBySecretKey(keyPair.secretKey);
            const reference = await this.request.address.lastReference(address);
            const genesis_sign = this.sidechainMode ? await this.genesisSignature() : new Int8Array([]);

            const tran = await tranVerifyPerson(keyPair, personKey, personPublicKey, reference, this.rpcPort, genesis_sign);
            if (!tran.error) {
                const data = await this.request.broadcast.broadcastPost(tran.raw)
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

    /** @description API send message.
     * @param {KeyPair} keyPair Key pair.
     * @param {string} recipientPublicKey Recipient public key.
     * @param {string} head Title.
     * @param {string} message Message.
     * @param {boolean} encrypted Encryption flag.
     * @return {Promise<IBroadcastResponse>}
     */
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

        const genesis_sign = this.sidechainMode ? await this.genesisSignature() : new Int8Array([]);
    
        const tran = await tranMessage(recipient, keyPair, tranBody, this.rpcPort, genesis_sign);
        
        if (!tran.error) {
            const data = await this.request.broadcast.broadcastPost(tran.raw)
                            .catch(e => {
                                throw new Error(e);
                            });
            return data;
        } else {
            throw new Error(tran.error);
        }
    }

    /** @description API send telegram.
     * @param {KeyPair} keyPair Key pair.
     * @param {string} recipientPublicKey Recipient public key.
     * @param {string} message Message.
     * @param {boolean} encrypted Encryption flag.
     * @return {Promise<IBroadcastResponse>}
     */
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

        const genesis_sign = this.sidechainMode ? await this.genesisSignature() : new Int8Array([]);
    
        const tran = await tranMessage(recipient, keyPair, tranBody, this.rpcPort, genesis_sign);
        
        if (!tran.error) {
            const data = await this.request.broadcast.telegramPost(tran.raw)
                            .catch(e => {
                                throw new Error(e);
                            });
            return data;
        } else {
            throw new Error(tran.error);
        }
    }

    /** @description API register asset.
     * @param {KeyPair} keyPair Key pair.
     * @param {string} name Asset name.
     * @param {number} assetType Asset type.
     * @param {number} quantity Quantity.
     * @param {number} scale Scale.
     * @param {Int8Array} icon Icon.
     * @param {Int8Array} image Image.
     * @param {string} description Description.
     * @return {Promise<IBroadcastResponse>}
     */
    async registerAsset(
        keyPair: KeyPair, 
        name: string,
        assetType: number,
        quantity: number,
        scale: number,
        icon: Int8Array,
        image: Int8Array,
        description: string
    ): Promise<IBroadcastResponse> {

        const genesis_sign = this.sidechainMode ? await this.genesisSignature() : new Int8Array([]);

        const tran = await tranAsset(
            keyPair,
            name,
            assetType,
            quantity,
            scale,
            icon,
            image,
            description,
            this.rpcPort,
            genesis_sign);
        
        if (!tran.error) {
            const data = await this.request.broadcast.broadcastPost(tran.raw)
                            .catch(e => {
                                throw new Error(e);
                            });
            return data;
        } else {
            throw new Error(tran.error);
        }
    }

}
