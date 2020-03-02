(function(root, factory) {
  'use strict'
  
  if (typeof root === 'object') {
    root.EraChain = factory();
    console.log("root: ", root);
  } else if (typeof exports === 'object' && typeof module === 'object') {
    module.exports.EraChain = factory();
    console.log("module.exports: ", module.exports);
  } else if(typeof exports === 'object') {
    exports.EraChain = factory();
    console.log("exports: ", exports);
  } 

})(window, function() {
  'use strict'

  const { Base58 } = require('./core/crypt/libs/Base58');
  const { Bytes } = require('./core/src/core/Bytes');
  const { AppCrypt } = require('./core/crypt/AppCrypt');
  const { KeyPair } = require('./core/src/core/account/KeyPair');
  const { tranMessage } = require('./core/api/TranMessage');

  const crypt = require('./core/crypt/libs/aesCrypt');

  const lib = {
    Base58,
    Bytes,
    Crypt: {
      generateKeys: AppCrypt.generateKeys,
      KeyPair,
      addressByPublicKey: AppCrypt.getAccountAddressFromPublicKey,
      addressBySecretKey: AppCrypt.getAddressBySecretKey,
      publicKeyBySecretKey: AppCrypt.getPublicKeyBySecretKey,
      sign: AppCrypt.sign,
      verifySign: AppCrypt.verifySign,
      encryptMessage: crypt.encryptMessage,
      decryptMessage: crypt.decryptMessage,
    },
    Tran: {
      tranMessage,
    },
  };
  return lib;

})






