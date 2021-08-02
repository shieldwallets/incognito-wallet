import React from 'react';
import PropTypes from 'prop-types';
import { isNumber } from 'lodash';
import formatUtil from '@utils/format';
import ExtraInfo from '@screens/DexV2/components/ExtraInfo';
import BigNumber from 'bignumber.js';

const ExchangeRate = React.memo((props) => {
  const {
    inputToken,
    inputValue,
    outputToken,
    outputValue,
  } = props;

  if (
    !outputToken ||
    !outputValue ||
    !isNumber(outputValue) ||
    !inputValue || !isNumber(inputValue)
  ) {
    return null;
  }

  const rawRate = Math.floor(new BigNumber(outputValue).dividedBy(inputValue / Math.pow(10, inputToken.pDecimals || 0)).toNumber());

  return (
    <ExtraInfo
      left="Exchange Rate"
      right={`1 ${inputToken.symbol} = ${formatUtil.amount(rawRate, outputToken.pDecimals)} ${outputToken?.symbol}`}
    />
  );
});

ExchangeRate.propTypes = {
  inputToken: PropTypes.object.isRequired,
  inputValue: PropTypes.number.isRequired,
  outputToken: PropTypes.object.isRequired,
  outputValue: PropTypes.number.isRequired,
};

export default ExchangeRate;
