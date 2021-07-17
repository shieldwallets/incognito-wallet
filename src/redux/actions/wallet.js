import { batch } from 'react-redux';
import {
  configsWallet,
  loadListAccount,
} from '@src/services/wallet/WalletService';
import accountService from '@src/services/wallet/accountService';
import type from '@src/redux/types/wallet';
// eslint-disable-next-line import/no-cycle
import {
  setListAccount,
  setDefaultAccount,
  actionReloadFollowingToken,
  setAccount,
} from '@src/redux/actions/account';
import { currentMasterKeySelector } from '@src/redux/selectors/masterKey';
import { walletSelector } from '@src/redux/selectors/wallet';
// eslint-disable-next-line import/no-cycle
import { updateMasterKey } from '@src/redux/actions/masterKey';
// eslint-disable-next-line import/no-cycle
import { setListToken } from '@src/redux/actions/token';
import { Validator } from 'incognito-chain-web-js/build/wallet';
import { ExHandler } from '@src/services/exception';
import isEqual from 'lodash/isEqual';

export const setWallet = (
  wallet = throw new Error('Wallet object is required'),
) => ({
  type: type.SET,
  data: wallet,
});

export const removeWallet = () => ({
  type: type.REMOVE,
});

export const reloadAccountList = () => async (dispatch, getState) => {
  const state = getState();
  const wallet = walletSelector(state);
  const masterKey = currentMasterKeySelector(state);
  if (!wallet) {
    return;
  }
  const accounts = await wallet.listAccount();
  await dispatch(updateMasterKey(masterKey));
  await dispatch(setListAccount(accounts));
  return accounts;
};

export const reloadWallet = (accountName = '') => async (
  dispatch,
  getState,
) => {
  try {
    new Validator('accountName', accountName).string();
    const state = getState();
    const masterKey = currentMasterKeySelector(state);
    let wallet = masterKey.wallet;
    await configsWallet(wallet);
    if (wallet?.Name) {
      const listAccount = await wallet.listAccount();
      let defaultAccount =
        listAccount.find((item) => isEqual(item?.accountName, accountName)) ||
        listAccount[0];
      if (!defaultAccount?.accountName) {
        throw new Error(`Can not get default account ${accountName}`);
      }
      const followed = await accountService.getFollowingTokens(
        defaultAccount,
        wallet,
      );
      batch(() => {
        dispatch(setWallet(wallet));
        dispatch(setListAccount(listAccount));
        dispatch(setAccount(defaultAccount));
        dispatch(setListToken(followed));
      });
      await dispatch(setDefaultAccount(defaultAccount));
      await dispatch(actionReloadFollowingToken(true));
      return wallet;
    }
    return false;
  } catch (e) {
    new ExHandler(e).showErrorToast();
  }
};
