import { base64ToArray } from '../core/src/core/util/resizeImage';
import { Documents } from '../core/src/core/item/documents/Documents';
//import { Base58 } from '../core/crypt/libs/Base58';

const crypt = require('../core/crypt/libs/aesCrypt');

describe('Decrypt.document', () => {

  it('From.node.secret.and.data', () => {

    const encryptedData64 = "L/8u9umEHQ7brGBkOsrObvInnXbjk5dUbuQDEGjpBoY=";

    const encodedSecret = 'KEPWN6LKhgqaFWsct9eiDFTcrisFNNWwRLY3PxvV9uW9MGXcd6F73HhzPYvoLHfW28';
    const creatorPublicKey = "bnXr8gN6LdrhPFQHF7KzLt1LjjfeR1QSDYKLRyW42zA";

    const secret1 = '2RSehSu6szKbhEap46fhLN4s2BCfD1N2PLqbKnVWCbPvzF9JRBJs8sbQFqqaGLs4x4TZZV8hD5irs2RiT7gsGVjq';
    // const public1 = '3jPhyhgqry3J95PHRLmH27UhKvn93y3x6Z748uv2vKoH';

    // gets shared password
    return crypt.passwordAES(creatorPublicKey, secret1)
      .then((password: any) => {
        // decripts secret for recipient
        return crypt.decryptAES(encodedSecret, password)
          .then((decryptedSecret: any) => {
            const encryptedData = base64ToArray(encryptedData64);
            // decripts data with secret
            return crypt.decryptAES(encryptedData, decryptedSecret, false)
              .then((decryptedData: any) => {
                // convert result to Base58
                return crypt.wordsToBase58(decryptedData)
                  .then((base58: string) => {
                    // parse document's json
                    return Documents.parse(base58)
                      .then((doc: any) => {
                        expect(doc.json().MS).toEqual("1234567890 1");
                      });
                  });
              });
          });
      })
      .catch((e: any) => { console.log(e); expect(true).toBe(false); });
  })


  it('From.sdk.secret.and.data', () => {

    const encodedSecret= 'HftAxX2SgtKKPGUzSpZeTEWJ3TrQsundvv3vRWo7amnDRPaFiE2JJHunhFabofpvaw';
    const encryptedData64 = "PiK7ajH2g45Dr5kbe15c2Zb5BT1Gz/5O8rd8ryfwTEQp95O3Wa7CrzC9AzDKMTFNZ/Vi+9HkeY3Eyf6hoessXKz5MWc7hmSl9F/SrFQH4RudJtwL2a2HlhqVBdkVCl5vAXwxVz9J7tsZ35/evvRFJhUtSprMHnRyOaidFYDwjbEbKtBKka1KnH+j15LkPLAwioDMp3hCgrJFLy7mEFhipQ==";
    const creatorPublicKey = "3jPhyhgqry3J95PHRLmH27UhKvn93y3x6Z748uv2vKoH";

    const secret1 = '2RSehSu6szKbhEap46fhLN4s2BCfD1N2PLqbKnVWCbPvzF9JRBJs8sbQFqqaGLs4x4TZZV8hD5irs2RiT7gsGVjq';
    // const public1 = '3jPhyhgqry3J95PHRLmH27UhKvn93y3x6Z748uv2vKoH';

        // gets shared password
    return crypt.passwordAES(creatorPublicKey, secret1)
      .then((password: any) => {

        // decripts secret for recipient
        return crypt.decryptAES(encodedSecret, password)
          .then((decryptedSecret: any) => {

            const encryptedData = base64ToArray(encryptedData64);

            // decripts data with secret
            return crypt.decryptAES(encryptedData, decryptedSecret, false)
              .then((decryptedData: any) => {
                // convert result to Base58
                return crypt.wordsToBase58(decryptedData)
                  .then((base58: string) => {
                    // parse document's json
                    return Documents.parse(base58)
                      .then((doc: any) => {
                        expect(doc.json().MS).toEqual("Уникальный текст 10007");
                      });
                  });
              });
          });
      })
      .catch((e: any) => { expect(true).toBe(false); });
  })

/*
  it('From.sdk.raw', () => {

    const data64 = "AGAAABLQlNC+0LrRg9C80LXQvdGC0YsAAAABsDCHP0yVPVFQePz5L1L9taagBiYAMQFSSJVWHQ22EPAKsvZeVp6aN8IZXVcQTlzaUEdEP+eWIlfdsf+b2pU0D5GssFj2t7YxAVJIlVYdDbYQ8Aqy9l5Wnpo3whldVxBOXNpQR0Q/55YiV92x/5valTQPkaywWPa3tgmH8OYw008K7GrTgEWGKQuPNL3fJhvzN/iKuvuD8FNhNXcxcWVfvChB9kR50ZJsQNNEDNK4M6exRoTD3Xzc672xXZEvu+f0VNgazudIJxYKRmup5lGZrLYOduTU5RrQeoQKLjLp8Oc4+YrbBKGq60778Y22Xy46A9fi+HhW1W2VvqUAB/nNv7/f0GRxk4wcxDnYOnSw3UsddKyngC1tw78=";

    const bytes = base64ToArray(data64);

    return Base58.encode(bytes)
      .then((base58: string) => {
        Documents.parse(base58)
          .then((doc: any) => {
            console.log(doc.json());
            expect(doc.json().MS).toEqual("Уникальный текст 10001");
          });
      })
      .catch((e: any) => { expect(true).toBe(false); });

  })
*/

});
