import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from '@components/core';
import VerifiedText from '@components/VerifiedText/index';
import styles from './style';

const TokenItem = ({ name, symbol, verified }) => {
  return (
    <View style={styles.tokenItem}>
      <View style={{ marginTop: 8 }}>
        <VerifiedText text={name} isVerified={verified} style={styles.tokenName} />
      </View>
      <View style={styles.row}>
        <Text style={styles.networkName}>{symbol}</Text>
      </View>
    </View>
  );
};

TokenItem.propTypes = {
  name: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  verified: PropTypes.bool,
};

TokenItem.defaultProps = {
  verified: false,
};

export default TokenItem;
