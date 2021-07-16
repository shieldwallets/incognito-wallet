import React, { memo } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import stylesheet from '@screens/DexV2/components/NewInput/style';
import isEmpty from 'lodash/isEmpty';
import { ActivityIndicator, Text, TouchableOpacity } from '@components/core';
import styles from '@screens/DexV2/components/Trade/style';
import Input from '@screens/DexV2/components/NewInput/Input';
import { PRV } from '@src/constants/common';
import formatUtils from '@utils/format';
import { BtnInfinite } from '@components/Button';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import { RightIcon } from '@screens/Dex/components/InputAmount';

const InputAmountNormal = (props) => {
  const {
    value,
    onChange,
    disabled,
    loading,
    maxValue,
    placeholder,
    errorMessage,
    onPressMax,
    inputToken,
    outputToken,
    fee,
    tokens,
    onSelectToken,
    disableChooseToken,
  } = props;
  const navigation = useNavigation();

  const renderTextInput = () => (
    <Input
      style={{ flex: 1, alignItems: 'stretch', paddingRight: 10 }}
      onChange={onChange}
      value={value}
      disabled={disabled}
      placeholder={placeholder}
    />
  );

  const renderLoading = () => {
    if (!loading) return null;
    return (<ActivityIndicator />);
  };

  const onTokenPress = () => {
    if (isEmpty(tokens) || tokens.length === 1) return;
    navigation.navigate(routeNames.TwoTokensSelect, { tokens, onSelectToken });
  };

  const renderToken = () => (
    <TouchableOpacity
      onPress={onTokenPress}
      style={stylesheet.centerJustify}
    >
      <View style={stylesheet.token}>
        {!!inputToken && !!outputToken && (
          <Text style={stylesheet.bigText}>
            {`${inputToken.symbol}-${outputToken.symbol}`}
          </Text>
        )}
        {!disableChooseToken && <RightIcon />}
      </View>
    </TouchableOpacity>
  );

  const handlePressMax = () => {
    if (typeof onPressMax === 'function') {
      onPressMax();
    }
    onChange(`${formatUtils.amountFull(maxValue, PRV.pDecimals)}`);
  };

  const renderButtonInfinite = () => {
    if (!!loading || !maxValue || maxValue < fee) return null;

    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <BtnInfinite onPress={handlePressMax} />
      </View>
    );
  };

  return (
    <>
      <View style={[stylesheet.row, stylesheet.justifyBetween]}>
        {renderTextInput()}
        <View style={{ marginRight: 15, alignSelf: 'center' }}>
          {renderLoading()}
          {renderButtonInfinite()}
        </View>
        {renderToken()}
      </View>
      {!isEmpty(errorMessage) && <Text style={[ styles.error, { marginTop: 15 } ]}>{errorMessage}</Text>}
    </>
  );
};

InputAmountNormal.defaultProps = {
  value: undefined,
  onChange: undefined,
  disabled: false,
  loading: false,
  maxValue: undefined,
  placeholder: '',
  errorMessage: '',
  onPressMax: null,
  inputToken: undefined,
  outputToken: undefined,
  fee: 0,
  tokens: [],
  disableChooseToken: true,
};

InputAmountNormal.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  maxValue: PropTypes.string,
  placeholder: PropTypes.string,
  errorMessage: PropTypes.string,
  onPressMax: PropTypes.func,
  inputToken: PropTypes.object,
  outputToken: PropTypes.object,
  fee: PropTypes.number,
  tokens: PropTypes.array,
  onSelectToken: PropTypes.func.isRequired,
  disableChooseToken: PropTypes.bool,
};

export default memo(InputAmountNormal);
