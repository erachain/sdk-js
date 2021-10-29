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
          'A4mLGRx7dLiBYeh96XFy5ahRG6TyHEXvfrcfrXzs8n1RfhfnTXUod3NepzWWJvUoWA5u1yRUcTPmr79Y39cnUGehbcbakkip7UYY1G83xj2ra1zhEeL7PMt4aioxuGfmtQKCWPT7vwFAsyxVdJVRsZLWZR6WTziAR496C3vGoQzQpexC8exhNYb8ucqCzuRwW47hE5QgdUgXoJe2YipsoFHUf62w1pB4GBQoVUwtzT9UVMfquwFXmxfRiLWHjHHM5dhDRFKQAQL2QvWnHoZi5wzvQZBNeVzqcXEy952Xjv77HYdBX',
        );
      })
      .catch(() => { expect(true).toBe(false); });
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
            expect(p.birthday).toEqual(-740653200000); // отрицательный timestamp
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

  it('PersonHuman.parse64', () => {
    return person.raw64(keyPair.secretKey)
      .then((raw: string) => {
        return PersonHuman.parse(raw)
          .then((p: PersonHuman) => {
            //console.log({ person: p });
            expect(p.name).toEqual('Donald Trump');
            expect(p.birthday).toEqual(-740653200000); // отрицательный timestamp
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
                  '2YNgcLFSGeA1mRVxUGWhFbhoGnBLXs4j2Zy3fm3Bz1NHiYyXNt1ftKdsArQWZYFZAWWsqSWryDHuvRYANrCQNBQLmG6qYFdMtwqXZzTAmVfCA8cy62y8JMpHZgtTm5m5At7srBN7RE1j4ehRX565WUD8wFPdfKNcKXo9By9JgET53tptWqmbYSBe7SS19nTPzwfYKfioVhW3JBnbaQS4kpyCyPJZWHbnYJQbz5bnY8fR5uYs1KDFZEEtr9JUzgpCn9Uy6ofDZrBAUhDpAEYe23pF1YWUFUABkCsR9pz3tJVnxZ2kuYsPnQCY4kdesuMyvo9cee44MHpewXqqUNF4zn9D5b9gtjJwCdYcL6dun87bXoT4aAesuoY7nGkjswRSjrhLY2my5ybRAeSRr4eHJwPLPehkCYUwMxNMZRYqjegmj3Y1HpDAmu36D8C3qxYxopakwEPDBQykyiWA9X',
                );
              });
          });
      })
      .catch(() => { expect(true).toBe(false); });
    
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
                  'GAAAAAAAAXNVUCJHAAAAAAAAAAAok3Ex3nHhFZAzcOtvi8GCjR3ZJ21dFU0mMks4cJWt/ACmCZUFivMTiN6Is+HKH/cnjGokjkN2ctbKjgEkHBafp54EW3evhelJ4YHwwKQ9lgPJ49dunl/Krl7oL/G/H0wFAQEok3Ex3nHhFZAzcOtvi8GCjR3ZJ21dFU0mMks4cJWt/AxEb25hbGQgVHJ1bXAAAAAAAAAAAAAZ0J/RgNC10LfQuNC00LXQvdGCINCh0KjQkP///1ONoQ2AAAAAAAAAAAAACtCR0LXQu9GL0LlCXwX3QhZ4HQrQkdC10LvRi9C5DtCT0L7Qu9GD0LHQvtC5DtCR0LvQvtC90LTQuNC9vt2jjZwWZKujX2PCv5swXWsHchFhFXm2SmYyA5vQ0sLNAoEcVPwgmcg1fKdnnRxPD8IL/HN9Df9MhCmH+Gs8JQo=',
                );
              });
          });
      })
      .catch(() => { expect(true).toBe(false); });
    
  });
});
