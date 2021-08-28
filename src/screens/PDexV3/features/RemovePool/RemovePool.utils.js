import {formValueSelector} from 'redux-form';
import convert from '@utils/convert';
import {PRV_ID} from '@src/constants/common';
import format from '@utils/format';

export const getInputAmount = (
  state,
  isGettingBalance,
  tokens,
  feeAmount
) => (formName, field) => {
  try {
    const token = tokens[field];
    if (!token || !token.tokenId) {
      return {
        amount: '',
        originalAmount: 0,
        loadingBalance: true
      };
    }

    const selector = formValueSelector(formName);

    const amountText = selector(state, field);
    let amount = convert.toNumber(amountText, true) || 0;
    const originalAmount = convert.toOriginalAmount(amount, token.pDecimals);

    let availableOriginalAmount = token.amount || 0;
    let availableAmountText = '';
    if (token.tokenId === PRV_ID && availableOriginalAmount > feeAmount) {
      availableOriginalAmount = availableOriginalAmount - feeAmount;
      availableAmountText = format.amountFull(convert.toInput(availableOriginalAmount), token?.pDecimals);
    }
    return {
      tokenId: token.tokenId,
      symbol: token.symbol,
      pDecimals: token.pDecimals,
      isMainCrypto: token.isMainCrypto,

      originalAmount,
      amountText,

      availableOriginalAmount,
      availableAmountText,

      loadingBalance: isGettingBalance.includes(token.tokenId),
      balance: token.amount,
      balanceStr: format.amountFull(token.amount, token.pDecimals, false),
    };
  } catch (error) {
    console.log('inputAmountSelector error', error);
  }
};
