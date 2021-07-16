import React from 'react';
import { View } from 'react-native';
import {Header} from '@src/components';
import Balance from '@screens/DexV2/components/Balance';
import { RoundCornerButton, ScrollView, Text } from '@components/core';
import { useSelector } from 'react-redux';
import { selectedPrivacySelector } from '@src/redux/selectors';
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
    retryToken,
    retryAmount,
    prvBalance,
    pTokenBalance,
    inputTokenId,
    inputAmount,
    outputTokenId,
    outputAmount,
    account,
    onConfirmPress,
    error,
  } = props;

  const getPrivacyDataByTokenID = useSelector(selectedPrivacySelector.getPrivacyDataByTokenID);

  const inputToken = getPrivacyDataByTokenID(inputTokenId);
  let outputToken;
  if (outputTokenId) {
    outputToken = getPrivacyDataByTokenID(outputTokenId);
  }

  const balanceFactories = React.useMemo(() => (
    [{
      token: inputToken,
      balance: prvBalance,
    }, {
      token: outputToken,
      balance: pTokenBalance,
    }]
  ), [inputToken, prvBalance, outputToken]);

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
    return (
      <ExchangeRate
        inputToken={inputToken}
        inputValue={inputAmount}
        outputToken={outputToken}
        outputValue={outputAmount}
      />
    );
  };

  const getRefundText = () => {
    let message = '';
    if ((!retryToken || !outputTokenId) && inputTokenId) {
      message = `${formatUtil.amountFull(inputAmount, inputToken.pDecimals)} ${inputToken.symbol}`;
    } else {
      let {
        tokenId,
        amount
      } = {
        tokenId: (!retryToken || (inputToken?.tokenId === retryToken?.tokenId)) ? outputTokenId : inputTokenId,
        amount: (!retryToken || (inputToken?.tokenId === retryToken?.tokenId)) ? outputAmount : inputAmount
      };
      const token = getPrivacyDataByTokenID(tokenId);
      message = `${formatUtil.amountFull(amount, token.pDecimals)} ${token.symbol}`;
    }
    return message;
  };

  return (
    <View style={{ flex: 1, marginHorizontal: 25 }}>
      <Header title="Liquidity" />
      <ScrollView>
        <View style={styles.mainInfo}>
          <Text style={styles.bigText}>{isRetry ? 'Retry add liquidity' : 'Refund liquidity'}</Text>
          {
            isRetry ? (
              <Text style={styles.bigText} numberOfLines={3}>{`${formatUtil.amountFull(retryAmount, retryToken.pDecimals)} ${retryToken.symbol}`}</Text>
            ) : (
              <Text style={styles.bigText} numberOfLines={3}>{getRefundText()}</Text>
            )
          }
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
  retryAmount: PropTypes.number.isRequired,
  prvBalance: PropTypes.number.isRequired,
  pTokenBalance: PropTypes.number.isRequired,
  inputTokenId: PropTypes.string.isRequired,
  inputAmount: PropTypes.number.isRequired,
  outputTokenId: PropTypes.string.isRequired,
  outputAmount: PropTypes.number.isRequired,
  account: PropTypes.object.isRequired,
  onConfirmPress: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default compose(
  withTransaction
)(ConfirmRetry);
