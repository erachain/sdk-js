
export const wordsToByteArray = (wordArray) => {
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

export const prepareAfterDecrypt = (byteArray) => {
    for (let i = byteArray.length - 1; i >= 0; i--) {
        if (byteArray[i] === 125) {
            return byteArray.slice(0, ++i);            
        }
    }
    return byteArray;
};

export const trimString = (str) => {
    return str.replace(/[\u0001-\u0010]+$/gm, '');
};