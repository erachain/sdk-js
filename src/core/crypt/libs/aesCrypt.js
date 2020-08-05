import { scalarMult } from 'tweetnacl';
import { Base58 } from './Base58';
import SHA256 from './SHA256';
import { wordsToByteArray, prepareAfterDecrypt } from './convert';
import { Bytes } from '../../src/core/Bytes';

const ed2curve = require('./ed2curve');

const CryptoJS = require('crypto-js');

/** @description Gets share key.
 * @param {Int8Array | string} publicKey The radius of the circle.
 * @param {Int8Array | string} privateKey The radius of the circle.
 * @return {Promise<Uint8Array>}
 */
export const getPassword = async (publicKey, privateKey) => {
  const key = typeof publicKey === 'string' ? new Buffer(await Base58.decode(publicKey)) : new Buffer(publicKey);
  const secret = typeof privateKey === 'string' ? new Buffer(await Base58.decode(privateKey)) : new Buffer(privateKey);
  const theirDHPublicKey = ed2curve.convertPublicKey(key);
  const myDHSecretKey = ed2curve.convertSecretKey(secret);
  const password = SHA256.digest(scalarMult(myDHSecretKey, theirDHPublicKey));

  return password;
};

/** @description Encrypt text.
 * @param {string} message Text to encrypt.
 * @param {Int8Array | string} publicKey The radius of the circle.
 * @param {Int8Array | string} privateKey The radius of the circle.
 * @return {Promise<int8Array | boolean>}
 */
export const encryptMessage = async (message, publicKey, privateKey) => {
  try {
    const iv = CryptoJS.enc.Hex.parse('06040308010201020702030805070101');
    const password = await getPassword(publicKey, privateKey);
    
    const sharedKey = CryptoJS.lib.WordArray.create(password);
    const encrypted = CryptoJS.AES.encrypt(message, sharedKey, { iv });
    const int8Array0 = wordsToByteArray(encrypted.ciphertext);
    const int8Array = new Int8Array([0x01, ...int8Array0]);
    return int8Array;
  } catch (e) {
    console.log(e);
    return false;
  }
};

/** @description Decrypt text to json.
 * @param {string} encryptedMessage Encrypted text to decrypt.
 * @param {Int8Array | string} publicKey The radius of the circle.
 * @param {Int8Array | string} privateKey The radius of the circle.
 * @return {Promise<string>}
 */
export const decryptJson = async (encryptedMessage, publicKey, privateKey) => {
  try {
    const iv = CryptoJS.enc.Hex.parse('06040308010201020702030805070101');
    const password = await getPassword(publicKey, privateKey);
    const sharedKey = CryptoJS.lib.WordArray.create(password);

    const arrayMessage = await Base58.decode(encryptedMessage);
    const message = arrayMessage.slice(1);
    const words = CryptoJS.lib.WordArray.create(message);
    const decrypted = CryptoJS.AES.decrypt({ ciphertext: words }, sharedKey, { iv });
    const jsonString = await Bytes.stringFromByteArray(prepareAfterDecrypt(wordsToByteArray(decrypted)));
    return jsonString;
  } catch (e) {
    console.log(e);
    return false;
  }
};

/** @description Decrypt text.
 * @param {string} encryptedMessage Encrypted text to decrypt.
 * @param {Int8Array | string} publicKey The radius of the circle.
 * @param {Int8Array | string} privateKey The radius of the circle.
 * @return {Promise<string | boolean>}
 */
