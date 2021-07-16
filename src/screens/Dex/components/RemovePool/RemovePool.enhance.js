import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useSelector } from 'react-redux';
import { mergeInputSelector } from '@screens/Dex/Liquidity.selector';

const removePoolEnhance = WrappedComp => props => {
  const {
    inputToken,
    inputValue,
    outputToken,
    outputValue,
    pair,
    inputBalance,
    outputBalance,
    totalShare,
    share,
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
          totalShare,
          share,
          fee
        }}
      />
    </ErrorBoundary>
  );
};

export default removePoolEnhance;
