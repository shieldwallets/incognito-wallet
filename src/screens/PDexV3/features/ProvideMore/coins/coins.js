import React, {memo} from 'react';
import {View} from 'react-native';
import { styled as mainStyle } from '@screens/PDexV3/PDexV3.styled';
import {Header, Row} from '@src/components';
import {batch, useDispatch, useSelector} from 'react-redux';
import {provideDataSelector} from '@screens/PDexV3/features/ProvideHome';
import {ActivityIndicator, ScrollView, Text, TouchableOpacity} from '@components/core';
import {coinStyles as coinStyled} from '@screens/PDexV3/features/ProvideHome/ProvideHome.styled';
import {useNavigation} from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import {provideMoreActions} from '@screens/PDexV3/features/ProvideMore';

const Coins = () => {
  const coins = useSelector(provideDataSelector);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const onProvide = (coin) => {
    batch(() => {
      dispatch(provideMoreActions.actionSetCoin(coin));
      navigation.navigate(routeNames.ProvideMoreInput);
    });
  };

  const renderItem = (coin) => {
    const { token, userBalance, userBalanceStr, displayInterest, isLoadingBalance } = coin;
    return (
      <TouchableOpacity
        key={token.tokenId}
        style={coinStyled.coin}
        disabled={!userBalance || isLoadingBalance}
        onPress={() => onProvide(coin)}
      >
        <View style={userBalance === 0 && coinStyled.disabled}>
          <Row spaceBetween>
            <Text style={coinStyled.coinName}>{token.symbol}</Text>
            {isLoadingBalance ?
              <ActivityIndicator /> :
              <Text style={coinStyled.coinName}>{userBalanceStr}</Text>
            }
          </Row>
          <Text style={coinStyled.coinExtra}>{displayInterest}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={mainStyle.container}>
      <Header title="Select coin" />
      <ScrollView style={coinStyled.coinContainer}>
        {coins.map(renderItem)}
      </ScrollView>
    </View>
  );
};

Coins.propTypes = {};


export default memo(Coins);
