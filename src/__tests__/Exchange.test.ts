import { EraChain } from '../index';
import { ITranRaw } from '../core/src/core/transaction/TranTypes';

describe('Exchange', () => {

  const url = "http://supernode1.foil.network:9077/api"; // 9067 - TestNET, 9047 - MainNET
  const rpcPort = 9076; // 9066 - TestNET, 9046 - MainNET

  const api = new EraChain.API(url, rpcPort, {
    mode: EraChain.Type.ChainMode.SIDE,
    genesis: '3xgkZi22KFKDGoxtQjcQrRzNQo4e6xFHTdmH8JF3uVh5fvjRz2qLW9Rj71JAMGsBY2Zy9MbpgJbjchHYX9N6MoaU',
  });

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

  const keyPair = new EraChain.Type.KeyPair(keys.secretKey, keys.publicKey);

  const name = 'UpdateOrder';
  const signature = "4kEF77wVazToPcf13u56SyfoZZQsRBFrcedwy8nr684egpofYpbphF7HcuWQ9s77Nx2DjzDbqCFe5MooVJ2ouzhN";

  const haveAssetKey = 2;
  const haveAmount = 0.05;
  const wantAssetKey = 1;
  const wantAmount = 10;

  it('Create.Order', async () => {
    return  api.tranRawOrder(
      keyPair,
      name,
      haveAssetKey,
      haveAmount,
      wantAssetKey,
      wantAmount,
      true
    )
      .then((r: ITranRaw) => {
        expect(r.size).toEqual(149);
      })
      .catch((e) => { expect(true).toBe(false); });
  });

  it('Update.Order', async () => {
    return api.tranRawUpdateOrder(keyPair,
      name,
      signature,
      wantAmount,
      true,
      )
      .then((r: ITranRaw) => {
        expect(r.size).toEqual(189);
      })
      .catch((e) => { expect(true).toBe(false); });
  });

  it('Cancel.Order', async () => {
    return api.tranRawCancelOrder(keyPair,
      name,
      signature,
      true,
      )
      .then((r: ITranRaw) => {
        expect(r.size).toEqual(181);
      })
      .catch((e) => { expect(true).toBe(false); });
  });
});
