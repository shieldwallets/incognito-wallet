import React from 'react';
import routeNames from '@src/router/routeNames';
import { useSelector } from 'react-redux';
import { selectedPrivacySelector } from '@src/redux/selectors';
import { getDefaultAccountWalletSelector } from '@src/redux/selectors/shared';
import walletValidator from 'wallet-address-validator';
import { LoadingContainer } from '@src/components/core';

export const enhanceSwitchPortal = (WrappedComp) => (props) => {
  const [ isPortalToken, setIsPortalToken ] = React.useState(false);
  const [ isChecking, setIsChecking ] = React.useState(false);
  const selectedPrivacy = useSelector(selectedPrivacySelector.selectedPrivacy);
  const accountWallet = useSelector(getDefaultAccountWalletSelector);
  const { isExternalAddress, navigation, toAddress, amount } = props;

  const checkPortalToken = async () => {
    try {
      setIsChecking(true);
      const _isPortalToken = await accountWallet.handleCheckIsPortalToken({ tokenID: selectedPrivacy.tokenId });
      setIsPortalToken(_isPortalToken);
    } catch (e) {
      console.log(`Checking for portal token faield ${e && e.message}`);
    } finally {
      setIsChecking(false);
    }
  };

  const switchToPortal = () => {
    navigation.replace(routeNames.UnshieldPortal, {
      toAddress, amount
    });
  };

  React.useEffect(() => {
    checkPortalToken();
  }, []);

  React.useEffect(() => {
    const isValidAddress = toAddress && walletValidator.validate(toAddress, 'BTC', 'both');
    if (isExternalAddress && isPortalToken && isValidAddress) {
      switchToPortal();
    }
  }, [isExternalAddress, isPortalToken, toAddress, amount]);

  if (isChecking) {
    return <LoadingContainer />;
  }

  return <WrappedComp {...props} />;
};
