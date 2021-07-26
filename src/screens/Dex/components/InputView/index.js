import React, { memo } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import InputAmount from '@screens/Dex/components/InputAmount';
import { mainStyle } from '@screens/Dex/style';
import { Divider } from 'react-native-elements';
import { Image } from '@components/core';
import addLiquidityIcon from '@assets/images/icons/add_liquidity.png';
import enhance from '@screens/Dex/components/InputView/enhance';
import { HEADER_TABS, SHARE_FIELD, USER_FEES } from '@screens/Dex/Liquidity.constants';
import InputAmountNormal from '@screens/Dex/components/InputAmountNormal';
import isEmpty from 'lodash/isEmpty';

const InputView = ({
  value,
  onChangeInputText,
  onChangeOutputText,
  onSelectOutputToken,
  isLoading,
  inputError,
  outputError,
  tabName,
  onChangeWithdrawFeeValue,
}) => {

  const {
    inputText,
    inputToken,
    inputBalance,
    outputToken,
    outputText,
    outputList,
    outputBalance,
    share,
    maxInputShare,
    withdrawFeeText
  } = value;

  const renderTwoInputView = () => {
    return(
      <View>
        <InputAmount
          token={inputToken}
          placeholder="0"
          disableChooseToken
          value={inputText}
          onChange={onChangeInputText}
          errorMessage={inputError}
          maxValue={tabName === HEADER_TABS.Add ? inputBalance : maxInputShare}
          fee={tabName === HEADER_TABS.Add ? USER_FEES : 0}
          disabled={isLoading}
        />
        <View style={mainStyle.arrowWrapper}>
          <Divider style={mainStyle.divider} />
          <Image source={addLiquidityIcon} style={mainStyle.arrow} />
          <Divider style={mainStyle.divider} />
        </View>
        <InputAmount
          token={outputToken}
          placeholder="0"
          tokens={outputList}
          value={outputText}
          loading={isLoading}
          onChange={onChangeOutputText}
          onSelectToken={onSelectOutputToken}
          errorMessage={outputError}
          maxValue={tabName === HEADER_TABS.Add ? outputBalance : 0}
          disabled={isLoading}
          disableChooseToken={isLoading || !outputToken}
          rightField={tabName === HEADER_TABS.Remove ? SHARE_FIELD.WITHDRAW_SHARE : undefined}
        />
      </View>
    );
  };

  const renderOneInputView = () => {
    return (
      <InputAmountNormal
        inputToken={inputToken}
        outputToken={outputToken}
        placeholder="0"
        disableChooseToken={isEmpty(outputList) || outputList.length === 1}
        value={withdrawFeeText}
        onChange={onChangeWithdrawFeeValue}
        errorMessage={inputError}
        maxValue={share}
        disabled={isLoading}
        loading={isLoading}
        tokens={outputList}
        onSelectToken={onSelectOutputToken}
      />
    );
  };

  const renderContent = () => {
    let component;
    switch (tabName) {
    case HEADER_TABS.Withdraw:
      component = renderOneInputView();
      break;
    default:
      component = renderTwoInputView();
    }
    return component;
  };

  return (renderContent());
};

InputView.propTypes = {
  value: PropTypes.object.isRequired,
  onChangeInputText: PropTypes.func.isRequired,
  onChangeOutputText: PropTypes.func.isRequired,
  onSelectOutputToken: PropTypes.func.isRequired,
  inputError: PropTypes.string.isRequired,
  outputError: PropTypes.string.isRequired,
  tabName: PropTypes.string.isRequired,
  onChangeWithdrawFeeValue: PropTypes.func.isRequired,
};

export default enhance(memo(InputView));
