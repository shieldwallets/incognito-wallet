import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useSelector } from 'react-redux';
import {liquiditySelector, inputViewValidatorSelector, mergeInputSelector} from '@screens/Dex/Liquidity.selector';
import { accountSelector } from '@src/redux/selectors';

const withData = WrappedComp => props => {
  const {
    tabName,
    isLoading,
    isFiltering
  } = useSelector(liquiditySelector);

  const {
    inputError,
    outputError
  } = useSelector(inputViewValidatorSelector);

  const {
    inputValue,
    outputValue,
    pair,
    outputToken,
  } = useSelector(mergeInputSelector);

  const account = useSelector(accountSelector.defaultAccount);

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          isLoading,
          isFiltering,
          tabName,
          inputError,
          outputError,
          account,
          inputValue,
          outputValue,
          pair,
          outputToken,
        }}
      />
    </ErrorBoundary>
  );
};

export default withData;
