import React from 'react';
import { Header } from '@src/components';
import { ScrollView, Tabs } from '@src/components/core';
import PropTypes from 'prop-types';
import {
  FollowingPools,
  tradingVolume24hSelector,
  actionFetch as actionFetchPools,
} from '@src/screens/PDexV3/features/Pools';
import Portfolio, {
  actionFetch as actionFetchListShare,
} from '@src/screens/PDexV3/features/Portfolio';
import { View, RefreshControl } from 'react-native';
import {batch, useDispatch, useSelector} from 'react-redux';
import { ButtonTrade } from '@src/components/Button';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import {contributeActions} from '@screens/PDexV3/features/Contribute';
import withHome from './Home.enhance';
import { styled } from './Home.styled';
import { ROOT_TAB_HOME, TAB_POOLS_ID, TAB_PORTFOLIO_ID } from './Home.constant';
import { homePDexV3Selector } from './Home.selector';
import HomeTabHeader from './Home.tabHeader';

const GroupButton = React.memo(() => {
  const navigation = useNavigation();
  return (
    <View style={styled.groupBtns}>
      <ButtonTrade
        title="Trade"
        btnStyle={styled.tradeBtn}
        onPress={() => navigation.navigate(routeNames.Trade)}
      />
      <ButtonTrade
        title="Create new pool"
        btnStyle={styled.createNewPoolBtn}
        onPress={() => navigation.navigate(routeNames.CreatePool)}
      />
    </View>
  );
});

const TabPools = React.memo(() => {
  const tradingVolume24h = useSelector(tradingVolume24hSelector);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const onNavigateContribute = (poolId) => {
    batch(() => {
      dispatch(contributeActions.actionUpdateContributePoolID({ poolId }));
      navigation.navigate(routeNames.ContributePool);
    });
  };
  return (
    <>
      <HomeTabHeader title="Trading Volume 24h" desc={tradingVolume24h} />
      <GroupButton />
      <FollowingPools handlePressPool={onNavigateContribute} />
    </>
  );
});

const Home = (props) => {
  const dispatch = useDispatch();
  const { isFetching } = useSelector(homePDexV3Selector);
  const { handleOnRefresh } = props;
  return (
    <View style={styled.container}>
      <Header title="Market" accountSelectable />
      <ScrollView
        style={styled.main}
        refreshControl={(
          <RefreshControl
            refreshing={isFetching}
            onRefresh={() =>
              typeof handleOnRefresh === 'function' && handleOnRefresh()
            }
          />
        )}
      >
        <Tabs rootTabID={ROOT_TAB_HOME}>
          <View
            tabID={TAB_POOLS_ID}
            label="Pools"
            onChangeTab={() => dispatch(actionFetchPools())}
          >
            <TabPools />
          </View>
          <View
            tabID={TAB_PORTFOLIO_ID}
            label="Your portfolio"
            onChangeTab={() => dispatch(actionFetchListShare())}
          >
            <Portfolio />
          </View>
        </Tabs>
      </ScrollView>
    </View>
  );
};

Home.propTypes = {
  handleOnRefresh: PropTypes.func.isRequired,
};

export default withHome(React.memo(Home));
