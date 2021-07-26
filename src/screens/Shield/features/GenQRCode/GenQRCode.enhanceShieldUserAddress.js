import React, {useState} from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useSelector } from 'react-redux';
import {shieldDataSelector, shieldSelector} from '@screens/Shield/Shield.selector';
import LoadingContainer from '@components/LoadingContainer';
import Header from '@components/Header';
import {styled} from '@screens/Shield/features/GenQRCode/GenQRCode.styled';
import {BtnInfo} from '@components/Button';
import routeNames from '@routers/routeNames';
import { selectedPrivacySelector } from '@src/redux/selectors';
import { useNavigation } from 'react-navigation-hooks';
import TermOfUseShield from '@screens/Shield/features/TermOfUseShield';

const enhance = (WrappedComp) => (props) => {
  const { isFetching, isFetched } = useSelector(shieldSelector);
  const { isShieldAddressDecentralized } = useSelector(shieldDataSelector);
  const [showTerm, setShowTerm] = useState(true);
  const navigation = useNavigation();
  const selectedPrivacy = useSelector(selectedPrivacySelector.selectedPrivacy);
  const handleToggleTooltip = () => {
    navigation.navigate(routeNames.CoinInfo, { isShieldAddressDecentralized });
  };
  const hasError = !isFetched && !isFetching;

  const handleGoBack = () => {
    navigation.navigate(routeNames.Shield);
  };

  const renderHeader = React.useCallback(() => (
    <Header
      title={`Shield ${selectedPrivacy?.externalSymbol}`}
      titleStyled={styled.titleStyled}
      rightHeader={<BtnInfo isBlack onPress={handleToggleTooltip} />}
      onGoBack={handleGoBack}
    />
  ), [selectedPrivacy]);

  const renderLoading = React.useCallback(() => (
    <>
      {renderHeader()}
      <LoadingContainer />
    </>
  ), []);

  const renderTermOfUse = () => {
    return <TermOfUseShield onNextPress={() => setShowTerm(false)} />;
  };

  /** render loading */
  if (isFetching) {
    return renderLoading();
  }

  /** render term off user */
  if (
    isShieldAddressDecentralized === false
    && (selectedPrivacy?.currencyType === 1 || selectedPrivacy?.currencyType === 3)
    && !selectedPrivacy?.isVerified
    && selectedPrivacy?.priceUsd <= 0
    && !hasError
    && showTerm
  ) {
    return renderTermOfUse();
  }

  return (
    <ErrorBoundary>
      {renderHeader()}
      <WrappedComp {...{ ...props, isFetching, isFetched, hasError }} />
    </ErrorBoundary>
  );
};


export default enhance;
