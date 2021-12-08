import { FetchRequest } from '../request/FetchRequest';
import { IWalletHistoryRow } from '../request/ApiRecordsRequest';
import { tranSend } from './TranSend';
import { IBroadcastResponse } from '../request/BroadcastRequest';
import { Base58 } from '../crypt/libs/Base58';
import { Qora } from '../crypt/libs/Qora';
import { KeyPair } from '../src/core/account/KeyPair';
import { ITranRecipient, ITranAsset, ITranRaw } from '../src/core/transaction/TranTypes';
import { BigDecimal } from '../src/BigDecimal';
import { tranMessage } from './TranMessage';
import { tranPerson } from './TranPerson';
import { tranAsset } from './TranAsset';
import { tranVerifyPerson } from './TranPersonVerify';
import { tranOrder } from './TranOrder';
import { tranCancelOrder } from './TranCancelOrder';
import { IEraBlock } from '../types/era/IEraBlock';
import { IEraFirstBlock } from '../types/era/IEraBlock';
import { ITelegramTransaction } from '../request/TelegramRequest';
import { IEraAsset } from '../types/era/IEraAsset';
import { IEraAssetData } from '../types/era/IEraAssetData';
import { IEraAssetsList } from '../types/era/IEraAssetsList';
import { PersonHuman } from '../src/core/item/persons/PersonHuman';
import { IEraPerson } from '../types/era/IEraPerson';
import { IEraPersonData } from '../types/era/IEraPersonData';
import { IEraBalance } from '../types/era/IEraBalanse';
import { IEraParams } from '../types/era/IEraParams';
import { IEraInfo } from '../types/era/IEraInfo';
import { IApiConfig, ChainMode } from '../types/era/IApiConfig';
import { IOrders, IPlayOrders } from '../types/era/IOrders';
import { IOrderComplete } from '../types/era/IOrderComplete';
import { ITrade } from '../types/era/ITrade';
import { ExData } from '../src/core/item/documents/ExData';
import { tranDocument } from './TranDocument';
import { tranSign } from './TranSign';
import { tranImprint } from './TranImprint';
import { tranTemplate } from './TranTemplate';
import { tranUpdateOrder } from './TranUpdateOrder';
import { ETransferType } from '../src/core/transaction/TranTypes';

