const keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const regexBase64 = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
const regexNotBase58 = /[0OIl\+\/]+/;

export default class Base64 {
    static isBase64(input: string) {
        return regexBase64.test(input) && regexNotBase58.test(input);
    }

    static encode(input: string) {
        const output = [];
        let chr1: number = 0;
        let chr2: number = 0;
        let chr3: number = 0;
        let enc1: number = 0;
        let enc2: number = 0;
        let enc3: number = 0;
        let enc4: number = 0;
        let i = 0;

        do {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output.push(
                keyStr.charAt(enc1) +
                keyStr.charAt(enc2) +
                keyStr.charAt(enc3) +
                keyStr.charAt(enc4))
            chr1 = chr2 = chr3 = 0;
            enc1 = enc2 = enc3 = enc4 = 0;
        } while (i < input.length);

        return output.join('');
    }

    static encodeFromByteArray(input: Uint8Array | Int8Array) {
        if (input instanceof Int8Array) {
            input = new Uint8Array(input);
        }

        const output = [];
        let chr1: number = 0;
        let chr2: number = 0;
        let chr3: number = 0;
        let enc1: number = 0;
        let enc2: number = 0;
        let enc3: number = 0;
        let enc4: number = 0;
        let i = 0;

        do {
            chr1 = input[i++];
            chr2 = input[i++];
            chr3 = input[i++];

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output.push(
                keyStr.charAt(enc1) +
                keyStr.charAt(enc2) +
                keyStr.charAt(enc3) +
                keyStr.charAt(enc4))
            chr1 = chr2 = chr3 = 0;
            enc1 = enc2 = enc3 = enc4 = 0;
        } while (i < input.length);

        return output.join('');
    }

    static decode(input: string) {
        let output = "";
        let chr1: number = 0;
        let chr2: number = 0;
        let chr3: number = 0;
        let enc1: number = 0;
        let enc2: number = 0;
        let enc3: number = 0;
        let enc4: number = 0;
        let i = 0;

        // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
        const base64test = /[^A-Za-z0-9\+\/\=]/g;
        if (base64test.exec(input)) {
            throw new Error("There were invalid base64 characters in the input text.\n" +
              "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
              "Expect errors in decoding.");
        }
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        do {
            enc1 = keyStr.indexOf(input.charAt(i++));
            enc2 = keyStr.indexOf(input.charAt(i++));
            enc3 = keyStr.indexOf(input.charAt(i++));
            enc4 = keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 !== 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 !== 64) {
                output = output + String.fromCharCode(chr3);
            }

            chr1 = chr2 = chr3 = 0;
            enc1 = enc2 = enc3 = enc4 = 0;

        } while (i < input.length);

        return output;
    }

    static decodeToByteArray(input: string) {
        const output: number[] = [];
        let chr1: number = 0;
        let chr2: number = 0;
        let chr3: number = 0;
        let enc1: number = 0;
        let enc2: number = 0;
        let enc3: number = 0;
        let enc4: number = 0;
        let i = 0;

        // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
        const base64test = /[^A-Za-z0-9\+\/\=]/g;
        if (base64test.exec(input)) {
            throw new Error("There were invalid base64 characters in the input text.\n" +
              "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
              "Expect errors in decoding.");
        }
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        do {
            enc1 = keyStr.indexOf(input.charAt(i++));
            enc2 = keyStr.indexOf(input.charAt(i++));
            enc3 = keyStr.indexOf(input.charAt(i++));
            enc4 = keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output.push(chr1);

            if (enc3 !== 64) {
                output.push(chr2);
            }
            if (enc4 !== 64) {
                output.push(chr3);
            }

            chr1 = chr2 = chr3 = 0;
            enc1 = enc2 = enc3 = enc4 = 0;

        } while (i < input.length);

        return new Int8Array(output);
    }
}
