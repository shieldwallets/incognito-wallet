import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from '@components/core';
import { COINS } from '@src/constants';
import formatUtil from '@utils/format';
import HelpIcon from '@components/HelpScreen/Icon';
import ROUTE_NAMES from '@routers/routeNames';
import { Row } from '@components/';
import styles from './style';

const TotalReward = ({
  total,
}) => {
  const formatted = formatUtil.amountFull(total, COINS.PRV.pDecimals, true);
  return (
    <View>
      <Row center style={styles.rewards}>
        <Text style={styles.amount}>
          <Text style={styles.symbol}>ℙ</Text>&nbsp;
          {formatted}
        </Text>
        <HelpIcon screen={ROUTE_NAMES.PoolV2Help} style={styles.icon} />
      </Row>
      <Text style={[styles.center, styles.rateStyle]}>Provider Rewards</Text>
    </View>
  );
};

TotalReward.propTypes = {
  total: PropTypes.number,
};

TotalReward.defaultProps = {
  total: null,
};

export default React.memo(TotalReward);
