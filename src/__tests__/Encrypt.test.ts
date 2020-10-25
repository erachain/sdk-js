import { Base58 } from '../core/crypt/libs/Base58';
import { AppCrypt } from '../core/crypt/AppCrypt';

const crypt = require('../core/crypt/libs/aesCrypt');

describe('Encrypt', () => {

  it('EncryptMessage().DecryptMessage()', () => {
    const s = 'Здравствуй, EraChain API!';
    const secret1 = '2RSehSu6szKbhEap46fhLN4s2BCfD1N2PLqbKnVWCbPvzF9JRBJs8sbQFqqaGLs4x4TZZV8hD5irs2RiT7gsGVjq';
    const public1 = '3jPhyhgqry3J95PHRLmH27UhKvn93y3x6Z748uv2vKoH';

    const public2 = '6jt933MGNLo8DFEtJX1HXsfu38h21PyWpBRstaNM1Q5q';
    const secret2 = 'kiAeqbBDqQ4Qa5X1hdpuWnzmX3GW3i9Bwk81VmNeFkXWhypZnxCYGnPDdTbbBFkgZHQkADowQhatRqYAT72nYrf';

    return crypt.encryptMessage(s, public2, secret1)
      .then((encrypted: any) => {
        return Base58.encode(encrypted)
          .then((str: string) => {
            return crypt.decryptMessage(str, public1, secret2).then((decrypted: any) => {
              console.log({ input: s, output: decrypted });
              expect(decrypted).toEqual(s);
            });
          });
      })
      .catch(() => { expect(true).toBe(false); });
  });

  it('passwordAES.EncryptAES().DecryptAES()', () => {
    const s = {
      key: 99,
      msg: 'Здравствуй, EraChain API!'
    }

    const keyPair = AppCrypt.generateKeys();

    return crypt.passwordAES(keyPair.publicKey, keyPair.secretKey)
      .then((password: any) => {
        return crypt.wordsToBase58(password)
          .then((pwd: string) => {
            return crypt.encryptAES(JSON.stringify(s), pwd)
              .then((encrypted: Int8Array) => {
                return Base58.encode(encrypted)
                  .then((str: string) => {
                    return crypt.decryptAES(str, password)
                      .then((decrypted: any) => {
                        //console.log({ decrypted: crypt.wordsToUtf8(decrypted) });
                        const output = JSON.parse(crypt.wordsToUtf8(decrypted));
                        console.log({ input: s, output });
                        expect(output.key).toEqual(99);
                      });
                  });
              });
          });
      })
      .catch((e: any) => { console.log(e); expect(true).toBe(false); });
  });

  it('passwordAES.EncryptBytes().DecryptAES()', () => {
    
    const keyPair = AppCrypt.generateKeys();

    const message = new Int8Array([ -23, 10, 0, 24, 156, -205, -33, -2, -1, 100, 0, 0, 1, 5]);

    return crypt.passwordAES(keyPair.publicKey, keyPair.secretKey)
      .then((password: any) => {
          return crypt.encryptBytes(message, password)
            .then((encrypted: Int8Array) => {
              return Base58.encode(encrypted)
                .then((str: string) => {
                  return crypt.decryptAES(str, password)
                    .then((decrypted: any) => {
                      const output = new Int8Array(crypt.wordsToBytes(decrypted));
                      console.log({ output, message });
                      expect(output).toEqual(message);
                    });
                });
            });
      })
      .catch((e: any) => { console.log(e); expect(true).toBe(false); });
  });

});
