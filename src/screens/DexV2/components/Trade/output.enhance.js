import React from 'react';
import _ from 'lodash';
import formatUtils from '@utils/format';
import { MIN_PERCENT } from '@screens/DexV2/constants';
import { v4 } from 'uuid';
import { COINS } from '@src/constants';
import { calculateOutputValue as calculateOutput } from './utils';

const withCalculateOutput = WrappedComp => (props) => {
  const [outputValue, setOutputValue] = React.useState(0);
  const [outputText, setOutputText] = React.useState('0');
  const [minimumAmount, setMinimumAmount] = React.useState(0);
  const [gettingQuote, setGettingQuote] = React.useState(false);
  const [quote, setQuote] = React.useState(null);

  const { inputToken, inputValue, outputToken, pair, min } = props;

  const calculateOutputValue = () => {
    const firstPair = _.get(pair, 0);
    const secondPair = _.get(pair, 1);

    let currentInputToken = inputToken;
    let outputValue = inputValue;

    if (secondPair) {
      outputValue = calculateOutput(firstPair, currentInputToken, outputValue, COINS.PRV);
      currentInputToken = COINS.PRV;
    }

    outputValue = calculateOutput(secondPair || firstPair, currentInputToken, outputValue, outputToken);

    if (outputValue < 0) {
      outputValue = 0;
    }

    setOutputValue(outputValue);

    const minPercent = _.toNumber(min) / 100;
    const minimumAmount = _.floor(outputValue * minPercent);
    setMinimumAmount(minimumAmount);

    let outputText = formatUtils.amountFull(minimumAmount, outputToken.pDecimals);

    if (outputValue === 0 || minimumAmount === 0 || _.isNaN(minimumAmount)) {
      outputText = 0;
    }

    setOutputText(outputText.toString());

    // console.debug('TOKEN', inputToken.symbol, outputToken.symbol, outputToken.pDecimals, inputValue);
    // console.debug('PAIR', pair, pair[inputToken.id], pair[outputToken.id]);
    // console.debug('RESULT', outputValue, minimumAmount, outputText, outputValue === 0 || minimumAmount === 0 || isNaN(outputText));
  };

  React.useEffect(() => {
    if (inputToken && outputToken && inputToken.id !== outputToken.id && inputValue) {
      calculateOutputValue();
    }

    if (!inputValue) {
      setOutputValue(0);
      setOutputText(0);
      setMinimumAmount(0);
    }
  }, [inputToken, inputValue, outputToken, pair, min]);

  return (
    <WrappedComp
      {...{
        ...props,
        outputValue,
        outputText,
        minimumAmount,
        quote,
        gettingQuote,
      }}
    />
  );
};

export default withCalculateOutput;
