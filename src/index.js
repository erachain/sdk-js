(function (root, U){
    "use strict";

    const { sign, scalarMult } = require("tweetnacl");
    const Base58 = require("./js/Base58.js");
    const Bytes = require("./js/Bytes.js");
    require("./js/sha256.js");
    require("./js/ripemd160.js");
    
    const ed2curve = require("./js/ed2curve");
    const CryptoJS = require("crypto-js");

    const ADDRESS_VERSION = 15;  

    //Concatination of two buffers 
    //buffer1: Int8Array, 
    //buffer2: Int8Array
    //
    //return : Int8Array
    function appendBuffer(buffer1, buffer2) {
        buffer1 = new Int8Array(buffer1);
        buffer2 = new Int8Array(buffer2);
        const tmp = new Int8Array(buffer1.byteLength + buffer2.byteLength);
        tmp.set(buffer1, 0);
        tmp.set(buffer2, buffer1.byteLength);
        return tmp;
    }

    //Get account address from public key
    //publicKey: Int8Array
    //
    //return : string Base58
    function getAccountAddressFromPublicKey(publicKey) {

        // SHA256 PUBLICKEY FOR PROTECTION
        let publicKeyHash = SHA256.digest(publicKey);

        // RIPEMD160 TO CREATE A SHORTER ADDRESS

        RIPEMD160.reset();
        publicKeyHash = RIPEMD160.digest(publicKeyHash);

        // CONVERT TO LIST
        let addressList = new Int8Array(0);

        //ADD VERSION BYTE
        const versionByte = new Int8Array([ADDRESS_VERSION]);
        addressList = appendBuffer(addressList, versionByte);

        addressList = appendBuffer(addressList, publicKeyHash);

        //GENERATE CHECKSUM
        const checkSum = SHA256.digest(SHA256.digest(addressList));

        //ADD FIRST 4 BYTES OF CHECKSUM TO ADDRESS
        addressList = appendBuffer(addressList, new Int8Array([checkSum[0]]));
        addressList = appendBuffer(addressList, new Int8Array([checkSum[1]]));
        addressList = appendBuffer(addressList, new Int8Array([checkSum[2]]));
        addressList = appendBuffer(addressList, new Int8Array([checkSum[3]]));

        //BASE58 ENCODE ADDRESS
        return Base58.encode(addressList);
    }

    //Generate key pair
    //
    //return : SignKeyPair
    function generateKeys() {
        return sign.keyPair();
    }

    //Get address by secret key
    //secretKey: string | Int8Array
    //
    //return : string
    function getAddressBySecretKey(secretKey) {
        if (typeof secretKey === "string") {
            secretKey = Base58.decode(secretKey);
        }
        const keys = sign.keyPair.fromSecretKey(new Uint8Array(secretKey));
        return getAccountAddressFromPublicKey(keys.publicKey);
    }

    //Get address by secret key
    //secretKey: string | Int8Array
    //
    //return : Int8Array
    function getPublicKeyBySecretKey(secretKey) {
        if (typeof secretKey === "string") {
            secretKey = Base58.decode(secretKey);
        }
        const keys = sign.keyPair.fromSecretKey(new Uint8Array(secretKey));
        return new Int8Array(keys.publicKey);
    }

    //Digital signature
    //message : Int8Array
    //secretKey : Int8Array
    //
    //return : Int8Array
    function toSign(message, secretKey) {
        const result = sign.detached(new Uint8Array(message), new Uint8Array(secretKey));
        return new Int8Array(result);
    }

    //Verify signature
    //message : Int8Array, 
    //result : Int8Array, 
    //publicKey : Int8Array
    //
    //return : boolean
    function verifySign(message, result, publicKey) {
        return sign.detached.verify(new Uint8Array(message), new Uint8Array(result), new Uint8Array(publicKey));
    }

    //Get shared key
    // publicKey: Int8Array | string
    // privateKey: Int8Array | string
    //
    // return : Int8Array
    function getPassword(publicKey, privateKey) {
        const key = typeof(publicKey) === 'string'?Base58.decode(publicKey):publicKey; 
        const secret = typeof(privateKey) === 'string'?Base58.decode(privateKey):privateKey; 
        const theirDHPublicKey = ed2curve.convertPublicKey(key);
        const myDHSecretKey = ed2curve.convertSecretKey(secret);
        const password = SHA256.digest(scalarMult(myDHSecretKey, theirDHPublicKey));
        return password;
    };

    //Encrypt message
    // message: string
    // publicKey: Int8Array
    // privateKey: Int8Array
    //
    // return : Int8Array
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

    //Decrypt message
    // encryptedMessage: string Base58
    // publicKey: Int8Array
    // privateKey: Int8Array
    //
    // return : string
    function decryptMessage(encryptedMessage, publicKey, privateKey) {
        try {
            const iv = CryptoJS.enc.Hex.parse('06040308010201020702030805070101');
            const password = getPassword(publicKey, privateKey);
            let sharedKey = Bytes.convertUint8ArrayToWordArray(password);
            const arrayMessage = Base58.decode(encryptedMessage);
            const message = arrayMessage.slice(1);
            let words = Bytes.convertUint8ArrayToWordArray(message);
            let decrypted = CryptoJS.AES.decrypt({ ciphertext: words }, sharedKey, { iv });
            const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
            //const jsonString = Bytes.stringFromByteArray(Bytes.prepareAfterDecrypt(Bytes.wordsToByteArray(decrypted)));
            return jsonString;
        } catch (e) {;
            return false;
        }
    };

    window.Base58 = Base58;
    window.EraCrypt = {
        base58encode: Base58.encode,
        base58decode: Base58.decode,
        stringToByteArray: Bytes.stringToByteArray,
        addressByPublicKey: getAccountAddressFromPublicKey,
        generateKeys: generateKeys,
        addressBySecretKey: getAddressBySecretKey,
        publicKeyBySecretKey: getPublicKeyBySecretKey,
        sign: toSign,
        verifySign: verifySign,
        encryptMessage: encryptMessage,
        decryptMessage: decryptMessage,
    };

}(this, undefined));