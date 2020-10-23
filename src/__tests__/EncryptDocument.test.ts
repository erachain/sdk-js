import { base64ToArray } from '../core/src/core/util/resizeImage';
import { Documents } from '../core/src/core/item/documents/Documents';

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
            return crypt.decryptAES(encryptedData, decryptedSecret)
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
      .catch((e: any) => { expect(true).toBe(false); });
  })
  /*
  it('From.sdk.secret.and.data', () => {

    const encodedSecret= 'GYm6AX625RsCxaPWX3A7qkmP1RG73mSrdRyPMMPSbBBVFuMAV98VhXbogAz9TaN9Mj';
    const encryptedData64 = "AYSQr9KGIudI4NORtNr9UbOQVBOe1aMbQyrwWDTOWfLKnyXv7FliWhic4WaUCMpD4tb6R+Lm19wA6qEJrNXgBdahLxDml87rPNto7K3nEamtba5pzM/W9g6IlrJKsO6fzdYQqePYV+aIJjcUK6Hp/dKXvD/lr1e/K+mNRSURNt5h9k3p4cBRxz1AgSKiqc1l5YQceucKRhfOXz1wsteH9y+Ejh3xXx4V8g/viukJlr47ijQvZerV4nZWOzvYr4oGplxpJiPbwTXsBzaZOzMkJQE=";
    const creatorPublicKey = "gx2qCpJDbpurpSLotYZokfzi5VpUAbj6AhVbarkgLbX";


    const secret1 = '2RSehSu6szKbhEap46fhLN4s2BCfD1N2PLqbKnVWCbPvzF9JRBJs8sbQFqqaGLs4x4TZZV8hD5irs2RiT7gsGVjq';
    // const public1 = '3jPhyhgqry3J95PHRLmH27UhKvn93y3x6Z748uv2vKoH';

    // gets shared password
    return crypt.passwordAES(creatorPublicKey, secret1)
      .then((password: any) => {
        console.log({ password });
        // decripts secret for recipient
        return crypt.decryptAES(encodedSecret, password)
          .then((decryptedSecret: any) => {
            console.log({ decryptedSecret });
            const encryptedData = base64ToArray(encryptedData64);
            // decripts data with secret
            return crypt.decryptAES(encryptedData, decryptedSecret)
              .then((decryptedData: any) => {
                console.log({ decryptedData });
                // convert result to Base58
                return crypt.wordsToBase58(decryptedData)
                  .then((base58: string) => {
                    console.log({ base58 });
                    // parse document's json
                    return Documents.parse(base58)
                      .then((doc: any) => {
                        expect(doc.json().MS).toEqual("Уникальный текст 10001");
                      });
                  });
              });
          });
      })
      .catch((e: any) => { expect(true).toBe(false); });
  })
  */

});
