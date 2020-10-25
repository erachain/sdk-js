function wordToByteArray(word, length) {
	var ba = [],
		i,
		xFF = 0xFF;
	if (length > 0)
		ba.push(word >>> 24);
	if (length > 1)
		ba.push((word >>> 16) & xFF);
	if (length > 2)
		ba.push((word >>> 8) & xFF);
	if (length > 3)
		ba.push(word & xFF);

	return ba;
}

export function wordsToByteArray(wordArray, length) {
	if (wordArray.hasOwnProperty("sigBytes") && wordArray.hasOwnProperty("words")) {
		length = wordArray.sigBytes;
		wordArray = wordArray.words;
	}

	var result = [],
		bytes,
		i = 0;
	while (length > 0) {
		bytes = wordToByteArray(wordArray[i], Math.min(4, length));
		length -= bytes.length;
		result.push(bytes);
		i++;
	}
	return [].concat.apply([], result);
}


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

export function hexToBytes(hex) {
  for (let bytes = [], c = 0; c < hex.length; c += 2)
      bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

export function bytesToHex(bytes) {
  for (let hex = [], i = 0; i < bytes.length; i++) {
      let current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
      hex.push((current >>> 4).toString(16));
      hex.push((current & 0xF).toString(16));
  }
  return hex.join("");
}