(function(root, factory) {
  'use strict'
  
  if (typeof root === 'object') {
    root.EraChain = factory();
  } else if (typeof exports === 'object' && typeof module === 'object') {
    module.exports.EraChain = factory();
  } else if(typeof exports === 'object') {
    exports.EraChain = factory();
  } 

})(window, function() {
  'use strict'

  const { Base58 } = require('./core/crypt/libs/Base58');
  const { Bytes } = require('./core/src/core/Bytes');
  const { AppCrypt } = require('./core/crypt/AppCrypt');
  const { KeyPair } = require('./core/src/core/account/KeyPair');
  const { sendMessage } = require('./core/api/SendMessage');
  const { sendAsset } = require('./core/api/SendAsset');
  const { BigDecimal } = require('./core/src/BigDecimal');

  const crypt = require('./core/crypt/libs/aesCrypt');

  const lib = {
    Base58,
    Bytes,
    BigDecimal,
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
      sendMessage,
      sendAsset
    },
  };
  return lib;

})






