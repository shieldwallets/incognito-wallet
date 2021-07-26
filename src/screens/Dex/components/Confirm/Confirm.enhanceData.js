import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useNavigationParam } from 'react-navigation-hooks';
import { useSelector } from 'react-redux';
import { liquiditySelector, mergeInputSelector } from '@screens/Dex/Liquidity.selector';

const withConfirmData = WrappedComp => props => {
  const {
    title,
    subTitle,
    successTitle,
    successDesc,
  } = useNavigationParam('title');
  const onNavSuccess = useNavigationParam('onNavSuccess');

  const {
    tabName,
  } = useSelector(liquiditySelector);

  const {
    pair,
    share,
    totalShare,
    inputValue,
    inputToken,

    outputValue,
    outputToken,
    fee,
    inputBalance,
    outputBalance,
    maxInputShare,
    maxInputShareOriginal,
    maxOutputShare,
    sharePercent,
    withdrawFeeValue,
    withdrawFeeText,
  } = useSelector(mergeInputSelector);

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          title,
          subTitle,
          successTitle,
          successDesc,

          tabName,
          inputValue,
          outputValue,
          pair,
          share,
          totalShare,
          inputToken,
          outputToken,
          fee,
          inputBalance,
          outputBalance,
          onNavSuccess,
          maxInputShare,
          maxOutputShare,
          sharePercent,
          withdrawFeeValue,
          withdrawFeeText,
          maxInputShareOriginal,
        }}
      />
    </ErrorBoundary>
  );
};

export default withConfirmData;
