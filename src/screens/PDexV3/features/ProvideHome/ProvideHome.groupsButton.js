import React from 'react';
import PropTypes from 'prop-types';
import { RoundCornerButton } from '@components/core';
import ROUTE_NAMES from '@routers/routeNames';
import { useNavigation } from 'react-navigation-hooks';
import { Row } from '@src/components';
import { btnStyles as btnStyled } from './ProvideHome.styled';

const GroupsButton = ({ withdrawable }) => {
  const navigation = useNavigation();

  const handleBuy = () => {
    navigation.navigate(ROUTE_NAMES.Trade);
  };

  const handleWithdraw = () => {
    navigation.navigate(ROUTE_NAMES.PoolV2WithdrawSelectCoin);
  };

  const handleProvide = () => {
    navigation.navigate(ROUTE_NAMES.PoolV2ProvideSelectCoin);
  };

  const provideButton = (
    <RoundCornerButton
      title={withdrawable ? 'Provide more': 'Provide now'}
      style={btnStyled.button}
      onPress={handleProvide}
    />
  );
  const buyButton = (
    <RoundCornerButton
      title="Buy crypto"
      style={btnStyled.button}
      onPress={handleBuy}
    />
  );
  const withdrawButton = (
    <RoundCornerButton
      title="Withdraw"
      style={btnStyled.button}
      onPress={handleWithdraw}
    />
  );

  return (
    <Row center>
      {provideButton}
      {withdrawable ? withdrawButton : buyButton}
    </Row>
  );
};

GroupsButton.propTypes = {
  withdrawable: PropTypes.bool,
};

GroupsButton.defaultProps = {
  withdrawable: false,
};

export default React.memo(GroupsButton);
