
# Описание

JS библиотека для шифрования сообщений в EraChain сети.

# Install via npm

npm install --save erachain-js-api

### Usage:

```javascript
    const EraChain =  require('erachain-js-api');
```

# Install for html

git clone https://lab.erachain.org/erachain/web-js-encrypt.git

npm run build

npm run prodjs

### Usage:

    download dist/ directory

# Npm module publish

npm publish

## API

```javascript

    // Base58

    const base58string: string = await EraChain.Base58.encode(int8Array);
    const int8Array: Int8Array = await EraChain.Base58.decode(base58string);

    // Crypt

    // Generate new key pair (secret key && public key)
    const keys: {
        [secretKey]: Int8Array,
        [publicKey]: Int8Array
    } = await EraChain.Crypt.generateKeys();

    const address: string = await EraChain.Crypt.addressByPublicKey(publicKeyInt8Array);

    const address: string = await EraChain.Crypt.addressBySecretKey(secretKeyInt8Array);

    const publicKeyInt8Array: Int8Array = await EraChain.Crypt.publicKeyBySecretKey(secretKeyInt8Array);

    const publicKeyStringBase58: string = await EraChain.Base58.encode(publicKeyInt8Array);

    const secretKeyStringBase58: string = await EraChain.Base58.encode(secretKeyInt8Array);

    const int8Array: Int8Array = await EraChain.Base58.decode(stringBase58);

    ## Signature
    const message: Int8Array = EraChain.Bytes.stringToByteArray(messageString);
    const signed: Int8Array = EraChain.Crypt.sign(messageInt8Array, secretKeyInt8Array);
    

```