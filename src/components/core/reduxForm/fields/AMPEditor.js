import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import BaseTextInput from '@components/core/BaseTextInput';
import {COLORS, FONT} from '@src/styles';
import createField from '@components/core/reduxForm/fields/createField';
import {Row} from '@src/components';

const styled = StyleSheet.create({
  input: {
    width: '100%',
    color: COLORS.black,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.large + 2,
    fontFamily: FONT.NAME.bold,
  },
  title: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.large + 2,
    color: COLORS.black,
    marginBottom: 5
  }
});

const AMPEditor = React.memo((props) => {
  const { ...rest } = props || {};
  return (
    <View>
      <Row>
        <Text style={styled.title}>AMP</Text>
      </Row>
      <BaseTextInput
        style={{
          ...styled.input,
        }}
        keyboardType="decimal-pad"
        ellipsizeMode="tail"
        numberOfLines={1}
        placeholder="0"
        {...rest}
      />
    </View>

  );
});

const renderCustomField = (props) => {
  const { input, ...rest } = props;
  const { onChange, ...restInput } = input;
  return (
    <AMPEditor
      {...{
        ...rest,
        ...restInput,
        onChangeText: (text) => {
          onChange(text);
        },
      }}
    />
  );
};

const RFTAMPEditor = createField({
  fieldName: 'RFTAMPEditor',
  render: renderCustomField,
});

renderCustomField.defaultProps = {};

renderCustomField.propTypes = {};

export default React.memo(RFTAMPEditor);
