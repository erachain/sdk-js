
# erachain-js-api

EraChain JS API

## Install SDK via npm

npm install --save erachain-js-api

## Build js lib for html => /dist

git clone https://lab.erachain.org/erachain/web-js-encrypt.git

npm run build

npm run prodjs

## Generate docs => /docs

typedoc

## Usage API

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

    // With seed
    EraChain.Crypt.generateSeed()
        .then(seed => {
            console.log('seed: ', seed);

            EraChain.Crypt.generateAccountSeed(seed, 0)
                .then(seedAccount => {
                    console.log('seedAccount: ', seedAccount);

                    EraChain.Crypt.getKeyPairFromSeed(seedAccount, 0)
                        .then(async (keyPair) => {
                            console.log('keyPair: ', {
                                secretKey: await EraChain.Base58.encode(keyPair.secretKey),
                                publicKey: await EraChain.Base58.encode(keyPair.publicKey),
                            });
                        });
                });
        });

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

### Base request

```javascript

    api.query(method: string, path: string, params?: { [key: string]: string }, body?: any): Promise<any>

```

### Send asset to address or public key of recipient wallet

```javascript

    const keys = {
        // sender address: 7GtqHorKL6CDZW6T98C8aGFNJXc87xoivZ
        secretKey: await EraChain.Base58.decode("5a4AabYQ54gdwYq83FNng96BTzzSL6bTxALcRFe9VZboLfzaUToZFnAdMsnNKM13NJZeCMJbykfQbNT9vryyhF4R"),
        publicKey: await EraChain.Base58.decode("ESx4g78k72URJWW87M4vKbMCqQpChzLfQ5s8gJhsjB7B")
    };

    const keyPair = new EraChain.Type.KeyPair(keys);

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

    api.sendAsset(keyPair, recipientPublicKeyOrAddress, asset, head, message, encrypted)
        .then(data => {
            // data = {status: "ok"}
            console.log(data);
        })
        .catch(e => {
            console.log(e);
        });

```

### Register new asset

[Asset types](resources/assets.md)

```javascript

    const keys = {
        // sender address: 7GtqHorKL6CDZW6T98C8aGFNJXc87xoivZ
        secretKey: await EraChain.Base58.decode("5a4AabYQ54gdwYq83FNng96BTzzSL6bTxALcRFe9VZboLfzaUToZFnAdMsnNKM13NJZeCMJbykfQbNT9vryyhF4R"),
        publicKey: await EraChain.Base58.decode("ESx4g78k72URJWW87M4vKbMCqQpChzLfQ5s8gJhsjB7B")
    };

    const keyPair = new EraChain.Type.KeyPair(keys);

    const name = "Asset name";
    const description = "";
    const assetType = 1; // цифровой актив
    const quantity = 1000; // количество
    const scale = 2; // дробность
    const icon = EraChain.base64ToArray(icon_base64string);
    const image = EraChain.base64ToArray(image_base64string);;

    api.registerAsset(keyPair, name, assetType, quantity, scale, icon, image, description)
        .then(data => {
            // data = {status: "ok"}
            console.log(data);
        })
        .catch(e => {
            console.log(e);
        });

```

### Register person

```javascript

    const keys = {
        // sender address: 7GtqHorKL6CDZW6T98C8aGFNJXc87xoivZ
        secretKey: await EraChain.Base58.decode("5a4AabYQ54gdwYq83FNng96BTzzSL6bTxALcRFe9VZboLfzaUToZFnAdMsnNKM13NJZeCMJbykfQbNT9vryyhF4R"),
        publicKey: await EraChain.Base58.decode("ESx4g78k72URJWW87M4vKbMCqQpChzLfQ5s8gJhsjB7B")
    };

    const keyPair = new EraChain.Type.KeyPair(keys);

    const account = new EraChain.Type.PublicKeyAccount(keys.publicKey)

    const person = new EraChain.Type.PersonHuman(
        account,
        name: string,
        birthday: number,
        deathday: number,
        gender: number,
        race: string,
        birthLatitude: number,
        birthLongitude: number,
        skinColor: string,
        eyeColor: string,
        hairColor: string,
        height: number,
        icon: Int8Array,
        image: Int8Array,
        description: string,
    );

    api.registerPerson(keyPair, person)
        .then(data => {
            // data = {status: "ok"}
            console.log(data);
        })
        .catch(e => {
            console.log(e);
        });

```

