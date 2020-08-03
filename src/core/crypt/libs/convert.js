export const wordsToByteArray = wordArray => {
  if (wordArray.hasOwnProperty('sigBytes') && wordArray.hasOwnProperty('words')) {
    wordArray = wordArray.words;
  }
  const byteArray = [];
  for (let i = 0; i < wordArray.length; ++i) {
    const word = wordArray[i];
    for (let j = 3; j >= 0; --j) {
      byteArray.push((word >> (8 * j)) & 0xff);
    }
  }
  return byteArray;
};

export const prepareAfterDecrypt = byteArray => {
  for (let i = byteArray.length - 1; i >= 0; i--) {
    if (byteArray[i] === 125) {
      return byteArray.slice(0, ++i);
    }
  }
  return byteArray;
};

export const trimString = str => {
  return str.replace(/[\u0001-\u0010]+$/gm, '');
};

export const int32ToBytes = word => {
  var byteArray = [];
  for (var b = 0; b < 32; b += 8) {
    byteArray.push((word >>> (24 - (b % 32))) & 0xff);
  }
  return new Int8Array(byteArray);
};
