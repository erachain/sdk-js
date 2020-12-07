import { Bytes } from '../core/src/core/Bytes';
import { Transaction } from '../core/src/core/transaction/Transaction';
import { TransactionAmount } from '../core/src/core/transaction/TransactionAmount';
import { BigDecimal } from '../core/src/BigDecimal';

describe('AmountPrecise', () => {

  const amount = new BigDecimal(989.7);

  it('BigDecimal to bytes with scaled', () => {
    let scaledAmount = amount;
    let diffScale = amount.getScale() - Transaction.AMOUNT_DEFAULT_SCALE;
    if (diffScale !== 0) {
        const num = amount.num * Math.pow(10, diffScale);
        if (diffScale < 0) {
            diffScale += Transaction.SCALE_MASK + 1;
        }
        scaledAmount = new BigDecimal(num);
    }

    expect(9897).toEqual(scaledAmount.unscaledValue());

    return Bytes.longToByteArray(scaledAmount.unscaledValue())
      .then((amountBytes: Int8Array) => {
        const bytes = Bytes.ensureCapacity(amountBytes, TransactionAmount.AMOUNT_LENGTH, 0)
        expect(new Int8Array([ 0, 0, 0, 0, 0, 0, 38, -87 ])).toEqual(bytes);
      })
      .catch(e => { console.log(e); expect(true).toBe(false); });

  });

});