export const decryptMessage = async (encryptedMessage, publicKey, privateKey) => {
  try {
    const iv = CryptoJS.enc.Hex.parse('06040308010201020702030805070101');
    const password = await getPassword(publicKey, privateKey);
    //console.log({ password });
    const sharedKey = CryptoJS.lib.WordArray.create(password);
    //console.log({ sharedKey });
    const arrayMessage = await Base58.decode(encryptedMessage);
    const message = arrayMessage.slice(1);
    //console.log({ message });
    const words = CryptoJS.lib.WordArray.create(message);
    //console.log({ words });
    const decrypted = CryptoJS.AES.decrypt({ ciphertext: words }, sharedKey, { iv });
    //console.log({ decrypted });
    const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
    //const jsonString = await Bytes.stringFromByteArray(wordsToByteArray(decrypted));
    //console.log({ jsonString });
    return jsonString;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const testCrypt = async () => {
  //const secret1 = '2RSehSu6szKbhEap46fhLN4s2BCfD1N2PLqbKnVWCbPvzF9JRBJs8sbQFqqaGLs4x4TZZV8hD5irs2RiT7gsGVjq';
  //const public1 = '3jPhyhgqry3J95PHRLmH27UhKvn93y3x6Z748uv2vKoH';
  //const secret2 = 'kiAeqbBDqQ4Qa5X1hdpuWnzmX3GW3i9Bwk81VmNeFkXWhypZnxCYGnPDdTbbBFkgZHQkADowQhatRqYAT72nYrf';
  //const public2 = '6jt933MGNLo8DFEtJX1HXsfu38h21PyWpBRstaNM1Q5q';
  const secret1 = '2RSehSu6szKbhEap46fhLN4s2BCfD1N2PLqbKnVWCbPvzF9JRBJs8sbQFqqaGLs4x4TZZV8hD5irs2RiT7gsGVjq';
  const public1 = '3jPhyhgqry3J95PHRLmH27UhKvn93y3x6Z748uv2vKoH';

  const public2 = '6jt933MGNLo8DFEtJX1HXsfu38h21PyWpBRstaNM1Q5q';
  const secret2 = 'kiAeqbBDqQ4Qa5X1hdpuWnzmX3GW3i9Bwk81VmNeFkXWhypZnxCYGnPDdTbbBFkgZHQkADowQhatRqYAT72nYrf';

  //const msg = JSON.stringify({name:1});
  const msg = 'my comment';

  const encrypted = await encryptMessage(msg, public2, secret1);
  const str = await Base58.encode(encrypted);

  const decrypted = await decryptMessage(str, public1, secret2);
  //console.log({ encrypted, base58: str, decrypted: decrypted });
};

export const testDecrypt = async () => {
  //const secret1 = '2RSehSu6szKbhEap46fhLN4s2BCfD1N2PLqbKnVWCbPvzF9JRBJs8sbQFqqaGLs4x4TZZV8hD5irs2RiT7gsGVjq';
  //const public1 = '3jPhyhgqry3J95PHRLmH27UhKvn93y3x6Z748uv2vKoH';
  //const secret2 = 'kiAeqbBDqQ4Qa5X1hdpuWnzmX3GW3i9Bwk81VmNeFkXWhypZnxCYGnPDdTbbBFkgZHQkADowQhatRqYAT72nYrf';
  //const public2 = '6jt933MGNLo8DFEtJX1HXsfu38h21PyWpBRstaNM1Q5q';
  const public1 = 'CtzcJQGjboL5wqcnfstUvQ7hRKQYhnQLro7kAVQU1Ma8';

  const public2 = '9ZQ3SU3Eb8hoPoumCqahSRo7H6ELparHkiX9Zbn5om7R';
  const secret2 = '39zGY4HyFGMwri5wozf9BJeS1m2BwFor5rt3JsQnvQ6X3jk76aMocbEczFmsUg1WjR276AFirQYit3utCXZJ4QJP';
  const str = 'T3UyvEPdQW5UuAjKMGLv3pSwGh4WvwTqVHG8U1LfPByB';

  const decrypted1 = await decryptMessage(str, public1, secret2);
  console.log({ decrypted1 });
};

export const decrypt = async (str, public1, secret2) => {
  return await decryptMessage(str, public1, secret2);
};


/** @description Encrypt text.
 * @param {string} message Text to encrypt.
 * @param {Int8Array | string} secret32 The shared secret key.
 * @return {Promise<int8Array | boolean>}
 */
export const encrypt32 = async (message, secret32) => {
  try {
    const secret = typeof secret32 === 'string' ? await Base58.decode(secret32) : secret32;
    const iv = CryptoJS.enc.Hex.parse('06040308010201020702030805070101');
    const password = new Uint8Array(secret);

    const sharedKey = CryptoJS.lib.WordArray.create(password);
    const encrypted = CryptoJS.AES.encrypt(message, sharedKey, { iv });
    const int8Array0 = wordsToByteArray(encrypted.ciphertext);
    const int8Array = new Int8Array([0x01, ...int8Array0]);
    return int8Array;
  } catch (e) {
    console.log(e);
    return false;
  }
};

/** @description Decrypt text to json.
 * @param {string} encryptedMessage Encrypted text to decrypt.
 * @param {Int8Array | string} secret32 The shared secret key.
 * @return {Promise<string>}
 */
export const decrypt32 = async (encryptedMessage, secret32) => {
  try {
    const iv = CryptoJS.enc.Hex.parse('06040308010201020702030805070101');
    const secret = typeof secret32 === 'string' ? await Base58.decode(secret32) : secret32;
    const password = new Uint8Array(secret);
    const sharedKey = CryptoJS.lib.WordArray.create(password);

    const arrayMessage = await Base58.decode(encryptedMessage);
    const message = arrayMessage.slice(1);
    const words = CryptoJS.lib.WordArray.create(message);
    const decrypted = CryptoJS.AES.decrypt({ ciphertext: words }, sharedKey, { iv });
    const jsonString = await Bytes.stringFromByteArray(prepareAfterDecrypt(wordsToByteArray(decrypted)));
    return jsonString;
  } catch (e) {
    console.log(e);
    return false;
  }
};
