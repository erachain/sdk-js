import {tranSend} from "./TranSend";
import {BroadcastRequest, IBroadcastResponse} from "../request/BroadcastRequest";
import {Base58} from "../crypt/libs/Base58";
import {Qora} from "../crypt/libs/Qora";
import {KeyPair} from "../src/core/account/KeyPair";
import { ITranRecipient, ITranAsset } from "../src/core/transaction/TranTypes";

export const sendAsset = async (url: string, keyPair: KeyPair, asset: ITranAsset, recipientPublicKey: string, head: string, message: string, encrypted: boolean, rpcPort: number): Promise<IBroadcastResponse> => {

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

    const tran = await tranSend(recipient, keyPair, asset, tranBody, rpcPort);
    
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

