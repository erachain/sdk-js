import { scalarMult } from 'tweetnacl';
import { Base58 } from './Base58';
import SHA256 from './SHA256';
import { wordsToByteArray, prepareAfterDecrypt, trimString, bytesToHex, hexToBytes } from './convert';
import { Bytes } from '../../src/core/Bytes';

const ed2curve = require('./ed2curve');

const CryptoJS = require('crypto-js');

/** @description Gets share key.
 * @param {Int8Array | string} publicKey The radius of the circle.
 * @param {Int8Array | string} privateKey The radius of the circle.
 * @return {Promise<Uint8Array>}
 */
export const getPassword = async (publicKey, privateKey) => {
  const key = typeof publicKey === 'string' ? Buffer.from(await Base58.decode(publicKey)) : Buffer.from(publicKey);
  const secret = typeof privateKey === 'string' ? Buffer.from(await Base58.decode(privateKey)) : Buffer.from(privateKey);
  const theirDHPublicKey = ed2curve.convertPublicKey(key);
  const myDHSecretKey = ed2curve.convertSecretKey(secret);
  const password = SHA256.digest(scalarMult(myDHSecretKey, theirDHPublicKey));

  return password;
};

/** @description Gets share key.
 * @param {Int8Array | string} publicKey The radius of the circle.
 * @param {Int8Array | string} privateKey The radius of the circle.
 * @return {Promise<Words>}
 */
export const passwordAES = async (publicKey, privateKey) => {
  const password = await getPassword(publicKey, privateKey);

  return CryptoJS.lib.WordArray.create(password);
};

/** @description Decrypt byte array.
 * @param {Int8Array | string} encryptedMessage Encrypted text to decrypt.
 * @param {Words} secret32 The radius of the circle.
 * @return {Words | boolean}
 */
export const decryptAES = async (encryptedMessage, secret32) => {
  try {
    const iv = CryptoJS.enc.Hex.parse('06040308010201020702030805070101');

    let arrayMessage = encryptedMessage;
    if (typeof encryptedMessage === 'string') {
      arrayMessage = await Base58.decode(encryptedMessage);
      arrayMessage = arrayMessage.slice(1);
    } 
    const words = CryptoJS.lib.WordArray.create(arrayMessage);

    return CryptoJS.AES.decrypt({ ciphertext: words }, secret32, { iv });
    // return await Base58.encode(prepareAfterDecrypt(wordsToByteArray(decrypted)));    
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const wordsToBase58 = async (words) => {
  return await Base58.encode(prepareAfterDecrypt(wordsToByteArray(words)));    
}

export const wordsToUtf8 = (words) => {
  return words.toString(CryptoJS.enc.Utf8);    
}

export const wordsToBytes = (words) => {
  return hexToBytes(CryptoJS.enc.Hex.stringify(words));
}

export const bytesToWords = (bytes) => {
  return CryptoJS.lib.WordArray.create(new Uint8Array(bytes));
}

/** @description Decrypt text.
 * @param {string} encryptedMessage Encrypted text to decrypt.
 * @param {Int8Array | string} publicKey The radius of the circle.
 * @param {Int8Array | string} privateKey The radius of the circle.
 * @return {Promise<string | boolean>}
 */
export const decryptMessage = async (encryptedMessage, publicKey, privateKey) => {
  try {
    const iv = CryptoJS.enc.Hex.parse('06040308010201020702030805070101');
    
    const sharedKey = await passwordAES(publicKey, privateKey);
    const decrypted = await decryptAES(encryptedMessage, sharedKey);

    return wordsToUtf8(decrypted);

    //return trimString(jsonString);
  } catch (e) {
    console.log(e);
    return false;
  }
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
    return trimString(jsonString);
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const decrypt = async (str, public1, secret2) => {
  return await decryptMessage(str, public1, secret2);
};

/** @description Encrypt text.
 * @param {string} message Text to encrypt.
 * @param {Int8Array | string} secret32 The shared secret key.
 * @return {Promise<int8Array | boolean>}
 */
export const encryptAES = async (message, secret32) => {
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

/** @description Encrypt text.
 * @param {Int8Array} message Text to encrypt.
 * @param {WordArray} secret32 The shared secret key.
 * @return {Promise<Int8Array>}
 */
export const encryptBytes = async (message, secret32) => {
    const iv = CryptoJS.enc.Hex.parse('06040308010201020702030805070101');

    const words = CryptoJS.enc.Hex.parse(bytesToHex(message));
    const encrypted = CryptoJS.AES.encrypt(words, secret32, { iv });
    const int8Array0 = wordsToByteArray(encrypted.ciphertext);
    const int8Array = new Int8Array([0x01, ...int8Array0]);
    return int8Array;
};

/** @description Decrypt text to json.
 * @param {string} encryptedMessage Encrypted text to decrypt.
 * @param {Int8Array | string} secret32 The shared secret key.
 * @return {Promise<string>}
 */
/*
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
    return trimString(jsonString);
  } catch (e) {
    console.log(e);
    return false;
  }
};
*/


