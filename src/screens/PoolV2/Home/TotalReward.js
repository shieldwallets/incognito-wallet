import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from '@components/core';
import HelpIcon from '@components/HelpScreen/Icon';
import ROUTE_NAMES from '@routers/routeNames';
import { Row } from '@src/components/';
import PRVSymbol from '@components/PRVSymbol';
import { CONSTANT_COMMONS } from '@src/constants';
import { isNaN } from 'lodash';
import formatUtils from '@utils/format';
import convert from '@utils/convert';
import styles from './style';

const TotalReward = ({ total, nativeToken }) => {
  const pDecimals = nativeToken?.pDecimals || 0;

  const price = nativeToken?.priceUsd || 0;
  const totalAmountNumber = convert.toNumber(total, true);
  const totalAmountOriginal = convert.toOriginalAmount(totalAmountNumber, pDecimals, false);
  let totalAmount = convert.toNumber(totalAmountOriginal, true) * price;

  if (isNaN(totalAmount)) {
    totalAmount = 0;
  }

  const displayClipTotalUSDRewards = formatUtils.amountFull(totalAmount, pDecimals, true);

  return (
    <View>
      <Row center style={[styles.rewards, { marginBottom: 0 }]}>
        <Text>
          <PRVSymbol style={styles.symbol} />
          &nbsp;
          <Text style={styles.amount}>{total}</Text>
        </Text>
      </Row>
      <Row center style={[styles.rewards, { marginTop: 0 }]}>
        <Text>
          <PRVSymbol
            style={styles.symbolUSD}
            symbol={CONSTANT_COMMONS.USD_SPECIAL_SYMBOL}
          />
          &nbsp;
          <Text style={styles.symbolUSD}>
            {displayClipTotalUSDRewards}
          </Text>
        </Text>
      </Row>
      <Row center style={{marginTop: 8}}>
        <Text style={[styles.center, styles.rateStyle]}>
          Compounding Rewards
        </Text>
        <HelpIcon screen={ROUTE_NAMES.PoolV2Help} style={styles.icon} />
      </Row>
    </View>
  );
};

TotalReward.propTypes = {
  total: PropTypes.string.isRequired,
  nativeToken: PropTypes.any,
};

TotalReward.defaultProps = {
};

export default React.memo(TotalReward);
