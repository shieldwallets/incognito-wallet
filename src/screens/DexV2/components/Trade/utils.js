// eslint-disable-next-line import/no-cycle
import { getSlippagePercent } from '@screens/DexV2/components/Trade/TradeV2/Trade.utils';
// eslint-disable-next-line import/no-cycle
import { tradeSelector } from '@screens/DexV2/components/Trade/TradeV2/Trade.selector';
import _ from 'lodash';
import { COINS } from '@src/constants';
import BigNumber from 'bignumber.js';
import formatUtils from '@utils/format';
import { useSelector } from 'react-redux';

export const calculateOutputValueCrossPool = (pairs, inputToken, inputValue, outputToken) => {
  const firstPair = _.get(pairs, 0);
  const secondPair = _.get(pairs, 1);

  let currentInputToken = inputToken;
  let outputValue = inputValue;

  if (secondPair) {
    outputValue = calculateOutputValue(firstPair, currentInputToken, outputValue, COINS.PRV);
    currentInputToken = COINS.PRV;
  }

  outputValue = calculateOutputValue(secondPair || firstPair, currentInputToken, outputValue, outputToken);

  if (outputValue < 0) {
    outputValue = 0;
  }

  return outputValue;
};

export const calculateInputValueCrossPool = (pairs, inputToken, outputValue, outputToken) => {
  const firstPair   = _.get(pairs, 0);
  const secondPair  = _.get(pairs, 1);

  let currentOutputToken  = inputToken;
  let inputValue          = outputValue;

  if (secondPair) {
    inputValue = calculateInputValue(secondPair, COINS.PRV, inputValue, outputToken);
    currentOutputToken = COINS.PRV;
    inputValue = calculateInputValue(firstPair, inputToken, inputValue, currentOutputToken);
  } else {
    inputValue = calculateInputValue(firstPair, currentOutputToken, inputValue, outputToken);
  }

  if (inputValue < 0) {
    inputValue = 0;
  }

  return inputValue;
};

export const calculateOutputValue = (pair, inputToken, inputValue, outputToken) => {
  try {
    if (!pair) {
      return 0;
    }
    const inputPool = pair[inputToken.id];
    const outputPool = pair[outputToken.id];
    const initialPool = inputPool * outputPool;
    const newInputPool = inputPool + inputValue;
    const newOutputPoolWithFee = _.ceil(initialPool / newInputPool);
    return outputPool - newOutputPoolWithFee;
  } catch (error) {
    console.debug('CALCULATE OUTPUT', error);
  }
};

export const calculateInputValue = (pair, inputToken, outputValue, outputToken) => {
  try {
    const inputPool = pair[inputToken.id];
    const outputPool = pair[outputToken.id];
    const initialPool = inputPool * outputPool;
    return _.ceil((initialPool) / (outputPool - outputValue)) - inputPool;
  } catch (error) {
    console.debug('CALCULATE OUTPUT', error);
  }
};

const getImpact = (outputValue, poolOutput, slippage) => {
  outputValue = new BigNumber(outputValue);
  poolOutput = new BigNumber(poolOutput);
  return outputValue
    .multipliedBy(100)
    .dividedBy(getSlippagePercent(slippage))
    .dividedBy(poolOutput)
    .toNumber();
};

export const calculateSizeImpact = (outputValue, outputToken, pair, slippage) => {
  const outputTokenId = outputToken?.id;
  let poolOutput = 0;
  const { quote } = useSelector(tradeSelector);
  if (pair && outputTokenId) {
    pair.forEach(pairItem => {
      if (pairItem && pairItem[outputTokenId]) {
        poolOutput = pairItem[outputTokenId];
      }
    });
  }
  if (outputValue && poolOutput && (!quote || quote?.protocol === 'PDex')) {
    let impact = getImpact(outputValue, poolOutput, slippage);
    impact = formatUtils.fixedNumber(impact, 3) || 0.01;
    if (!isNaN(impact) && impact > 0 && slippage >= 0) {
      const formatSeparator = formatUtils.amount(impact);
      return {
        impact: formatSeparator,
        showWarning: impact > 10
      };
    }
  }
  return {
    impact: null,
    showWarning: false
  };
};
