import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useSelector } from 'react-redux';
import { mergeInputSelector } from '@screens/Dex/Liquidity.selector';

const addPoolEnhance = WrappedComp => (props) => {
  const {
    inputToken,
    inputValue,
    outputToken,
    outputValue,
    pair,
    inputBalance,
    outputBalance,
    fee,
  } = useSelector(mergeInputSelector);

  // const onNextPress = async () => {
  //   await accountServices.createAndSendTxWithContribution({
  //     account,
  //     wallet,
  //     tokenID1: inputToken?.id,
  //     tokenID2: outputToken?.id,
  //     contributedAmount1: inputValue,
  //     contributedAmount2: outputValue,
  //     fee: TRANSACTION_FEE
  //   });
  // };

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
          fee
        }}
      />
    </ErrorBoundary>
  );
};

export default addPoolEnhance;
