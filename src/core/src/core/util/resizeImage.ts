const resizeBase64 = require('resize-base64'); 
const sizeOf = require('buffer-image-size');
const atob = require('atob');

export interface IImageContainer {
    image: Uint8Array;
    width: number;
    height: number;
    type: string;
}

export function base64ToArray(imageBase64: string): Int8Array {

    const imageURIarray = imageBase64.split(",");
    if (imageURIarray.length !== 2) {
        throw new Error("Base64 failed");
    }

    if (imageURIarray[0].indexOf("base64") === -1) {
        throw new Error("Header Base64 failed");
    }

    const base64 = imageURIarray[1];
    const raw = atob(base64);
    
    const array = new Uint8Array(new ArrayBuffer(raw.length))
    for (let i = 0; i < raw.length; i++) {
        array[i] = raw.charCodeAt(i)
    }
    return new Int8Array(array);
}

export function decodeBase64(imageBase64: string): IImageContainer {

    const imageURIarray = imageBase64.split(",");
    if (imageURIarray.length !== 2) {
        throw new Error("Base64 failed");
    }

    if (imageURIarray[0].indexOf("base64") === -1) {
        throw new Error("Header Base64 failed");
    }

    const base64 = imageURIarray[1];
    const raw = atob(base64);
    
    const array = new Uint8Array(new ArrayBuffer(raw.length))
    for (let i = 0; i < raw.length; i++) {
        array[i] = raw.charCodeAt(i)
    }
    const dim = sizeOf(Buffer.from(array));
    return {
        image: array.slice(),
        ...dim,
    };

}

function px(l: number, w: number, h: number): number {
    return l / (w * h);
}

function newSize(l: number, pl: number, rate: number): { width: number, height: number } {
    const w = Math.sqrt(l * rate / pl);
    return {
        width: w,
        height: w/rate,
    };
}

export async function resizeImage(imageBase64: string, maxImageSize: number, minImageSize: number): Promise<string> {
    try {
        const imageContainer = decodeBase64(imageBase64);
        let length = imageContainer.image.length;

        const rate = imageContainer.width / imageContainer.height;
        let pl = px(length, imageContainer.width, imageContainer.height);
        let size = newSize(maxImageSize, pl, rate);

        let base64 = imageBase64;
        while (length > maxImageSize || length < minImageSize) {

            base64 = await resizeBase64(base64, size.width, size.height);
            const c = decodeBase64(base64);
            length = c.image.length;
            imageBase64 = base64;

            pl = px(length, size.width, size.height);
            size = newSize(maxImageSize, pl, rate);
        }
        return imageBase64;

    } catch(e) {
        // console.log(e);
        return "";
    }
   
}

