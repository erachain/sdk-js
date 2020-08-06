const { EraChain } = require('erachain-js-api');
import { testTranPerson } from '../core/api/TranPerson';

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

  const date = new Date('1946-06-14T00:00:00');
  const birthday = date.getTime();

  console.log(birthday);

  const person = new EraChain.Type.PersonHuman(
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

  it('PersonHuman.raw', async () => {
    const raw = await person.raw(keyPair.secretKey);
    expect(raw).toEqual(
      'A4mLGRx7dLiBYeh96XFy5ahRG6TyHEXvfrcfrXzs8n1RfhfnTXUod3NepzWWJvUoWA5u1yRUcTPmr79Y39cnUGehbcbakkip7UYY1G83xj2ra1zhEeL7KSVvU21ZGnXiv7HE5JjGUnEDrt4cjfTMygELe9Hs5Bm4CvZN5sMUYV1vC7dxeZZ1n4XH5T4siWLo1F1xrCwxaTTz5xTc6zxSpti6ZbznPxLUo4gGQzaBnEZMJAvYRq98X9qjcAb5q555N4KDWHWaDjhXE6TUH9QHqfJffn56WG611odi6qVmigWnXPQom',
    );
  });

  it('PersonHuman.parse', async () => {
    const raw = await person.raw(keyPair.secretKey);
    const p = await EraChain.Type.PersonHuman.parse(raw);

    expect(p.name).toEqual('Donald Trump');
    expect(p.birthday).toEqual(18446743330464352000); // отрицательный timestamp
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

  it('PersonHuman.register', async () => {
    const raw = await person.raw(keyPair.secretKey);
    const p = await EraChain.Type.PersonHuman.parse(raw);
    const timestamp = 1594864181831;

    const tranRaw = await testTranPerson(keyPair, p, timestamp, 9066, new Int8Array([]));

    expect(tranRaw.size).toEqual(199);

    expect(tranRaw.raw).toEqual(
      '2YNgcLFSGeA1mRVxUGWhFbhoGnBR9AM8fPp3Y4RDWjn4gNQvLmLEFBojYte6Hu79fNwn3xQMPwSbECoybS6dUQocmAdHwECnZ7korzaj3KweL8fRXygp9Pm8GYPc7QaJnEQFYx7JK41h1QECgTmkNNh7Y3Bf8MSc6HwVkjjcQHDm12iBomTesARBWCW6aUu3KLNWJij4GvCcqvRbgniEoNcUCrGKmptTfy634PiChAyQxW9gh4Ryq7okZLoAVNYBs83ED384AWk6gVdimpGx6Ch3qv6FnsUsg19UwnTZjm4Q4tS5txTtS6Z2FpzSgQWqUkHkmwZjg9CtfsezZkedWkeBvbKtFBxGdkpNrcMYRhJ6LNPaW21iRq52m5xkZtNnRaeeJYauAj7YZaTxRpE8GjkPmGhM4jpthsv7uzDeaCyDLgAwzS7fXL22obgAnpGH68N79CGZvuK5zt394P',
    );
  });
});
