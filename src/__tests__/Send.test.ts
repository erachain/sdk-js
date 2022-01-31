const { EraChain } = require('erachain-js-api');
import { API } from '../core/api/API';
import { ITranRaw } from '../core/src/core/transaction/TranTypes';

describe('Send', () => {

  const api = new API('http://localhost', 9066);

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
  const asset = { assetKey: 2, amount: 1 };
  const recipientPublicKeyOrAddress = "7K8eqCRon1NKxnWn9o7dfbkTkL9zNEKCzR";
  const head = 'head';
  const message = 'message';

  it('Send', async () => {
    return api.tranRawSendAsset(keyPair, asset, recipientPublicKeyOrAddress, head, message, false, true)
      .then((r: ITranRaw) => {
        expect(r.size).toEqual(176);
      })
      .catch(() => { expect(true).toBe(false); });
  });

  it('Send.debt', async () => {
    return api.tranRawDebt(keyPair, asset, recipientPublicKeyOrAddress, head, message, false, true)
      .then((r: ITranRaw) => {
        expect(r.size).toEqual(176);
      })
      .catch(() => { expect(true).toBe(false); });
  });

  it('Send.return.debt', async () => {
    return api.tranRawReturnDebt(keyPair, asset, recipientPublicKeyOrAddress, head, message, false, true)
      .then((r: ITranRaw) => {
        expect(r.size).toEqual(176);
      })
      .catch(() => { expect(true).toBe(false); });
  });

  it('Send.confiscate.debt', async () => {
    return api.tranRawConfiscateDebt(keyPair, asset, recipientPublicKeyOrAddress, head, message, false, true)
      .then((r: ITranRaw) => {
        expect(r.size).toEqual(176);
      })
      .catch(() => { expect(true).toBe(false); });
  });

  it('Send.take', async () => {
    return api.tranRawTake(keyPair, asset, recipientPublicKeyOrAddress, head, message, false, true)
      .then((r: ITranRaw) => {
        expect(r.size).toEqual(176);
      })
      .catch(() => { expect(true).toBe(false); });
  });

  it('Send.spend', async () => {
    return api.tranRawSpend(keyPair, asset, recipientPublicKeyOrAddress, head, message, false, true)
      .then((r: ITranRaw) => {
        expect(r.size).toEqual(176);
      })
      .catch(() => { expect(true).toBe(false); });
  });

  it('Send.pledge', async () => {
    return api.tranRawPledge(keyPair, asset, recipientPublicKeyOrAddress, head, message, false, true)
      .then((r: ITranRaw) => {
        expect(r.size).toEqual(176);
      })
      .catch(() => { expect(true).toBe(false); });
  });

  it('Send.return.pledge', async () => {
    return api.tranRawReturnPledge(keyPair, asset, recipientPublicKeyOrAddress, head, message, false, true)
      .then((r: ITranRaw) => {
        expect(r.size).toEqual(176);
      })
      .catch(() => { expect(true).toBe(false); });
  });
});
