import React from 'react';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import { actionUpdateConnector as updateConnector } from '@screens/Wallet/features/BridgeConnect/BridgeConnect.actions';

/** listen connect events*/
const enhanceConnect = WrappedComp => props => {
  const dispatch = useDispatch();
  const connector = useWalletConnect();

  const handleUpdateConnector = () => {
    if (isEmpty(connector)) return;
    dispatch(updateConnector(connector));
  };

  React.useEffect(() => {
    handleUpdateConnector();
  }, [connector]);

  return (
    <WrappedComp {...props} />
  );
};

export default enhanceConnect;
