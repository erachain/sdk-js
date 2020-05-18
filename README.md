
# erachain-js-api

EraChain JS API

## Install SDK via npm

npm install --save erachain-js-api

## Install /jsfor html

git clone https://lab.erachain.org/erachain/web-js-encrypt.git

npm run build

npm run prodjs

## API functions

### Import

```javascript

const { EraChain } = require('erachain-js-api')

```

### Base58 functions

```javascript

    const string_base58 = await EraChain.Base58.encode(input_Int8Array);
    const int8Array = await EraChain.Base58.decode(input_string_base58);

```

### Create wallet

```javascript

    // Generate new key pair (secret key && public key)
    const keys: {
        [secretKey]: Int8Array,
        [publicKey]: Int8Array
    } = await EraChain.Crypt.generateKeys();

    // address of wallet = f(public key)
    const address_string = await EraChain.Crypt.addressByPublicKey(publicKey_Int8Array);

    // address of wallet = f(secret key)
    const address_string = await EraChain.Crypt.addressBySecretKey(secretKey_Int8Array);

    const publicKey_Int8Array: Int8Array = await EraChain.Crypt.publicKeyBySecretKey(secretKey_Int8Array);

    // Encode Int8Array to Base58 string
    const publicKey_string_base58: string = await EraChain.Base58.encode(publicKey_Int8Array);

    const secretKey_string_base58: string = await EraChain.Base58.encode(secretKey_Int8Array);

```

### Signature functions

```javascript

    // Signature of string message
    const message_Int8Array = EraChain.Bytes.stringToByteArray(message_string);
    const signed_Int8Array = await EraChain.Crypt.sign(message_Int8Array, secretKey_Int8Array);
    const signature_string_base58 = await EraChain.Base58.encode(signed_Int8Array);

    // Verify signature
    const result_boolean = await EraChain.Crypt.verifySign(message_Int8Array,  await EraChain.Base58.decode(signature_string_base58), publicKey_Int8Array);

```

### Encrypt/Decrypt functions

```javascript

    // Encrypt
    const encrypted_Int8Array = await EraChain.Crypt.encryptMessage(msg_string, key2.publicKey_Int8Array, key1.secretKey_Int8Array);

    const encrypted_string_base58 = await EraChain.Base58.encode(encrypted_Int8Array);

    // Decrypt
    const decrypted_string = await EraChain.Crypt.decryptMessage(encrypted_string_base58, keys1.publicKey_Int8Array, keys2.secretKey_Int8Array);

```

## API

### Init API

```javascript

    const url = "http://domain.com:9067/api"; // 9067 - TestNET, 9047 - MainNET
    const rpcPort = 9066; // 9066 - TestNET, 9046 - MainNET

    const api = new EraChain.API(url, rpcPort);

```

### Send message to address or public key of recipient wallet

```javascript

    const keys = {
        // sender address: 7GtqHorKL6CDZW6T98C8aGFNJXc87xoivZ
        secretKey: await EraChain.Base58.decode("5a4AabYQ54gdwYq83FNng96BTzzSL6bTxALcRFe9VZboLfzaUToZFnAdMsnNKM13NJZeCMJbykfQbNT9vryyhF4R"),
        publicKey: await EraChain.Base58.decode("ESx4g78k72URJWW87M4vKbMCqQpChzLfQ5s8gJhsjB7B")
    };

    const keyPair = new EraChain.Crypt.KeyPair(keys);

    const recipientPublicKeyOrAddress = "2fGQhMDrZdeKnT83wFhjNVhJ7LrNA8faRzsfuihaN2T6";
    // recipient address: 7GEebDVKj9eW1udSNqpAXJr8TMJR3HPsXK
    const head = "Заголовок";
    const message = "Здравствуй, Мир!";
    const encrypted = true; // encrypted = true, only if recipient is public key
                            // encrypted = false, only if sender is certified persons

    api.sendMessage(keyPair, recipientPublicKeyOrAddress, head, message, encrypted)
        .then(data => {
            // data = {status: "ok"}
            console.log(data);
        })
        .catch(e => {
            console.log(e);
        });

```

### Send asset to address or public key of recipient wallet

```javascript

    const keys = {
        // sender address: 7GtqHorKL6CDZW6T98C8aGFNJXc87xoivZ
        secretKey: await EraChain.Base58.decode("5a4AabYQ54gdwYq83FNng96BTzzSL6bTxALcRFe9VZboLfzaUToZFnAdMsnNKM13NJZeCMJbykfQbNT9vryyhF4R"),
        publicKey: await EraChain.Base58.decode("ESx4g78k72URJWW87M4vKbMCqQpChzLfQ5s8gJhsjB7B")
    };

    const keyPair = new EraChain.Crypt.KeyPair(keys);

    const asset = {
        assetKey: 2, // 1 = ERA, 2 = COMPU, etc.
        amount: 1,   // amount of asset
    }

    const recipientPublicKeyOrAddress = "2fGQhMDrZdeKnT83wFhjNVhJ7LrNA8faRzsfuihaN2T6";
    // recipient address: 7GEebDVKj9eW1udSNqpAXJr8TMJR3HPsXK
    const head = "Заголовок";
    const message = "Здравствуй, Мир!";
    const encrypted = true; // encrypted = true, only if recipient is public key
                            // encrypted = false, only if sender is certified persons

    api.Tran.sendAsset(keyPair, recipientPublicKeyOrAddress, asset, head, message, encrypted)
        .then(data => {
            // data = {status: "ok"}
            console.log(data);
        })
        .catch(e => {
            console.log(e);
        });

```
