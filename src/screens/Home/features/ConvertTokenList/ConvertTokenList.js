import React from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { Header, LoadingContainer } from '@src/components';
import { compose } from 'recompose';
import convertTokenListEnhance from '@screens/Home/features/ConvertTokenList/ConvertTokenList.enhance';
import { useDispatch, useSelector } from 'react-redux';
import { convertCoinsDataSelector } from '@screens/Home/features/Convert/Convert.selector';
import { styled } from '@components/Token/Token.styled';
import { NormalText } from '@components/Token/Token';
import { TokenVerifiedIcon } from '@components/Icons';
import { balanceStyled } from '@screens/Wallet/features/Detail/Detail.styled';
import { FONT } from '@src/styles';
import formatUtils from '@utils/format';
import PropTypes from 'prop-types';
import { selectedPrivacySelector } from '@src/redux/selectors';
import BigNumber from 'bignumber.js';
import { ButtonBasic } from '@components/Button';
import isEmpty from 'lodash/isEmpty';
import { ActivityIndicator, Image, TouchableOpacity } from '@components/core';
import noTransaction from '@assets/images/icons/shield.png';
import { styles } from '@screens/Wallet/features/HistoryToken/HistoryToken.empty';
import { withLayout_2 } from '@components/Layout';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import { setSelectedPrivacy } from '@src/redux/actions/selectedPrivacy';

const Item = React.memo(({ item, maxSize, index, loading }) => {
  const navigation = useNavigation();
  const { tokenID, unspentCoins } = item;
  const token = useSelector(selectedPrivacySelector.getPrivacyDataByTokenID)(
    tokenID,
  );
  const dispatch = useDispatch();
  const balance = React.useMemo(() => {
    return unspentCoins.reduce((prev, coin) => {
      return prev.plus(coin.Value);
    }, new BigNumber(0));
  }, [token, unspentCoins]);
  const onPress = async () => {
    await dispatch(setSelectedPrivacy(tokenID));
    navigation.navigate(routeNames.HistoryConvert);
  };
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styled.container,
          styled.extraTop,
          styled.row,
          maxSize === index && { marginBottom: 40 },
        ]}
      >
        <View style={styled.column}>
          <View style={{ flexDirection: 'row' }}>
            <NormalText text={token?.name || 'Incognito Token'} style={styled.boldText} />
            {!!token?.isVerified && <TokenVerifiedIcon />}
          </View>
          {!loading && (
            <Text
              style={[
                balanceStyled.pSymbol,
                { fontFamily: FONT.NAME.medium, marginTop: 5 },
              ]}
            >
              {`${unspentCoins.length} UTXOS`}
            </Text>
          )}
        </View>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text
            style={[
              styled.bottomText,
              styled.boldText,
              { flex: 1, marginLeft: 20, textAlign: 'right' },
            ]}
          >
            {`${formatUtils.amountFull(balance.toString(), token.pDecimals)} ${
              token.symbol
            }`}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
});

const ConvertTokenList = React.memo(
  ({ onNavigateToConvert, onPullRefresh }) => {
    const { coins, isFetching, hasUnspentCoins, isRefreshing } = useSelector(
      convertCoinsDataSelector,
    );

    const renderItem = (data) => (
      <Item
        item={data?.item}
        index={data?.index}
        maxSize={coins.length - 1}
        loading={isRefreshing}
      />
    );

    const renderButton = () => {
      if (!hasUnspentCoins || isRefreshing) return null;
      return (
        <View style={{ height: 80 }}>
          <ButtonBasic
            title="Go to convert screen"
            disabled={!hasUnspentCoins}
            onPress={onNavigateToConvert}
          />
        </View>
      );
    };

    const renderEmptyView = () => (
      <View style={styles.container}>
        <Image source={noTransaction} style={styles.image} />
        <Text style={styles.text}>
          {'Shield some coins to start\ntransacting anonymously.'}
        </Text>
      </View>
    );

    const renderContent = () => {
      if (isFetching && !isRefreshing) return <LoadingContainer />;
      if (isEmpty(coins)) return renderEmptyView();
      return (
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <FlatList
            refreshControl={(
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onPullRefresh}
              />
            )}
            data={coins}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            keyExtractor={(item) => item.tokenID}
            style={{ paddingTop: 10 }}
          />
          {renderButton()}
        </View>
      );
    };

    return (
      <View style={{ flex: 1 }}>
        <Header title="Convert Coins" accountSelectable />
        {renderContent()}
      </View>
    );
  },
);

ConvertTokenList.propTypes = {
  onNavigateToConvert: PropTypes.func.isRequired,
  onPullRefresh: PropTypes.func.isRequired,
};

Item.propTypes = {
  item: PropTypes.object.isRequired,
  maxSize: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default compose(
  withLayout_2,
  convertTokenListEnhance,
)(ConvertTokenList);
