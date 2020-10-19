import { AppCrypt } from '../core/crypt/AppCrypt';
import { Bytes } from '../core/src/core/Bytes';

describe('SHA256', () => {

  it('SHA256.Int8Array', async () => {
    const t = await Bytes.stringToByteArray('Здравствуй, EraChain API!');

    const equal = AppCrypt.sha256(t);
    const result = AppCrypt.sha256big(t);
    expect(result).toEqual(equal);
  });

  it('SHA256.Buffer', async () => {
    const t = new Buffer('Здравствуй, EraChain API!');

    const equal = AppCrypt.sha256(t);
    const result = AppCrypt.sha256big(t);

    expect(result).toEqual(equal);
  });

  it('SHA256.string', async () => {
    const t = 'Здравствуй, EraChain API!';

    const equal = AppCrypt.sha256(t);
    const result = AppCrypt.sha256big(t);

    expect(result).toEqual(equal);
  });

});
