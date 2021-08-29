import React, {memo} from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import {Header} from '@src/components';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {TotalReward} from '@screens/PDexV3/features/ProvideHome';
import GroupsButton from '@screens/PDexV3/features/ProvideHome/ProvideHome.groupsButton';
import withProvide from '@screens/PDexV3/features/ProvideHome/ProvideHome.enhance';
import CoinsList from '@screens/PDexV3/features/ProvideHome/ProvideHome.coinsList';

const ProvideHome = () => {
  return (
    <View style={mainStyle.container}>
      <Header title="Provide" />
      <TotalReward />
      <GroupsButton withdrawable />
      <CoinsList />
    </View>
  );
};

ProvideHome.propTypes = {};

export default withProvide(memo(ProvideHome));
