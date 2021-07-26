import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useSelector } from 'react-redux';
import { mergeInputSelector } from '@screens/Dex/Liquidity.selector';

const withDrawFeeEnhance = WrappedComp => (props) => {
  const {
    inputToken,
    inputValue,
    outputToken,
    outputValue,
    pair,
    inputBalance,
    outputBalance,
    share,
    totalShare,
    fee
  } = useSelector(mergeInputSelector);

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          inputToken,
          inputValue,
          outputToken,
          outputValue,
          pair,
          inputBalance,
          outputBalance,
          share,
          totalShare,
          fee,
        }}
      />
    </ErrorBoundary>
  );
};

export default withDrawFeeEnhance;
