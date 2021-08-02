import React from 'react';
import { View } from 'react-native';
import {Header} from '@src/components';
import Balance from '@screens/DexV2/components/Balance';
import { RoundCornerButton, ScrollView, Text } from '@components/core';
import styles from '@screens/DexV2/components/TradeConfirm/style';
import ExtraInfo from '@screens/DexV2/components/ExtraInfo';
import formatUtil from '@utils/format';
import ExchangeRate from '@screens/Dex/components/ExchangeRate';
import { compose } from 'recompose';
import withTransaction from '@screens/Dex/features/ConfirmRetry/enhanceTransaction';
import PropTypes from 'prop-types';

const ConfirmRetry = React.memo((props) => {
  const {
    isRetry,
    retryAmount,
    refundAmount,
    account,
    onConfirmPress,
    retryToken,
    refundToken,
    error,
  } = props;

  const balanceFactories = React.useMemo(() => (
    [{
      token: retryToken,
      balance: retryToken?.amount,
    }, {
      token: refundToken,
      balance: refundToken?.amount,
    }]
  ), [retryToken, refundToken]);

  const renderBalance = ({ token, balance }) => {
    if (!token || balance === undefined) return null;
    return (
      <Balance
        key={token?.tokenId}
        title={`${token.symbol} Balance`}
        token={token}
        balance={balance}
        hideRightSymbol
      />
    );
  };

  const renderExchangeRate = () => {
    if (!retryAmount || !refundAmount) return null;
    return (
      <ExchangeRate
        inputToken={retryToken}
        inputValue={retryAmount}
        outputToken={refundToken}
        outputValue={refundAmount}
      />
    );
  };

  const getRefundText = () => {
    const token = isRetry ? retryToken : refundToken;
    const amount = isRetry ? retryAmount : refundAmount;
    return `${formatUtil.amountFull(amount, token.pDecimals)} ${token.symbol}` || '';
  };

  return (
    <View style={{ flex: 1, marginHorizontal: 25 }}>
      <Header title="Liquidity" />
      <ScrollView>
        <View style={styles.mainInfo}>
          <Text style={styles.bigText}>{isRetry ? 'Retry add liquidity' : 'Refund liquidity'}</Text>
          <Text style={styles.bigText} numberOfLines={3}>{getRefundText()}</Text>
        </View>
        {balanceFactories.map(renderBalance)}
        <ExtraInfo
          left="Destination"
          right={account.name}
        />
        {renderExchangeRate()}
        {!!error && <Text style={styles.error}>{error}</Text>}
        <RoundCornerButton
          style={styles.button}
          title={isRetry ? 'Retry add liquidity' : 'Refund liquidity'}
          onPress={onConfirmPress}
          disabled={!!error}
        />
      </ScrollView>
    </View>
  );
});

ConfirmRetry.propTypes = {
  error: ''
};
ConfirmRetry.propTypes = {
  isRetry: PropTypes.bool.isRequired,
  retryToken: PropTypes.object.isRequired,
  refundToken: PropTypes.object.isRequired,
  retryAmount: PropTypes.number.isRequired,
  refundAmount: PropTypes.number.isRequired,
  account: PropTypes.object.isRequired,
  onConfirmPress: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default compose(
  withTransaction
)(ConfirmRetry);
