import { KeyPair } from '../core/src/core/account/KeyPair';
import { Asset } from '../core/src/core/item/assets/Asset';
import { PublicKeyAccount } from '../core/src/core/account/PublicKeyAccount';
import base64 from "../core/src/core/util/base64";
const fs = require('fs');


function mp4() {
  return new Promise<string>(function(resolve){
    const path = `${__dirname}/assets/test.mp4`;
    function read(p: string) {
        fs.readFile(p, "base64", function(err: Error, imagebuffer: string){
            if (err) throw err;
            resolve(imagebuffer);
        });
    }
    read(path);
  });
}

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
  const icon = new Int8Array([]);
  const description = '';

  const owner = new PublicKeyAccount(keyPair.publicKey);

  it('Asset.nft.links', async () => {

    return mp4()
      .then((base64Mp4: string) => {
        const image = base64.decodeToByteArray(base64Mp4);
        const asset = new Asset(owner, quantity, scale, assetType, name, icon, image, description, 0, 1);

        return asset.toBytes(false, false)
          .then(b => {
            const raw = base64.encodeFromByteArray(b);

            return Asset.parse(raw)
            .then(a => {
              console.log('test', {
                a: JSON.stringify(asset.appData),
                b: JSON.stringify(a.appData),
              });
              expect(JSON.stringify(asset.appData)).toBe(JSON.stringify(a.appData));
            });
          });
      })
      .catch(e => { 
        console.log(e);
        expect(true).toBe(false);
      });
  });
});
