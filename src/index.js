(function (root, U){
    "use strict";

    const { scalarMult } = require("tweetnacl");
    const Base58 = require("./js/Base58.js");
    const Bytes = require("./js/Bytes.js");
    require("./js/sha256.js");
    
    const ed2curve = require("./js/ed2curve");
    const CryptoJS = require("crypto-js");

    function getPassword(publicKey, privateKey) {
        const key = typeof(publicKey) === 'string'?Base58.decode(publicKey):publicKey; 
        const secret = typeof(privateKey) === 'string'?Base58.decode(privateKey):privateKey; 
        const theirDHPublicKey = ed2curve.convertPublicKey(key);
        const myDHSecretKey = ed2curve.convertSecretKey(secret);
        const password = SHA256.digest(scalarMult(myDHSecretKey, theirDHPublicKey));
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

    window.Base58 = Base58;
    window.EraCrypt = {
        encryptMessage: encryptMessage,
        decryptMessage: decryptMessage,
    };

}(this, undefined));