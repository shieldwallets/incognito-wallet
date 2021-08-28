import React, {memo} from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import {Header} from '@src/components';
import {styled as mainStyle} from '@screens/PDexV3/PDexV3.styled';
import {TotalReward} from '@screens/PDexV3/features/ProvideHome';

const ProvideHome = () => {
  return (
    <View style={mainStyle.container}>
      <Header title="Provide" />
      <TotalReward />
    </View>
  );
};

ProvideHome.propTypes = {};

export default memo(ProvideHome);
