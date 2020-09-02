import React from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import Header from '@src/components/Header';
import { BtnSelectAccount } from '@screens/SelectAccount';
import { BtnQRCode } from '@src/components/Button';
import { accountSeleclor, tokenSeleclor } from '@src/redux/selectors';
import { useSelector } from 'react-redux';
import Token from '@src/components/Token';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { CONSTANT_COMMONS } from '@src/constants';
import { Amount } from '@src/components/Token/Token';
import { RoundCornerButton } from '@src/components/core';
import accountService from '@services/wallet/accountService';
import COINS from '@src/constants/coin';
import ButtonBasic from '@components/Button/ButtonBasic';
import withWallet, { WalletContext } from './Wallet.enhance';
import {
  styled,
  styledBalance,
  styledFollow,
  extraStyled,
  styledToken,
  rightHeaderStyled,
} from './Wallet.styled';

const Balance = () => {
  const { walletProps } = React.useContext(WalletContext);
  const { rewards } = walletProps;
  return (
    <View style={[styledBalance.container, styled.hook]}>
      <Amount
        amount={rewards}
        pDecimals={0}
        showSymbol={false}
        isGettingBalance={rewards === null}
        showGettingBalance
        customStyle={styledBalance.balance}
        hasPSymbol
        stylePSymbol={styledBalance.pSymbol}
        containerStyle={styledBalance.balanceContainer}
      />
      <Text style={styledBalance.title}>Shielded Balance</Text>
    </View>
  );
};

const FollowToken = () => {
  const followed = useSelector(tokenSeleclor.tokensFollowedSelector);
  const { walletProps } = React.useContext(WalletContext);
  const { handleSelectToken, handleRemoveToken } = walletProps;
  return (
    <View style={styledFollow.container}>
      <Token
        tokenId={CONSTANT_COMMONS.PRV_TOKEN_ID}
        style={[
          styledFollow.token,
          followed.length === 0 && styledToken.lastChild,
        ]}
        onPress={() => handleSelectToken(CONSTANT_COMMONS.PRV_TOKEN_ID)}
      />
      {followed.map((token, index) => (
        <Token
          key={token?.id}
          tokenId={token?.id}
          style={[
            styledFollow.token,
            followed.length - 1 === index && styledToken.lastChild,
          ]}
          onPress={() => handleSelectToken(token?.id)}
          handleRemoveToken={() => handleRemoveToken(token?.id)}
          swipable
          removable
        />
      ))}
    </View>
  );
};

const GroupButton = () => {
  const [loading, setLoading] = React.useState(false);
  const wallet = useSelector(state => state.wallet);
  const account = useSelector(accountSeleclor.defaultAccountSelector);
  const navigation = useNavigation();
  const handleWithdraw = async () => {
    try {
      setLoading(true);
      await accountService.createAndSendWithdrawRewardTx(COINS.PRV_ID, account, wallet);
    } finally {
      setLoading(false);
    }
  };

  const handleTrade = async () => {
    navigation.navigate(routeNames.Trade);
  };

  return (
    <View
      style={[
        styled.groupButtonContainer,
        styled.hook,
      ]}
    >
      <View style={styled.groupButton}>
        <ButtonBasic
          title="Withdraw"
          btnStyle={[styled.btnStyle]}
          titleStyle={[styled.titleStyle]}
          onPress={handleWithdraw}
          disabled={loading}
        />
        <ButtonBasic
          title="Trade"
          btnStyle={[styled.btnStyle]}
          titleStyle={[styled.titleStyle]}
          onPress={handleTrade}
        />
      </View>
    </View>
  );
};

const Extra = () => {
  const { walletProps } = React.useContext(WalletContext);
  const { isReloading, fetchData } = walletProps;
  return (
    <View style={extraStyled.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={(
          <RefreshControl
            refreshing={isReloading}
            onRefresh={() => fetchData(true)}
          />
        )}
      >
        <Balance />
        <GroupButton />
        <FollowToken />
      </ScrollView>
    </View>
  );
};

const RightHeader = () => {
  const { walletProps } = React.useContext(WalletContext);
  const navigation = useNavigation();
  const { handleExportKey } = walletProps;
  return (
    <View style={rightHeaderStyled.container}>
      <RoundCornerButton
        style={rightHeaderStyled.btnExportKey}
        title="Import"
        onPress={() => navigation.navigate(routeNames.ImportAccount)}
      />
      <BtnQRCode
        style={rightHeaderStyled.btnExportKey}
        onPress={handleExportKey}
      />
      <BtnSelectAccount />
    </View>
  );
};

const Wallet = () => {
  return (
    <View style={[styled.container]}>
      <Header
        title="Assets"
        rightHeader={<RightHeader />}
        style={styled.hook}
        root
      />
      <Extra />
    </View>
  );
};

Wallet.propTypes = {};

export default withWallet(Wallet);
