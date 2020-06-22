import React from 'react';
import PropTypes from 'prop-types';
import { RoundCornerButton } from '@components/core';
import { Row } from '@components/';
import styles from './style';

const Actions = ({
  buy,
}) => {
  const handleBuy = () => {

  };

  const handleWithdraw = () => {

  };

  const handleProvide = () => {

  };

  const provideButton = (
    <RoundCornerButton
      title={buy ? 'Provide now' : 'Provide more'}
      style={styles.actionButton}
      onPress={handleProvide}
    />
  );
  const buyButton = (
    <RoundCornerButton
      title="Buy crypto"
      style={styles.actionButton}
      onPress={handleBuy}
    />
  );
  const withdrawButton = (
    <RoundCornerButton
      title="Withdraw"
      style={styles.actionButton}
      onPress={handleWithdraw}
    />
  );

  return (
    <Row center style={styles.actions}>
      {provideButton}
      {buy ? buyButton : withdrawButton}
    </Row>
  );
};

Actions.propTypes = {
  buy: PropTypes.bool,
};

Actions.defaultProps = {
  buy: false,
};

export default React.memo(Actions);
