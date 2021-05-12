import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { View, Text, RoundCornerButton, ScrollView } from '@components/core';
import ExtraInfo from '@screens/DexV2/components/ExtraInfo';
import format from '@utils/format';
import { withLayout_2 } from '@components/Layout';
import Header from '@components/Header/index';
import Loading from '@screens/DexV2/components/Loading';
import withDefaultAccount from '@components/Hoc/withDefaultAccount';
import mainStyles from '@screens/PoolV2/style';
import { RefreshControl } from 'react-native';
import withSuccess from './success.enhance';
import withConfirm from './confirm.enhance';
import withData from './data.enhance';
import styles from './style';

const Confirm = ({
  coin,
  deposit,
  provide,
  fee,
  feeToken,
  onConfirm,
  providing,
  error,
  disable,
  onRefresh,
  refreshing
}) => {
  const renderRefreshControl = () => (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
  return (
    <View style={{ flex: 1 }}>
      <Header title="Order preview" />
      <ScrollView refreshControl={renderRefreshControl()}>
        <View style={styles.mainInfo}>
          <Text style={styles.bigText}>Provide</Text>
          <Text style={styles.bigText} numberOfLines={3}>{provide} {coin.symbol}</Text>
        </View>
        <ExtraInfo
          left="Deposit"
          right={`${deposit} ${coin.symbol}`}
          style={{ ...styles.extra, ...styles.bold }}
        />
        <ExtraInfo
          token={feeToken}
          left="Fee"
          right={`${format.amount(fee, feeToken.pDecimals)} ${feeToken.symbol}`}
          style={styles.extra}
        />
        {!!error && <Text style={styles.error}>{error}</Text>}
        <RoundCornerButton
          style={[styles.button, mainStyles.button]}
          title="Confirm"
          onPress={onConfirm}
          disabled={!!error || disable}
        />
      </ScrollView>
      <Loading open={providing} />
    </View>
  );
};

Confirm.propTypes = {
  coin: PropTypes.object,
  deposit: PropTypes.string,
  provide: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,

  fee: PropTypes.number.isRequired,
  feeToken: PropTypes.object.isRequired,

  providing: PropTypes.bool.isRequired,

  error: PropTypes.string,
  disable: PropTypes.bool.isRequired,

  onRefresh: PropTypes.func.isRequired,
  refreshing: PropTypes.bool,
};

Confirm.defaultProps = {
  coin: null,
  deposit: '',
  provide: '',
  error: '',
  refreshing: false
};

export default compose(
  withLayout_2,
  withData,
  withSuccess,
  withDefaultAccount,
  withConfirm,
)(Confirm);
