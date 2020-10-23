import { Bytes } from '../core/src/core/Bytes';

describe('Bytes', () => {
  it('Bytes.intToByteArray().intFromByteArray()', () => {
    const i = 47;
    expect.assertions(1);
    return Bytes.intToByteArray(i)
      .then(af => {
        return Bytes.intFromByteArray(af)
          .then(r => {
            expect(r).toEqual(i);
          });
      })
      .catch(() => { expect(true).toBe(false); });
  });

  it('Bytes.longToByteArray().longFromByteArray()', () => {
    const l = Number.MAX_SAFE_INTEGER - 1;
    return Bytes.longToByteArray(l)
      .then(af => {
        return Bytes.longFromByteArray(af)
          .then(r => {
            expect(r).toEqual(l);
          });
      })
      .catch(() => { expect(true).toBe(false); });
  });

  it('Bytes.floatToByteArray().floatFromByteArray()', () => {
    const f = 521.75;
    return Bytes.floatToByteArray(f)
      .then(af => {
        return Bytes.floatFromByteArray(af)
          .then(r => {
            expect(r).toEqual(f);
          });
      })
      .catch(() => { expect(true).toBe(false); });
  });

  it('Bytes.stringToByteArray().stringFromByteArray()', () => {
    const s = 'Здравствуй, EraChain API!';
    return Bytes.stringToByteArray(s)
      .then(af => {
        return Bytes.stringFromByteArray(af)
          .then(r => {
            expect(r).toEqual(s);
          });
      })
      .catch(() => { expect(true).toBe(false); });
  });
});
