/* eslint-disable */

(function (root, factory) {
    'use strict'
    if (typeof module !== 'undefined' && module.exports) module.exports = factory();
    else root.Bytes = factory();
}(this, function () {
    'use strict'

    function stringToByteArray(str) {
        var binaryArray = new Uint8Array(str.length)
        Array.prototype.forEach.call(binaryArray, function (el, idx, arr) { arr[idx] = str.charCodeAt(idx) })
        return binaryArray;
    }

    function stringFromByteArray(bytes) {
        var s = '';
        for (var i = 0; i < bytes.length; i++) {
            s = s + String.fromCharCode(bytes[i]);
        }
        return s;
    }

    function wordsToByteArray(wordArray) {
        if (wordArray.hasOwnProperty('sigBytes') && wordArray.hasOwnProperty('words')) {
            wordArray = wordArray.words;
        }
        const byteArray = [];
        for (let i = 0; i < wordArray.length; ++i) {
            const word = wordArray[i];
            for (let j = 3; j >= 0; --j) {
                byteArray.push((word >> 8 * j) & 0xFF);
            }
        }
        return byteArray;
    };
    
    function prepareAfterDecrypt(byteArray) {
        for (let i = byteArray.length - 1; i >= 0; i--) {
            if (byteArray[i] === 125) {
                return byteArray.slice(0, ++i);            
            }
        }
        return byteArray;
    };

    function convertUint8ArrayToWordArray(u8Array) {
        var words = [], i = 0, len = u8Array.length;
    
        while (i < len) {
            words.push(
                (u8Array[i++] << 24) |
                (u8Array[i++] << 16) |
                (u8Array[i++] << 8)  |
                (u8Array[i++])
            );
        }
    
        return {
            sigBytes: words.length * 4,
            words: words
        };
    }

	return {
        stringToByteArray: stringToByteArray,
        stringFromByteArray: stringFromByteArray,
        wordsToByteArray: wordsToByteArray,
        prepareAfterDecrypt: prepareAfterDecrypt,
        convertUint8ArrayToWordArray: convertUint8ArrayToWordArray,
    };

}));
