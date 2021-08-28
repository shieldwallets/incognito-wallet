import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import {AddBreakLine} from '@components/core';
import withInput from '@screens/PDexV3/features/CreatePool/CreatePool.enhanceInput';
import {useSelector} from 'react-redux';
import styled from '@screens/PDexV3/features/CreatePool/CreatePool.styled';
import {Field} from 'redux-form';
import {RFTradeInputAmount as TradeInputAmount, validator} from '@components/core/reduxForm';
import {formConfigs} from '@screens/PDexV3/features/CreatePool/CreatePool.constant';
import {inputAmountSelector} from '@screens/PDexV3/features/CreatePool/CreatePool.selector';

const InputsGroup = ({ onChange, onPressInputSymbol, onPressOutputSymbol }) => {
  const inputAmount = useSelector(inputAmountSelector);
  const inputToken = inputAmount(formConfigs.formName, formConfigs.inputToken);
  const outputToken = inputAmount(formConfigs.formName, formConfigs.outputToken);
  return (
    <View style={styled.wrapInput}>
      <Field
        component={TradeInputAmount}
        name={formConfigs.inputToken}
        hasInfinityIcon
        canSelectSymbol
        symbol={inputToken && inputToken?.symbol}
        validate={[
          ...validator.combinedAmount,
        ]}
        onChange={(text) => {
          if (typeof onChange === 'function') {
            onChange({ text, field: formConfigs.inputToken });
          }
        }}
        editableInput={!inputToken.loadingBalance}
        loadingBalance={inputToken.loadingBalance}
        onPressSymbol={onPressInputSymbol}
      />
      <AddBreakLine />
      <Field
        component={TradeInputAmount}
        name={formConfigs.outputToken}
        hasInfinityIcon
        canSelectSymbol
        symbol={outputToken && outputToken?.symbol}
        validate={[
          ...validator.combinedAmount,
        ]}
        onChange={(text) => {
          if (typeof onChange === 'function') {
            onChange({ text, field: formConfigs.outputToken });
          }
        }}
        editableInput={!outputToken.loadingBalance}
        loadingBalance={outputToken.loadingBalance}
        onPressSymbol={onPressOutputSymbol}
      />
    </View>
  );
};

InputsGroup.propTypes = {
  onChange: PropTypes.func.isRequired,
  onPressInputSymbol: PropTypes.func.isRequired,
  onPressOutputSymbol: PropTypes.func.isRequired,
};

export default withInput(React.memo(InputsGroup));
