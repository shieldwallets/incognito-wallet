import React from 'react';
import { useNavigationParam } from 'react-navigation-hooks';
import convertUtil from '@utils/convert';
import formatUtil from '@utils/format';
import { useSelector } from 'react-redux';
import {tradeSelector, tradingFeeSelector} from '@screens/DexV2/components/Trade/TradeV2/Trade.selector';

const withData = WrappedComp => (props) => {
  const inputToken = useNavigationParam('inputToken');
  const inputValue = useNavigationParam('inputValue');
  const rawText = useNavigationParam('inputText');
  const outputToken = useNavigationParam('outputToken');
  const outputValue = useNavigationParam('outputValue');
  const minimumAmount = useNavigationParam('minimumAmount');
  const inputBalance = useNavigationParam('inputBalance');
  const prvBalance = useNavigationParam('prvBalance');
  const pair = useNavigationParam('pair');
  const fee = useNavigationParam('fee');
  const feeToken = useNavigationParam('feeToken');
  const isErc20 = useNavigationParam('isErc20');
  const quote = useNavigationParam('quote');

  const { tradingFee } = useSelector(tradingFeeSelector)();

  const inputOriginal = convertUtil.toOriginalAmount(convertUtil.toNumber(rawText, true), inputToken.pDecimals);
  const inputText = formatUtil.amountFull(inputOriginal, inputToken.pDecimals);

  const {
    priority,
    slippage
  } = useSelector(tradeSelector);

  return (
    <WrappedComp
      {...{
        ...props,
        inputToken,
        inputValue,
        inputText,
        outputToken,
        outputValue,
        minimumAmount,
        fee,
        feeToken,
        pair,

        inputBalance,
        prvBalance,
        isErc20,
        quote,

        tradingFee,
        priority,
        slippage,
      }}
    />
  );
};

export default withData;
