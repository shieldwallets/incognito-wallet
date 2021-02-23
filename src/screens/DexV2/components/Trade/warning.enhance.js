import React, { useMemo } from 'react';
import { calculateSizeImpact } from './utils';

const WARNING_STR = 'Do note that due to trade size, the price of this trade varies significantly from market price.';
const withWarning = (WrappedComp) => (props) => {
  const {
    outputToken,
    minimumAmount,
    pair,
    slippage
  } = props;

  const {
    impact: impactValue,
    showWarning
  } = calculateSizeImpact(minimumAmount, outputToken, pair, slippage);

  const warning = useMemo(() => {
    return impactValue && showWarning ? WARNING_STR : '';
  }, [impactValue, showWarning]);

  return (
    <WrappedComp
      {...{
        ...props,
        warning,
      }}
    />
  );
};

export default withWarning;