### Verify person

```javascript

    // Your key pair
    const keys = {
        secretKey: await EraChain.Base58.decode("5a4AabYQ54gdwYq83FNng96BTzzSL6bTxALcRFe9VZboLfzaUToZFnAdMsnNKM13NJZeCMJbykfQbNT9vryyhF4R"),
        publicKey: await EraChain.Base58.decode("ESx4g78k72URJWW87M4vKbMCqQpChzLfQ5s8gJhsjB7B")
    };

    const keyPair = new EraChain.Type.KeyPair(keys);

    // ID person for verify
    const personKey = 1555;

    api.verifyPerson(keyPair, personKey, keys.publicKey)
        .then(data => {
            // data = {status: "ok"}
            console.log(data);
        })
        .catch(e => {
            console.log(e);
        });

```

### Send message to address or public key of recipient wallet

```javascript

    const keys = {
        // sender address: 7GtqHorKL6CDZW6T98C8aGFNJXc87xoivZ
        secretKey: await EraChain.Base58.decode("5a4AabYQ54gdwYq83FNng96BTzzSL6bTxALcRFe9VZboLfzaUToZFnAdMsnNKM13NJZeCMJbykfQbNT9vryyhF4R"),
        publicKey: await EraChain.Base58.decode("ESx4g78k72URJWW87M4vKbMCqQpChzLfQ5s8gJhsjB7B")
    };

    const keyPair = new EraChain.Type.KeyPair(keys);

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

### Send telegram to address or public key of recipient wallet

```javascript

    const keys = {
        // sender address: 7GtqHorKL6CDZW6T98C8aGFNJXc87xoivZ
        secretKey: await EraChain.Base58.decode("5a4AabYQ54gdwYq83FNng96BTzzSL6bTxALcRFe9VZboLfzaUToZFnAdMsnNKM13NJZeCMJbykfQbNT9vryyhF4R"),
        publicKey: await EraChain.Base58.decode("ESx4g78k72URJWW87M4vKbMCqQpChzLfQ5s8gJhsjB7B")
    };

    const keyPair = new EraChain.Type.KeyPair(keys);

    const recipientPublicKey = "2fGQhMDrZdeKnT83wFhjNVhJ7LrNA8faRzsfuihaN2T6";
    // recipient address: 7GEebDVKj9eW1udSNqpAXJr8TMJR3HPsXK
    const head = "Заголовок";
    const message = "Здравствуй, Мир!";
    const encrypted = true; // encrypted = true, only if recipient is public key
                            // encrypted = false, only if sender is certified persons

    api.sendTelegram(keyPair, recipientPublicKey, head, message, encrypted)
        .then(data => {
            // data = {status: "ok"}
            console.log(data);
        })
        .catch(e => {
            console.log(e);
        });

```

## Get balance of asset

```javascript

    api.getBalance(address: string, assetKey: number): Promise<number>

```

## Get transactions

```javascript

    api.getTransactions(address: string, heightOfBlock: number, offsetInBlock: number, pageSize: number): Promise<IWalletHistoryRow[]>

```

## Get blocks

```javascript

    api.height(): Promise<any>

    api.firstBlock(): Promise<IEraFirstBlock>

    api.lastBlock(): Promise<IEraBlock>

    api.blocksFromHeight(height: number, limit: number): Promise<{ blocks: IEraBlock[] }>

```

## Get person data

```javascript

    api.getPersonsByFilter(filter: string): Promise<IEraPerson[]>

    api.getPersonData(personKey: number): Promise<IEraPersonData>

    api.getPerson(personKey: number): Promise<IEraPerson>
  
    api.getPersonByAddress(address: string): Promise<IEraPerson>

    api.getPersonByPublicKey(base58key: string): Promise<IEraPerson>

```

## Get asset data

```javascript

    api.getAllAssets(): Promise<IEraAssetsList>

    api.getAssetTransactions(address: string, assetKey: number, offset: number, pageSize:  number, type: number): Promise<{ [id: string]: IWalletHistoryRow }>

    api.getAsset(assetKey: number): Promise<IEraAsset>

    api.getAssetData(assetKey: number): Promise<IEraAssetData>

    api.getAssetImage(assetKey: number): Promise<string | null>

```
