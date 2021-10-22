import { testTranRawImprint } from '../core/api/TranImprint';

describe('Imprint', () => {
  // 

  const { EraChain } = require('erachain-js-api');
  const { KeyPair, PublicKeyAccount, Imprint } = EraChain.Type;
  const { Base58 } = EraChain;

  const keys = {
    secretKey: new Int8Array([
      71,
      24,
      85,
      -57,
      50,
      -54,
      -29,
      -5,
      1,
      -105,
      106,
      46,
      69,
      58,
      -21,
      -126,
      -73,
      -23,
      47,
      -80,
      -27,
      -74,
      101,
      2,
      107,
      41,
      -65,
      66,
      -112,
      -27,
      28,
      123,
      40,
      -109,
      113,
      49,
      -34,
      113,
      -31,
      21,
      -112,
      51,
      112,
      -21,
      111,
      -117,
      -63,
      -126,
      -115,
      29,
      -39,
      39,
      109,
      93,
      21,
      77,
      38,
      50,
      75,
      56,
      112,
      -107,
      -83,
      -4,
    ]),
    publicKey: new Int8Array([
      40,
      -109,
      113,
      49,
      -34,
      113,
      -31,
      21,
      -112,
      51,
      112,
      -21,
      111,
      -117,
      -63,
      -126,
      -115,
      29,
      -39,
      39,
      109,
      93,
      21,
      77,
      38,
      50,
      75,
      56,
      112,
      -107,
      -83,
      -4,
    ]),
  };

  const keyPair = new KeyPair(keys);

  const name = "Imprint";
  const icon= new Int8Array(0);
  const image = new Int8Array(0);
  const description = "My imprint";

  const owner = new PublicKeyAccount(keyPair.publicKey);

  const imprint = new Imprint(owner, name, icon, image, description);

  it('Imprint.create', () => {
    expect(imprint.name).toEqual('Imprint');
  });

  it('Imprint.parse', () => {
    return imprint.toBytes(false, false)
      .then((bytes: any) => {
        return Base58.encode(bytes)
          .then((s: any) => {
            return Imprint.parse(s)
              .then((i: any) => {
                expect(i.name).toEqual('Imprint');
                expect(i.icon).toEqual(new Int8Array(0));
                expect(i.image).toEqual(new Int8Array(0));
                expect(i.description).toEqual('My imprint');
              });
          })
      })
      .catch(() => { expect(true).toBe(false); });
  });

  it('Imprint.raw', () => {
    const timestamp = 1594864181831;

    return testTranRawImprint(
      keyPair, 
      timestamp,
      ["1", "2", "3"],
      icon,
      image,
      description
    )
      .then((r: any) => {
        expect(r.raw).toEqual(
          'xgiDYWkm76SmaEyHqphGxiGYftR7b9XcxYf7qTDmzBwg9mBvVw5dUSfSMgkWRhkV7vDcQZJHKbo49kwGaL5JRqNsyXqcuM2HuPAzb5XXq7CGwniSKhF9s7LXcPToYxSbJRyAu95jrRbzaSUPBK2qpfGH8iJKThjejdKMTBgyMWevk81c6uH1N17hCyczyvZ9A27H5xf7JguWCXnvn1QzjZKXtvcLrjLgiQEUEgSejhvNE8Vssjwofn9Dr8kAt3rXuHEsLnuG5b5mdj9uNbKsiK',
        );
      })
      .catch(() => { expect(true).toBe(false); });

    
  });

});
