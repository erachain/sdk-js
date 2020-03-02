import { Base58 } from "../core/crypt/libs/Base58";
import { Bytes } from "../core/src/core/Bytes";

describe("Base58", () => {

    it("Base58.encode().decode()", () => {
        const s = "Здравствуй, EraChain API!";
        Bytes.stringToByteArray(s)
            .then(a => {
                Base58.encode(a)
                    .then(base58 => {
                        Base58.decode(base58)
                            .then(a2 => {
                                Bytes.stringFromByteArray(a2)
                                    .then(s2 => {
                                        expect(s2).toEqual(s);
                                    })
                            });
                    });
            });

    });

});
