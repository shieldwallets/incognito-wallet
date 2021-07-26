import { ceil, isNaN, floor, isNumber } from 'lodash';
import formatUtils from '@utils/format';
import BigNumber from 'bignumber.js';

export const DEX = {
  MAIN_ACCOUNT: 'pDEX',
  WITHDRAW_ACCOUNT: 'pDEXWithdraw',
};

export default {
  isDEXAccount(accountName) {
    if (!accountName) {
      return false;
    }

    const name = accountName.toLowerCase();
    return name === DEX.WITHDRAW_ACCOUNT.toLowerCase() || name === DEX.MAIN_ACCOUNT.toLowerCase();
  },

  isDEXMainAccount(accountName) {
    if (!accountName) {
      return false;
    }

    const name = accountName.toLowerCase();
    return name === DEX.MAIN_ACCOUNT.toLowerCase();
  },

  isDEXWithdrawAccount(accountName) {
    if (!accountName) {
      return false;
    }

    const name = accountName.toLowerCase();
    return name === DEX.WITHDRAW_ACCOUNT.toLowerCase();
  },

  getPair(tokenId1, tokenId2, pairs) {
    return pairs.find(pair => {
      const keys = Object.keys(pair);
      return keys.includes(tokenId1) && keys.includes(tokenId2);
    });
  },

  calculateValue(inputToken, inputValue, outputToken, pair, isInput) {
    if (!pair) {
      return;
    }
    if (!outputToken || !isNumber(inputValue) || isNaN(inputValue) || !inputValue) {
      return { outputValue: 0, outputText: '0' };
    }
    const inputPool = pair[inputToken.id];
    const outputPool = pair[outputToken.id];
    const number = new BigNumber(inputValue).multipliedBy(outputPool).dividedBy(inputPool).toNumber();
    const outputValue = isInput ? floor(number) : ceil(number);
    const outputText = formatUtils.amountFull(outputValue, outputToken.pDecimals);
    return { outputValue, outputText, pair };
  }
};
