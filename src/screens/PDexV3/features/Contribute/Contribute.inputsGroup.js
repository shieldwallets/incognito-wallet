import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import {AddBreakLine} from '@components/core';
import withInput from '@screens/PDexV3/features/Contribute/Contribute.enhanceInput';
import {useSelector} from 'react-redux';
import {
  contributeDataSelector,
  inputAmountSelector
} from '@screens/PDexV3/features/Contribute/Contribute.selector';
import styled from '@screens/PDexV3/features/Contribute/Contribute.styled';
import {Field} from 'redux-form';
import {formConfigs} from '@screens/PDexV3/features/Contribute/Contribute.constant';
import {validator, RFTradeInputAmount as TradeInputAmount} from '@components/core/reduxForm';

const InputsGroup = ({ onChangeInput, onChangeOutput }) => {
  const { inputToken, outputToken } = useSelector(contributeDataSelector);
  const amountSelector = useSelector(inputAmountSelector);
  const inputAmount = amountSelector(formConfigs.formName, formConfigs.inputToken);
  const outputAmount = amountSelector(formConfigs.formName, formConfigs.outputToken);
  return (
    <View style={styled.wrapInput}>
      <Field
        component={TradeInputAmount}
        name={formConfigs.inputToken}
        hasInfinityIcon
        symbol={inputToken && inputToken?.symbol}
        validate={[
          ...validator.combinedAmount,
        ]}
        onChange={onChangeInput}
        editableInput={!inputAmount.loadingBalance}
        loadingBalance={inputAmount.loadingBalance}
      />
      <AddBreakLine />
      <Field
        component={TradeInputAmount}
        name={formConfigs.outputToken} //
        hasInfinityIcon
        symbol={outputToken && outputToken?.symbol}
        validate={[
          ...validator.combinedAmount,
        ]}
        onChange={onChangeOutput}
        editableInput={!outputAmount.loadingBalance}
        loadingBalance={outputAmount.loadingBalance}
      />
    </View>
  );
};

InputsGroup.propTypes = {
  onChangeInput: PropTypes.func.isRequired,
  onChangeOutput: PropTypes.func.isRequired
};

export default withInput(React.memo(InputsGroup));
