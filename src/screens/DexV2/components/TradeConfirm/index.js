import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { View, Text, RoundCornerButton, ScrollView } from '@components/core';
import Balance from '@screens/DexV2/components/Balance';
import ExtraInfo from '@screens/DexV2/components/ExtraInfo';
import format from '@utils/format';
import { withLayout_2 } from '@components/Layout';
import Header from '@components/Header/index';
import Loading from '@screens/DexV2/components/Loading';
import withAccount from '@screens/DexV2/components/account.enhance';
import Help from '@components/Help/index';
import PoolSize from '@screens/DexV2/components/PoolSize';
import withSuccess from './success.enhance';
import withTrade from './trade.enhance';
import withData from './data.enhance';
import styles from './style';

const Trade = ({
  inputToken,
  inputValue,
  inputText,
  outputToken,
  minimumAmount,
  fee,
  feeToken,
  onTrade,

  trading,

  error,
  pair,
}) => {
  return (
    <View>
      <Header title="Order preview" />
      <ScrollView>
        <View style={styles.mainInfo}>
          <Text style={styles.bigText}>Buy at least</Text>
          <Text style={styles.bigText} numberOfLines={3}>{format.amountFull(minimumAmount, outputToken.pDecimals)} {outputToken.symbol}</Text>
        </View>
        <ExtraInfo
          left="Pay with"
          right={`${inputText} ${inputToken.symbol}`}
          style={{ ...styles.extra, ...styles.bold }}
        />
        <Balance
          token={inputToken}
          balance={inputValue}
          title="Purchase"
          style={styles.extra}
        />
        <ExtraInfo
          token={feeToken}
          left={(
            <View style={styles.row}>
              <Text style={styles.extra}>Network fee</Text>
              <Help title="Network fee" content="Network fees go to validators. There is no trading fee." />
            </View>
          )}
          right={`${format.amount(fee, feeToken.pDecimals)} ${feeToken.symbol}`}
          style={styles.extra}
        />
        <PoolSize outputToken={outputToken} inputToken={inputToken} pair={pair} />
        {!!error && <Text style={styles.error}>{error}</Text>}
        <RoundCornerButton
          style={styles.button}
          title="Confirm"
          onPress={onTrade}
          disabled={!!error}
        />
      </ScrollView>
      <Loading open={trading} />
    </View>
  );
};

Trade.propTypes = {
  inputToken: PropTypes.object,
  inputValue: PropTypes.number,
  inputText: PropTypes.string,
  onTrade: PropTypes.func.isRequired,
  outputToken: PropTypes.object,
  minimumAmount: PropTypes.number,

  fee: PropTypes.number.isRequired,
  feeToken: PropTypes.object.isRequired,

  trading: PropTypes.bool.isRequired,

  error: PropTypes.string,
  pair: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
};

Trade.defaultProps = {
  inputToken: null,
  inputValue: null,
  inputText: '',
  outputToken: null,
  minimumAmount: null,
  error: '',
  pair: null,
};

export default compose(
  withLayout_2,
  withData,
  withSuccess,
  withAccount,
  withTrade,
)(Trade);
