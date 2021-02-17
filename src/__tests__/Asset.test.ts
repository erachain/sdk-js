const { EraChain } = require('erachain-js-api');
import { tranAsset } from '../core/api/TranAsset';
import { ITranRaw } from '../core/src/core/transaction/TranTypes';

describe('Asset', () => {

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

  const keyPair = new EraChain.Type.KeyPair(keys);

  const name = 'TestAssetVenture';
  const assetType = 14; //Вексель 
  const quantity = 100;
  const scale = 2;
  const icon = new Int8Array([]);
  const image = new Int8Array([]);
  const description = '';
  const port = 9066;
  const genesis_sign = new Int8Array([]);

  it('Asset.venture.raw', async () => {
    return tranAsset(keyPair,
      name,
      assetType,
      quantity,
      scale,
      icon,
      image,
      description,
      port,
      genesis_sign
      )
      .then((r: ITranRaw) => {
        expect(r.size).toEqual(178);
      })
      .catch(() => { expect(true).toBe(false); });
  });
});
