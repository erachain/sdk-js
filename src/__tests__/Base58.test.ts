import { Base58 } from '../core/crypt/libs/Base58';
import { Bytes } from '../core/src/core/Bytes';

describe('Base58', () => {
  it('Base58.encode().decode()', () => {
    const s = 'Здравствуй, EraChain API!';
    return Bytes.stringToByteArray(s)
      .then((a: any) => {
        return Base58.encode(a)
          .then((base58: any) => {
            return Base58.decode(base58)
              .then((a2: any) => {
                return Bytes.stringFromByteArray(a2)
                  .then((s2: any) => {
                    expect(s2).toEqual(s);
                  });
              });
          });
      })
      .catch(e => { expect(true).toBe(false); });
  });
});
