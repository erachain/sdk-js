import { PersonHuman } from '../src/core/item/persons/PersonHuman';
import { PublicKeyAccount } from '../src/core/account/PublicKeyAccount';
import { KeyPair } from '../src/core/account/KeyPair';
import { BigDecimal } from '../src/BigDecimal';
import { Documents } from '../src/core/item/documents/Documents';
import { ExData } from '../src/core/item/documents/ExData';
import { ExLink } from '../src/core/item/documents/ExLink';
import { Imprint } from '../src/core/item/imprint/Imprint';
import { Template } from '../src/core/item/template/Template';
import { ChainMode } from '../types/era/IApiConfig';
import { ETransferType } from '../src/core/transaction/TranTypes';

export const Type = {
  BigDecimal,
  PersonHuman,
  PublicKeyAccount,
  KeyPair,
  Documents,
  ExData,
  ExLink,
  Imprint,
  Template,
  ETransferType,
  ChainMode,
};
