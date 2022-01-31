import { AppCrypt } from '../core/crypt/AppCrypt';
import { Bytes } from '../core/src/core/Bytes';

describe('SHA256', () => {

  it('SHA256.Int8Array', () => {
    return Bytes.stringToByteArray('Здравствуй, EraChain API!')
     .then((t: any) => {
      const equal = AppCrypt.sha256(t);
      const result = AppCrypt.sha256big(t);
      expect(result).toEqual(equal);
     })
     .catch((e) => { expect(true).toBe(false); });
  });

  it('SHA256.Buffer', () => {
    const t = Buffer.from('Здравствуй, EraChain API!');

    const equal = AppCrypt.sha256(t);
    const result = AppCrypt.sha256big(t);

    expect(result).toEqual(equal);
  });

  it('SHA256.string', () => {
    const t = 'Здравствуй, EraChain API!';

    const equal = AppCrypt.sha256(t);
    const result = AppCrypt.sha256big(t);

    expect(result).toEqual(equal);
  });

});
