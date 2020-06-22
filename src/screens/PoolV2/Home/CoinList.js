import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from '@components/core';
import formatUtil from '@utils/format';
import { Row } from '@components/';
import styles from './style';

const CoinList = ({
  coins,
}) => {
  return (
    <View style={styles.coinContainer}>
      <Row style={styles.coin}>
        <Text style={styles.coinName}>Provide liquidity for pDEX</Text>
      </Row>
      {coins.map(item => (
        <Row style={styles.coin}>
          <Text style={styles.coinName}>{item.name}</Text>
          <Text style={styles.coinInterest}>{formatUtil.toFixed(item.apy, 2)}% APY</Text>
        </Row>
      ))}
      <View style={styles.rateChange}>
        <Text style={styles.rateStyle}>Rates subject to change at any time.</Text>
      </View>
    </View>
  );
};

CoinList.propTypes = {
  coins: PropTypes.array,
};

CoinList.defaultProps = {
  coins: [],
};

export default React.memo(CoinList);
