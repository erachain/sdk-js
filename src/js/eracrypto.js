/* eslint-disable */

(function (root, factory) {
    'use strict'
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(require("./core-min.js"), require("./cipher-core-min.js"), require("./aes.js"), require("./nacl-fast.js"), require("./ed2curve.js"), require("./sha256.js"), require("./Bytes.js"), require("./Base58.js"));
    } else {
        root.EraCrypt = factory();
    }
}(this, function () {
    'use strict'

    if (!CryptoJS) throw new Error('CryptoJS not loaded');
    if (!nacl) throw new Error('tweetnacl not loaded');
    if (!Base58) throw new Error('Base58 not loaded');
    if (!Bytes) throw new Error('Bytes not loaded');
    if (!SHA256) throw new Error('sha256 not loaded');
    if (!ed2curve) throw new Error('ed2curve not loaded');

    function getPassword(publicKey, privateKey) {
        const key = typeof(publicKey) === 'string'?Base58.decode(publicKey):publicKey; 
        const secret = typeof(privateKey) === 'string'?Base58.decode(privateKey):privateKey; 
        const theirDHPublicKey = ed2curve.convertPublicKey(key);
        const myDHSecretKey = ed2curve.convertSecretKey(secret);
        const password = SHA256.digest(nacl.scalarMult(myDHSecretKey, theirDHPublicKey));
        return password;
    };

    function encryptMessage(message, publicKey, privateKey) {
        try {
            const iv = CryptoJS.enc.Hex.parse('06040308010201020702030805070101');
            const password = getPassword(publicKey, privateKey);
            let sharedKey =Bytes.convertUint8ArrayToWordArray(password);
            const encrypted = CryptoJS.AES.encrypt(message, sharedKey, { iv });
            const int8Array0 = Bytes.wordsToByteArray(encrypted.ciphertext);
            const int8Array = new Int8Array([ 0x01, ...int8Array0]);
            return int8Array;
        } catch (e) {
            return false;
        }
    };

    function decryptMessage(encryptedMessage, publicKey, privateKey) {
        try {
            const iv = CryptoJS.enc.Hex.parse('06040308010201020702030805070101');
            const password = getPassword(publicKey, privateKey);
            let sharedKey = Bytes.convertUint8ArrayToWordArray(password);
            const arrayMessage = Base58.decode(encryptedMessage);
            const message = arrayMessage.slice(1);
            let words = Bytes.convertUint8ArrayToWordArray(message);
            let decrypted = CryptoJS.AES.decrypt({ ciphertext: words }, sharedKey, { iv });
            const jsonString = Bytes.stringFromByteArray(Bytes.prepareAfterDecrypt(Bytes.wordsToByteArray(decrypted)));
            return jsonString;
        } catch (e) {;
            return false;
        }
    };

	return {
        encryptMessage: encryptMessage,
        decryptMessage: decryptMessage,
    };

}));