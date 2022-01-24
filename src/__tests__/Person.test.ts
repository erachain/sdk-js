const { EraChain } = require('erachain-js-api');
import { testTranPerson } from '../core/api/TranPerson';
import { PersonHuman } from '../core/src/core/item/persons/PersonHuman';

describe('Person', () => {
  // const api = new EraChain.API('http://89.235.184.229:9067/api', 9066)

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

  const account = new EraChain.Type.PublicKeyAccount(keys.publicKey);

  const date = new Date(1946, 6, 14);
  const birthday = date.getTime();

  const person = new PersonHuman(
    account,
    'Donald Trump', // ФИО персоны
    birthday, // День рождения персоны
    0, // День смерти персоны
    0, // Пол персоны
    'Белый', // Раса персоны
    55.755826, // Широта места рождения
    37.6172999, // Долгота места рождения
    'Белый', // Цвет кожи персоны
    'Голубой', // Цвет глаз персоны
    'Блондин', // Цвет волос персоны
    190, // Рост персоны
    new Int8Array(0), // Иконка персоны
    new Int8Array(0), // Изображение персоны
    'Президент США', // Описание персоны
  );

  it('PersonHuman.create', () => {
    expect(person.name).toEqual('Donald Trump');
  });

  it('PersonHuman.raw', () => {
    return person.raw(keyPair.secretKey)
      .then((raw: string) => {
        expect(raw).toEqual(
          'A4mLGRx7dLiBYeh96XFy5ahRG6TyHEXvfrcfrXzs8n1RfhfnTXUod3NepzWWJvUoWA5u1yRUcTPmr79Y39cnUGehbcbakkip7UYY1G83xj2ra1zhEeL7PPmxrF7kXpoaK3BxxhNdpsTGAuf3U4nN3B3eNk5SuoW4Bd52C6uaayLhVdHCFAyNrPA33GcXXVTS68Nj2fBNcY5MRu89X18DLef2Fw3cxHei8perYqeAD63NT3Tc2c4GQU3fXiC8TbdMyRA1E7i8ic7gVCKBnStCcwNNdFdgfkMVRbX5gj29oGg8wDcFH',
        );
      })
      .catch(() => expect(true).toBe(false));
  });

  // birthday: 18446742830872672000,
  // deathday: 18446742830872672000,
  // birthday: 18446743330464352000,

  it('PersonHuman.parse58', () => {
    return person.raw(keyPair.secretKey)
      .then((raw: string) => {
        return PersonHuman.parse(raw)
          .then((p: PersonHuman) => {
            expect(p.name).toEqual('Donald Trump');
            expect(p.birthday).toEqual(birthday); // отрицательный timestamp
            expect(p.deathday).toEqual(0);
            expect(p.gender).toEqual(0);
            expect(p.race).toEqual('Белый');
            expect(p.birthLatitude).toBeLessThanOrEqual(55.755826);
            expect(p.birthLongitude).toBeLessThanOrEqual(37.6172999);
            expect(p.skinColor).toEqual('Белый');
            expect(p.eyeColor).toEqual('Голубой');
            expect(p.hairColor).toEqual('Блондин');
            expect(p.height).toEqual(190);
            expect(p.icon).toEqual(new Int8Array(0));
            expect(p.image).toEqual(new Int8Array(0));
            expect(p.description).toEqual('Президент США');
          });
      })
      .catch(() => {expect(true).toBe(false); });
  });

  it('PersonHuman.parse64', () => {
    return person.raw64(keyPair.secretKey)
      .then((raw: string) => {
        return PersonHuman.parse(raw)
          .then((p: PersonHuman) => {
            //console.log({ person: p });
            expect(p.name).toEqual('Donald Trump');
            expect(p.birthday).toEqual(birthday); // отрицательный timestamp
            expect(p.deathday).toEqual(0);
            expect(p.gender).toEqual(0);
            expect(p.race).toEqual('Белый');
            expect(p.birthLatitude).toBeLessThanOrEqual(55.755826);
            expect(p.birthLongitude).toBeLessThanOrEqual(37.6172999);
            expect(p.skinColor).toEqual('Белый');
            expect(p.eyeColor).toEqual('Голубой');
            expect(p.hairColor).toEqual('Блондин');
            expect(p.height).toEqual(190);
            expect(p.icon).toEqual(new Int8Array(0));
            expect(p.image).toEqual(new Int8Array(0));
            expect(p.description).toEqual('Президент США');
          });
      })
      .catch(() => { expect(true).toBe(false); });
  });


  it('PersonHuman.register', () => {
    return person.raw(keyPair.secretKey)
      .then((raw: string) => {
        return PersonHuman.parse(raw)
          .then((p: PersonHuman) => {
            const timestamp = 1594864181831;

            return testTranPerson(keyPair, p, timestamp, 9066, new Int8Array([]))
              .then((tranRaw: any) => {
                expect(tranRaw.size).toEqual(199);

                expect(tranRaw.raw).toEqual(
                  '2YNgcLFSGeA1mRVxUGWhFbhoGnBLXs4j2Zy3fm3Bz1NHiYyXNt1ftKdsArQWZYFZAWWsqSWrxwuLuZMAKe9Fh4UyqFTTwuUw92ogVhccnWRrp6wEtCGZA1VYu1X2dg21xpBFNGf6zRPSNboSZ8xDFMVnfya92AgHmgbsyVsNLzWUtKD7VyPgwYXr88q4T4e2nkcEFGRChZCM39gXVVtag9NQmy9UL2naNcTabaPRFFppLEWfFPy5rxE62eBXqQwgLGpcRJn57XPQkUWB9crrCUdMs4Jvur8fuTmfBAxJv9MEVVcuj8AGsGLitSQrffRSebEKZNNNrxxeDAcFG9kP9BrXsAfaEDj9cae2Bj6Se9bJETuy8PxUdn2VJvSdXwX6rwb6qEBHDG9zXroxVv7JUFFm6aSeNkRpWC8XVEAttm7K8a2gcxkq1jw4SYnGgwkaJN96oXthmNCzQiLiGw',
                );
              });
          });
      })
      .catch(() => {expect(true).toBe(false); });

  });

  it('PersonHuman.registerWithCertify', () => {
    return person.raw(keyPair.secretKey)
      .then((raw: string) => {
        return PersonHuman.parse(raw)
          .then((p: PersonHuman) => {
            const timestamp = 1594864181831;

            return testTranPerson(keyPair, p, timestamp, 9066, new Int8Array([]), true)
              .then((tranRaw: any) => {
                expect(tranRaw.size).toEqual(199);

                expect(tranRaw.raw).toEqual(
                  'GAAAAAAAAXNVUCJHAAAAAAAAAAAok3Ex3nHhFZAzcOtvi8GCjR3ZJ21dFU0mMks4cJWt/ACStmgcMD1ZpjvzJTCxm+PQNoZQdiivXD28Do6XaoPrN3RbQXgrbbyhU2JOXxZeg2u1/bzWMmLRzzNWdCOHy+YCAQEok3Ex3nHhFZAzcOtvi8GCjR3ZJ21dFU0mMks4cJWt/AxEb25hbGQgVHJ1bXAAAAAAAAAAAAAZ0J/RgNC10LfQuNC00LXQvdGCINCh0KjQkP///1OO6qSAAAAAAAAAAAAACtCR0LXQu9GL0LlCXwX3QhZ4HQrQkdC10LvRi9C5DtCT0L7Qu9GD0LHQvtC5DtCR0LvQvtC90LTQuNC9vt02D0aMBEPozjuxHfWEeSpSjI2ujYM8ZPCZ/fqrIVO6Q7Yp+HeDRsams1VNoqW9rnQM65G57lILP+F0J6aVtQg=',
                );
              });
          });
      })
      .catch(() => {expect(true).toBe(false); });

  });
});
