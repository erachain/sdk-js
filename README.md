
# erachain-js-api

EraChain JS API

### Install SDK via npm

npm install --save erachain-js-api

### Build js lib for html => /dist

git clone https://lab.erachain.org/erachain/web-js-encrypt.git

npm run build

npm run prodjs

### Generate docs => /docs

typedoc

## Usage SDK

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

    // By 32-byte's secret
    // Encrypt
    const encrypted_Int8Array = await EraChain.Crypt.encrypt32(msg_string, secret32);

    const encrypted_string_base58 = await EraChain.Base58.encode(encrypted_Int8Array);

    // Decrypt
    const decrypted_string = await EraChain.Crypt.decrypt32(encrypted_string_base58, secret32);

```

## API

### Init API

```javascript

    const url = "http://domain.com:9067/api"; // 9067 - TestNET, 9047 - MainNET, 905X - Sidechain, 909X - Clone mode
    const rpcPort = 9066; // 9066 - TestNET, 9046 - MainNET, 905X - Sidechain, 909X - Clone mode

    const api = new EraChain.API(url, rpcPort);

    // Sidechain | Clone mode: boolean
    if (api.sidechainMode) {
        console.log("Sidechain mode")
    }

    // Chain mode property
    api.mode

    // Forced  assignment
    api.mode = "DEFAULT"; // "SIDE" - sidechain, "CLONE" - clone mode

