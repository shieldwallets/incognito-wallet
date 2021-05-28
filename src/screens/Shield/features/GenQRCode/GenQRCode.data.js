import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useNavigationParam} from 'react-navigation-hooks';
import {useDispatch, useSelector} from 'react-redux';
import {shieldDataSelector, shieldSelector} from '@screens/Shield/Shield.selector';
import {selectedPrivacySeleclor} from '@src/redux/selectors';
import {actionFetch as fetchDataShield} from '@screens/Shield/Shield.actions';
import {wcProviderOptionals} from '@screens/Wallet/features/BridgeConnect';
import WalletConnectProvider from '@walletconnect/react-native-dapp';

const enhance = WrappedComp => props => {
  const loadingRef = React.useRef(true);
  const dispatch   = useDispatch();

  const tokenId     = useNavigationParam('tokenId');
  const tokenSymbol = useNavigationParam('tokenSymbol');

  const {
    isShieldAddressDecentralized
  } = useSelector(shieldDataSelector);
  const {
    isFetching,
    isFetched
  } = useSelector(shieldSelector);

  const selectedPrivacy = useSelector(selectedPrivacySeleclor.selectedPrivacy);

  const handleShield = () => dispatch(fetchDataShield({ tokenId }));

  React.useEffect(() => {
    setTimeout(() => {
      loadingRef.current = false;
      handleShield();
    }, 500);
  }, []);

  return (
    <WalletConnectProvider {...wcProviderOptionals}>
      <ErrorBoundary>
        <WrappedComp
          {...{
            ...props,
            loading: loadingRef.current,
            tokenId,
            tokenSymbol,
            selectedPrivacy,
            isFetching,
            isFetched,
            isShieldAddressDecentralized,

            handleShield,
          }}
        />
      </ErrorBoundary>
    </WalletConnectProvider>
  );
};

export default enhance;
