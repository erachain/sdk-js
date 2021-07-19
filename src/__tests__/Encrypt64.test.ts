import Base64 from '../core/src/core/util/base64';

const crypt = require('../core/crypt/libs/aesCrypt');

describe('Encrypt64', () => {

  it('EncryptMessage().DecryptMessage64()', () => {
    const s = 'Здравствуй, EraChain API!';
    const secret1 = '2RSehSu6szKbhEap46fhLN4s2BCfD1N2PLqbKnVWCbPvzF9JRBJs8sbQFqqaGLs4x4TZZV8hD5irs2RiT7gsGVjq';
    const public1 = '3jPhyhgqry3J95PHRLmH27UhKvn93y3x6Z748uv2vKoH';

    const public2 = '6jt933MGNLo8DFEtJX1HXsfu38h21PyWpBRstaNM1Q5q';
    const secret2 = 'kiAeqbBDqQ4Qa5X1hdpuWnzmX3GW3i9Bwk81VmNeFkXWhypZnxCYGnPDdTbbBFkgZHQkADowQhatRqYAT72nYrf';

    return crypt.encryptMessage(s, public2, secret1)
      .then((encrypted: any) => {
        const str = Base64.encodeFromByteArray(encrypted)
        return crypt.decryptMessage64(str, public1, secret2).then((decrypted: any) => {
          console.log({ input: s, output: decrypted });
          expect(decrypted).toEqual(s);
        });
      })
      .catch(() => { expect(true).toBe(false); });
  });
});