```

### Base request

```javascript

    // query(
    //      method: string,
    //      path: string,
    //      headers?: { [key: string]: string },
    //      params?: { [key: string]: string },
    //      body?: any): Promise<any>

    api.query(
        "GET" or "POST",
        "api/assets",
        { "Content-Type": "application/json" },
        { param1: "Hello", param2: 100 }
    )
        .then( data => {
            console.log(data);
            return data.json();
        })
        .then(data => console.log(data))
        .catch(e => console.log(e))

    api.query(
        "POST",
        "any_path_with_params",
        { "Content-Type": "application/json" },
        undefined,
        raw
    )
        .then( data => {
            console.log(data);
            return data.json();
        })
        .then(data => console.log(data))
        .catch(e => console.log(e))

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

    // With raw code

    api.tranRawSendAsset(keyPair, recipientPublicKeyOrAddress, asset, head, message, encrypted)
        .then(result => {
            /*
                result: {
                    raw: string;
                    size: number;
                    fee: number;
                    error?: any;
                }
            */
            if (!result.error) {
                api.broadcast(result.raw)
                    .then(data => {
                        // data = {status: "ok"}
                        console.log(data);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }
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
    const image = EraChain.base64ToArray(image_base64string);

    api.registerAsset(keyPair, name, assetType, quantity, scale, icon, image, description)
        .then(data => {
            // data = {status: "ok"}
            console.log(data);
        })
        .catch(e => {
            console.log(e);
        });

    // With raw code

    api.tranRawAsset(keyPair, name, assetType, quantity, scale, icon, image, description)
        .then(result => {
            /*
                result: {
                    raw: string;
                    size: number;
                    fee: number;
                    error?: any;
                }
            */
            if (!result.error) {
                api.broadcast(result.raw)
                    .then(data => {
                        // data = {status: "ok"}
                        console.log(data);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }
        })
        .catch(e => {
            console.log(e);
        });


```

### Generate raw of person, parse raw and register person

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

    // Gets raw of person
    const raw = await person.raw(keyPair.secretKey);

    const parsedPerson = EraChain.Type.PersonHuman.parse(raw);

    // Register person
    api.tranRawPerson(keyPair, parsedPerson)
        .then(result => {
            /*
                result: {
                    raw: string;
                    size: number;
                    fee: number;
                    error?: any;
                }
            */
            console.log(result);

            // Register person in Erachain
            api.broadcast(result.raw)
                .then(data => {
                    // data = {status: "ok"}
                    console.log(data);
                })
                .catch(e => {
                    console.log(e);
                });

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

    // With raw code

    api.tranRawVerifyPerson(keyPair, personKey, keys.publicKey)
        .then(result => {
            /*
                result: {
                    raw: string;
                    size: number;
                    fee: number;
                    error?: any;
                }
            */
            if (!result.error) {
                api.broadcast(result.raw)
                    .then(data => {
                        // data = {status: "ok"}
                        console.log(data);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }
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

    // With raw code

    api.tranRawMessage(keyPair, recipientPublicKeyOrAddress, head, message, encrypted)
        .then(result => {
            /*
                result: {
                    raw: string;
                    size: number;
                    fee: number;
                    error?: any;
                }
            */
            if (!result.error) {
                api.broadcast(result.raw)
                    .then(data => {
                        // data = {status: "ok"}
                        console.log(data);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }
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

    // With raw code

    api.tranRawTelegram(keyPair, recipientPublicKey, head, message, encrypted)
        .then(result => {
            /*
                result: {
                    raw: string;
                    size: number;
                    fee: number;
                    error?: any;
                }
            */
            if (!result.error) {
                api.broadcast(result.raw)
                    .then(data => {
                        // data = {status: "ok"}
                        console.log(data);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }
        })
        .catch(e => {
            console.log(e);
        });


```

### Get balance of asset

```javascript

    api.getBalance(address: string, assetKey: number): Promise<number>

    interface IEraBalance {
        [id: number]: number[][];
    }

    api.getAllBalance(address: string): Promise<IEraBalance>

```

### Get transactions

```javascript

    api.getTransactions(address: string, heightOfBlock: number, offsetInBlock: number, pageSize: number): Promise<IWalletHistoryRow[]>

    interface IEraParams {
        type?: number;
        address?: string;
        sender?: string;
        recipient?: string;
        offset?: number;
        limit?: number;
        desc?: booelan;
    }

    api.find(args: IEraParams): Promise<IWalletHistoryRow[]>

    api.tranBySeq(seqNo: string): Promise<IWalletHistoryRow>

    interface IWalletHistoryRow {
        action_key: number,
        amount: string,
        asset: number,
        confirmations: number,
        creator: string,
        data: string,
        encrypted: boolean,
        fee: string,
        head: string,
        height: number,
        isText: boolean,
        property1: number,
        property2: number,
        recipient: string,
        record_type: string,
        reference: string,
        sequence: number,
        signature: string,
        size: number
        sub_type_name: string,
        timestamp: number,
        type: number,
        type_name: string,
        version: number,
        publickey: string,
        message: string,
    }

```

### Get blocks

```javascript

    api.height(): Promise<any>

    api.genesisSignature(): Promise<Int8Array>

    api.firstBlock(): Promise<IEraFirstBlock>

    api.lastBlock(): Promise<IEraBlock>

    api.blockByHeight(height: number): Promise<IEraBlock>

    api.blocksFromHeight(height: number, limit: number): Promise<{ blocks: IEraBlock[] }>

```

### Get person data

```javascript

    api.getPersonsByFilter(filter: string): Promise<IEraPerson[]>

    api.getPersonData(personKey: number): Promise<IEraPersonData>

    api.getPersonImage(key: number)
        .then(res=>{return res.blob()})
        .then(blob=>{
            var img = URL.createObjectURL(blob);
            document.getElementById('img').setAttribute('src', img);
        });

    api.getPerson(personKey: number): Promise<IEraPerson>
  
    api.getPersonByAddress(address: string): Promise<IEraPerson>

    api.getPersonByPublicKey(base58key: string): Promise<IEraPerson>

```

### Get asset data

```javascript

    api.getAllAssets(): Promise<IEraAssetsList>

    api.getAssetTransactions(address: string, assetKey: number, offset: number, pageSize:  number, type: number): Promise<{ [id: string]: IWalletHistoryRow }>

    api.getAsset(assetKey: number): Promise<IEraAsset>

    api.getAssetData(assetKey: number): Promise<IEraAssetData>

    api.getAssetImage(assetKey: number)
        .then(res=>{return res.blob()})
        .then(blob=>{
            var img = URL.createObjectURL(blob);
            document.getElementById('img').setAttribute('src', img);
        });

    api.getAssetIcon(assetKey: number)
        .then(res=>{return res.blob()})
        .then(blob=>{
            var img = URL.createObjectURL(blob);
            document.getElementById('img').setAttribute('src', img);
        });

    api.getAssetsByFilter(filter: string): Promise<IEraAsset[]>

```

### Create documents

```javascript

    const ms = "Уникальный текст 10001"; // any text
    const msu = true; // if yes, then a unique message (a hash is created and entered into the blockchain database for search)
    const tm = 4; // Template key number
    const tmu = true; // if yes, then a unique template with parameters (a hash is created from the template number and parameter values and entered into the blockchain database for search)
    const hsu = true; // if yes, then each hash is unique and it is entered into the blockchain database for search
    const pr = { "param.1": "Уникальный" }; // List of parameters for the template
    const fu = true; // if yes, then each file is unique and the hash from it is entered into the blockchain database for search with a uniqueness check

    const docs = new EraChain.Type.Documents(ms, msu, tm, tmu, pr, hsu, fu);

    const fileContent: Int8Array | string = "Content of file";

    const hash = await EraChain.Base58.encode(EraChain.Crypt.sha256(fileContent));

    // Adding hash and path
    docs.addHash("C:/Erachains/IMG/TMP/EDS.gif", hash);

    /** Example only for node.js (not for browser) **/
    const fileContent = fs.readFileSync("./src/assets/erachain.png");

    // Adding the file
    docs.addFile("erachain.png", false, new Int8Array(fileContent.buffer));

    //const fileContent = fs.readFileSync("./src/assets/document.pdf");
    //docs.addFile("document2.pdf", false, new Int8Array(fileContent.buffer));

    const { ExLink } = EraChain.Type;
    /*
        ExLink.TYPE_NONE - normal, basic
        ExLink.TYPE_APPENDIX - this application, supplement
        ExLink.TYPE_REPLY_COMMENT - this is a Reply or Message (Note).
                                    If there are no Recipients - then this is a Comment (COMMENT), otherwise - a response (REPLY)
        ExLink.TYPE_SURELY - Guarantee for other info
        ExLink.TYPE_SOURCE - Source with weight and note
        ExLink.TYPE_AUTHOR - Author with weight and note
    */

    const exLink = new ExLink(ExLink.TYPE_APPENDIX, "433997-1");

    const exData = new EraChain.Type.ExData(keyPair, "Documents" /* title */, docs, true /* encrypt */, exLink /* default: undefined */, /* onlyRecipients: boolean = undefined */);

    // Add author
    const id = 2; // ID of Person
    let weight = 10;
    let note = "Anything";
    exData.addAuthor(id, weight, note);

    // Add source
    const seqNo = "433997-1"; // ID of Person
    weight = 10;
    note = "Anything";
    exData.addSource(seqNo, weight, note);

    // Add tags
    exData.addTags(["Tag1", "Tag2"]);

    // Add address if not encrypted transaction
    // await exData.addRecipient("7NTqnGWgzGHDvSD5FHw5AjHqCXg3gZcFTU");
    // OR
    // Add public key if encrypted transaction
    await exData.addRecipient("HuuDEwczAdckBc7vspVswYbhgoo5zTsVtSPC4wkHrETY");

    const tx = await api.tranRawDocuments(keyPair, exData);

    const response = await api.broadcast(tx.raw);

    console.log(response);


```

### Read transaction with documents

```javascript

    const keyPair = new EraChain.Type.KeyPair(keys);

    // recipient address
    const address = "7NTqnGWgzGHDvSD5FHw5AjHqCXg3gZcFTU";

    // only for example
    // reading the transaction with encrypted documents
    api.query("GET", `apirecords/unconfirmedincomes/${address}`, undefined, { type: 35, from: 0, count: 20 }, undefined)
        .then(async (response) => {
            const data = await response.json();
            if (data.length === 0) {
                throw new Error("Transactions not found");
            }

            const transaction = data[0];
            console.log(transaction);

            if (transaction.exData.encryptedData64) {

                // Decrypting

                const creatorPublicKey = transaction.publickey;
                const recipients = transaction.exData.recipients;
                const idx = recipients.indexOf(address);
                if (idx >= 0) {
                    const encryptedSecret = transaction.exData.secrets[idx];
                    const sharedKey = await EraChain.Crypt.passwordAES(creatorPublicKey, keys.secretKey);

                    const secret = await EraChain.Crypt.decryptAES(encryptedSecret, sharedKey);

                    const decodedData = EraChain.base64ToArray(data.exData.encryptedData64);

                    const decryptedData = await EraChain.Crypt.decryptAES(decodedData, secret, false);

                    const s = await EraChain.Crypt.wordsToBase58(decryptedData)

                    const doc = await EraChain.Type.Documents.parse(s);

                    console.log(doc.json());
                    // doc.json().F - array of meta file
                    // {
                        // FN: string; // name of file
                        // ZP: boolean; // compress flag,
                        // SZ: number; // size
                    // }
                    // doc.files: Int8Array[] - array of files
                }
            } else {
                console.log(data[0].exData.json);
                // data[0].exData.files: Int8Array[] - array of files
            }

        })
        .catch(e => console.log(e));

```

### Sign transaction

```javascript

    const keyPair = new EraChain.Type.KeyPair(keys);

    const seqNo = "433997-1";

    const tx = await api.tranRawSign(keyPair, seqNo);

    console.log("raw", tx);

    const response = await api.broadcast(tx.raw);

    console.log("response", response);

```

### Create a unique imprint

```javascript

    const keys = {
        // sender address: 7GtqHorKL6CDZW6T98C8aGFNJXc87xoivZ
        secretKey: await EraChain.Base58.decode("5a4AabYQ54gdwYq83FNng96BTzzSL6bTxALcRFe9VZboLfzaUToZFnAdMsnNKM13NJZeCMJbykfQbNT9vryyhF4R"),
        publicKey: await EraChain.Base58.decode("ESx4g78k72URJWW87M4vKbMCqQpChzLfQ5s8gJhsjB7B")
    };

    const keyPair = new EraChain.Type.KeyPair(keys);

    const names = ["Imprint", "word 1", "word 2"];
    const description = "My imprint";
    const icon = EraChain.base64ToArray(icon_base64string);
    const image = EraChain.base64ToArray(image_base64string);

    api.tranRawImprint(keyPair, name, icon, image, description)
        .then(result => {
            /*
                result: {
                    raw: string;
                    size: number;
                    fee: number;
                    error?: any;
                }
            */
            if (!result.error) {
                api.broadcast(result.raw)
                    .then(data => {
                        // data = {status: "ok"}
                        console.log(data);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }
        })
        .catch(e => {
            console.log(e);
        });


```

### Create a template

```javascript

    const keys = {
        // sender address: 7GtqHorKL6CDZW6T98C8aGFNJXc87xoivZ
        secretKey: await EraChain.Base58.decode("5a4AabYQ54gdwYq83FNng96BTzzSL6bTxALcRFe9VZboLfzaUToZFnAdMsnNKM13NJZeCMJbykfQbNT9vryyhF4R"),
        publicKey: await EraChain.Base58.decode("ESx4g78k72URJWW87M4vKbMCqQpChzLfQ5s8gJhsjB7B")
    };

    const keyPair = new EraChain.Type.KeyPair(keys);

    const name = "Template 1234"; // MIN length 12 symbols
    const description = "My template";
    const icon = EraChain.base64ToArray(icon_base64string);
    const image = EraChain.base64ToArray(image_base64string);

    api.tranRawTemplate(keyPair, name, icon, image, description)
        .then(result => {
            /*
                result: {
                    raw: string;
                    size: number;
                    fee: number;
                    error?: any;
                }
            */
            if (!result.error) {
                api.broadcast(result.raw)
                    .then(data => {
                        // data = {status: "ok"}
                        console.log(data);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }
        })
        .catch(e => {
            console.log(e);
        });


```
