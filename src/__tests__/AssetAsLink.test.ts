import { KeyPair } from '../core/src/core/account/KeyPair';
import { Bytes } from '../core/src/core/Bytes';
import { Asset } from '../core/src/core/item/assets/Asset';
import { PublicKeyAccount } from '../core/src/core/account/PublicKeyAccount';
import { Base58 } from '../core/crypt/libs/Base58';

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

  const keyPair = new KeyPair(keys.secretKey, keys.publicKey);

  const name = 'TestAssetVenture';
  const assetType = 65; //NFT
  const quantity = 1;
  const scale = 0;
  const iconURL = 'https://www.host.com/photo.jpg';
  const icon = Bytes.syncStringToByteArray(iconURL);
  const imageURL = 'https://www.host.com/video.mp4';
  const image = Bytes.syncStringToByteArray(imageURL);
  const description = '';

  const owner = new PublicKeyAccount(keyPair.publicKey);

  it('Asset.nft.links', async () => {
    const asset = new Asset(owner, quantity, scale, assetType, name, icon, image, description);

    return asset.toBytes(false, false)
      .then(b => {
        return Base58.encode(b)
          .then(raw => {
            console.log('raw', raw);
            return Asset.parse(raw)
              .then(a => {
                expect(JSON.stringify(asset.appData)).toBe(JSON.stringify(a.appData));
                expect(iconURL).toBe(Bytes.syncStringFromByteArray(a.icon));
                expect(imageURL).toBe(Bytes.syncStringFromByteArray(a.image));
              });
          });
      })
      .catch(e => { 
        console.log(e);
        expect(true).toBe(false);
      });
  });
});
