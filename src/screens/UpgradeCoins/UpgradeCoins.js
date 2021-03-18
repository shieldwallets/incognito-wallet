import React, {memo} from 'react';
import { StyleSheet, Text } from 'react-native';
import { RoundCornerButton } from '@components/core';
import { COLORS, FONT } from '@src/styles';
import PropTypes from 'prop-types';
import MainLayout from '@components/MainLayout/index';
import LoadingTx from '@components/LoadingTx/LoadingTx';
import withEnhance from './UpgradeCoins.enhance';

const UpgradeCoins = (props) => {
  const { onLearnMore, onConvert, processing, error } = props;

  return (
    <MainLayout header="Upgrade coins" hideBackButton scrollable>
      <Text style={styles.text}>
          Privacy v2 is live, you’re now even more private!

          All UTXOs now need to be converted to the new version.
        <Text onPress={onLearnMore} style={styles.more}> {'Click to learn more >'}</Text>
      </Text>
      <Text style={styles.text}>
          It seems you have some pCoins from Privacy v1. Please convert them Privacy v2 coins with the button below.
      </Text>

      <RoundCornerButton
        onPress={onConvert}
        style={styles.button}
        title="Click to convert"
      />
      <Text style={styles.error}>{error}</Text>
      {processing && <LoadingTx />}
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  text: {
    ...FONT.STYLE.medium,
    color: COLORS.newGrey,
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24,
  },
  more: {
    ...FONT.STYLE.bold,
  },
  button: {
    marginTop: 30,
  },
  error: {
    color: COLORS.red,
    fontSize: 14,
    marginTop: 10,
  },
});

UpgradeCoins.propTypes = {
  onLearnMore: PropTypes.func.isRequired,
  onConvert: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
  processing: PropTypes.bool.isRequired,
};

export default withEnhance(memo(UpgradeCoins));
