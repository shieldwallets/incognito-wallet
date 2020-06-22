import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import _ from 'lodash';
import { View } from '@components/core';
import TotalReward from '@screens/PoolV2/Home/TotalReward';
import { withLayout_2 } from '@components/Layout';
import Actions from '@screens/PoolV2/Home/Actions';
import CoinList from '@screens/PoolV2/Home/CoinList';
import withPoolData from '@screens/PoolV2/Home/data.enhance';
import withDefaultAccount from '@components/Hoc/withDefaultAccount';
import { Header, LoadingContainer } from '@components/';
import styles from './style';

const Home = ({
  config,
  userData,
}) => {
  const renderContent = () => {
    if (!config || !userData) {
      console.debug('CONFIG', config, userData);

      return (
        <LoadingContainer />
      );
    }

    return (
      <>
        <TotalReward total={1e9} />
        <Actions buy />
        <CoinList coins={config.coins} />
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Provide" accountSelectable />
      {renderContent()}
    </View>
  );
};

export default compose(
  withLayout_2,
  withDefaultAccount,
  withPoolData,
)(Home);
