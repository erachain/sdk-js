import { base64ToArray } from '../core/src/core/util/resizeImage';
import { Documents } from '../core/src/core/item/documents/Documents';
// import { Base58 } from '../core/crypt/libs/Base58';

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

    const encodedSecret= 'DQj9jDsuHsLcpYNZW3SSrhrQ73ca6XCJPWc3Yn3CoVvtmJemuzo9yZ5h88LyzndjFK';
    const encryptedData64 = "CYfw5jDTTwrsatOARYYpC480vd8mG/M3+Iq6+4PwU2E1dzFxZV+8KEH2RHnRkmxA00QM0rgzp7FGhMPdfNzrvbFdkS+75/RU2BrO50gnFgpGa6nmUZmstg525NTlGtB6hAouMunw5zj5itsEoarrTvvxjbZfLjoD1+L4eFbVbZW+pQAH+c2/v9/QZHGTjBzEOdg6dLDdSx10rKeALW3Dvw==";
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
                        expect(doc.json().MS).toEqual("Уникальный текст 10001");
                      });
                  });
              });
          });
      })
      .catch((e: any) => { expect(true).toBe(false); });
  })

/*
  it('From.sdk.raw', () => {

    const data64 = "AGAAABLQlNC+0LrRg9C80LXQvdGC0YsAAAABsDCHP0yVPVFQePz5L1L9taagBiYAMQGDotte5EYL7DAljTbj+Yk7WkTKp7hvOPIu9YV0XMOUx00mOdKUzadJYn14HZXtgHcxAYOi217kRgvsMCWNNuP5iTtaRMqnuG848i71hXRcw5THTSY50pTNp0lifXgdle2AdwH4xexJG/uTQSad9SONAMTkWB+/9Mo+mvI+C8xjSsCaafXWKBd0y3h7MnrbhcxI8mpGYTjGEpMaCG17Rj10HFS50EyQ6N0ZbP+MuDLW7Pc71lw0Oo5zZVbXMDeIcEOwkiiIPPG4BKcQMR+fE1iw970Cn3kGJV/Cy0LyF0+2cByu4I7obyfHN5BiXpN0iPwP+wFaGpZIX0LwHqOmyp00qYLP";
    const data58 = "15heupHmJ2UrFwzsroGJ7VAYYKa7ARmXaZjYvoiVvtisE79N88jrYxEYjYWbHRs8hmKBQp7224qwLu8tD9hGGcRe1mYL44WodN9RLg7mnGQfrju6ZMK2r7RRyjr1ATYHQmZXJ1B6eiMbBCaAKfmj8SEeYuVh7cipfEMXmmbTNcyAWh8XvbexEa72kKWKG9C6pytqsVWcox6QKefcanwCb6JWuCJyxnzUNTqzZwdvNFvvuAvGAkMCwMEbSW4ZVnfrrPzfChu2quThNpMMCRgSudUQoqMqjqJw6RqSeq83xrvYS1Hkow5R19Nxjd754Zmdt4dPVHiyRMPQbde7QnLkYaWv99XkmKuTJFKjbCeRw7UVM45DRMm2TRAVUHbv7rGndKBZNoyL3zUTnTa8oVvakgkBXRxbF8pUAxgmn6";

    const bytes = base64ToArray(data64);

    return Base58.encode(bytes)
      .then((base58: string) => {
        expect(data58).toEqual(base58);
      })
      .catch((e: any) => { expect(true).toBe(false); });

  })
*/

});
