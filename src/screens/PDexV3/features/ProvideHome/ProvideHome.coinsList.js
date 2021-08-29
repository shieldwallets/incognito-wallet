import React, {memo} from 'react';
import {RefreshControl, View} from 'react-native';
import {useSelector} from 'react-redux';
import {provideDataSelector, statusProvideSelector} from '@screens/PDexV3/features/ProvideHome/ProvideHome.selector';
import {ScrollView, Text} from '@components/core';
import {coinStyles as coinStyled} from '@screens/PDexV3/features/ProvideHome/ProvideHome.styled';
import {Row} from '@src/components';

const CoinsList = () => {
  const coins = useSelector(provideDataSelector);
  const { isLoading } = useSelector(statusProvideSelector);
  const renderUserData = () => {
    return (coins || []).map(item => {
      const { token } = item;
      return (
        <View style={coinStyled.coin} key={token.tokenId}>
          <Row>
            <View>
              <Text style={coinStyled.coinName}>{token.symbol}</Text>
              <Text style={coinStyled.coinExtra}>
                {coins.find(coin => coin.id === item.id).displayInterest}
              </Text>
            </View>
            <View style={coinStyled.flex}>
              <Text style={[coinStyled.coinName, coinStyled.textRight]}>{item.displayBalance}</Text>
            </View>
          </Row>
        </View>
      );
    });
  };
  return (
    <View style={coinStyled.coinContainer}>
      <ScrollView
        refreshControl={(
          <RefreshControl
            refreshing={isLoading}
          />
        )}
      >
        {renderUserData()}
      </ScrollView>
    </View>
  );
};

CoinsList.propTypes = {};


export default memo(CoinsList);
