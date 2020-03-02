import { Base58 } from "../core/crypt/libs/Base58";

const crypt = require("../core/crypt/libs/aesCrypt");

describe("Base58", () => {

    it("Base58.encode().decode()", () => {
        
        const s = "Здравствуй, EraChain API!";
        const secret1 = '2RSehSu6szKbhEap46fhLN4s2BCfD1N2PLqbKnVWCbPvzF9JRBJs8sbQFqqaGLs4x4TZZV8hD5irs2RiT7gsGVjq';
        const public1 = '3jPhyhgqry3J95PHRLmH27UhKvn93y3x6Z748uv2vKoH';
    
        const public2 = '6jt933MGNLo8DFEtJX1HXsfu38h21PyWpBRstaNM1Q5q';
        const secret2 = 'kiAeqbBDqQ4Qa5X1hdpuWnzmX3GW3i9Bwk81VmNeFkXWhypZnxCYGnPDdTbbBFkgZHQkADowQhatRqYAT72nYrf';
    
        crypt.encryptMessage(s, public2, secret1)
            .then((encrypted) => {
                Base58.encode(encrypted)
                    .then(str => {
                        console.log("encryptMessage().Base58.encode(): ", str);
                        crypt.decryptMessage(str, public1, secret2)
                            .then((decrypted) => {
                                console.log({ input: s, output: decrypted });
                                expect(decrypted).toEqual(s);
                            });
                    });
            });
    });

});
