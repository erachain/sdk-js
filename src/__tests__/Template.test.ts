import { testTranRawTemplate } from '../core/api/TranTemplate';

describe('Template', () => {
  // const api = new EraChain.API('http://89.235.184.229:9067/api', 9066)
  const { EraChain } = require('erachain-js-api');
  const { KeyPair, PublicKeyAccount, Template } = EraChain.Type;
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

  const name = "Template 1234";
  const icon= new Int8Array(0);
  const image = new Int8Array(0);
  const description = "My template";

  const owner = new PublicKeyAccount(keyPair.publicKey);

  const template = new Template(owner, name, icon, image, description);

  it('Template.create', () => {
    expect(template.name).toEqual('Template 1234');
  });

  it('Template.parse', () => {
    return template.toBytes(false, false)
      .then((bytes: any) => {
        return Base58.encode(bytes)
          .then((b: any) => {
            return Template.parse(b)
              .then((i: any) => {
                expect(i.name).toEqual('Template 1234');
                expect(i.icon).toEqual(new Int8Array(0));
                expect(i.image).toEqual(new Int8Array(0));
                expect(i.description).toEqual('My template');
              });
          });
      })
      .catch(() => { expect(true).toBe(false); });
  });

  it('Template.raw', () => {
    const timestamp = 1594864181831;

    return testTranRawTemplate(
      keyPair, 
      timestamp,
      name,
      icon,
      image,
      description
    )
      .then((r: any) => {
        expect(r.raw).toEqual(
          '6UtCmTdALNtrgSs9DmwPSZSdYf6Woj7bLPKTNgHw1mb8KK5hsMUdW3yPfqrv876Hsavf6j9E4ZWRnCrX6j4DHqmY217ezhHzk2MjA9jrPLwnwYYTgPCBKz1Jmkm9Rss3QvndGx9hMvh2jSZ6RBa2iRx78eT5DpNWWAbZxGppTxiMvXYajszmqPdnxnkRGiJWan26Ak8Jfv4SW6pCP5a9GbFchvU319nwiLsd2KsgTCSMHhWrtjSKYZ9FXYd1aU',
        );
      }) 
      .catch(() => { expect(true).toBe(false); });
    
  });

});
