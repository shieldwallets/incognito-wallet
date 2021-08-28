import React, {memo} from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import {Field} from 'redux-form';
import {RFTradeInputAmount as TradeInputAmount, validator} from '@components/core/reduxForm';
import {formConfigs} from '@screens/PDexV3/features/RemovePool/RemovePool.constant';
import {AddBreakLine} from '@components/core';
import styled from '@screens/PDexV3/features/RemovePool/RemovePool.styled';
import {useSelector} from 'react-redux';
import {inputAmountSelector} from '@screens/PDexV3/features/RemovePool/RemovePool.selector';
import withInput from './RemovePool.enhanceInput';

const InputsGroup = ({ onChangeInput, onChangeOutput, onPressMax }) => {
  const inputAmount = useSelector(inputAmountSelector);
  const inputToken = inputAmount(formConfigs.formName, formConfigs.inputToken);
  const outputToken = inputAmount(formConfigs.formName, formConfigs.outputToken);
  return (
    <View style={styled.wrapInput}>
      <Field
        component={TradeInputAmount}
        name={formConfigs.inputToken}
        validate={[
          ...validator.combinedAmount,
        ]}
        symbol={inputToken && inputToken?.symbol}
        onChange={onChangeInput}
        hasInfinityIcon
        onPressInfinityIcon={onPressMax}
      />
      <AddBreakLine />
      <Field
        component={TradeInputAmount}
        name={formConfigs.outputToken}
        validate={[
          ...validator.combinedAmount,
        ]}
        symbol={outputToken && outputToken?.symbol}
        onChange={onChangeOutput}
      />
    </View>
  );
};

InputsGroup.propTypes = {
  onPressMax: PropTypes.func.isRequired,
  onChangeInput: PropTypes.func.isRequired,
  onChangeOutput: PropTypes.func.isRequired,
};

export default withInput(memo(InputsGroup));
