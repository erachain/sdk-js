import { scalarMult } from 'tweetnacl';
import { Base58 } from './Base58';
import SHA256 from './SHA256';
import { wordsToByteArray, prepareAfterDecrypt, trimString, bytesToHex, hexToBytes } from './convert';
import { Bytes } from '../../src/core/Bytes';
import Base64 from '../../src/core/util/base64';

const ed2curve = require('./ed2curve');

const CryptoJS = require('crypto-js');

/** @description Gets share key.
 * @param {Int8Array | string} publicKey The public key.
 * @param {Int8Array | string} privateKey The private key.
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

/** @description Gets share key at word array type.
 * @param {Int8Array | string} publicKey The public key.
 * @param {Int8Array | string} privateKey The private key.
 * @return {Promise<Words>}
 */
export const passwordAES = async (publicKey, privateKey) => {
  const password = await getPassword(publicKey, privateKey);

  return CryptoJS.lib.WordArray.create(password);
};

/** @description Decrypt byte array.
 * @param {Int8Array | string} encryptedMessage Encrypted text to decrypt.
 * @param {Words} secret32 Shared secret.
 * @param {boolean} prefix Exists prefix.
 * @return {Words | boolean}
 */
export const decryptAES = async (encryptedMessage, secret32, prefix = true) => {

    const iv = CryptoJS.enc.Hex.parse('06040308010201020702030805070101');

    let arrayMessage = encryptedMessage;
    if (typeof encryptedMessage === 'string') {
      arrayMessage = await Base58.decode(encryptedMessage);
      
    }
    if (prefix) {
      arrayMessage = arrayMessage.slice(1);
    }
    
    const words = CryptoJS.lib.WordArray.create(arrayMessage);

    return CryptoJS.AES.decrypt({ ciphertext: words }, secret32, { iv });
    // return await Base58.encode(prepareAfterDecrypt(wordsToByteArray(decrypted)));    

};

/** @description Decrypt byte array.
 * @param {Int8Array | string} encryptedMessage Encrypted text to decrypt.
 * @param {Words} secret32 Shared secret.
 * @param {boolean} prefix Exists prefix.
 * @return {Words | boolean}
 */
 export const decryptAES64 = async (encryptedMessage, secret32, prefix = true) => {

  const iv = CryptoJS.enc.Hex.parse('06040308010201020702030805070101');

  let arrayMessage = encryptedMessage;
  if (typeof encryptedMessage === 'string') {
    arrayMessage = Base64.decodeToByteArray(encryptedMessage);
    
  }
  if (prefix) {
    arrayMessage = arrayMessage.slice(1);
  }
  
  const words = CryptoJS.lib.WordArray.create(arrayMessage);

  return CryptoJS.AES.decrypt({ ciphertext: words }, secret32, { iv });
  // return await Base58.encode(prepareAfterDecrypt(wordsToByteArray(decrypted)));    

};

export const wordsToBytes = (words) => {
  return hexToBytes(CryptoJS.enc.Hex.stringify(words));
}

export const wordsToBase58 = async (words) => {
  return await Base58.encode(wordsToBytes(words));  
}

export const wordsToUtf8 = (words) => {
  return words.toString(CryptoJS.enc.Utf8);    
}

export const bytesToWords = (bytes) => {
  return CryptoJS.lib.WordArray.create(new Uint8Array(bytes));
}

/** @description Decrypt text.
 * @param {string} encryptedMessage Encrypted text to decrypt.
 * @param {Int8Array | string} publicKey The public key.
 * @param {Int8Array | string} privateKey The private key.
 * @param {boolean} prefix Exists prefix.
 * @return {Promise<string | boolean>}
 */
export const decryptMessage = async (encryptedMessage, publicKey, privateKey, prefix = true) => {
  try {
    const iv = CryptoJS.enc.Hex.parse('06040308010201020702030805070101');
    
    const sharedKey = await passwordAES(publicKey, privateKey);
    const decrypted = await decryptAES(encryptedMessage, sharedKey, prefix);

    return wordsToUtf8(decrypted);

    //return trimString(jsonString);
  } catch (e) {
    console.log(e);
    return false;
  }
};

/** @description Decrypt text.
 * @param {string} encryptedMessage Encrypted text to decrypt.
 * @param {Int8Array | string} publicKey The public key.
 * @param {Int8Array | string} privateKey The private key.
 * @param {boolean} prefix Exists prefix.
 * @return {Promise<string | boolean>}
 */
 export const decryptMessage64 = async (encryptedMessage, publicKey, privateKey, prefix = true) => {
  try {
    const iv = CryptoJS.enc.Hex.parse('06040308010201020702030805070101');
    
    const sharedKey = await passwordAES(publicKey, privateKey);
    const decrypted = await decryptAES64(encryptedMessage, sharedKey, prefix);

    return wordsToUtf8(decrypted);

    //return trimString(jsonString);
  } catch (e) {
    console.log(e);
    return false;
  }
};

/** @description Encrypt text.
 * @param {string} message Text to encrypt.
 * @param {Int8Array | string} publicKey The public key.
 * @param {Int8Array | string} privateKey The private key.
 * @param {boolean} prefix Exists prefix.
 * @return {Promise<int8Array | boolean>}
 */
export const encryptMessage = async (message, publicKey, privateKey, prefix = true) => {
  try {
    const iv = CryptoJS.enc.Hex.parse('06040308010201020702030805070101');
    const password = await getPassword(publicKey, privateKey);
    
    const sharedKey = CryptoJS.lib.WordArray.create(password);
    const encrypted = CryptoJS.AES.encrypt(message, sharedKey, { iv });
    const int8Array0 = wordsToBytes(encrypted.ciphertext);
    if (prefix) {
      return new Int8Array([0x01, ...int8Array0]);
    } else {
      return int8Array0;
    }
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
 * @param {boolean} prefix Exists prefix.
 * @return {Promise<Int8Array | boolean>}
 */
export const encryptAES = async (message, secret32, prefix = true) => {
  try {
    const secret = typeof secret32 === 'string' ? await Base58.decode(secret32) : secret32;
    const iv = CryptoJS.enc.Hex.parse('06040308010201020702030805070101');
    const password = new Uint8Array(secret);

    const sharedKey = CryptoJS.lib.WordArray.create(password);
    const encrypted = CryptoJS.AES.encrypt(message, sharedKey, { iv });
    const int8Array0 = wordsToBytes(encrypted.ciphertext);
    if (prefix) {
      return new Int8Array([0x01, ...int8Array0]);
    } else {
      return int8Array0;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
};

/** @description Encrypt text.
 * @param {Int8Array} message Text to encrypt.
 * @param {WordArray} secret32 The shared secret key.
 * @param {boolean} prefix Add one byte to begin.
 * @return {Promise<Int8Array>}
 */
export const encryptBytes = async (message, secret32, prefix = true) => {
    const iv = CryptoJS.enc.Hex.parse('06040308010201020702030805070101');

    const words = CryptoJS.enc.Hex.parse(bytesToHex(message));
    const encrypted = CryptoJS.AES.encrypt(words, secret32, { iv });
    const int8Array0 = wordsToBytes(encrypted.ciphertext);
    if (prefix) {
      return new Int8Array([0x01, ...int8Array0]);
    } else {
      return int8Array0;
    }
};