const fetch = require('node-fetch');
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
  static CHAIN_MODE: ChainMode = ChainMode.DEFAULT; 

  private request: FetchRequest;
  private rpcPort: number;
  private url: any;
  private genesis_sign: Int8Array;
  private genesis: string | undefined;

  constructor(baseUrl: string, rpcPort: number, config?: IApiConfig) {
    this.request = new FetchRequest(baseUrl);
    this.rpcPort = rpcPort;
    this.genesis_sign = new Int8Array([]);
    this.url = url.parse(baseUrl);
    if (config) {
      API.CHAIN_MODE = config.mode;
      this.genesis = config.genesis;
    } else {
      this.setMode();
    }
  }

  private setMode(): void {
    API.CHAIN_MODE = ChainMode.DEFAULT;
    const part = Math.trunc(this.rpcPort / 10);
    if (part === 905 || part === 907) {
      API.CHAIN_MODE = ChainMode.SIDE;
    } else if (part === 909) {
      API.CHAIN_MODE = ChainMode.CLONE;
    }
  }

  set mode(mode: ChainMode) {
    if (mode === ChainMode.DEFAULT || mode === ChainMode.SIDE || mode === ChainMode.CLONE) {
      API.CHAIN_MODE = mode;
    } else {
      throw new Error(`Invalid mode. Expected either: ${ChainMode.DEFAULT}, ${ChainMode.SIDE}, ${ChainMode.CLONE}`);
    }
  }

  get mode(): ChainMode {
    return API.CHAIN_MODE;
  }

  get sidechainMode(): boolean {
    return API.CHAIN_MODE !== ChainMode.DEFAULT;
  }

  async genesisSignature(): Promise<Int8Array> {
    if (this.genesis_sign.length > 0) {
      return this.genesis_sign;
    }
    try {
      if (this.genesis) {
        this.genesis_sign = await Base58.decode(this.genesis);
  
        return this.genesis_sign;
      }
      const block: IEraFirstBlock = await this.request.block.firstBlock();
      const sign = block.signatures[0];
      this.genesis = sign;
      this.genesis_sign = await Base58.decode(sign);
    } catch (e) {
      this.genesis_sign = new Int8Array([]);
      throw new Error(`Genesis signature retrieval error: ${(e as Error).message}`);
    }
    return this.genesis_sign;
  }

  // APIInterface

  async query(
    method: string,
    path: string,
    headers?: { [key: string]: string },
    params?: { [key: string]: string },
    body?: any,
  ): Promise<any> {
    path = path.trim();
    if (!path.startsWith('/')) {
      path = `/${path}`;
    }
    let strParams = '';
    if (params) {
      if (method === 'post' || method === 'POST') {
        body = JSON.stringify(params);
      } else {
        let sep = '?';
        for (const [key, value] of Object.entries(params)) {
          if (strParams.length > 0) {
            sep = '&';
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

  async orderBook(wantAssetKey: number, haveAssetKey: number, limit?: number): Promise<IOrders> {
    return await this.request.exchange.orders(wantAssetKey, haveAssetKey, limit);
  }

  async lastTrade(wantAssetKey: number, haveAssetKey: number): Promise<ITrade[]> {
    return await this.request.exchange.lasttrade(wantAssetKey, haveAssetKey);
  }

  async playOrders(wantAssetKey: number, haveAssetKey: number): Promise<IPlayOrders> {
    return await this.request.exchange.playOrders(wantAssetKey, haveAssetKey);
  }

  async tradesAll(wantAssetKey: number, haveAssetKey: number, orderID?: string, limit?: number): Promise<ITrade[]> {
    return await this.request.exchange.tradesAll(wantAssetKey, haveAssetKey, orderID, limit);
  }

  async orderBySign(signature: string): Promise<IOrderComplete> {
    return await this.request.exchange.order(signature);
  }

  async getTransactions(
    address: string,
    heightOfBlock: number,
    offsetInBlock: number,
    pageSize: number,
  ): Promise<IWalletHistoryRow[]> {
    const data = await this.request.records.findAll(address, heightOfBlock, offsetInBlock, pageSize).catch(e => {
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

  async getAssetTransactions(
    address: string,
    assetKey: number,
    offset: number,
    pageSize: number,
    type: number,
  ): Promise<{ [id: string]: IWalletHistoryRow }> {
    const data = await this.request.records
      .getbyaddressfromtransactionlimit(address, assetKey, offset, offset + pageSize, type)
        .catch(e => {
          throw new Error(e);
        });
    return data;
  }

  async getAllAssets(): Promise<IEraAssetsList> {
    const data = await this.request.assets.assets().catch(e => {
      throw new Error(e);
    });
    return data;
  }

  async getAsset(assetKey: number): Promise<IEraAsset> {
    const data = await this.request.assets.asset(assetKey.toString()).catch(e => {
      throw new Error(e);
    });
    return data;
  }

  async getAllBalance(address: string): Promise<IEraBalance> {
    const data = await this.request.assets.addressassets(address).catch(e => {
      throw new Error(e);
    });
    return data;
  }

  async getBalance(address: string, assetKey: number): Promise<number> {
    const data = await this.request.assets.assetBalance(address, assetKey).catch(e => {
      throw new Error(e);
    });
    if (data && data.length > 0 && data[0] && data[0].length >= 2) {
      const num = data[0][1];
      if (!Number.isNaN(Number(num))) {
        return num;
      }
    }

    throw new Error('Balance error');
  }

  async getAssetData(assetKey: number): Promise<IEraAssetData> {
    const data = await this.request.assets.data(assetKey).catch(e => {
      throw new Error(e);
    });
    return data;
  }

  async getAssetImage(assetKey: number): Promise<any> {
    const data = await this.request.assets.assetimage(assetKey).catch(e => {
      throw new Error(e);
    });
    return data;
  }

  async getAssetIcon(assetKey: number): Promise<any> {
    const data = await this.request.assets.asseticon(assetKey).catch(e => {
      throw new Error(e);
    });
    return data;
  }

  async getAssetsByFilter(filter: string): Promise<IEraAsset[]> {
    return await this.request.assets.assetsfilter(filter);
  }

  async getTelegrams(address: string, fromTimestamp: number): Promise<ITelegramTransaction[]> {
    const data = await this.request.telegram.getfind(address, fromTimestamp).catch(e => {
      throw new Error(e);
    });
    return data;
  }

  async getPersonsByFilter(filter: string): Promise<IEraPerson[]> {
    const data = await this.request.person.personsfilter(filter).catch(e => {
      throw new Error(e);
    });
    return data;
  }

  async getPersonData(personKey: number): Promise<IEraPersonData> {
    const data = await this.request.person.persondata(personKey).catch(e => {
      throw new Error(e);
    });
    return data;
  }

  async getPersonImage(key: number): Promise<any> {
    return await this.request.person.getPersonImage(key);
  }

  async getPerson(personKey: number): Promise<IEraPerson> {
    const data = await this.request.person.person(personKey).catch(e => {
      throw new Error(e);
    });
    return data;
  }

  async getPersonByAddress(address: string): Promise<IEraPerson> {
    const data = await this.request.person.personbyaddress(address).catch(e => {
      throw new Error(e);
    });
    return data;
  }

  async getPersonByPublicKey(base58key: string): Promise<IEraPerson> {
    const data = await this.request.persons.personbypublickey(base58key).catch(e => {
      throw new Error(e);
    });
    return data;
  }

  // SDK

  /** @description API broadcast.
   * @param {string} raw Raw data.
   * @return {Promise<IBroadcastResponse>}
   */
  async broadcast(raw: string): Promise<IBroadcastResponse> {
      return await this.request.broadcast.broadcastPost(raw)
        .catch(e => {
          throw new Error(e);
        });
  }

  /** @description API broadcast.
   * @param {string} raw Base64 raw data.
   * @return {Promise<IBroadcastResponse>}
   */
   async broadcast64(raw: string): Promise<IBroadcastResponse> {
    return await this.request.broadcast.broadcastPost64(raw)
      .catch(e => {
        throw new Error(e);
      });
  }

  /** @description API send amount of asset to recipient.
   * @param {KeyPair} keyPair Key pair.
   * @param {IAsset} asset Amount and asset key.
   * @param {string} recipientPublicKey Recipient public key.
   * @param {string} head Title.
   * @param {string} message Message.
   * @param {boolean} encrypted Encryption flag.
   * @param {boolean} isBase64 Base64 encoding.
   * @return {Promise<IBroadcastResponse>}
   */
  async sendAsset(
    keyPair: KeyPair,
    asset: IAsset,
    recipientPublicKey: string,
    head: string,
    message: string,
    encrypted: boolean,
    isBase64?: boolean,
  ): Promise<IBroadcastResponse> {
    let recipient: ITranRecipient = {
      address: recipientPublicKey,
      publicKey: null,
    };

    if (recipientPublicKey.length >= 43) {
      const pk = await Base58.decode(recipientPublicKey);
      recipient = {
        address: await Qora.getAccountAddressFromPublicKey(pk),
        publicKey: pk,
      };
    }

    const tranBody = {
      head,
      message,
      encrypted,
    };

    const transAsset: ITranAsset = {
      assetKey: asset.assetKey,
      amount: new BigDecimal(asset.amount),
    };

    const genesis_sign = this.sidechainMode ? await this.genesisSignature() : new Int8Array([]);

    const tran = await tranSend(recipient, keyPair, transAsset, tranBody, this.rpcPort, genesis_sign, isBase64);

    if (!tran.error) {
      if (isBase64) {
        const data = await this.request.broadcast.broadcastPost64(tran.raw).catch(e => {
          throw new Error(e);
        });
        return data;
      } else {
        const data = await this.request.broadcast.broadcastPost(tran.raw).catch(e => {
          throw new Error(e);
        });
        return data; 
      }
    } else {
      throw new Error(tran.error);
    }
  }

  /** @description API gets raw send amount of asset to recipient.
   * @param {KeyPair} keyPair Key pair.
   * @param {IAsset} asset Amount and asset key.
   * @param {string} recipientPublicKey Recipient public key.
   * @param {string} head Title.
   * @param {string} message Message.
   * @param {boolean} encrypted Encryption flag.
   * @param {boolean} isBase64 Base64 encoding.
   * @param {ETransferType} transferType Transfer type.
   * @return {Promise<IBroadcastResponse>}
   */
  async tranRawSendAsset(
    keyPair: KeyPair,
    asset: IAsset,
    recipientPublicKey: string,
    head: string,
    message: string,
    encrypted: boolean,
    isBase64?: boolean,
    transferType: ETransferType = ETransferType.DEFAULT,
  ): Promise<ITranRaw> {
    let recipient: ITranRecipient = {
      address: recipientPublicKey,
      publicKey: null,
    };

    if (recipientPublicKey.length >= 43) {
      const pk = await Base58.decode(recipientPublicKey);
      recipient = {
        address: await Qora.getAccountAddressFromPublicKey(pk),
        publicKey: pk,
      };
    }

    const tranBody = {
      head,
      message,
      encrypted,
    };

    const transAsset: ITranAsset = {
      assetKey: asset.assetKey,
      amount: new BigDecimal(asset.amount),
    };

    const genesis_sign = this.sidechainMode ? await this.genesisSignature() : new Int8Array([]);

    return await tranSend(recipient, keyPair, transAsset, tranBody, this.rpcPort, genesis_sign, isBase64, transferType);
  }

  /** @description API get transaction raw of person.
   * @param {KeyPair} keyPair Key pair.
   * @param {PersonHuman} person Person.
   * @return {Promise<ITranRaw>}
   */
  async tranRawPerson(keyPair: KeyPair, person: PersonHuman, isBase64?: boolean): Promise<ITranRaw> {
    const genesis_sign = this.sidechainMode ? await this.genesisSignature() : new Int8Array([]);

    return await tranPerson(keyPair, person, this.rpcPort, genesis_sign, isBase64);
  }

  /** @description API get transaction raw of person with certification.
   * @param {KeyPair} keyPair Key pair.
   * @param {PersonHuman} person Person.
   * @return {Promise<ITranRaw>}
   */
    async tranRawPersonCertify(keyPair: KeyPair, person: PersonHuman, isBase64?: boolean): Promise<ITranRaw> {
    const genesis_sign = this.sidechainMode ? await this.genesisSignature() : new Int8Array([]);

    return await tranPerson(keyPair, person, this.rpcPort, genesis_sign, isBase64, true);
  }

  /** @description API verify person.
   * @param {KeyPair} keyPair Key pair.
   * @param {number} personKey Person key ID.
   * @param {Int8Array} personPublicKey Person public key.
   * @return {Promise<ITranRaw>}
   */
  async tranRawVerifyPerson(keyPair: KeyPair, personKey: number, personPublicKey: Int8Array, isBase64?: boolean): Promise<ITranRaw> {
    try {
      //const address = await AppCrypt.getAddressBySecretKey(keyPair.secretKey);
      const reference = 0;
      const genesis_sign = this.sidechainMode ? await this.genesisSignature() : new Int8Array([]);

      return await tranVerifyPerson(keyPair, personKey, personPublicKey, reference, this.rpcPort, genesis_sign, isBase64);

    } catch (e) {
      throw e;
    }
  }

  /** @description API verify person.
   * @param {KeyPair} keyPair Key pair.
   * @param {number} personKey Person key ID.
   * @param {Int8Array} personPublicKey Person public key.
   * @return {Promise<IBroadcastResponse>}
   */
  async verifyPerson(keyPair: KeyPair, personKey: number, personPublicKey: Int8Array, isBase64?: boolean): Promise<IBroadcastResponse> {
    try {
      //const address = await AppCrypt.getAddressBySecretKey(keyPair.secretKey);
      const reference = 0;
      const genesis_sign = this.sidechainMode ? await this.genesisSignature() : new Int8Array([]);

      const tran = await tranVerifyPerson(keyPair, personKey, personPublicKey, reference, this.rpcPort, genesis_sign, isBase64);
      if (!tran.error) {
        if (isBase64) {
          const data = await this.request.broadcast.broadcastPost64(tran.raw).catch(e => {
            throw new Error(e);
          });
          return data;
        } else {
          const data = await this.request.broadcast.broadcastPost(tran.raw).catch(e => {
            throw new Error(e);
          });
          return data;
        }
      } else {
        throw new Error(tran.error);
      }
    } catch (e) {
      throw e;
    }
  }

  /** @description API raw data for sending message.
   * @param {KeyPair} keyPair Key pair.
   * @param {string} recipientPublicKey Recipient public key.
   * @param {string} head Title.
   * @param {string} message Message.
   * @param {boolean} encrypted Encryption flag.
   * @return {Promise<ITranRaw>}
   */
  async tranRawMessage(
    keyPair: KeyPair,
    recipientPublicKey: string,
    head: string,
    message: string,
    encrypted: boolean,
    isBase64?: boolean
  ): Promise<ITranRaw> {
    let recipient: ITranRecipient = {
      address: recipientPublicKey,
      publicKey: null,
    };

    if (recipientPublicKey.length >= 43) {
      const pk = await Base58.decode(recipientPublicKey);
      recipient = {
        address: await Qora.getAccountAddressFromPublicKey(pk),
        publicKey: pk,
      };
    }

    const tranBody = {
      head,
      message,
      encrypted,
    };

    const genesis_sign = this.sidechainMode ? await this.genesisSignature() : new Int8Array([]);

    return await tranMessage(recipient, keyPair, tranBody, this.rpcPort, genesis_sign, isBase64);

  }

  /** @description API send message.
   * @param {KeyPair} keyPair Key pair.
   * @param {string} recipientPublicKey Recipient public key.
   * @param {string} head Title.
   * @param {string} message Message.
   * @param {boolean} encrypted Encryption flag.
   * @return {Promise<IBroadcastResponse>}
   */
  async sendMessage(
    keyPair: KeyPair,
    recipientPublicKey: string,
    head: string,
    message: string,
    encrypted: boolean,
    isBase64?: boolean,
  ): Promise<IBroadcastResponse> {
    let recipient: ITranRecipient = {
      address: recipientPublicKey,
      publicKey: null,
    };

    if (recipientPublicKey.length >= 43) {
      const pk = await Base58.decode(recipientPublicKey);
      recipient = {
        address: await Qora.getAccountAddressFromPublicKey(pk),
        publicKey: pk,
      };
    }

    const tranBody = {
      head,
      message,
      encrypted,
    };

    const genesis_sign = this.sidechainMode ? await this.genesisSignature() : new Int8Array([]);

    const tran = await tranMessage(recipient, keyPair, tranBody, this.rpcPort, genesis_sign, isBase64);

    if (!tran.error) {
      if (isBase64) {
        const data = await this.request.broadcast.broadcastPost64(tran.raw).catch(e => {
          throw new Error(e);
        });
        return data;
      } else {
        const data = await this.request.broadcast.broadcastPost(tran.raw).catch(e => {
          throw new Error(e);
        });
        return data;
      }
    } else {
      throw new Error(tran.error);
    }
  }

  /** @description API raw data for sending telegram.
   * @param {KeyPair} keyPair Key pair.
   * @param {string} recipientPublicKey Recipient public key.
   * @param {string} message Message.
   * @param {boolean} encrypted Encryption flag.
   * @return {Promise<ITranRaw>}
   */
  async tranRawTelegram(
    keyPair: KeyPair,
    recipientPublicKey: string,
    message: string,
    encrypted: boolean,
  ): Promise<ITranRaw> {
    let recipient: ITranRecipient = {
      address: recipientPublicKey,
      publicKey: null,
    };

    if (recipientPublicKey.length >= 43) {
      const pk = await Base58.decode(recipientPublicKey);
      recipient = {
        address: await Qora.getAccountAddressFromPublicKey(pk),
        publicKey: pk,
      };
    }

    const tranBody = {
      head: '',
      message,
      encrypted,
    };

    const genesis_sign = this.sidechainMode ? await this.genesisSignature() : new Int8Array([]);

    return await tranMessage(recipient, keyPair, tranBody, this.rpcPort, genesis_sign);

  }

  /** @description API send telegram.
   * @param {KeyPair} keyPair Key pair.
   * @param {string} recipientPublicKey Recipient public key.
   * @param {string} message Message.
   * @param {boolean} encrypted Encryption flag.
   * @return {Promise<IBroadcastResponse>}
   */
  async sendTelegram(
    keyPair: KeyPair,
    recipientPublicKey: string,
    message: string,
    encrypted: boolean,
  ): Promise<IBroadcastResponse> {
    let recipient: ITranRecipient = {
      address: recipientPublicKey,
      publicKey: null,
    };

    if (recipientPublicKey.length >= 43) {
      const pk = await Base58.decode(recipientPublicKey);
      recipient = {
        address: await Qora.getAccountAddressFromPublicKey(pk),
        publicKey: pk,
      };
    }

    const tranBody = {
      head: '',
      message,
      encrypted,
    };

    const genesis_sign = this.sidechainMode ? await this.genesisSignature() : new Int8Array([]);

    const tran = await tranMessage(recipient, keyPair, tranBody, this.rpcPort, genesis_sign);

    if (!tran.error) {
      const data = await this.request.broadcast.telegramPost(tran.raw).catch(e => {
        throw new Error(e);
      });
      return data;
    } else {
      throw new Error(tran.error);
    }
  }

  /** @description API raw data for registering asset.
   * @param {KeyPair} keyPair Key pair.
   * @param {string} name Asset name.
   * @param {number} assetType Asset type.
   * @param {number} quantity Quantity.
   * @param {number} scale Scale.
   * @param {Int8Array} icon Icon.
   * @param {Int8Array} image Image.
   * @param {string} description Description.
   * @return {Promise<ITranRaw>}
   */
  async tranRawAsset(
    keyPair: KeyPair,
    name: string,
    assetType: number,
    quantity: number,
    scale: number,
    icon: Int8Array,
    image: Int8Array,
    description: string,
    isBase64?: boolean,
    iconType?: number,
    imageType?: number,
  ): Promise<ITranRaw> {
    const genesis_sign = this.sidechainMode ? await this.genesisSignature() : new Int8Array([]);

    return await tranAsset(
      keyPair,
      name,
      assetType,
      quantity,
      scale,
      icon,
      image,
      description,
      this.rpcPort,
      genesis_sign,
      isBase64,
      iconType,
      imageType,
    );

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
    description: string,
    isBase64?: boolean,
    iconType?: number,
    imageType?: number,
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
      genesis_sign,
      isBase64,
      iconType,
      imageType,
    );

    if (!tran.error) {
      if (isBase64) {
        const data = await this.request.broadcast.broadcastPost64(tran.raw).catch(e => {
          throw new Error(e);
        });
        return data;
      } else {
        const data = await this.request.broadcast.broadcastPost(tran.raw).catch(e => {
          throw new Error(e);
        });
        return data;
      }
    } else {
      throw new Error(tran.error);
    }
  }

/** @description API send documents.
 * @param {KeyPair} keyPair Key pair.
 * @param {string} exData Metadata of documents.
 * @return {Promise<IBroadcastResponse>}
 */
  async sendDocuments(
    keyPair: KeyPair,
    exData: ExData,
    isBase64?: boolean,
  ): Promise<IBroadcastResponse> {

    const genesis_sign = this.sidechainMode ? await this.genesisSignature() : new Int8Array([]);

    const dataBytes = await exData.toBytes();

    const tran = await tranDocument(keyPair, dataBytes, this.rpcPort, genesis_sign, isBase64);

    if (!tran.error) {
      if (isBase64) {
        const data = await this.request.broadcast.broadcastPost64(tran.raw).catch(e => {
          throw new Error(e);
        });
        return data;
      } else {
        const data = await this.request.broadcast.broadcastPost(tran.raw).catch(e => {
          throw new Error(e);
        });
        return data;
      }
    } else {
      throw new Error(tran.error);
    }
  }

  /** @description API: gets raw of documents.
   * @param {KeyPair} keyPair Key pair.
   * @param {string} exData Metadata of documents.
   * @return {Promise<string>}
   */
  async tranRawDocuments(
    keyPair: KeyPair,
    exData: ExData,
    isBase64?: boolean,
  ): Promise<ITranRaw> {

    const genesis_sign = this.sidechainMode ? await this.genesisSignature() : new Int8Array([]);

    const dataBytes = await exData.toBytes();

    return await tranDocument(keyPair, dataBytes, this.rpcPort, genesis_sign, isBase64);
  }


  /** @description API: Sign other transaction.
   * @param {KeyPair} keyPair Key pair.
   * @param {string} seqNo String format - `Height of block-Number in block`.
   * @return {Promise<string>}
   */
  async tranRawSign(
    keyPair: KeyPair,
    seqNo: string,
    isBase64?: boolean,
  ): Promise<ITranRaw> {

    const genesis_sign = this.sidechainMode ? await this.genesisSignature() : new Int8Array([]);

    return await tranSign(keyPair, seqNo, this.rpcPort, genesis_sign, isBase64);
  }

/** @description API: Gets raw data for create a unique imprint.
 * @param {KeyPair} keyPair Key pair.
 * @param {string} name Imprint name.
 * @param {Int8Array} icon Icon.
 * @param {Int8Array} image Image.
 * @param {string} description Description.
 * @return {Promise<ITranRaw>}
 */
async tranRawImprint(
  keyPair: KeyPair,
  names: string[],
  icon: Int8Array,
  image: Int8Array,
  description: string,
  isBase64?: boolean,
): Promise<ITranRaw> {

    const genesis_sign = this.sidechainMode ? await this.genesisSignature() : new Int8Array([]);

    return await tranImprint(
      keyPair,
      names,
      icon,
      image,
      description,
      this.rpcPort,
      genesis_sign,
      isBase64,
    );
  }

/** @description API: Gets raw data for create a template.
 * @param {KeyPair} keyPair Key pair.
 * @param {string} name Template name.
 * @param {Int8Array} icon Icon.
 * @param {Int8Array} image Image.
 * @param {string} description Description.
 * @return {Promise<ITranRaw>}
 */
async tranRawTemplate(
  keyPair: KeyPair,
  name: string,
  icon: Int8Array,
  image: Int8Array,
  description: string,
  isBase64?: boolean,
): Promise<ITranRaw> {

    const genesis_sign = this.sidechainMode ? await this.genesisSignature() : new Int8Array([]);

    return await tranTemplate(
      keyPair,
      name,
      icon,
      image,
      description,
      this.rpcPort,
      genesis_sign,
      isBase64,
    );
  }

/** @description API: Gets raw data for create order.
 * @param {KeyPair} keyPair Key pair.
 * @param {string} name Name.
 * @param {number} haveAssetKey Asset key on hand.
 * @param {number} haveAmount Amount of assets at hand.
 * @param {number} wantAssetKey Want such an asset key.
 * @param {number} wantAmount Want amount assets.
 * @return {Promise<ITranRaw>}
 */
async tranRawOrder(
  keyPair: KeyPair,
  name: string,
  haveAssetKey: number,
  haveAmount: number,
  wantAssetKey: number,
  wantAmount: number,
  isBase64?: boolean,
): Promise<ITranRaw> {

    const genesis_sign = this.sidechainMode ? await this.genesisSignature() : new Int8Array([]);

    return await tranOrder(
      keyPair,
      name,
      haveAssetKey,
      haveAmount,
      wantAssetKey,
      wantAmount,
      this.rpcPort,
      genesis_sign,
      isBase64,
    );

  }

/** @description API: Gets raw data for cancel order.
 * @param {KeyPair} keyPair Key pair.
 * @param {string} name Name.
 * @param {string} signature Signature of order.
 * @return {Promise<ITranRaw>}
 */
async tranRawCancelOrder(
  keyPair: KeyPair,
  name: string,
  signature: string,
  isBase64?: boolean,
): Promise<ITranRaw> {

    const genesis_sign = this.sidechainMode ? await this.genesisSignature() : new Int8Array([]);

    return await tranCancelOrder(
      keyPair,
      name,
      signature,
      this.rpcPort,
      genesis_sign,
      isBase64,
    );
  }

/** @description API: Gets raw data for cancel order.
 * @param {KeyPair} keyPair Key pair.
 * @param {string} name Name.
 * @param {string} signature Signature of order.
 * @param {number} wantAmount Want amount assets.
 * @return {Promise<ITranRaw>}
 */
async tranRawUpdateOrder(
  keyPair: KeyPair,
  name: string,
  signature: string,
  wantAmount: number,
  isBase64?: boolean,
  forHave?: boolean,
): Promise<ITranRaw> {

    const genesis_sign = this.sidechainMode ? await this.genesisSignature() : new Int8Array([]);
    
    return await tranUpdateOrder(
      keyPair,
      name,
      signature,
      wantAmount,
      this.rpcPort,
      genesis_sign,
      isBase64,
      forHave,
    );
  }

  /** @description API gets raw transaction, send amount of asset to recipient to debt.
   * @param {KeyPair} keyPair Key pair.
   * @param {IAsset} asset Amount and asset key.
   * @param {string} recipientPublicKey Recipient public key.
   * @param {string} head Title.
   * @param {string} message Message.
   * @param {boolean} encrypted Encryption flag.
   * @param {boolean} isBase64 Base64 encoding.
   * @return {Promise<IBroadcastResponse>}
   */
   async tranRawDebt(
    keyPair: KeyPair,
    asset: IAsset,
    recipientPublicKey: string,
    head: string,
    message: string,
    encrypted: boolean,
    isBase64?: boolean,
  ): Promise<ITranRaw> {
    return await this.tranRawSendAsset(keyPair, asset, recipientPublicKey, head, message, encrypted, isBase64, ETransferType.DEBT);
  }

  /** @description API gets raw transaction, send amount of asset to recipient to return debt.
   * @param {KeyPair} keyPair Key pair.
   * @param {IAsset} asset Amount and asset key.
   * @param {string} recipientPublicKey Recipient public key.
   * @param {string} head Title.
   * @param {string} message Message.
   * @param {boolean} encrypted Encryption flag.
   * @param {boolean} isBase64 Base64 encoding.
   * @return {Promise<IBroadcastResponse>}
   */
    async tranRawReturnDebt(
      keyPair: KeyPair,
      asset: IAsset,
      recipientPublicKey: string,
      head: string,
      message: string,
      encrypted: boolean,
      isBase64?: boolean,
    ): Promise<ITranRaw> {
      return await this.tranRawSendAsset(keyPair, asset, recipientPublicKey, head, message, encrypted, isBase64, ETransferType.RETURN_DEBT);
    }

  /** @description API gets raw transaction, send amount of asset to recipient to confiscate debt.
   * @param {KeyPair} keyPair Key pair.
   * @param {IAsset} asset Amount and asset key.
   * @param {string} recipientPublicKey Recipient public key.
   * @param {string} head Title.
   * @param {string} message Message.
   * @param {boolean} encrypted Encryption flag.
   * @param {boolean} isBase64 Base64 encoding.
   * @return {Promise<IBroadcastResponse>}
   */
  async tranRawConfiscateDebt(
    keyPair: KeyPair,
    asset: IAsset,
    recipientPublicKey: string,
    head: string,
    message: string,
    encrypted: boolean,
    isBase64?: boolean,
  ): Promise<ITranRaw> {
    return await this.tranRawSendAsset(keyPair, asset, recipientPublicKey, head, message, encrypted, isBase64, ETransferType.CONFISCATE_DEBT);
  }

/** @description API gets raw transaction, send amount of asset to recipient to take.
 * @param {KeyPair} keyPair Key pair.
 * @param {IAsset} asset Amount and asset key.
 * @param {string} recipientPublicKey Recipient public key.
 * @param {string} head Title.
 * @param {string} message Message.
 * @param {boolean} encrypted Encryption flag.
 * @param {boolean} isBase64 Base64 encoding.
 * @return {Promise<IBroadcastResponse>}
 */
  async tranRawTake(
    keyPair: KeyPair,
    asset: IAsset,
    recipientPublicKey: string,
    head: string,
    message: string,
    encrypted: boolean,
    isBase64?: boolean,
  ): Promise<ITranRaw> {
    return await this.tranRawSendAsset(keyPair, asset, recipientPublicKey, head, message, encrypted, isBase64, ETransferType.TAKE);
  }

  /** @description API gets raw transaction, send amount of asset to recipient to spend.
   * @param {KeyPair} keyPair Key pair.
   * @param {IAsset} asset Amount and asset key.
   * @param {string} recipientPublicKey Recipient public key.
   * @param {string} head Title.
   * @param {string} message Message.
   * @param {boolean} encrypted Encryption flag.
   * @param {boolean} isBase64 Base64 encoding.
   * @return {Promise<IBroadcastResponse>}
   */
  async tranRawSpend(
    keyPair: KeyPair,
    asset: IAsset,
    recipientPublicKey: string,
    head: string,
    message: string,
    encrypted: boolean,
    isBase64?: boolean,
  ): Promise<ITranRaw> {
    return await this.tranRawSendAsset(keyPair, asset, recipientPublicKey, head, message, encrypted, isBase64, ETransferType.SPEND);
  }

  /** @description API gets raw transaction, send amount of asset to recipient to pledge.
   * @param {KeyPair} keyPair Key pair.
   * @param {IAsset} asset Amount and asset key.
   * @param {string} recipientPublicKey Recipient public key.
   * @param {string} head Title.
   * @param {string} message Message.
   * @param {boolean} encrypted Encryption flag.
   * @param {boolean} isBase64 Base64 encoding.
   * @return {Promise<IBroadcastResponse>}
   */
   async tranRawPledge(
    keyPair: KeyPair,
    asset: IAsset,
    recipientPublicKey: string,
    head: string,
    message: string,
    encrypted: boolean,
    isBase64?: boolean,
  ): Promise<ITranRaw> {
    return await this.tranRawSendAsset(keyPair, asset, recipientPublicKey, head, message, encrypted, isBase64, ETransferType.PLEDGE);
  }

  /** @description API gets raw transaction, send amount of asset to recipient to return pledge.
   * @param {KeyPair} keyPair Key pair.
   * @param {IAsset} asset Amount and asset key.
   * @param {string} recipientPublicKey Recipient public key.
   * @param {string} head Title.
   * @param {string} message Message.
   * @param {boolean} encrypted Encryption flag.
   * @param {boolean} isBase64 Base64 encoding.
   * @return {Promise<IBroadcastResponse>}
   */
   async tranRawReturnPledge(
    keyPair: KeyPair,
    asset: IAsset,
    recipientPublicKey: string,
    head: string,
    message: string,
    encrypted: boolean,
    isBase64?: boolean,
  ): Promise<ITranRaw> {
    return await this.tranRawSendAsset(keyPair, asset, recipientPublicKey, head, message, encrypted, isBase64, ETransferType.RETURN_PLEDGE);
  }
}
