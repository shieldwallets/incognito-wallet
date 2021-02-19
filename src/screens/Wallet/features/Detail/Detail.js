import React from 'react';
import { View } from 'react-native';
import Header from '@src/components/Header';
import {
  selectedPrivacySeleclor,
  sharedSeleclor,
  tokenSeleclor,
  accountSeleclor,
} from '@src/redux/selectors';
import { useSelector } from 'react-redux';
import { ButtonBasic, BtnInfo } from '@src/components/Button';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import {
  Amount,
  AmountBasePRV,
  AmountBaseUSDT,
  ChangePrice,
} from '@src/components/Token/Token';
import HistoryToken from '@screens/Wallet/features/HistoryToken';
import MainCryptoHistory from '@screens/Wallet/features/MainCryptoHistory';
import { isGettingBalance as isGettingTokenBalanceSelector } from '@src/redux/selectors/token';
import { isGettingBalance as isGettingMainCryptoBalanceSelector } from '@src/redux/selectors/account';
import { useBtnTrade } from '@src/components/UseEffect/useBtnTrade';
import useFeatureConfig from '@src/shared/hooks/featureConfig';
import { pTokenSelector } from '@src/redux/selectors/shared';
import { generateTestId } from '@utils/misc';
import { TEST_TOKEN } from '@src/constants/elements';
import withDetail from './Detail.enhance';
import {
  styled,
  groupBtnStyled,
  balanceStyled,
  historyStyled,
} from './Detail.styled';

const GroupButton = React.memo(() => {
  const navigation = useNavigation();
  const handleSend = () => navigation.navigate(routeNames.Send);
  const handleReceive = () => navigation.navigate(routeNames.ReceiveCrypto);
  const [onPressSend, isSendDisabled] = useFeatureConfig('send', handleSend);
  return (
    <View style={groupBtnStyled.groupButton}>
      <ButtonBasic
        title="Send"
        btnStyle={groupBtnStyled.btnStyle}
        titleStyle={groupBtnStyled.titleStyle}
        onPress={onPressSend}
        disabled={isSendDisabled}
        {...generateTestId(TEST_TOKEN.BTN_SEND)}
      />
      <ButtonBasic
        title="Receive"
        btnStyle={groupBtnStyled.btnStyle}
        titleStyle={groupBtnStyled.titleStyle}
        onPress={handleReceive}
        {...generateTestId(TEST_TOKEN.BTN_RECEIVE)}
      />
    </View>
  );
});

const Balance = React.memo(() => {
  const selected  = useSelector(selectedPrivacySeleclor.selectedPrivacy);
  const {
    isToggleUSD
  } = useSelector(pTokenSelector);

  const isGettingBalance = useSelector(
    sharedSeleclor.isGettingBalance,
  ).includes(selected?.tokenId);
  const tokenData = {
    ...selected,
    isGettingBalance,
  };
  const amountProps = {
    customStyle: balanceStyled.amount,
    ...tokenData,
    showSymbol: false,
  };
  const amountBaseUSDTProps = {
    customStyle: balanceStyled.amountBasePRV,
    customPSymbolStyle: [balanceStyled.pSymbol],
    ...tokenData,
  };
  const changePriceProps = {
    customStyle: balanceStyled.changePrice,
    ...tokenData,
  };
  return (
    <View accessible={false} style={balanceStyled.container}>
      <Amount
        {...amountProps}
        testId={generateTestId(TEST_TOKEN.LBL_TOKEN_TOTAL_BALANCE)}
      />
      <View style={balanceStyled.hook}>
        { isToggleUSD
          ? (<AmountBaseUSDT {...amountBaseUSDTProps} />)
          : (<AmountBasePRV {...amountBaseUSDTProps} />)
        }
        <ChangePrice {...changePriceProps} />
      </View>
    </View>
  );
});

const History = React.memo(() => {
  const selectedPrivacy = useSelector(selectedPrivacySeleclor.selectedPrivacy);
  return (
    <View style={historyStyled.container}>
      {selectedPrivacy?.isMainCrypto ? <MainCryptoHistory /> : <HistoryToken />}
    </View>
  );
});

const Detail = (props) => {
  const navigation = useNavigation();
  const selected = useSelector(selectedPrivacySeleclor.selectedPrivacy);
  const { isFetching } = useSelector(tokenSeleclor.historyTokenSelector);
  const token = useSelector(
    selectedPrivacySeleclor.selectedPrivacyByFollowedSelector,
  );
  const isGettingTokenBalance = useSelector(isGettingTokenBalanceSelector);
  const isGettingMainCryptoBalance = useSelector(
    isGettingMainCryptoBalanceSelector,
  );
  const defaultAccount = useSelector(accountSeleclor.defaultAccountSelector);
  const refreshing =
    !!isFetching || selected?.isMainCrypto
      ? isGettingMainCryptoBalance.length > 0 || !defaultAccount
      : isGettingTokenBalance.length > 0 || !token;
  const onGoBack = () => navigation.navigate(routeNames.Wallet);
  const [BtnTrade, hasTradeBtn] = useBtnTrade();
  return (
    <View style={styled.container}>
      <Header
        title={selected?.name}
        customHeaderTitle={<BtnInfo />}
        rightHeader={<BtnTrade />}
        onGoBack={onGoBack}
        styledContainerHeaderTitle={
          hasTradeBtn && styled.styledContainerHeaderTitle
        }
      />
      <Balance />
      <GroupButton />
      <History {...{ ...props, refreshing }} />
    </View>
  );
};

Detail.propTypes = {};

History.propTypes = {};

export default withDetail(React.memo(Detail));
