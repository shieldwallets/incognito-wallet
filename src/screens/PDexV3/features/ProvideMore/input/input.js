import React, {memo, useMemo} from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import Header from '@components/Header/Header';
import {RoundCornerButton, Text} from '@components/core';
import {coinStyles as coinStyled} from '@screens/PDexV3/features/ProvideHome/ProvideHome.styled';
import {useDispatch, useSelector} from 'react-redux';
import {
  coinSelector, disableBtnProvide,
  validateSelector
} from '@screens/PDexV3/features/ProvideMore';
import {createForm, RFTradeInputAmount as TradeInputAmount, validator} from '@components/core/reduxForm';
import {formConfigs} from '@screens/PDexV3/features/ProvideMore/ProvideMore.constant';
import {change, Field} from 'redux-form';

const initialFormValues = {
  input: ''
};

const Form = createForm(formConfigs.formName, {
  initialValues: initialFormValues,
  destroyOnUnmount: true,
  enableReinitialize: true,
});

const CustomInput = React.memo(() => {
  const dispatch = useDispatch();
  const onChangeText = (text) => dispatch(change(formConfigs.formName, formConfigs.input, text));
  const validatorInput = useSelector(validateSelector);
  return(
    <Field
      component={TradeInputAmount}
      name={formConfigs.input}
      hasInfinityIcon
      validate={[
        ...validator.combinedAmount,
        validatorInput
      ]}
      onChange={onChangeText}
      editableInput
    />
  );
});

const Input = () => {
  const coin = useSelector(coinSelector);
  const disabled = useSelector(disableBtnProvide);
  return (
    <View style={mainStyle.container}>
      <Header title="Provide" />
      <View style={coinStyled.coinContainer}>
        <Form>
          {({ handleSubmit }) => (
            <>
              <CustomInput />
              {!!coin && <Text style={coinStyled.coinExtra}>{coin.displayInterest}</Text>}
              <RoundCornerButton
                title="Provide liquidity"
                style={coinStyled.button}
                disabled={disabled}
              />
            </>
          )}
        </Form>
      </View>
    </View>
  );
};

Input.propTypes = {};


export default memo(Input);
