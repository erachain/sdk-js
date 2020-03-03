import {tranSend} from "./TranSend";
import {BroadcastRequest, IBroadcastResponse} from "../request/BroadcastRequest";
import {Base58} from "../crypt/libs/Base58";
import {Qora} from "../crypt/libs/Qora";
import {KeyPair} from "../src/core/account/KeyPair";
import { ITranRecipient, ITranAsset } from "../src/core/transaction/TranTypes";
import { BigDecimal } from "../src/BigDecimal";

export const sendAsset = async (url: string, keyPair: KeyPair, asset: IAsset, recipientPublicKey: string, head: string, message: string, encrypted: boolean, rpcPort: number): Promise<IBroadcastResponse> => {

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

    const request = new BroadcastRequest(url);

    const tranBody = {
        head,
        message,
        encrypted,
    } 

    const transAsset: ITranAsset = {
        assetKey: asset.assetKey,
        amount: new BigDecimal(asset.amount),
    }

    const tran = await tranSend(recipient, keyPair, transAsset, tranBody, rpcPort);
    
    if (!tran.error) {
        const data = request.broadcastPost(tran.raw)
                        .catch(e => {
                            throw new Error(e);
                        });
        return data;
    } else {
        throw new Error(tran.error);
    }

}


export interface IAsset {
    assetKey: number;
    amount: number;
  }

