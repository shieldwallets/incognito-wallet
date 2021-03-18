import {
  ACTION_UPDATE_ACCOUNTS,
  ACTION_UPDATE_CONNECTOR,
} from '@screens/Wallet/features/BridgeConnect/BridgeConnect.actionsName';

/** update accounts when connect|disconnect with another wallet */
export const actionUpdateAccounts = (accounts) => ({
  type: ACTION_UPDATE_ACCOUNTS,
  accounts
});

/** update WalletConnect connector */
export const actionUpdateConnector = (connector) => ({
  type: ACTION_UPDATE_CONNECTOR,
  connector
});