import {StyleSheet} from 'react-native';
import TradeInputAmount from '@components/core/TradeInputAmount/TradeInputAmount';
import createField from '@components/core/reduxForm/fields/createField';
import React from 'react';
import {BaseTextInput} from '@components/core';

const styled = StyleSheet.create({

});

const renderCustomField = (props) => {
  const { input, onChangeTextCustom, ...rest } = props;
  const { onChange, onFocus, onBlur, ...restInput } = input;
  return (
    <BaseTextInput
      {...{
        ...rest,
        ...restInput,
        onChangeText: (text) => {
          onChange(text);
        },
        onFocus: (event) => onFocus(event),
        onBlur: (event) => onBlur(event),
      }}
    />
  );
};

const RFNormalInput = createField({
  fieldName: 'RFNormalInput',
  render: renderCustomField,
});

renderCustomField.defaultProps = {};

renderCustomField.propTypes = {};

export default React.memo(RFNormalInput);
