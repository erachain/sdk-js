import { Base58 } from '../core/crypt/libs/Base58';
import { AppCrypt } from '../core/crypt/AppCrypt';

const crypt = require('../core/crypt/libs/aesCrypt');

describe('Encrypt', () => {

  it('encode().decode()', () => {
    const s = 'Здравствуй, EraChain API!';
    const secret1 = '2RSehSu6szKbhEap46fhLN4s2BCfD1N2PLqbKnVWCbPvzF9JRBJs8sbQFqqaGLs4x4TZZV8hD5irs2RiT7gsGVjq';
    const public1 = '3jPhyhgqry3J95PHRLmH27UhKvn93y3x6Z748uv2vKoH';

    const public2 = '6jt933MGNLo8DFEtJX1HXsfu38h21PyWpBRstaNM1Q5q';
    const secret2 = 'kiAeqbBDqQ4Qa5X1hdpuWnzmX3GW3i9Bwk81VmNeFkXWhypZnxCYGnPDdTbbBFkgZHQkADowQhatRqYAT72nYrf';

    crypt.encryptMessage(s, public2, secret1).then((encrypted: any) => {
      Base58.encode(encrypted).then(str => {
        console.log('encryptMessage().Base58.encode(): ', str);
        crypt.decryptMessage(str, public1, secret2).then((decrypted: any) => {
          console.log({ input: s, output: decrypted });
          expect(decrypted).toEqual(s);
        });
      });
    });
  });

  it('Encode32().Decode32()', () => {
    const s = {
      key: 99,
      msg: 'Здравствуй, EraChain API!'
    }

    const keyPair = AppCrypt.generateKeys();

    crypt.getPassword(keyPair.publicKey, keyPair.secretKey)
      .then((pwd: Uint8Array) => {
        Base58.encode(new Int8Array(pwd))
          .then((password: string) => {
            crypt.encrypt32(JSON.stringify(s), password)
              .then((encrypted: Int8Array) => {
                Base58.encode(encrypted)
                  .then((str: string) => {
                    crypt.decrypt32(str, password)
                      .then((decrypted: string) => {
                        const output = JSON.parse(decrypted);
                        console.log({ input: s, output });
                        expect(output.key).toEqual(99);
                      })
                  })
              })
          })
      })
  });

});
