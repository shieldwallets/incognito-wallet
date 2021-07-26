import React, { memo } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { Header } from '@src/components';
import { compose } from 'recompose';
import withConfirmData from '@screens/Dex/components/Confirm/Confirm.enhanceData';
import {FlexView, RoundCornerButton, ScrollView, Text} from '@components/core';
import styles from '@screens/DexV2/components/TradeConfirm/style';
import Shares from '@screens/Dex/components/Shares';
import { HEADER_TABS } from '@screens/Dex/Liquidity.constants';
import withAccount from '@screens/DexV2/components/account.enhance';
import ExtraInfo from '@screens/DexV2/components/ExtraInfo';
import NetworkFee from '@screens/Dex/components/NetworkFee';
import formatUtil from '@utils/format';
import Balance from '@screens/DexV2/components/Balance';
import ExchangeRate from '@screens/Dex/components/ExchangeRate';
import PoolSize from '@screens/Dex/components/PoolSize';
import withSuccess from '@screens/Dex/components/Confirm/Confirm.enhanceSuccess';
import withTransaction from '@screens/Dex/components/Confirm/Confirm.enhanceTransaction';

const Confirm = (props) => {
  const {
    title,
    subTitle,
    tabName,
    inputValue,
    outputValue,
    pair,
    share,
    totalShare,
    inputToken,
    outputToken,
    fee,
    account,
    inputBalance,
    outputBalance,
    loading,
    error,
    onConfirmPress,
    withdrawFeeText,
  } = props;

  const getAmountValue = () => {
    if (tabName === HEADER_TABS.Withdraw) return `${withdrawFeeText} ${inputToken.symbol}`;
    let inputText = `${formatUtil.amountFull(inputValue, inputToken.pDecimals)} ${inputToken.symbol}`;
    let outputText = ` + ${formatUtil.amountFull(outputValue, outputToken.pDecimals)} ${outputToken.symbol}`;
    return inputText + outputText;
  };

  return (
    <FlexView style={{ marginHorizontal: 25 }}>
      <Header title={title} />
      <ScrollView paddingBottom>
        <View style={styles.mainInfo}>
          <Text style={styles.bigText}>{subTitle}</Text>
          <Text style={styles.bigText} numberOfLines={3}>{getAmountValue()}</Text>
        </View>
        {tabName !== HEADER_TABS.Add && (
          <Shares
            totalShare={totalShare}
            share={share}
            token={inputToken}
          />
        )}
        <Balance
          title={`${inputToken.symbol} Balance`}
          token={inputToken}
          balance={inputBalance}
          hideRightSymbol
        />
        {!!outputToken &&(
          <Balance
            title={`${outputToken ? outputToken.symbol : ''} Balance`}
            token={outputToken}
            balance={outputBalance}
            hideRightSymbol
          />
        )}
        <ExtraInfo
          left="Destination"
          right={account.name}
        />
        <ExchangeRate
          inputToken={inputToken}
          inputValue={inputValue}
          outputToken={outputToken}
          outputValue={outputValue}
        />
        <PoolSize
          inputToken={inputToken}
          pair={pair}
          outputToken={outputToken}
        />
        <NetworkFee title="Fee" fee={fee} />
        {!!error && <Text style={styles.error}>{error}</Text>}
        <RoundCornerButton
          style={styles.button}
          title={title}
          onPress={onConfirmPress}
          disabled={loading || error}
        />
      </ScrollView>
    </FlexView>
  );
};

Confirm.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired,
  tabName: PropTypes.string.isRequired,
  inputValue: PropTypes.number.isRequired,
  outputValue: PropTypes.number.isRequired,
  pair: PropTypes.object,
  outputToken: PropTypes.object.isRequired,
  inputToken: PropTypes.object.isRequired,
  fee: PropTypes.number.isRequired,
  account: PropTypes.object.isRequired,
  share: PropTypes.number.isRequired,
  totalShare: PropTypes.number.isRequired,
  inputBalance: PropTypes.number.isRequired,
  outputBalance: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onConfirmPress: PropTypes.func.isRequired,
  withdrawFeeText: PropTypes.string.isRequired,
};

Confirm.defaultProps = {
  pair: undefined,
  error: ''
};

export default compose(
  withAccount,
  withConfirmData,
  withSuccess,
  withTransaction,
)(memo(Confirm));
