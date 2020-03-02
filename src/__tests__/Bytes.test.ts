import { Bytes } from '../core/src/core/Bytes';

describe('Bytes', () => {
  it('Bytes.intToByteArray().intFromByteArray()', () => {
    const i = -47;
    expect.assertions(1);
    Bytes.intToByteArray(i).then(af => {
      Bytes.intFromByteArray(af).then(r => {
        expect(r).toEqual(i);
      });
    });
  });

  it('Bytes.longToByteArray().longFromByteArray()', () => {
    const l = -(Number.MAX_SAFE_INTEGER - 1);
    Bytes.longToByteArray(l).then(af => {
      Bytes.longFromByteArray(af).then(r => {
        expect(r).toEqual(l);
      });
    });
  });

  it('Bytes.floatToByteArray().floatFromByteArray()', () => {
    const f = -521.736;
    Bytes.floatToByteArray(f).then(af => {
      Bytes.floatFromByteArray(af).then(r => {
        expect(r).toEqual(f);
      });
    });
  });

  it('Bytes.stringToByteArray().stringFromByteArray()', () => {
    const s = 'Здравствуй, EraChain API!';
    Bytes.stringToByteArray(s).then(af => {
      Bytes.stringFromByteArray(af).then(r => {
        expect(r).toEqual(s);
      });
    });
  });
});
